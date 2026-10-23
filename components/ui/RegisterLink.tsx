import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const PLACEHOLDER = 'forms.gle/samshodhani';

/** The registration link an organizer pasted in, or nothing if none was set. */
export function registrationLink(item: { registrationUrl?: string; googleFormUrl?: string }): string | null {
  const url = (item.registrationUrl || item.googleFormUrl || '').trim();
  if (!url || url.includes(PLACEHOLDER)) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

interface RegisterLinkProps {
  url: string | null;
  label?: string;
  className: string;
  disabledClassName?: string;
}

export default function RegisterLink({ url, label = 'Register', className, disabledClassName }: RegisterLinkProps) {
  if (!url) {
    return (
      <span
        className={disabledClassName || 'px-4 py-2 rounded-full border-2 border-dashed border-ink/50 text-sm font-bold text-ink/60'}
        aria-disabled="true"
      >
        Registration opens soon
      </span>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`${className} inline-flex items-center justify-center gap-1.5`}>
      {label}
      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
      <span className="sr-only">(opens the registration form in a new tab)</span>
    </a>
  );
}
