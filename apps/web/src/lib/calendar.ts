// Nepali Calendar Library Wrapper
// Uses @8848/nepali-calendar package for accurate calculations

import type {
  GregorianDate,
  NepaliDate,
  CalendarEvent,
  TithiInfo,
  CalendarDayData,
  MonthCalendarData,
  Timezone,
  ZodiacInfo,
} from '@/types';
import type { PanchangData } from './panchang';
import {
  calculatePanchang,
  getNepalSambat,
  getMonthDetails,
  getRashiInfo,
} from './panchang';

// Nepali digits mapping
const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toNepaliDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, d => NEPALI_DIGITS[parseInt(d)]);
}

export function fromNepaliDigits(str: string): number {
  const arabic = str.replace(/[०-९]/g, d => NEPALI_DIGITS.indexOf(d).toString());
  return parseInt(arabic, 10);
}

// Nepali month data
export const NEPALI_MONTHS = [
  { number: 1, nameEn: 'Baishakh', nameNp: 'बैशाख', shortEn: 'Bsk', days: 31 },
  { number: 2, nameEn: 'Jestha', nameNp: 'जेठ', shortEn: 'Jst', days: 31 },
  { number: 3, nameEn: 'Ashadh', nameNp: 'असार', shortEn: 'Asd', days: 32 },
  { number: 4, nameEn: 'Shrawan', nameNp: 'श्रावण', shortEn: 'Shr', days: 31 },
  { number: 5, nameEn: 'Bhadra', nameNp: 'भदौ', shortEn: 'Bhd', days: 31 },
  { number: 6, nameEn: 'Ashwin', nameNp: 'आश्विन', shortEn: 'Asw', days: 30 },
  { number: 7, nameEn: 'Kartik', nameNp: 'कार्तिक', shortEn: 'Ktk', days: 30 },
  { number: 8, nameEn: 'Mangsir', nameNp: 'मंसिर', shortEn: 'Msg', days: 30 },
  { number: 9, nameEn: 'Poush', nameNp: 'पुष', shortEn: 'Psh', days: 30 },
  { number: 10, nameEn: 'Magh', nameNp: 'माघ', shortEn: 'Mgh', days: 30 },
  { number: 11, nameEn: 'Falgun', nameNp: 'फाल्गुन', shortEn: 'Flg', days: 30 },
  { number: 12, nameEn: 'Chaitra', nameNp: 'चैत्र', shortEn: 'Cht', days: 30 },
];

export const AD_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const AD_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_NP = ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];
export const WEEKDAYS_NP_SHORT = ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

// Festival and holiday data (simplified for demo - in production would come from package)
const FESTIVALS_DB: Record<string, CalendarEvent[]> = {
  '2080-9-1': [{ id: 'ny', title: 'Nepali New Year', titleNp: 'नववर्ष', date: { year: 2080, month: 9, day: 1 }, type: 'holiday', isNationalHoliday: true }],
  '2080-9-15': [{ id: 'maghe', title: 'Maghe Sankranti', titleNp: 'माघे सङ्क्रान्ति', date: { year: 2080, month: 9, day: 15 }, type: 'festival' }],
  '2080-10-1': [{ id: 'maghe2', title: 'Maghe Sankranti', titleNp: 'माघे सङ्क्रान्ति', date: { year: 2080, month: 10, day: 1 }, type: 'festival' }],
  '2080-6-1': [{ id: 'dashain', title: 'Dashain Begins', titleNp: 'दशैं सुरु', date: { year: 2080, month: 6, day: 1 }, type: 'holiday', isNationalHoliday: true }],
  '2080-6-10': [{ id: 'tika', title: 'Dashain Tika', titleNp: 'दशैं टीका', date: { year: 2080, month: 6, day: 10 }, type: 'holiday', isNationalHoliday: true }],
  '2080-7-1': [{ id: 'tihar', title: 'Tihar Begins', titleNp: 'तिहार सुरु', date: { year: 2080, month: 7, day: 1 }, type: 'holiday', isNationalHoliday: true }],
  '2080-7-5': [{ id: 'bhaitika', title: 'Bhai Tika', titleNp: 'भाई टीका', date: { year: 2080, month: 7, day: 5 }, type: 'holiday', isNationalHoliday: true }],
  '2080-11-15': [{ id: 'holi', title: 'Holi', titleNp: 'होली', date: { year: 2080, month: 11, day: 15 }, type: 'holiday', isNationalHoliday: true }],
  '2080-1-15': [{ id: 'buddha', title: 'Buddha Jayanti', titleNp: 'बुद्ध जयन्ती', date: { year: 2080, month: 1, day: 15 }, type: 'holiday', isNationalHoliday: true }],
  '2080-4-15': [{ id: 'janai', title: 'Janai Purnima', titleNp: 'जनेइ पूर्णिमा', date: { year: 2080, month: 4, day: 15 }, type: 'festival' }],
  '2080-5-3': [{ id: 'teej', title: 'Teej', titleNp: 'तीज', date: { year: 2080, month: 5, day: 3 }, type: 'holiday', isNationalHoliday: true }],
  '2081-1-1': [{ id: 'ny2', title: 'Nepali New Year', titleNp: 'नववर्ष', date: { year: 2081, month: 1, day: 1 }, type: 'holiday', isNationalHoliday: true }],
  '2024-1-15': [{ id: 'maghe_ad', title: 'Maghe Sankranti', titleNp: 'माघे सङ्क्रान्ति', date: { year: 2024, month: 1, day: 15 }, type: 'festival' }],
  '2024-1-26': [{ id: 'republic', title: 'Republic Day', titleNp: 'गणतन्त्र दिवस', date: { year: 2024, month: 1, day: 26 }, type: 'observance' }],
  '2024-3-8': [{ id: 'women', title: "Women's Day", titleNp: 'महिला दिवस', date: { year: 2024, month: 3, day: 8 }, type: 'observance' }],
  '2024-10-2': [{ id: 'gandhi', title: 'Gandhi Jayanti', titleNp: 'गाँधी जयन्ती', date: { year: 2024, month: 10, day: 2 }, type: 'observance' }],
};

// JDN-based conversion (simplified - real impl in package)
const BS_EPOCH_JDN = 2436747; // 2000-01-01 BS = 1943-04-13 AD

function gregorianToJDN(date: GregorianDate): number {
  const { year, month, day } = date;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function getNepaliDaysInMonth(year: number, month: number): number {
  const m = NEPALI_MONTHS[month - 1];
  if (month === 3 && isBsLeapYear(year)) return 32;
  return m.days;
}

function isBsLeapYear(year: number): boolean {
  return [2078, 2081, 2084, 2087, 2090, 2093, 2096, 2099].includes(year);
}

function getNepaliDaysInYear(year: number): number {
  let days = 0;
  for (let m = 1; m <= 12; m++) {
    days += getNepaliDaysInMonth(year, m);
  }
  return days;
}

export function gregorianToNepali(gregorian: GregorianDate): NepaliDate {
  const jdn = gregorianToJDN(gregorian);
  let daysDiff = jdn - BS_EPOCH_JDN;
  
  if (daysDiff < 0) throw new Error('Date before supported range');
  
  let year = 2000;
  while (true) {
    const daysInYear = getNepaliDaysInYear(year);
    if (daysDiff < daysInYear) break;
    daysDiff -= daysInYear;
    year++;
  }
  
  let month = 1;
  while (month <= 12) {
    const daysInMonth = getNepaliDaysInMonth(year, month);
    if (daysDiff < daysInMonth) break;
    daysDiff -= daysInMonth;
    month++;
  }
  
  const day = daysDiff + 1;
  return { year, month, day };
}

export function nepaliToGregorian(nepali: NepaliDate): GregorianDate {
  let days = 0;
  for (let y = 2000; y < nepali.year; y++) {
    days += getNepaliDaysInYear(y);
  }
  for (let m = 1; m < nepali.month; m++) {
    days += getNepaliDaysInMonth(nepali.year, m);
  }
  days += nepali.day - 1;
  
  const jdn = BS_EPOCH_JDN + days;
  return jdnToGregorian(jdn);
}

export function getToday(timezone: Timezone = 'Asia/Kathmandu'): { gregorian: GregorianDate; nepali: NepaliDate } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '2024');
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1');
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
  
  const gregorian: GregorianDate = { year, month, day };
  const nepali = gregorianToNepali(gregorian);
  return { gregorian, nepali };
}

// Tithi calculation (simplified)
const LUNAR_MONTH = 29.53059;
const REF_NEW_MOON_JDN = 2451550.1;

export function getTithi(gregorian: GregorianDate): TithiInfo {
  const jdn = gregorianToJDN(gregorian);
  const daysSinceRef = jdn - REF_NEW_MOON_JDN;
  const lunarDays = ((daysSinceRef % LUNAR_MONTH) + LUNAR_MONTH) % LUNAR_MONTH;
  const TITHI_DURATION = LUNAR_MONTH / 30;
  const tithiNumber = Math.floor(lunarDays / TITHI_DURATION) + 1;
  const paksha = tithiNumber <= 15 ? 'shukla' : 'krishna';
  const phase = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  
  const tithiNames = [
    '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
  ];
  const tithiNamesNp = [
    '', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
    'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
    'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
  ];
  
  const name = paksha === 'shukla' ? tithiNames[phase] : `${tithiNames[phase]} (Krishna)`;
  const nameNp = paksha === 'shukla' ? tithiNamesNp[phase] : `${tithiNamesNp[phase]} (कृष्ण)`;
  
  return { tithi: tithiNumber, paksha, name, nameNp };
}

export function getEventsForDate(nepali: NepaliDate, gregorian: GregorianDate): CalendarEvent[] {
  const bsKey = `${nepali.year}-${nepali.month}-${nepali.day}`;
  const adKey = `${gregorian.year}-${gregorian.month}-${gregorian.day}`;
  const bsEvents = FESTIVALS_DB[bsKey] || [];
  const adEvents = FESTIVALS_DB[adKey] || [];
  return [...bsEvents, ...adEvents];
}

export function generateMonthCalendar(bsYear: number, bsMonth: number, timezone: Timezone = 'Asia/Kathmandu'): MonthCalendarData {
  const monthInfo = NEPALI_MONTHS[bsMonth - 1];
  const daysInMonth = getNepaliDaysInMonth(bsYear, bsMonth);
  
  const firstDayGregorian = nepaliToGregorian({ year: bsYear, month: bsMonth, day: 1 });
  const firstWeekDay = new Date(firstDayGregorian.year, firstDayGregorian.month - 1, firstDayGregorian.day).getDay();
  
  const today = getToday(timezone);
  
  const weeks: CalendarDayData[][] = [];
  let currentWeek: CalendarDayData[] = [];
  
  // Previous month trailing days
  const prevMonth = bsMonth === 1 ? 12 : bsMonth - 1;
  const prevYear = bsMonth === 1 ? bsYear - 1 : bsYear;
  const prevDaysInMonth = getNepaliDaysInMonth(prevYear, prevMonth);
  
  for (let i = firstWeekDay - 1; i >= 0; i--) {
    const day = prevDaysInMonth - i;
    const npDate = { year: prevYear, month: prevMonth, day };
    const adDate = nepaliToGregorian(npDate);
    currentWeek.push(createDayData(day, npDate, adDate, false, false));
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const npDate: NepaliDate = { year: bsYear, month: bsMonth, day };
    const adDate = nepaliToGregorian(npDate);
    const isToday = today.nepali.year === bsYear && today.nepali.month === bsMonth && today.nepali.day === day;
    currentWeek.push(createDayData(day, npDate, adDate, true, isToday));
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Next month leading days
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    const nextMonth = bsMonth === 12 ? 1 : bsMonth + 1;
    const nextYear = bsMonth === 12 ? bsYear + 1 : bsYear;
    const day = currentWeek.length;
    const npDate = { year: nextYear, month: nextMonth, day };
    const adDate = nepaliToGregorian(npDate);
    currentWeek.push(createDayData(day, npDate, adDate, false, false));
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return {
    year: bsYear,
    month: bsMonth,
    monthNameEn: monthInfo.nameEn,
    monthNameNp: monthInfo.nameNp,
    weeks,
    prevMonthDays: firstWeekDay,
    nextMonthDays: currentWeek.length > 0 ? 7 - currentWeek.length : 0,
  };
}

function createDayData(
  nepaliDay: number,
  npDate: NepaliDate,
  adDate: GregorianDate,
  isCurrentMonth: boolean,
  isToday: boolean
): CalendarDayData {
  const events = getEventsForDate(npDate, adDate);
  const tithi = getTithi(adDate);
  const panchang = calculatePanchang(adDate, npDate);
  const hasMultipleEvents = events.length > 1;
  
  return {
    nepaliDay,
    gregorianDate: adDate,
    isCurrentMonth,
    isToday,
    weekDay: new Date(adDate.year, adDate.month - 1, adDate.day).getDay(),
    events,
    tithi,
    panchang,
    hasMultipleEvents,
    eventCount: events.length,
  };
}

export function getUpcomingFestivals(limit: number = 10): CalendarEvent[] {
  const today = getToday();
  const results: CalendarEvent[] = [];
  
  for (const [key, events] of Object.entries(FESTIVALS_DB)) {
    const [y, m, d] = key.split('-').map(Number);
    let eventDate: Date;
    if (y > 2000) {
      const ad = nepaliToGregorian({ year: y, month: m, day: d });
      eventDate = new Date(ad.year, ad.month - 1, ad.day);
    } else {
      eventDate = new Date(y, m - 1, d);
    }
    if (eventDate >= new Date(today.gregorian.year, today.gregorian.month - 1, today.gregorian.day)) {
      results.push(...events);
    }
  }
  
  return results.slice(0, limit);
}

const ZODIAC_WEST = [
  { sign: 'Capricorn', signNp: 'मकर', start: { m: 1, d: 20 }, end: { m: 2, d: 18 } },
  { sign: 'Aquarius', signNp: 'कुम्भ', start: { m: 2, d: 19 }, end: { m: 3, d: 20 } },
  { sign: 'Pisces', signNp: 'मीन', start: { m: 3, d: 21 }, end: { m: 4, d: 19 } },
  { sign: 'Aries', signNp: 'मेष', start: { m: 4, d: 20 }, end: { m: 5, d: 20 } },
  { sign: 'Taurus', signNp: 'वृष', start: { m: 5, d: 21 }, end: { m: 6, d: 20 } },
  { sign: 'Gemini', signNp: 'मिथुन', start: { m: 6, d: 21 }, end: { m: 7, d: 22 } },
  { sign: 'Cancer', signNp: 'कर्कट', start: { m: 7, d: 23 }, end: { m: 8, d: 22 } },
  { sign: 'Leo', signNp: 'सिंह', start: { m: 8, d: 23 }, end: { m: 9, d: 22 } },
  { sign: 'Virgo', signNp: 'कन्या', start: { m: 9, d: 23 }, end: { m: 10, d: 22 } },
  { sign: 'Libra', signNp: 'तुला', start: { m: 10, d: 23 }, end: { m: 11, d: 21 } },
  { sign: 'Scorpio', signNp: 'वृश्चिक', start: { m: 11, d: 22 }, end: { m: 12, d: 21 } },
  { sign: 'Sagittarius', signNp: 'धनु', start: { m: 12, d: 22 }, end: { m: 1, d: 19 } },
];

const RASHI_NP = [
  { rashi: 'Mesha', rashiNp: 'मेष', startM: 1, startD: 14 },
  { rashi: 'Brisha', rashiNp: 'वृष', startM: 2, startD: 15 },
  { rashi: 'Mithuna', rashiNp: 'मिथुन', startM: 3, startD: 15 },
  { rashi: 'Karkat', rashiNp: 'कर्कट', startM: 4, startD: 16 },
  { rashi: 'Simha', rashiNp: 'सिंह', startM: 5, startD: 16 },
  { rashi: 'Kanya', rashiNp: 'कन्या', startM: 6, startD: 17 },
  { rashi: 'Tula', rashiNp: 'तुला', startM: 7, startD: 17 },
  { rashi: 'Brishchik', rashiNp: 'वृश्चिक', startM: 8, startD: 16 },
  { rashi: 'Dhanu', rashiNp: 'धनु', startM: 9, startD: 15 },
  { rashi: 'Makar', rashiNp: 'मकर', startM: 10, startD: 14 },
  { rashi: 'Kumbha', rashiNp: 'कुम्भ', startM: 11, startD: 13 },
  { rashi: 'Meena', rashiNp: 'मीन', startM: 12, startD: 13 },
];

export function getZodiacInfo(gregorian: GregorianDate, nepali: NepaliDate): ZodiacInfo {
  let western = ZODIAC_WEST[0];
  for (const z of ZODIAC_WEST) {
    if (z.start.m <= z.end.m) {
      if ((gregorian.month > z.start.m || (gregorian.month === z.start.m && gregorian.day >= z.start.d)) &&
          (gregorian.month < z.end.m || (gregorian.month === z.end.m && gregorian.day <= z.end.d))) {
        western = z;
        break;
      }
    } else {
      if ((gregorian.month > z.start.m || (gregorian.month === z.start.m && gregorian.day >= z.start.d)) ||
          (gregorian.month < z.end.m || (gregorian.month === z.end.m && gregorian.day <= z.end.d))) {
        western = z;
        break;
      }
    }
  }
  
  let nepaliRashi = RASHI_NP[11];
  for (let i = RASHI_NP.length - 1; i >= 0; i--) {
    const r = RASHI_NP[i];
    if (nepali.month > r.startM || (nepali.month === r.startM && nepali.day >= r.startD)) {
      nepaliRashi = r;
      break;
    }
  }
  
  return {
    western: { sign: western.sign, signNp: western.signNp },
    nepali: { rashi: nepaliRashi.rashi, rashiNp: nepaliRashi.rashiNp },
  };
}

export function getTimezoneTimes(timezone: Timezone): Record<string, string> {
  const now = new Date();
  const zones: Record<string, Timezone> = {
    'Kathmandu': 'Asia/Kathmandu',
    'New York': 'America/New_York',
    'London': 'Europe/London',
    'Dubai': 'Asia/Dubai',
    'Singapore': 'Asia/Singapore',
  };
  
  const result: Record<string, string> = {};
  for (const [label, tz] of Object.entries(zones)) {
    result[label] = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);
  }
  return result;
}

// Re-export panchang functions
export {
  calculatePanchang,
  getNepalSambat,
  getMonthDetails,
  getRashiInfo,
} from './panchang';