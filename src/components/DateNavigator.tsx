import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDisplayDate, getTodayDateString } from '../utils/dateUtils';

interface DateNavigatorProps {
  currentDate: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onSelectDate: (date: string) => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
  onSelectDate
}) => {
  const isToday = currentDate === getTodayDateString();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onSelectDate(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Date Display Card */}
      <div 
        onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.click()}
        className="bg-white border border-dustyPink-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:border-dustyPink-300 transition-colors cursor-pointer select-none relative"
      >
        <input 
          ref={dateInputRef}
          type="date" 
          value={currentDate} 
          onChange={handleDateChange}
          className="sr-only"
          aria-label="Pilih tanggal"
        />

        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-dustyPink-600 uppercase tracking-wider">
            {isToday ? 'Hari ini' : 'Tanggal yang dipilih'}
          </span>
          <span className="text-base font-semibold text-charcoal-800 tracking-tight mt-0.5">
            {formatDisplayDate(currentDate)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-dustyPink-50 text-dustyPink-600 px-3 py-1.5 rounded-xl border border-dustyPink-200/60 text-xs font-medium">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Pilih</span>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onPreviousDay}
          className="flex items-center justify-center gap-1 bg-white hover:bg-dustyPink-50 border border-dustyPink-200 text-charcoal-700 active:scale-[0.98] py-2.5 px-3 rounded-xl text-xs font-medium transition-all shadow-xs"
        >
          <ChevronLeft className="w-4 h-4 text-dustyPink-600" />
          <span>Kemarin</span>
        </button>

        <button
          onClick={onToday}
          className={`flex items-center justify-center py-2.5 px-3 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] shadow-xs ${
            isToday
              ? 'bg-dustyPink-500 text-white shadow-dustyPink-500/20'
              : 'bg-dustyPink-100 hover:bg-dustyPink-200 text-dustyPink-700 border border-dustyPink-300/60'
          }`}
        >
          Hari Ini
        </button>

        <button
          onClick={onNextDay}
          className="flex items-center justify-center gap-1 bg-white hover:bg-dustyPink-50 border border-dustyPink-200 text-charcoal-700 active:scale-[0.98] py-2.5 px-3 rounded-xl text-xs font-medium transition-all shadow-xs"
        >
          <span>Besok</span>
          <ChevronRight className="w-4 h-4 text-dustyPink-600" />
        </button>
      </div>
    </div>
  );
};
