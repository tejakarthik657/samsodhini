/**
 * GitHub Storage Provider for Samshodhani Assets
 * Commits images, posters, PDFs, and gallery captures directly to the unified GitHub repository
 * under the 'media/' directory, returning fast, permanent raw and CDN URLs.
 * No local disk storage or server disk storage is used.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'tejakarthik657';
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'samsodhini';
const BRANCH = 'main';

export interface UploadResult {
  success: boolean;
  filePath: string;
  cdnUrl: string;
  rawUrl: string;
  sha?: string;
  error?: string;
}

export async function uploadToGitHubStorage(
  filePath: string,
  base64Content: string,
  commitMessage: string
): Promise<UploadResult> {
  try {
    // Normalize path to strictly live in the media/ directory of the repository
    let cleanPath = filePath.replace(/^\/+/, '').replace(/^assets\//, 'media/');
    if (!cleanPath.startsWith('media/')) {
      cleanPath = `media/${cleanPath}`;
    }

    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}`;

    // Check if file already exists to get SHA
    let existingSha: string | undefined;
    try {
      const checkRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'User-Agent': 'Samshodhani-App',
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    } catch (e) {
      // File doesn't exist yet, which is expected for new uploads
    }

    const payload: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: commitMessage || `Archival upload to ${cleanPath}`,
      content: base64Content,
      branch: BRANCH,
    };

    if (existingSha) {
      payload.sha = existingSha;
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'Samshodhani-App',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(payload),
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      console.error('[GitHub Storage Error]', putRes.status, errorText);
      return {
        success: false,
        filePath: cleanPath,
        cdnUrl: '',
        rawUrl: '',
        error: `GitHub repository commit failed (${putRes.status}: ${putRes.statusText})`,
      };
    }

    const data = await putRes.json();
    const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${cleanPath}`;
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BRANCH}/${cleanPath}`;

    return {
      success: true,
      filePath: cleanPath,
      cdnUrl,
      rawUrl,
      sha: data.content?.sha,
    };
  } catch (error: any) {
    console.error('[GitHub Storage Exception]', error);
    return {
      success: false,
      filePath,
      cdnUrl: '',
      rawUrl: '',
      error: error.message || 'Unknown repository storage error',
    };
  }
}
