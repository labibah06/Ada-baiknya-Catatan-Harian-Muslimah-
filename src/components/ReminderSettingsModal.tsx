import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, AlertCircle, X, Sparkles } from 'lucide-react';
import {
  ReminderSettings,
  getReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  getNotificationPermissionStatus,
  sendLocalNotification
} from '../services/notificationService';

interface ReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChanged?: () => void;
}

const PRESET_TIMES = [
  { label: 'Pagi', time: '06:00', desc: 'Awali hari dengan niat baik' },
  { label: 'Sore', time: '17:30', desc: 'Jelang Maghrib & istirahat' },
  { label: 'Malam', time: '20:30', desc: 'Evaluasi & refleksi tenang (Rekomendasi)' }
];

export const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsChanged
}) => {
  const [settings, setSettings] = useState<ReminderSettings>(getReminderSettings());
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getReminderSettings());
      setPermission(getNotificationPermissionStatus());
      setTestNotificationStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleEnable = async () => {
    const nextEnabled = !settings.enabled;
    if (nextEnabled && permission !== 'granted') {
      const res = await requestNotificationPermission();
      setPermission(res);
      if (res !== 'granted') {
        alert(
          'Izin notifikasi belum diberikan. Harap izinkan notifikasi pada peramban agar pengingat dapat muncul.'
        );
        return;
      }
    }

    const updated = { ...settings, enabled: nextEnabled };
    setSettings(updated);
    saveReminderSettings(updated);
    if (onSettingsChanged) onSettingsChanged();
  };

  const handleSave = () => {
    saveReminderSettings(settings);
    if (onSettingsChanged) onSettingsChanged();
    onClose();
  };

  const handleTestNotification = async () => {
    setTestNotificationStatus('Mengirim notifikasi...');
    const success = await sendLocalNotification('Ada Baiknya — Catatan Harian 🌷', {
      body: settings.message || 'Waktunya muhasabah & mencatat kebaikan hari ini ✨'
    });

    if (success) {
      setTestNotificationStatus('Notifikasi berhasil dikirim! Silakan periksa layar perangkat.');
      setPermission(getNotificationPermissionStatus());
    } else {
      setTestNotificationStatus(
        'Gagal mengirim notifikasi. Pastikan izin notifikasi diaktifkan di browser Anda.'
      );
    }

    setTimeout(() => {
      setTestNotificationStatus(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-dustyPink-200 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-dustyPink-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-dustyPink-100 flex items-center justify-center text-dustyPink-600">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-charcoal-800">
                Pengingat Harian
              </h3>
              <p className="text-[11px] text-charcoal-500">
                Jadwalkan notifikasi untuk mencatat ibadah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-400 hover:text-charcoal-600 hover:bg-dustyPink-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission status alert if denied or unsupported */}
        {permission === 'denied' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Izin Notifikasi Diblokir</p>
              <p className="text-[11px] text-red-600 mt-0.5">
                Buka pengaturan peramban/situs ini dan izinkan notifikasi agar alarm pengingat dapat bekerja.
              </p>
            </div>
          </div>
        )}

        {permission === 'granted' && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium">Izin notifikasi peramban aktif</span>
          </div>
        )}

        {/* Toggle Switch */}
        <div className="flex items-center justify-between bg-dustyPink-50/70 p-3.5 rounded-2xl border border-dustyPink-200/80">
          <div>
            <span className="text-xs font-bold text-charcoal-800 block">
              Aktifkan Pengingat
            </span>
            <span className="text-[11px] text-charcoal-500">
              Kirim pemberitahuan setiap hari
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.enabled}
            onClick={handleToggleEnable}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
              settings.enabled ? 'bg-dustyPink-500 justify-end' : 'bg-charcoal-300 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
          </button>
        </div>

        {/* Settings Body when Enabled */}
        {settings.enabled && (
          <div className="flex flex-col gap-3.5">
            {/* Time selection */}
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-dustyPink-500" />
                <span>Pilih Jam Pengingat:</span>
              </label>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                className="w-full text-center font-bold text-lg p-2 rounded-xl border border-dustyPink-300 focus:outline-hidden focus:border-dustyPink-500 bg-white text-dustyPink-700"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-medium text-charcoal-500 block mb-1">
                Pilihan waktu populer:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_TIMES.map((preset) => (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => setSettings({ ...settings, time: preset.time })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      settings.time === preset.time
                        ? 'bg-dustyPink-100 border-dustyPink-400 text-dustyPink-800 font-bold'
                        : 'bg-white border-dustyPink-200/90 text-charcoal-600 hover:bg-dustyPink-50 text-xs'
                    }`}
                  >
                    <span className="text-xs block">{preset.label}</span>
                    <span className="text-[10px] opacity-75">{preset.time}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">
                Pesan Notifikasi:
              </label>
              <textarea
                value={settings.message}
                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                rows={2}
                placeholder="Tuliskan pesan motivasi untuk diri sendiri..."
                className="w-full p-2.5 rounded-xl border border-dustyPink-200 focus:outline-hidden focus:border-dustyPink-400 text-xs text-charcoal-800 resize-none bg-dustyPink-50/30"
              />
            </div>

            {/* Test notification button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestNotification}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dustyPink-300 bg-white hover:bg-dustyPink-50 text-dustyPink-700 font-medium text-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-dustyPink-500" />
                <span>Kirim Notifikasi Uji Coba Sekarang</span>
              </button>
              {testNotificationStatus && (
                <p className="text-[10px] text-center text-charcoal-600 mt-1 italic">
                  {testNotificationStatus}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-dustyPink-100">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3.5 rounded-xl border border-dustyPink-200 text-charcoal-600 text-xs font-medium hover:bg-dustyPink-50 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-4 rounded-xl bg-dustyPink-500 hover:bg-dustyPink-600 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
