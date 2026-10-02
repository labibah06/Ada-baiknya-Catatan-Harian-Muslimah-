import React from 'react';
import { Heart, Sparkles, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenReminder: () => void;
  isReminderActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReminder,
  isReminderActive = false
}) => {
  return (
    <header className="flex items-center justify-between py-3 px-1 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-full bg-dustyPink-100 flex items-center justify-center text-dustyPink-600 shadow-xs">
          <Heart className="w-4 h-4 fill-dustyPink-500 text-dustyPink-500" />
        </span>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold tracking-tight text-charcoal-800">
              Ada Baiknya
            </h1>
            <Sparkles className="w-3.5 h-3.5 text-dustyPink-400" />
          </div>
          <p className="text-[11px] font-medium text-charcoal-500">
            Catatan Harian Muslimah
          </p>
        </div>
      </div>

      {/* Reminder Notification Button */}
      <button
        type="button"
        onClick={onOpenReminder}
        aria-label="Atur pengingat harian"
        className={`relative p-2 rounded-2xl border transition-all active:scale-95 ${
          isReminderActive
            ? 'bg-dustyPink-100/80 border-dustyPink-300 text-dustyPink-700 shadow-xs'
            : 'bg-white border-dustyPink-200/90 text-charcoal-500 hover:text-dustyPink-600 hover:bg-dustyPink-50'
        }`}
      >
        <Bell className="w-4 h-4" />
        {isReminderActive && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-dustyPink-500 ring-2 ring-white" />
        )}
      </button>
    </header>
  );
};
