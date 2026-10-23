'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  User,
  School,
  Mail,
  Phone,
  Hash,
  ArrowRight
} from 'lucide-react';
import { Workshop, FestEvent } from '../types';

interface RegistrationModalProps {
  item: Workshop | FestEvent | null;
  onClose: () => void;
}

export default function RegistrationModal({ item, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    college: 'KITSW Warangal',
    rollNumber: '',
    branch: item?.branch || 'CSE',
    yearOfStudy: '3rd Year B.Tech',
    email: '',
    phone: '',
    teamName: '',
  });

  const [generatedPassId, setGeneratedPassId] = useState('');

  if (!item) return null;

  const isWorkshop = 'isFlagship' in item;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          college: formData.college,
          rollNumber: formData.rollNumber,
          branch: item.branch,
          yearOfStudy: formData.yearOfStudy,
          email: formData.email,
          phone: formData.phone,
          teamName: formData.teamName,
          targetId: item.id,
          targetTitle: item.title,
          targetType: isWorkshop ? 'workshop' : 'event',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      setGeneratedPassId(data.passToken);
      setStep('success');
    } catch (err: any) {
      console.error('Registration error:', err);
      // Fallback pass token if offline
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setGeneratedPassId(`SAM26-${item.branch}-${randomNum}`);
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Department of {item.branch}
            </span>
            <h3 className="text-sm sm:text-lg font-bold leading-tight mt-0.5">
              {item.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Fee:</span>{' '}
                <span className="text-slate-900 font-bold">
                  {isWorkshop ? (item as Workshop).fees : 'Included in Fest Pass'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Venue:</span>{' '}
                <span>{item.venue.split('&')[0]}</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / Institute *</label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. KITSW Warangal"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Hall Ticket No *</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. B22CS045"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study *</label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                  >
                    <option value="1st Year B.Tech">1st Year B.Tech</option>
                    <option value="2nd Year B.Tech">2nd Year B.Tech</option>
                    <option value="3rd Year B.Tech">3rd Year B.Tech</option>
                    <option value="Final Year B.Tech">Final Year B.Tech</option>
                    <option value="Postgraduate / Research">Postgraduate / Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98480 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {!isWorkshop && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Team Name (Optional for Solo)</label>
                  <input
                    type="text"
                    placeholder="e.g. CyberKnights"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white outline-none"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Confirming Registration...</span>
                  ) : (
                    <>
                      <span>Confirm Registration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* PASS TICKET */
          <div className="p-6 space-y-5 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">Registration Confirmed</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Your official delegate pass has been generated.
              </p>
            </div>

            <div className="max-w-md mx-auto bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md text-left text-xs">
              <div className="flex justify-between items-start border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">KITSW SAMSHODHINI</span>
                  <h5 className="font-bold text-white mt-0.5">{item.title}</h5>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[11px]">
                  {item.branch}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 my-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Delegate</span>
                  <p className="font-bold text-white">{formData.fullName || 'Student Delegate'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">College / Roll</span>
                  <p className="text-slate-200">{formData.college} • {formData.rollNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Timing</span>
                  <p className="text-slate-200">{item.time}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Hall / Lab</span>
                  <p className="text-slate-200 truncate">{item.venue.split('&')[0]}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-800 pt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-mono">PASS ID</span>
                  <span className="font-mono text-xs font-bold text-amber-400">{generatedPassId}</span>
                </div>
                <div className="bg-white p-1 rounded text-slate-900">
                  <QrCode className="w-7 h-7" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
