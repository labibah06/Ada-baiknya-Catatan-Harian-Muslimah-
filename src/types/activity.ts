export interface DailyActivity {
  id: string;
  title: string;
  time: string; // HH:mm or ""
  note: string;
  completed: boolean;
  isDefault?: boolean;
}

export type ActivitiesByDate = Record<string, DailyActivity[]>;
