import React, { useState, useEffect } from 'react';
import { BookOpen, Edit3, Trash2, Check, Sparkles, X } from 'lucide-react';

interface ReflectionJournalProps {
  currentDate: string;
  reflectionText: string;
  onSaveReflection: (text: string) => void;
}

const INSPIRATION_PROMPTS = [
  { label: '🌸 Syukur', prompt: 'Hal yang paling aku syukuri hari ini adalah... ' },
  { label: '🤲 Doa', prompt: 'Doa dan harapan terbaikku untuk hari ini: ' },
  { label: '🌿 Muhasabah', prompt: 'Pelajaran berharga yang aku petik hari ini: ' },
  { label: '✨ Kebaikan', prompt: 'Kebaikan kecil yang berusaha aku jaga hari ini: ' }
];

export const ReflectionJournal: React.FC<ReflectionJournalProps> = ({
  currentDate,
  reflectionText,
  onSaveReflection
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(reflectionText);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    setText(reflectionText);
    setIsEditing(false);
  }, [currentDate, reflectionText]);

  const handleSave = () => {
    onSaveReflection(text.trim());
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleCancel = () => {
    setText(reflectionText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Hapus catatan refleksi untuk hari ini?')) {
      onSaveReflection('');
      setText('');
      setIsEditing(false);
    }
  };

  const handleAddPrompt = (promptString: string) => {
    setText((prev) => (prev ? `${prev}\n\n${promptString}` : promptString));
  };

  return (
    <div className="bg-white border border-dustyPink-200/90 rounded-2xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-dustyPink-100 flex items-center justify-center text-dustyPink-600">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-charcoal-800">
              Jurnal Refleksi
            </h3>
            <p className="text-[11px] text-charcoal-500">
              Muhasabah, rasa syukur, & doa harian
            </p>
          </div>
        </div>

        {showSavedToast && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 animate-in fade-in duration-150">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Tersimpan 🌷</span>
          </span>
        )}
      </div>

      {/* Main Body */}
      {isEditing ? (
        <div className="flex flex-col gap-3">
          {/* Quick Inspirations */}
          <div>
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block mb-1.5">
              Mulai dengan ide:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {INSPIRATION_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAddPrompt(item.prompt)}
                  className="shrink-0 text-xs px-2.5 py-1 bg-dustyPink-50 hover:bg-dustyPink-100 text-dustyPink-700 rounded-lg border border-dustyPink-200/80 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tuliskan rasa syukur, evaluasi diri, atau doa penyejuk hati hari ini..."
              rows={4}
              className="w-full p-3 rounded-xl border border-dustyPink-300 focus:border-dustyPink-500 focus:outline-hidden text-xs text-charcoal-800 leading-relaxed resize-none bg-dustyPink-50/20"
              autoFocus
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-charcoal-400">
              {text.length} karakter
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 py-1.5 px-3 rounded-xl border border-dustyPink-200 text-charcoal-600 text-xs font-medium hover:bg-dustyPink-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 py-1.5 px-3.5 rounded-xl bg-dustyPink-500 hover:bg-dustyPink-600 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </div>
      ) : reflectionText ? (
        <div className="flex flex-col gap-2.5">
          <div className="bg-dustyPink-50/50 border border-dustyPink-200/70 rounded-xl p-3.5 relative">
            <p className="text-xs text-charcoal-700 whitespace-pre-wrap leading-relaxed font-sans italic">
              “{reflectionText}”
            </p>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-[11px] text-dustyPink-600 hover:text-dustyPink-700 font-semibold px-2.5 py-1 rounded-lg bg-dustyPink-50 hover:bg-dustyPink-100 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Ubah Refleksi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-dustyPink-50/40 border border-dashed border-dustyPink-200 rounded-xl p-3.5 text-center flex flex-col items-center">
          <p className="text-xs text-charcoal-500 max-w-xs leading-relaxed">
            Belum ada catatan refleksi untuk hari ini. Luangkan sejenak waktu untuk mencatat rasa syukur atau muhasabah diri.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-dustyPink-600 hover:text-dustyPink-700 bg-white border border-dustyPink-200/80 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-dustyPink-50 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-dustyPink-500" />
            <span>+ Tulis Refleksi Hari Ini</span>
          </button>
        </div>
      )}
    </div>
  );
};
