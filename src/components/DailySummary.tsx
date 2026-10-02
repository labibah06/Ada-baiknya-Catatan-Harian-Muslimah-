import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface DailySummaryProps {
  totalCount: number;
  completedCount: number;
  isToday: boolean;
}

export const DailySummary: React.FC<DailySummaryProps> = ({
  totalCount,
  completedCount,
  isToday
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="bg-white border border-dustyPink-200/90 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-semibold text-charcoal-800">
            {isToday ? 'Catatan Hari Ini' : 'Catatan Harian'}
          </h2>
          <Sparkles className="w-3.5 h-3.5 text-dustyPink-400" />
        </div>

        {totalCount > 0 && (
          <span className="text-xs font-semibold text-dustyPink-600 bg-dustyPink-50 px-2.5 py-1 rounded-full border border-dustyPink-200/60">
            {completedCount} / {totalCount} selesai
          </span>
        )}
      </div>

      <div className="mt-3">
        {totalCount === 0 ? (
          <div className="bg-dustyPink-50/70 rounded-xl p-3 text-xs text-charcoal-500">
            Belum ada catatan hari ini.
          </div>
        ) : (
          <div>
            {/* Progress Bar */}
            <div className="w-full bg-dustyPink-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isAllCompleted ? 'bg-emerald-500' : 'bg-dustyPink-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs font-bold ${isAllCompleted ? 'text-emerald-600' : 'text-charcoal-700'}`}>
                {percentage}%
              </span>

              {isAllCompleted && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Alhamdulillah, semua selesai hari ini 🌷</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
