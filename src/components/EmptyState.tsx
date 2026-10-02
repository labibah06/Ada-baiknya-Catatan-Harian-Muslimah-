import React from 'react';
import { Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onAddActivity: () => void;
  onReloadDefaults: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddActivity,
  onReloadDefaults
}) => {
  return (
    <div className="bg-white border border-dustyPink-200/90 rounded-3xl p-6 text-center shadow-xs flex flex-col items-center">
      <div className="w-14 h-14 rounded-full bg-dustyPink-100/70 flex items-center justify-center text-2xl mb-3">
        🌷
      </div>

      <h3 className="text-base font-bold text-charcoal-800">
        Belum ada catatan
      </h3>

      <p className="text-xs text-charcoal-500 mt-1 max-w-xs leading-relaxed">
        Tambahkan satu kebaikan kecil untuk hari ini.
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs mt-5">
        <button
          onClick={onAddActivity}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-dustyPink-500 hover:bg-dustyPink-600 text-white font-semibold text-xs shadow-md shadow-dustyPink-500/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Catatan</span>
        </button>

        <button
          onClick={onReloadDefaults}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-dustyPink-200 hover:bg-dustyPink-50 text-charcoal-600 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-dustyPink-500" />
          <span>Muat Bawaan</span>
        </button>
      </div>
    </div>
  );
};
