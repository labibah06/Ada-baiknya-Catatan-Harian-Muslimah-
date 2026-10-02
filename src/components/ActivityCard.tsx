import React, { useState, useRef, useEffect } from 'react';
import { Clock, MoreVertical, Edit2, Trash2, Check } from 'lucide-react';
import { DailyActivity } from '../types/activity';

interface ActivityCardProps {
  activity: DailyActivity;
  onToggle: (activity: DailyActivity) => void;
  onEdit: (activity: DailyActivity) => void;
  onDelete: (activity: DailyActivity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onToggle,
  onEdit,
  onDelete
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className={`relative bg-white border rounded-2xl p-4 transition-all shadow-xs ${
        activity.completed
          ? 'border-dustyPink-200/60 bg-dustyPink-50/20'
          : 'border-dustyPink-200 hover:border-dustyPink-300'
      }`}
    >
      {/* Top Row: Title + Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-[15px] font-semibold tracking-tight transition-all break-words ${
              activity.completed
                ? 'line-through text-charcoal-400'
                : 'text-charcoal-800'
            }`}
          >
            {activity.title}
          </h3>

          {/* Time Badge */}
          {activity.time && (
            <div className="inline-flex items-center gap-1.5 bg-dustyPink-50 text-dustyPink-700 px-2 py-0.5 rounded-lg border border-dustyPink-200/60 text-xs font-medium mt-1.5">
              <Clock className="w-3 h-3 text-dustyPink-500" />
              <span>{activity.time}</span>
            </div>
          )}

          {/* Optional Note */}
          {activity.note && (
            <p className="text-xs italic text-charcoal-500 mt-1">
              "{activity.note}"
            </p>
          )}
        </div>

        {/* 3-dots Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-dustyPink-50 active:scale-95 transition-all"
            aria-label="Pilihan aktivitas"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-30 w-32 bg-white rounded-xl shadow-lg border border-dustyPink-200/80 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(activity);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal-700 hover:bg-dustyPink-50 transition-colors text-left"
              >
                <Edit2 className="w-3.5 h-3.5 text-dustyPink-500" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(activity);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checklist Button: ○ Belum selesai / ✓ Sudah selesai */}
      <div className="mt-3.5 pt-2.5 border-t border-dustyPink-100/80 flex items-center justify-between">
        <button
          onClick={() => onToggle(activity)}
          className="flex items-center gap-2.5 group py-1 active:scale-[0.98] transition-all"
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
              activity.completed
                ? 'bg-dustyPink-500 border-dustyPink-500 text-white shadow-xs'
                : 'border-dustyPink-300 group-hover:border-dustyPink-500 bg-white'
            }`}
          >
            {activity.completed ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-dustyPink-200 transition-colors" />
            )}
          </div>
          <span
            className={`text-xs font-medium transition-colors ${
              activity.completed ? 'text-dustyPink-600 font-semibold' : 'text-charcoal-600'
            }`}
          >
            {activity.completed ? 'Sudah selesai' : 'Belum selesai'}
          </span>
        </button>
      </div>
    </div>
  );
};
