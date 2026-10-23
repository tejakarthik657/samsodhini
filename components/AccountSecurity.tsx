'use client';

import React, { useState } from 'react';
import { KeyRound, RotateCcw } from 'lucide-react';

const fieldClass =
  'w-full px-4 py-2.5 text-sm font-medium bg-paper border-2 border-ink rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-cobalt-200';

/** Change your own password. Shown as a dialog; `forced` blocks closing until it is done. */
export function ChangePasswordDialog({
  forced,
  onClose,
  notify,
}: {
  forced?: boolean;
  onClose: () => void;
  notify: (m: string) => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next.length < 8) return setError('Use at least 8 characters.');
    if (next !== again) return setError('The two new passwords do not match.');
    setBusy(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Could not update the password.');
      notify('Password updated');
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Change password">
      <form onSubmit={submit} className="w-full max-w-md bg-white border-2 border-ink rounded-[28px] shadow-pop-lg p-6 sm:p-8 space-y-4 animate-scale-up">
        <div className="w-12 h-12 rounded-full bg-marigold-400 border-2 border-ink flex items-center justify-center -rotate-6">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-ink leading-tight">{forced ? 'Set your own password' : 'Change password'}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {forced ? 'You are using a starting password. Choose one only you know before you continue.' : 'Choose a new password of at least 8 characters.'}
          </p>
        </div>
        {error && <p role="alert" className="p-3 rounded-2xl bg-coral-50 border-2 border-coral-300 text-sm font-semibold text-coral-700">{error}</p>}
        <label className="block text-sm font-bold text-ink">Current password
          <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={`${fieldClass} mt-1.5`} required />
        </label>
        <label className="block text-sm font-bold text-ink">New password
          <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={`${fieldClass} mt-1.5`} required />
        </label>
        <label className="block text-sm font-bold text-ink">Repeat new password
          <input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={`${fieldClass} mt-1.5`} required />
        </label>
        <div className="flex justify-end gap-2 pt-1">
          {!forced && (
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-full border-2 border-ink bg-white text-sm font-bold hover:bg-lilac-100">Cancel</button>
          )}
          <button type="submit" disabled={busy} className="pop px-5 py-2.5 rounded-full bg-ink text-white text-sm font-bold disabled:opacity-60">
            {busy ? 'Saving…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
}

/** Admin only: put an association's password back to its starting value. */
export function ResetPasswordsPanel({ branches, notify }: { branches: { code: string; label: string }[]; notify: (m: string) => void }) {
  const [branch, setBranch] = useState(branches[0]?.code || '');
  const [busy, setBusy] = useState(false);

  const reset = async () => {
    if (!confirm(`Reset the ${branch} password to its starting value? They will be asked to choose a new one.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/password?branch=${branch}`, { method: 'DELETE' });
      const json = await res.json();
      notify(json.success ? `${branch} password reset` : json.error || 'Could not reset the password');
    } catch {
      notify('Could not reach the server');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-white rounded-[28px] border-2 border-ink shadow-pop p-6 sm:p-8">
      <h2 className="font-display text-2xl sm:text-3xl text-ink">Association passwords</h2>
      <p className="mt-1 text-sm text-slate-600 max-w-xl">
        If an association forgets its password, reset it here. The password goes back to the department code followed by @sumshodhini, and they choose a new one at their next sign-in.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <select value={branch} onChange={(e) => setBranch(e.target.value)} className={`${fieldClass} max-w-xs`} aria-label="Association">
          {branches.map((b) => <option key={b.code} value={b.code}>{b.label}</option>)}
        </select>
        <button type="button" onClick={reset} disabled={busy} className="pop inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-marigold-400 text-ink text-sm font-bold disabled:opacity-60">
          <RotateCcw className="w-4 h-4" /> Reset password
        </button>
      </div>
    </section>
  );
}
