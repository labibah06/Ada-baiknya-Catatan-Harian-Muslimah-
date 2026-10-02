import { DailyActivity, ActivitiesByDate } from '../types/activity';

const STORAGE_KEY = 'ada_baiknya_activities_v1';
const INITIALIZED_DATES_KEY = 'ada_baiknya_initialized_dates_v1';
const REFLECTIONS_KEY = 'ada_baiknya_reflections_v1';

export function getDefaultActivities(): DailyActivity[] {
  return [
    {
      id: 'default-subuh',
      title: '🌙 Shalat Subuh',
      time: '04:35',
      note: 'Awal hari yang berkah',
      completed: false,
      isDefault: true
    },
    {
      id: 'default-dzuhur',
      title: '🌙 Shalat Dzuhur',
      time: '11:55',
      note: '',
      completed: false,
      isDefault: true
    },
    {
      id: 'default-ashar',
      title: '🌙 Shalat Ashar',
      time: '15:10',
      note: '',
      completed: false,
      isDefault: true
    },
    {
      id: 'default-maghrib',
      title: '🌙 Shalat Maghrib',
      time: '18:00',
      note: '',
      completed: false,
      isDefault: true
    },
    {
      id: 'default-isya',
      title: '🌙 Shalat Isya',
      time: '19:15',
      note: '',
      completed: false,
      isDefault: true
    },
    {
      id: 'default-quran',
      title: '📖 Membaca Al-Qur\'an',
      time: '',
      note: 'Tilawah & tadabbur',
      completed: false,
      isDefault: true
    },
    {
      id: 'default-dzikir',
      title: '🤲 Dzikir',
      time: '',
      note: 'Dzikir pagi / petang',
      completed: false,
      isDefault: true
    }
  ];
}

function getAllStoredData(): ActivitiesByDate {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllStoredData(data: ActivitiesByDate): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function getInitializedDates(): string[] {
  try {
    const raw = localStorage.getItem(INITIALIZED_DATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markDateInitialized(date: string): void {
  const dates = getInitializedDates();
  if (!dates.includes(date)) {
    dates.push(date);
    try {
      localStorage.setItem(INITIALIZED_DATES_KEY, JSON.stringify(dates));
    } catch (e) {
      console.error('Failed to mark date initialized:', e);
    }
  }
}

// Get activities for a date (initializes defaults on first visit of that date)
export function getActivities(date: string): DailyActivity[] {
  const allData = getAllStoredData();
  const initializedDates = getInitializedDates();

  // If this date has been visited before, return its saved activities (even if empty)
  if (initializedDates.includes(date)) {
    return allData[date] || [];
  }

  // First time visiting this date: create default activities
  const defaults = getDefaultActivities();
  allData[date] = defaults;
  saveAllStoredData(allData);
  markDateInitialized(date);

  return defaults;
}

// Save entire activity array for a date
export function saveActivities(date: string, activities: DailyActivity[]): void {
  const allData = getAllStoredData();
  allData[date] = activities;
  saveAllStoredData(allData);
  markDateInitialized(date);
}

// Add a new activity for a date
export function addActivity(date: string, activity: Omit<DailyActivity, 'id'>): DailyActivity {
  const activities = getActivities(date);
  const newActivity: DailyActivity = {
    ...activity,
    id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
  };
  const updated = [...activities, newActivity];
  saveActivities(date, updated);
  return newActivity;
}

// Update an existing activity
export function updateActivity(date: string, updatedActivity: DailyActivity): void {
  const activities = getActivities(date);
  const index = activities.findIndex((a) => a.id === updatedActivity.id);
  if (index !== -1) {
    activities[index] = updatedActivity;
    saveActivities(date, [...activities]);
  }
}

// Delete an activity by ID
export function deleteActivity(date: string, activityId: string): void {
  const activities = getActivities(date);
  const filtered = activities.filter((a) => a.id !== activityId);
  saveActivities(date, filtered);
}

// Reload default activities for a date
export function reloadDefaults(date: string): DailyActivity[] {
  const defaults = getDefaultActivities();
  saveActivities(date, defaults);
  return defaults;
}

export interface DayProgress {
  date: string;
  dayLabel: string;
  displayDate: string;
  total: number;
  completed: number;
  percentage: number;
  isCurrent: boolean;
}

// Compute 7-day progress for charts
export function getWeeklyProgress(referenceDate: string): DayProgress[] {
  const allData = getAllStoredData();
  const initializedDates = getInitializedDates();
  
  // Use past 7 days ending at referenceDate
  const [yearStr, monthStr, dayStr] = referenceDate.split('-');
  const days: DayProgress[] = [];

  const dayNamesShort = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateFormatted = `${year}-${month}-${day}`;

    // Read activities without automatically initializing defaults for past untouched dates
    let activitiesForDay: DailyActivity[] = [];
    if (initializedDates.includes(dateFormatted)) {
      activitiesForDay = allData[dateFormatted] || [];
    } else if (dateFormatted === referenceDate) {
      // For referenceDate, it might be active
      activitiesForDay = getActivities(dateFormatted);
    }

    const total = activitiesForDay.length;
    const completed = activitiesForDay.filter((a) => a.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    days.push({
      date: dateFormatted,
      dayLabel: dayNamesShort[d.getDay()],
      displayDate: `${d.getDate()} ${monthNamesShort[d.getMonth()]}`,
      total,
      completed,
      percentage,
      isCurrent: dateFormatted === referenceDate
    });
  }

  return days;
}

// Reflection Journal storage helpers
export function getReflection(date: string): string {
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[date] || '';
  } catch {
    return '';
  }
}

export function saveReflection(date: string, text: string): void {
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (text.trim() === '') {
      delete all[date];
    } else {
      all[date] = text;
    }
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save reflection to localStorage:', e);
  }
}

