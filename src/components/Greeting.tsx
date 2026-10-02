import React from 'react';

export const Greeting: React.FC = () => {
  return (
    <div className="bg-dustyPink-100/60 border border-dustyPink-200/70 rounded-2xl p-4 text-center shadow-xs">
      <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-charcoal-800">
        <span>Selamat datang</span>
        <span className="text-base">🌷</span>
      </div>
      <p className="text-xs italic text-charcoal-600 mt-1 leading-relaxed">
        “Sedikit demi sedikit, semoga menjadi baik yang istiqamah.”
      </p>
    </div>
  );
};
