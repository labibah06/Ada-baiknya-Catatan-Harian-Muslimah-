import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { DailyActivity } from './types/activity';
import {
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  reloadDefaults,
  getWeeklyProgress,
  getReflection,
  saveReflection,
  DayProgress
} from './services/storageService';
import {
  getReminderSettings,
  checkDailyReminder
} from './services/notificationService';
import {
  getTodayDateString,
  getPreviousDateString,
  getNextDateString
} from './utils/dateUtils';
import { Header } from './components/Header';
import { Greeting } from './components/Greeting';
import { DateNavigator } from './components/DateNavigator';
import { DailySummary } from './components/DailySummary';
import { WeeklyProgressChart } from './components/WeeklyProgressChart';
import { ReflectionJournal } from './components/ReflectionJournal';
import { ActivityCard } from './components/ActivityCard';
import { AddActivityModal } from './components/AddActivityModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { ReminderSettingsModal } from './components/ReminderSettingsModal';
import { EmptyState } from './components/EmptyState';

export function App() {
  const [currentDate, setCurrentDate] = useState<string>(() => getTodayDateString());
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [weeklyData, setWeeklyData] = useState<DayProgress[]>([]);
  const [reflectionText, setReflectionText] = useState<string>('');

  // Reminder states
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isReminderActive, setIsReminderActive] = useState(() => getReminderSettings().enabled);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<DailyActivity | null>(null);

  // Sync reminder active flag
  const refreshReminderStatus = useCallback(() => {
    const s = getReminderSettings();
    setIsReminderActive(s.enabled);
  }, []);

  // Periodic reminder checker (checks every 30 seconds if today's scheduled reminder should fire)
  useEffect(() => {
    const today = getTodayDateString();
    checkDailyReminder(today);

    const interval = setInterval(() => {
      checkDailyReminder(getTodayDateString());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load activities and reflection whenever currentDate changes
  useEffect(() => {
    const loadedActivities = getActivities(currentDate);
    setActivities(loadedActivities);

    const loadedReflection = getReflection(currentDate);
    setReflectionText(loadedReflection);
  }, [currentDate]);

  // Update weekly data whenever currentDate or activities change
  useEffect(() => {
    const weekly = getWeeklyProgress(currentDate);
    setWeeklyData(weekly);
  }, [currentDate, activities]);

  // Date Navigation
  const handlePreviousDay = () => {
    setCurrentDate((prev) => getPreviousDateString(prev));
  };

  const handleNextDay = () => {
    setCurrentDate((prev) => getNextDateString(prev));
  };

  const handleToday = () => {
    setCurrentDate(getTodayDateString());
  };

  // Activity handlers
  const handleToggle = (activity: DailyActivity) => {
    const updated = { ...activity, completed: !activity.completed };
    updateActivity(currentDate, updated);
    setActivities((prev) =>
      prev.map((item) => (item.id === activity.id ? updated : item))
    );
  };

  const handleSaveActivity = (title: string, time: string, note: string) => {
    if (editingActivity) {
      const updated = {
        ...editingActivity,
        title,
        time,
        note
      };
      updateActivity(currentDate, updated);
      setActivities((prev) =>
        prev.map((item) => (item.id === editingActivity.id ? updated : item))
      );
    } else {
      const created = addActivity(currentDate, {
        title,
        time,
        note,
        completed: false,
        isDefault: false
      });
      setActivities((prev) => [...prev, created]);
    }
    setEditingActivity(null);
  };

  const handleConfirmDelete = () => {
    if (activityToDelete) {
      deleteActivity(currentDate, activityToDelete.id);
      setActivities((prev) => prev.filter((item) => item.id !== activityToDelete.id));
      setActivityToDelete(null);
    }
  };

  const handleReloadDefaults = () => {
    const reloaded = reloadDefaults(currentDate);
    setActivities(reloaded);
  };

  const handleSaveReflection = (text: string) => {
    saveReflection(currentDate, text);
    setReflectionText(text);
  };

  const totalCount = activities.length;
  const completedCount = activities.filter((a) => a.completed).length;
  const isToday = currentDate === getTodayDateString();

  return (
    <div className="min-h-screen bg-dustyPink-50 text-charcoal-800 flex justify-center selection:bg-dustyPink-200">
      <main className="w-full max-w-md px-4 py-5 flex flex-col gap-4 pb-28">
        {/* 1. Header with Reminder trigger */}
        <Header
          onOpenReminder={() => setIsReminderModalOpen(true)}
          isReminderActive={isReminderActive}
        />

        {/* 2. Welcome Greeting */}
        <Greeting />

        {/* 3. Date Navigator */}
        <DateNavigator
          currentDate={currentDate}
          onPreviousDay={handlePreviousDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
          onSelectDate={setCurrentDate}
        />

        {/* 4. Daily Summary */}
        <DailySummary
          totalCount={totalCount}
          completedCount={completedCount}
          isToday={isToday}
        />

        {/* 5. Weekly Consistency Progress Chart (recharts) */}
        <WeeklyProgressChart
          data={weeklyData}
          onSelectDate={(selected) => setCurrentDate(selected)}
        />

        {/* 6. Activities Section */}
        {activities.length > 0 ? (
          <section className="flex flex-col gap-3 mt-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-charcoal-700 tracking-wide uppercase">
                Daftar Aktivitas
              </h2>
              <button
                onClick={() => {
                  setEditingActivity(null);
                  setIsModalOpen(true);
                }}
                className="text-xs font-semibold text-dustyPink-600 hover:text-dustyPink-700 flex items-center gap-1 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onToggle={handleToggle}
                  onEdit={(item) => {
                    setEditingActivity(item);
                    setIsModalOpen(true);
                  }}
                  onDelete={(item) => setActivityToDelete(item)}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            onAddActivity={() => {
              setEditingActivity(null);
              setIsModalOpen(true);
            }}
            onReloadDefaults={handleReloadDefaults}
          />
        )}

        {/* 7. Jurnal Refleksi Harian */}
        <section className="mt-1">
          <ReflectionJournal
            currentDate={currentDate}
            reflectionText={reflectionText}
            onSaveReflection={handleSaveReflection}
          />
        </section>

        {/* 8. Bottom Motivation Quote */}
        <footer className="mt-6 text-center select-none">
          <p className="text-xs italic text-charcoal-500">
            “Tak harus banyak, yang penting ada baiknya.”
          </p>
          <span className="inline-block mt-1 text-sm">🌷</span>
        </footer>
      </main>

      {/* Floating Action Button (FAB) for adding activity */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-auto sm:left-1/2 sm:translate-x-32 z-40">
        <button
          onClick={() => {
            setEditingActivity(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-dustyPink-500 hover:bg-dustyPink-600 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-dustyPink-500/30 active:scale-95 transition-all"
          aria-label="Tambah catatan baru"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Catatan</span>
        </button>
      </div>

      {/* Add / Edit Activity Modal */}
      <AddActivityModal
        isOpen={isModalOpen}
        activityToEdit={editingActivity}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!activityToDelete}
        itemTitle={activityToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setActivityToDelete(null)}
      />

      {/* Reminder Settings Modal */}
      <ReminderSettingsModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSettingsChanged={refreshReminderStatus}
      />
    </div>
  );
}
export default App;
