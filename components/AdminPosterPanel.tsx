'use client';

import React, { useState } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

interface AdminPosterPanelProps {
  year: number;
  posterUrl?: string | null;
  onSaved: (url: string | null) => void;
  notify: (message: string) => void;
}

/** Admin-only: sets the main Sumshodhini poster shown right after the home-page hero. */
export default function AdminPosterPanel({ year, posterUrl, onSaved, notify }: AdminPosterPanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (url: string | null) => {
    const res = await fetch('/api/editions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, posterUrl: url }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Could not save the poster');
    onSaved(url);
  };

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      if (!file.type.startsWith('image/')) throw new Error('Choose an image file (PNG, JPG or WebP).');
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'main-poster');
      form.append('branch', 'admin');
      const up = await fetch('/api/upload', { method: 'POST', body: form });
      const upJson = await up.json();
      if (!up.ok || !upJson.success) throw new Error(upJson.error || 'Upload failed');
      await save(upJson.url);
      notify('Main poster updated');
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm('Remove the main poster from the home page?')) return;
    setBusy(true);
    setError(null);
    try {
      await save(null);
      notify('Main poster removed');
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8">
      <h2 className="font-display text-2xl sm:text-3xl text-ink">Main poster</h2>
      <p className="mt-1 text-sm text-slate-600 max-w-xl">
        The official Sumshodhini &apos;{String(year).slice(-2)} poster. It appears on the home page, right after the opening section.
      </p>

      <div className="mt-6 grid md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <div className="aspect-[3/4] rounded-2xl border-2 border-ink bg-lilac-100 overflow-hidden flex items-center justify-center">
            {posterUrl ? (
              <img src={posterUrl} alt="Current main poster" className="w-full h-full object-contain bg-white" />
            ) : (
              <div className="text-center p-6 text-ink/70">
                <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm font-semibold">No poster set for this edition</p>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-center gap-4">
          <label className="pop inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-marigold-400 text-ink text-sm font-bold cursor-pointer self-start">
            <Upload className="w-4 h-4" />
            {busy ? 'Working…' : posterUrl ? 'Replace poster' : 'Upload poster'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                onFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          {posterUrl && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-ink bg-white text-sm font-bold text-ink hover:bg-coral-100 disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              Remove poster
            </button>
          )}
          <p className="text-sm text-slate-600 max-w-md">
            Use a portrait image, ideally at least 1200 pixels wide. The upload is committed to the media repository, like other posters.
          </p>
          {error && (
            <p role="alert" className="p-3 rounded-xl bg-coral-50 border-2 border-coral-300 text-sm font-semibold text-coral-700 max-w-md">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
