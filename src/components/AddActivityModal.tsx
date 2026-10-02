import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles } from 'lucide-react';
import { DailyActivity } from '../types/activity';

interface AddActivityModalProps {
  isOpen: boolean;
  activityToEdit?: DailyActivity | null;
  onClose: () => void;
  onSave: (title: string, time: string, note: string) => void;
}

const QUICK_INSPIRATIONS = [
  "Surah Al-Waqi'ah",
  "Surah Yasin",
  "Surah Al-Mulk",
  "Shalat Dhuha",
  "Shalat Tahajjud",
  "Sedekah Subuh",
  "Membaca 1 Juz",
  "Istighfar 100x",
  "Olahraga",
  "Belajar",
  "Pekerjaan Rumah"
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  activityToEdit,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title);
      setTime(activityToEdit.time || '');
      setNote(activityToEdit.note || '');
    } else {
      setTitle('');
      setTime('');
      setNote('');
    }
    setError('');
  }, [activityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Nama aktivitas belum diisi.');
      return;
    }
    onSave(title.trim(), time, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl border border-dustyPink-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dustyPink-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-dustyPink-100 flex items-center justify-center text-dustyPink-600">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-base font-bold text-charcoal-800">
              {activityToEdit ? 'Edit Catatan' : 'Tambah Catatan Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-charcoal-400 hover:text-charcoal-700 hover:bg-dustyPink-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* Quick inspiration chips */}
          {!activityToEdit && (
            <div>
              <label className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block mb-1.5">
                Inspirasi Kebaikan
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {QUICK_INSPIRATIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setTitle(item);
                      setError('');
                    }}
                    className="shrink-0 text-xs px-2.5 py-1 bg-dustyPink-50 hover:bg-dustyPink-100 text-dustyPink-700 rounded-lg border border-dustyPink-200/80 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
              Nama aktivitas <span className="text-dustyPink-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Contoh: Surah Al-Waqi'ah"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden transition-colors ${
                error
                  ? 'border-red-400 bg-red-50/20 focus:border-red-500'
                  : 'border-dustyPink-200 focus:border-dustyPink-500 bg-white'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Time Field */}
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
              Waktu (opsional)
            </label>
            <div className="relative">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-dustyPink-200 focus:border-dustyPink-500 text-sm focus:outline-hidden bg-white text-charcoal-800"
              />
              <Clock className="w-4 h-4 text-dustyPink-400 absolute left-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-charcoal-400 mt-1">
              Format tampilan: 04:35, 06:15, 19:30
            </p>
          </div>

          {/* Note Field */}
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
              Catatan kecil (opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Setelah Subuh / 1 juz"
              className="w-full px-3.5 py-2.5 rounded-xl border border-dustyPink-200 focus:border-dustyPink-500 text-sm focus:outline-hidden bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-dustyPink-200 text-charcoal-600 font-medium text-xs hover:bg-dustyPink-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-dustyPink-500 hover:bg-dustyPink-600 text-white font-semibold text-xs shadow-md shadow-dustyPink-500/20 active:scale-[0.98] transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
