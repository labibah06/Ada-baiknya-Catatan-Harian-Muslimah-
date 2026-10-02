import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  itemTitle,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-xl border border-dustyPink-200 text-center animate-in zoom-in-95 duration-150">
        <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-charcoal-800">
          Hapus catatan ini?
        </h3>

        <p className="text-xs text-charcoal-500 mt-1.5 leading-relaxed px-2">
          Catatan <span className="font-semibold text-charcoal-700">"{itemTitle}"</span> akan dihapus dari daftar hari ini.
        </p>

        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            onClick={onCancel}
            className="py-2.5 px-3 rounded-xl border border-dustyPink-200 text-charcoal-600 font-medium text-xs hover:bg-dustyPink-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
