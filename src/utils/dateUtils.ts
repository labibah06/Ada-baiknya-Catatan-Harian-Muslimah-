export const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu'
];

export const INDONESIAN_DAYS_SHORT = [
  'Min',
  'Sen',
  'Sel',
  'Rab',
  'Kam',
  'Jum',
  'Sab'
];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des'
];

// Returns today's date formatted as YYYY-MM-DD in user's device local timezone
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format YYYY-MM-DD to Indonesian human-friendly date: "Jumat, 2 Oktober 2026"
export function formatDisplayDate(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const dateObj = new Date(year, month, day);
  const dayName = INDONESIAN_DAYS[dateObj.getDay()];
  const monthName = INDONESIAN_MONTHS[month];

  return `${dayName}, ${day} ${monthName} ${year}`;
}

// Navigate to previous day (dateStr - 1 day)
export function getPreviousDateString(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
  dateObj.setDate(dateObj.getDate() - 1);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Navigate to next day (dateStr + 1 day)
export function getNextDateString(dateStr: string): string {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
  dateObj.setDate(dateObj.getDate() + 1);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get array of past `count` days ending at referenceDateStr
export function getPastDaysList(referenceDateStr: string, count: number = 7): Array<{
  dateStr: string;
  dayShort: string;
  dateShort: string;
}> {
  const [yearStr, monthStr, dayStr] = referenceDateStr.split('-');
  const result = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateFormatted = `${year}-${month}-${day}`;

    result.push({
      dateStr: dateFormatted,
      dayShort: INDONESIAN_DAYS_SHORT[d.getDay()],
      dateShort: `${d.getDate()} ${INDONESIAN_MONTHS_SHORT[d.getMonth()]}`
    });
  }

  return result;
}
