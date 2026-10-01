/**
 * Calendar utilities for generating month views, week views, etc.
 */

import { 
  GregorianDate, 
  NepaliDate, 
  MonthInfo, 
  WeekDay,
  ConversionResult 
} from './types';
import { 
  gregorianToNepali, 
  nepaliToGregorian, 
  getNepaliDaysInMonth,
  getGregorianDaysInMonth,
  isGregorianLeapYear,
  getToday,
  gregorianToJDN,
  nepaliToJDN,
  jdnToGregorian,
  jdnToNepali
} from './converter';

/** Nepali month names */
export const NEPALI_MONTHS: MonthInfo[] = [
  { number: 1, nameEn: 'Baishakh', nameNp: 'बैशाख', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 1) },
  { number: 2, nameEn: 'Jestha', nameNp: 'जेठ', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 2) },
  { number: 3, nameEn: 'Ashadh', nameNp: 'असार', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 3) },
  { number: 4, nameEn: 'Shrawan', nameNp: 'श्रावण', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 4) },
  { number: 5, nameEn: 'Bhadra', nameNp: 'भदौ', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 5) },
  { number: 6, nameEn: 'Ashwin', nameNp: 'आश्विन', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 6) },
  { number: 7, nameEn: 'Kartik', nameNp: 'कार्तिक', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 7) },
  { number: 8, nameEn: 'Mangsir', nameNp: 'मंसिर', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 8) },
  { number: 9, nameEn: 'Poush', nameNp: 'पुष', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 9) },
  { number: 10, nameEn: 'Magh', nameNp: 'माघ', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 10) },
  { number: 11, nameEn: 'Falgun', nameNp: 'फाल्गुन', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 11) },
  { number: 12, nameEn: 'Chaitra', nameNp: 'चैत्र', daysInMonth: (y: number) => getNepaliDaysInMonth(y, 12) },
];

/** Gregorian month names */
export const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/** Week day names (English) */
export const WEEK_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Week day names (Nepali) */
export const WEEK_DAYS_NP = ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

/** Full week day names (English) */
export const WEEK_DAYS_EN_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Full week day names (Nepali) */
export const WEEK_DAYS_NP_FULL = ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];

/**
 * Get the week day (0-6, 0=Sunday) for a Gregorian date
 */
export function getGregorianWeekDay(date: GregorianDate): WeekDay {
  const d = new Date(date.year, date.month - 1, date.day);
  return d.getDay() as WeekDay;
}

/**
 * Get the week day (0-6, 0=Sunday) for a Nepali date
 */
export function getNepaliWeekDay(date: NepaliDate): WeekDay {
  const gregorian = nepaliToGregorian(date);
  return getGregorianWeekDay(gregorian);
}

/**
 * Get month info for a Nepali month
 */
export function getNepaliMonthInfo(year: number, month: number): MonthInfo {
  const base = NEPALI_MONTHS[month - 1];
  return {
    ...base,
    daysInMonth: (y: number) => getNepaliDaysInMonth(y, month)
  };
}

/**
 * Generate a month calendar grid for Nepali calendar
 * Returns weeks, each containing 7 days (null for days outside the month)
 */
export interface CalendarDay {
  nepaliDay: number;
  gregorianDate: GregorianDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  weekDay: WeekDay;
  festivals: string[]; // festival IDs
  holidays: string[];  // holiday IDs
}

export interface MonthCalendar {
  year: number;
  month: number;
  monthNameEn: string;
  monthNameNp: string;
  weeks: CalendarDay[][];
  prevMonthDays: number;
  nextMonthDays: number;
}

/**
 * Generate a full month calendar for a Nepali month
 */
export function generateNepaliMonthCalendar(
  year: number, 
  month: number,
  festivals: Map<string, any[]> = new Map(),
  holidays: Map<string, any[]> = new Map()
): MonthCalendar {
  const monthInfo = getNepaliMonthInfo(year, month);
  const daysInMonth = monthInfo.daysInMonth(year);
  
  // Get the first day of the month in Gregorian
  const firstDayGregorian = nepaliToGregorian({ year, month, day: 1 });
  const firstWeekDay = getGregorianWeekDay(firstDayGregorian);
  
  // Get today for comparison
  const today = getToday();
  
  // Build the calendar
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];
  
  // Add leading days from previous month
  for (let i = 0; i < firstWeekDay; i++) {
    const prevMonthDay = firstWeekDay - i;
    // We'd need to calculate the previous month's last days
    // For simplicity, we'll add placeholder days
    currentWeek.unshift({
      nepaliDay: 0,
      gregorianDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: (firstWeekDay - 1 - i) as WeekDay,
      festivals: [],
      holidays: []
    });
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const nepaliDate: NepaliDate = { year, month, day };
    const gregorianDate = nepaliToGregorian(nepaliDate);
    const weekDay = getGregorianWeekDay(gregorianDate);
    
    const isToday = today.nepali.year === year && today.nepali.month === month && today.nepali.day === day;
    
    // Get festivals/holidays for this day
    const key = `${year}-${month}-${day}`;
    const dayFestivals = festivals.get(key)?.map(f => f.id) || [];
    const dayHolidays = holidays.get(key)?.map(h => h.id) || [];
    
    currentWeek.push({
      nepaliDay: day,
      gregorianDate,
      isCurrentMonth: true,
      isToday,
      weekDay,
      festivals: dayFestivals,
      holidays: dayHolidays
    });
    
    // If week is complete, start a new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Add trailing days from next month
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    currentWeek.push({
      nepaliDay: 0,
      gregorianDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: currentWeek.length as WeekDay,
      festivals: [],
      holidays: []
    });
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return {
    year,
    month,
    monthNameEn: monthInfo.nameEn,
    monthNameNp: monthInfo.nameNp,
    weeks,
    prevMonthDays: firstWeekDay,
    nextMonthDays: currentWeek.length > 0 ? 7 - currentWeek.length : 0
  };
}

/**
 * Generate a Gregorian month calendar with Nepali dates overlay
 */
export interface GregorianCalendarDay {
  gregorianDay: number;
  nepaliDate: NepaliDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  weekDay: WeekDay;
  festivals: string[];
  holidays: string[];
}

export interface GregorianMonthCalendar {
  year: number;
  month: number;
  monthName: string;
  weeks: GregorianCalendarDay[][];
}

/**
 * Generate a Gregorian month calendar with Nepali dates
 */
export function generateGregorianMonthCalendar(
  year: number,
  month: number,
  festivals: Map<string, any[]> = new Map(),
  holidays: Map<string, any[]> = new Map()
): GregorianMonthCalendar {
  const daysInMonth = getGregorianDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekDay = firstDay.getDay();
  
  const today = getToday();
  
  const weeks: GregorianCalendarDay[][] = [];
  let currentWeek: GregorianCalendarDay[] = [];
  
  // Leading days
  for (let i = 0; i < firstWeekDay; i++) {
    currentWeek.push({
      gregorianDay: 0,
      nepaliDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: i as WeekDay,
      festivals: [],
      holidays: []
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const gregorianDate: GregorianDate = { year, month, day };
    const nepaliDate = gregorianToNepali(gregorianDate);
    const weekDay = getGregorianWeekDay(gregorianDate);
    
    const isToday = today.gregorian.year === year && today.gregorian.month === month && today.gregorian.day === day;
    
    const key = `${nepaliDate.year}-${nepaliDate.month}-${nepaliDate.day}`;
    const dayFestivals = festivals.get(key)?.map(f => f.id) || [];
    const dayHolidays = holidays.get(key)?.map(h => h.id) || [];
    
    currentWeek.push({
      gregorianDay: day,
      nepaliDate,
      isCurrentMonth: true,
      isToday,
      weekDay,
      festivals: dayFestivals,
      holidays: dayHolidays
    });
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Trailing days
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    currentWeek.push({
      gregorianDay: 0,
      nepaliDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: currentWeek.length as WeekDay,
      festivals: [],
      holidays: []
    });
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return {
    year,
    month,
    monthName: GREGORIAN_MONTHS[month - 1],
    weeks
  };
}

/**
 * Get week range for a given date (Sunday to Saturday)
 */
export function getWeekRange(date: GregorianDate): { start: GregorianDate; end: GregorianDate } {
  const weekDay = getGregorianWeekDay(date);
  const startJDN = gregorianToJDN(date) - weekDay;
  const endJDN = startJDN + 6;
  
  const start = jdnToGregorian(startJDN);
  const end = jdnToGregorian(endJDN);
  
  return { start, end };
}

/**
 * Check if a Nepali date is valid
 */
export function isValidNepaliDate(date: NepaliDate): boolean {
  if (date.year < 2000 || date.year > 2099) return false;
  if (date.month < 1 || date.month > 12) return false;
  const daysInMonth = getNepaliDaysInMonth(date.year, date.month);
  return date.day >= 1 && date.day <= daysInMonth;
}

/**
 * Check if a Gregorian date is valid
 */
export function isValidGregorianDate(date: GregorianDate): boolean {
  if (date.year < 1943 || date.year > 2100) return false;
  if (date.month < 1 || date.month > 12) return false;
  const daysInMonth = getGregorianDaysInMonth(date.year, date.month);
  return date.day >= 1 && date.day <= daysInMonth;
}

/**
 * Add days to a Nepali date
 */
export function addDaysToNepali(date: NepaliDate, days: number): NepaliDate {
  const jdn = nepaliToJDN(date) + days;
  return jdnToNepali(jdn);
}

/**
 * Subtract days from a Nepali date
 */
export function subtractDaysFromNepali(date: NepaliDate, days: number): NepaliDate {
  return addDaysToNepali(date, -days);
}

/**
 * Difference in days between two Nepali dates
 */
export function nepaliDaysDifference(date1: NepaliDate, date2: NepaliDate): number {
  return nepaliToJDN(date2) - nepaliToJDN(date1);
}

/**
 * Get the Nepali year range that overlaps with a Gregorian year
 */
export function getNepaliYearRangeForGregorianYear(gregorianYear: number): { start: number; end: number } {
  // Approximate: BS year = Gregorian year + 57 (roughly)
  // Baishakh 1 usually falls in mid-April
  const startOfYear = gregorianToNepali({ year: gregorianYear, month: 1, day: 1 });
  const endOfYear = gregorianToNepali({ year: gregorianYear, month: 12, day: 31 });
  
  return {
    start: startOfYear.year,
    end: endOfYear.year
  };
}

/**
 * Get the Gregorian year range that overlaps with a Nepali year
 */
export function getGregorianYearRangeForNepaliYear(nepaliYear: number): { start: number; end: number } {
  const startOfYear = nepaliToGregorian({ year: nepaliYear, month: 1, day: 1 });
  const endOfYear = nepaliToGregorian({ year: nepaliYear, month: 12, day: getNepaliDaysInMonth(nepaliYear, 12) });
  
  return {
    start: startOfYear.year,
    end: endOfYear.year
  };
}