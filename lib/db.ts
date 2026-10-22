import { Pool } from '@neondatabase/serverless';
import type { QueryResult } from 'pg';

let pool: Pool;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_pfEk0iqOZ1jD@ep-quiet-violet-b4ysvvyv-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

function createPool(): Pool {
  return new Pool({
    connectionString,
  });
}

if (process.env.NODE_ENV === 'production') {
  pool = createPool();
} else {
  const globalWithPg = global as typeof globalThis & {
    _pgPool?: Pool;
    _queryCache?: Map<string, { data: QueryResult; timestamp: number }>;
  };
  if (!globalWithPg._pgPool) {
    globalWithPg._pgPool = createPool();
  }
  pool = globalWithPg._pgPool;
}

// In-Memory Query Cache with Instant Invalidation on Mutations
const cache = new Map<string, { data: QueryResult; timestamp: number }>();
const CACHE_TTL_MS = 180 * 1000; // 3 minutes

export function clearDbCache() {
  cache.clear();
}

export default pool;

export async function query(text: string, params?: any[]) {
  const sanitizedParams = params ? params.map((p) => (p === undefined ? null : p)) : undefined;
  const isSelect = text.trim().toUpperCase().startsWith('SELECT');
  const cacheKey = isSelect ? `${text}::${JSON.stringify(sanitizedParams)}` : null;

  // Serve from in-memory cache if available (sub-millisecond response)
  if (cacheKey && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  // If mutation (INSERT, UPDATE, DELETE), invalidate read cache immediately
  if (!isSelect) {
    clearDbCache();
  }

  const start = Date.now();
  let retries = 2;

  while (retries >= 0) {
    try {
      const res = await pool.query(text, sanitizedParams);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV === 'development') {
        console.log('[Neon Serverless Query]', {
          text: text.slice(0, 60).trim(),
          duration: `${duration}ms`,
          rows: res.rowCount,
        });
      }

      // Cache select results
      if (cacheKey) {
        cache.set(cacheKey, { data: res, timestamp: Date.now() });
      }

      return res;
    } catch (err: any) {
      retries--;
      if (
        retries >= 0 &&
        (err.message?.includes('Connection terminated') ||
          err.message?.includes('closed') ||
          err.code === 'ECONNRESET' ||
          err.message?.includes('socket has been ended'))
      ) {
        console.warn('[Neon Serverless] Retrying query...');
        await new Promise((resolve) => setTimeout(resolve, 200));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Database query execution failed after retry');
}
