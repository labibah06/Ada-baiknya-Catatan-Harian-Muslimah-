export interface ReminderSettings {
  enabled: boolean;
  time: string; // Format "HH:mm"
  message: string;
  lastNotifiedDate?: string; // "YYYY-MM-DD"
}

const SETTINGS_KEY = 'ada_baiknya_reminder_settings_v1';

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  time: '20:30',
  message: 'Waktunya muhasabah & mencatat kebaikan hari ini. Luangkan sejenak waktu untuk diri dan ibadahmu 🌷'
};

export function getReminderSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_REMINDER_SETTINGS;
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export function saveReminderSettings(settings: ReminderSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save reminder settings:', e);
  }
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

export async function sendLocalNotification(title: string, options: { body: string; icon?: string; tag?: string }): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    const requested = await requestNotificationPermission();
    if (requested !== 'granted') {
      return false;
    }
  }

  try {
    // Prefer service worker showNotification if available (works on mobile PWA)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.showNotification) {
        await registration.showNotification(title, {
          body: options.body,
          icon: options.icon || '/icon.svg',
          badge: '/icon.svg',
          tag: options.tag || 'ada-baiknya-reminder',
          vibrate: [200, 100, 200]
        } as NotificationOptions);
        return true;
      }
    }

    // Fallback to standard window Notification
    new Notification(title, {
      body: options.body,
      icon: options.icon || '/icon.svg',
      tag: options.tag || 'ada-baiknya-reminder'
    });
    return true;
  } catch (e) {
    console.warn('Notification display failed, falling back:', e);
    try {
      new Notification(title, {
        body: options.body,
        icon: options.icon || '/icon.svg'
      });
      return true;
    } catch (innerError) {
      console.error('Fallback notification also failed:', innerError);
      return false;
    }
  }
}

// Check if it's time to trigger daily reminder
export async function checkDailyReminder(todayDateStr: string): Promise<boolean> {
  const settings = getReminderSettings();
  if (!settings.enabled) return false;

  // Already notified today
  if (settings.lastNotifiedDate === todayDateStr) return false;

  const now = new Date();
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  // If current time is equal to or past scheduled reminder time
  if (currentTime >= settings.time) {
    const sent = await sendLocalNotification('Ada Baiknya — Catatan Harian', {
      body: settings.message,
      tag: `daily-reminder-${todayDateStr}`
    });

    if (sent) {
      settings.lastNotifiedDate = todayDateStr;
      saveReminderSettings(settings);
      return true;
    }
  }

  return false;
}
