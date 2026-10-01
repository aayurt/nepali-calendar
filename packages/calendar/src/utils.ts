/**
 * Utility functions for Nepali Calendar
 */

import { GregorianDate, NepaliDate, FormatOptions } from './types';
import { 
  gregorianToNepali, 
  nepaliToGregorian, 
  getNepaliDaysInMonth,
  getGregorianDaysInMonth,
  isGregorianLeapYear,
  gregorianToJDN,
  nepaliToJDN,
  jdnToGregorian,
  jdnToNepali
} from './converter';
import { NEPALI_MONTHS } from './calendar';

/** Nepali digit mapping */
const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/** Convert Arabic numerals to Nepali digits */
export function toNepaliDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, d => NEPALI_DIGITS[parseInt(d)]);
}

/** Convert Nepali digits to Arabic numerals */
export function fromNepaliDigits(str: string): number {
  const arabic = str.replace(/[०-९]/g, d => NEPALI_DIGITS.indexOf(d as any).toString());
  return parseInt(arabic, 10);
}

/** Format a Nepali date as a string */
export function formatNepaliDate(
  date: NepaliDate, 
  options: FormatOptions = {}
): string {
  const { locale = 'np', format = 'full', showEra = false } = options;
  
  const monthInfo = NEPALI_MONTHS[date.month - 1];
  if (!monthInfo) return 'Invalid date';
  
  const dayStr = locale === 'np' ? toNepaliDigits(date.day) : String(date.day);
  const yearStr = locale === 'np' ? toNepaliDigits(date.year) : String(date.year);
  const monthStr = locale === 'np' ? monthInfo.nameNp : monthInfo.nameEn;
  
  if (format === 'short') {
    return `${dayStr}/${date.month}/${yearStr}`;
  }
  
  if (format === 'long') {
    return `${dayStr} ${monthStr}, ${yearStr}`;
  }
  
  // full format
  const era = showEra ? (locale === 'np' ? ' बि.सं.' : ' BS') : '';
  return `${dayStr} ${monthStr}, ${yearStr}${era}`;
}

/** Format a Gregorian date as a string */
export function formatGregorianDate(
  date: GregorianDate,
  options: FormatOptions = {}
): string {
  const { locale = 'en', format = 'full' } = options;
  
  const months = locale === 'np' 
    ? NEPALI_MONTHS.map(m => m.nameNp)
    : ['January', 'February', 'March', 'April', 'May', 'June', 
       'July', 'August', 'September', 'October', 'November', 'December'];
  
  const monthStr = months[date.month - 1] || 'Invalid';
  const dayStr = locale === 'np' ? toNepaliDigits(date.day) : String(date.day);
  const yearStr = locale === 'np' ? toNepaliDigits(date.year) : String(date.year);
  
  if (format === 'short') {
    return `${date.month}/${date.day}/${yearStr}`;
  }
  
  if (format === 'long') {
    return `${monthStr} ${dayStr}, ${yearStr}`;
  }
  
  return `${dayStr} ${monthStr}, ${yearStr}`;
}

/** Format both dates together */
export function formatDualDate(
  gregorian: GregorianDate,
  nepali: NepaliDate,
  options: FormatOptions = {}
): string {
  const gregStr = formatGregorianDate(gregorian, { ...options, locale: 'en' });
  const nepStr = formatNepaliDate(nepali, { ...options, locale: 'np' });
  return `${gregStr} | ${nepStr}`;
}

/** Parse a Nepali date string (e.g., "२०८१ बैशाख १५") */
export function parseNepaliDate(str: string): NepaliDate | null {
  // Try various formats
  const patterns = [
    // "२०८१ बैशाख १५" or "2081 Baishakh 15"
    /(\d{4}|[०-९]{4})\s+([\u0900-\u097F]+|[A-Za-z]+)\s+(\d{1,2}|[०-९]{1,2})/,
    // "२०८१-०१-१५" or "2081-01-15" (ISO format: year-month-day)
    /(\d{4}|[०-९]{4})[-/](\d{1,2}|[०-९]{1,2})[-/](\d{1,2}|[०-९]{1,2})/,
    // "बैशाख १५, २०८१" or "Baishakh 15, 2081"
    /([\u0900-\u097F]+|[A-Za-z]+)\s+(\d{1,2}|[०-९]{1,2}),?\s+(\d{4}|[०-९]{4})/
  ];
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const match = str.match(pattern);
    if (match) {
      let yearStr, monthStr, dayStr;
      
      if (i === 0) {
        [, yearStr, monthStr, dayStr] = match;
      } else if (i === 1) {
        // ISO format: year-month-day (all numbers)
        [, yearStr, monthStr, dayStr] = match;
        const year = fromNepaliDigits(yearStr);
        const month = fromNepaliDigits(monthStr);
        const day = fromNepaliDigits(dayStr);
        
        if (month >= 1 && month <= 12 && year >= 2000 && year <= 2099 && day >= 1 && day <= 32) {
          return { year, month, day };
        }
        continue; // Try next pattern if invalid
      } else {
        [, monthStr, dayStr, yearStr] = match;
      }
      
      const year = fromNepaliDigits(yearStr);
      const day = fromNepaliDigits(dayStr);
      
      // Find month by name
      const month = NEPALI_MONTHS.findIndex(m => 
        m.nameNp === monthStr || m.nameEn.toLowerCase() === monthStr.toLowerCase()
      ) + 1;
      
      if (month > 0 && year >= 2000 && year <= 2099 && day >= 1 && day <= 32) {
        return { year, month, day };
      }
    }
  }
  
  return null;
}

/** Parse a Gregorian date string */
export function parseGregorianDate(str: string): GregorianDate | null {
  const patterns = [
    /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
    /([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/
  ];
  
  for (const pattern of patterns) {
    const match = str.match(pattern);
    if (match) {
      let year, month, day;
      
      if (pattern === patterns[0]) {
        [, year, month, day] = match.map(Number);
      } else if (pattern === patterns[1]) {
        [, month, day, year] = match.map(Number);
      } else {
        const monthName = match[1];
        day = Number(match[2]);
        year = Number(match[3]);
        const months = ['january', 'february', 'march', 'april', 'may', 'june',
                       'july', 'august', 'september', 'october', 'november', 'december'];
        month = months.findIndex(m => m.startsWith(monthName.toLowerCase())) + 1;
      }
      
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1943 && year <= 2100) {
        // Validate day for month
        const maxDay = getGregorianDaysInMonth(year, month);
        if (day <= maxDay) {
          return { year, month, day };
        }
      }
    }
  }
  
  return null;
}

/** Get relative time description (e.g., "3 days ago", "in 2 weeks") */
export function getRelativeTime(
  from: GregorianDate | NepaliDate,
  to: GregorianDate | NepaliDate,
  locale: 'en' | 'np' = 'en'
): string {
  const fromJDN = 'month' in from && from.month <= 12 && from.day <= 31
    ? gregorianToJDN(from as GregorianDate)
    : nepaliToJDN(from as NepaliDate);
    
  const toJDN = 'month' in to && to.month <= 12 && to.day <= 31
    ? gregorianToJDN(to as GregorianDate)
    : nepaliToJDN(to as NepaliDate);
  
  const diff = toJDN - fromJDN;
  
  if (diff === 0) return locale === 'np' ? 'आज' : 'Today';
  if (diff === 1) return locale === 'np' ? 'भोली' : 'Tomorrow';
  if (diff === -1) return locale === 'np' ? 'हिजो' : 'Yesterday';
  
  if (diff > 0) {
    if (diff < 7) return locale === 'np' 
      ? `${toNepaliDigits(diff)} दिन पछि` 
      : `in ${diff} day${diff > 1 ? 's' : ''}`;
    if (diff < 30) {
      const weeks = Math.floor(diff / 7);
      return locale === 'np'
        ? `${toNepaliDigits(weeks)} हप्ता पछि`
        : `in ${weeks} week${weeks > 1 ? 's' : ''}`;
    }
    if (diff < 365) {
      const months = Math.floor(diff / 30);
      return locale === 'np'
        ? `${toNepaliDigits(months)} महिना पछि`
        : `in ${months} month${months > 1 ? 's' : ''}`;
    }
    const years = Math.floor(diff / 365);
    return locale === 'np'
      ? `${toNepaliDigits(years)} वर्ष पछि`
      : `in ${years} year${years > 1 ? 's' : ''}`;
  }
  
  // Past
  const absDiff = Math.abs(diff);
  if (absDiff < 7) return locale === 'np'
    ? `${toNepaliDigits(absDiff)} दिन अगाडि`
    : `${absDiff} day${absDiff > 1 ? 's' : ''} ago`;
  if (absDiff < 30) {
    const weeks = Math.floor(absDiff / 7);
    return locale === 'np'
      ? `${toNepaliDigits(weeks)} हप्ता अगाडि`
      : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (absDiff < 365) {
    const months = Math.floor(absDiff / 30);
    return locale === 'np'
      ? `${toNepaliDigits(months)} महिना अगाडि`
      : `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(absDiff / 365);
  return locale === 'np'
    ? `${toNepaliDigits(years)} वर्ष अगाडि`
    : `${years} year${years > 1 ? 's' : ''} ago`;
}

/** Get zodiac sign for a Gregorian date */
export function getZodiacSign(date: GregorianDate): { sign: string; signNp: string } {
  const signs = [
    { sign: 'Capricorn', signNp: 'मकर', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    { sign: 'Aquarius', signNp: 'कुम्भ', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    { sign: 'Pisces', signNp: 'मीन', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    { sign: 'Aries', signNp: 'मेष', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    { sign: 'Taurus', signNp: 'वृष', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    { sign: 'Gemini', signNp: 'मिथुन', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    { sign: 'Cancer', signNp: 'कर्कट', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    { sign: 'Leo', signNp: 'सिंह', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    { sign: 'Virgo', signNp: 'कन्या', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    { sign: 'Libra', signNp: 'तुला', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    { sign: 'Scorpio', signNp: 'वृश्चिक', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    { sign: 'Sagittarius', signNp: 'धनु', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } }
  ];
  
  for (const s of signs) {
    const start = new Date(date.year, s.start.month - 1, s.start.day);
    const end = new Date(date.year, s.end.month - 1, s.end.day);
    const check = new Date(date.year, date.month - 1, date.day);
    
    if (s.start.month <= s.end.month) {
      if (check >= start && check <= end) return { sign: s.sign, signNp: s.signNp };
    } else {
      // Wraps around year end (Capricorn)
      if (check >= start || check <= end) return { sign: s.sign, signNp: s.signNp };
    }
  }
  
  return { sign: 'Unknown', signNp: 'अज्ञात' };
}

/** Get Nepali zodiac (Rashi) for a Nepali date */
export function getNepaliRashi(date: NepaliDate): { rashi: string; rashiNp: string } {
  // Nepali zodiac follows solar calendar but months are different
  // This is approximate - real calculation needs solar longitude
  const month = date.month;
  const day = date.day;
  
  const rashis = [
    { rashi: 'Mesha', rashiNp: 'मेष', startMonth: 1, startDay: 14 },      // Baishakh 14
    { rashi: 'Brisha', rashiNp: 'वृष', startMonth: 2, startDay: 15 },      // Jestha 15
    { rashi: 'Mithuna', rashiNp: 'मिथुन', startMonth: 3, startDay: 15 },   // Ashadh 15
    { rashi: 'Karkat', rashiNp: 'कर्कट', startMonth: 4, startDay: 16 },    // Shrawan 16
    { rashi: 'Simha', rashiNp: 'सिंह', startMonth: 5, startDay: 16 },       // Bhadra 16
    { rashi: 'Kanya', rashiNp: 'कन्या', startMonth: 6, startDay: 17 },      // Ashwin 17
    { rashi: 'Tula', rashiNp: 'तुला', startMonth: 7, startDay: 17 },        // Kartik 17
    { rashi: 'Brishchik', rashiNp: 'वृश्चिक', startMonth: 8, startDay: 16 },// Mangsir 16
    { rashi: 'Dhanu', rashiNp: 'धनु', startMonth: 9, startDay: 15 },        // Poush 15
    { rashi: 'Makar', rashiNp: 'मकर', startMonth: 10, startDay: 14 },       // Magh 14
    { rashi: 'Kumbha', rashiNp: 'कुम्भ', startMonth: 11, startDay: 13 },    // Falgun 13
    { rashi: 'Meena', rashiNp: 'मीन', startMonth: 12, startDay: 13 }        // Chaitra 13
  ];
  
  // Find the rashi
  for (let i = rashis.length - 1; i >= 0; i--) {
    const r = rashis[i];
    if (month > r.startMonth || (month === r.startMonth && day >= r.startDay)) {
      return { rashi: r.rashi, rashiNp: r.rashiNp };
    }
  }
  
  // Default to last (Meena) for dates before first start
  return { rashi: rashis[11].rashi, rashiNp: rashis[11].rashiNp };
}

/** Validate and normalize a Nepali date */
export function normalizeNepaliDate(date: Partial<NepaliDate> & { year?: number; month?: number; day?: number }): NepaliDate {
  const year = date.year || 2080;
  const month = Math.max(1, Math.min(12, date.month || 1));
  const maxDay = getNepaliDaysInMonth(year, month);
  const day = Math.max(1, Math.min(maxDay, date.day || 1));
  
  return { year, month, day };
}

/** Validate and normalize a Gregorian date */
export function normalizeGregorianDate(date: Partial<GregorianDate> & { year?: number; month?: number; day?: number }): GregorianDate {
  const year = date.year || new Date().getFullYear();
  const month = Math.max(1, Math.min(12, date.month || 1));
  const maxDay = getGregorianDaysInMonth(year, month);
  const day = Math.max(1, Math.min(maxDay, date.day || 1));
  
  return { year, month, day };
}

/** Create a date range iterator */
export function* dateRange(
  start: GregorianDate, 
  end: GregorianDate
): Generator<GregorianDate> {
  const startJDN = gregorianToJDN(start);
  const endJDN = gregorianToJDN(end);
  
  for (let jdn = startJDN; jdn <= endJDN; jdn++) {
    yield jdnToGregorian(jdn);
  }
}

/** Create a Nepali date range iterator */
export function* nepaliDateRange(
  start: NepaliDate, 
  end: NepaliDate
): Generator<NepaliDate> {
  const startJDN = nepaliToJDN(start);
  const endJDN = nepaliToJDN(end);
  
  for (let jdn = startJDN; jdn <= endJDN; jdn++) {
    yield jdnToNepali(jdn);
  }
}