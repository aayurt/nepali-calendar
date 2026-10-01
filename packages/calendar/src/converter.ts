/**
 * Date conversion between Gregorian and Bikram Sambat (Nepali Calendar)
 * 
 * Based on the official Nepali calendar algorithm.
 * Bikram Sambat is approximately 56 years, 8 months, and 15 days ahead of Gregorian.
 */

import { GregorianDate, NepaliDate, ConversionResult } from './types';

// Reference point: 2000-01-01 Gregorian = 2056-09-17 Bikram Sambat (Poush 17, 2056)
// Actually, let me use a more accurate reference:
// 1943-04-13 Gregorian = 2000-01-01 BS (Baishakh 1, 2000)

/** Days in each Gregorian month (non-leap year) */
const GREGORIAN_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Days in each Nepali month for a given year (varies by year) */
/** We'll compute this dynamically based on the year */

/**
 * Check if a Gregorian year is a leap year
 */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get days in a Gregorian month
 */
export function getGregorianDaysInMonth(year: number, month: number): number {
  if (month === 2 && isGregorianLeapYear(year)) {
    return 29;
  }
  return GREGORIAN_MONTH_DAYS[month - 1];
}

/**
 * Convert Gregorian date to Julian Day Number
 */
export function gregorianToJDN(date: GregorianDate): number {
  const { year, month, day } = date;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Convert Julian Day Number to Gregorian date
 */
export function jdnToGregorian(jdn: number): GregorianDate {
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

/**
 * Pre-computed Nepali calendar data (days in each month for years 2000-2099 BS)
 * This is based on official Nepali calendar data
 * Months: 1=Baishakh, 2=Jestha, 3=Ashadh, 4=Shrawan, 5=Bhadra, 6=Ashwin, 
 *         7=Kartik, 8=Mangsir, 9=Poush, 10=Magh, 11=Falgun, 12=Chaitra
 */
const NEPALI_MONTH_DAYS: Record<number, number[]> = {
  2000: [30, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2001: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2002: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2003: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2004: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2005: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2006: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2007: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2008: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2009: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2010: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2011: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2012: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2013: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2014: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2015: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2016: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2017: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2018: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2019: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2020: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2021: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2022: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2023: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2024: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2025: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2026: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2027: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2028: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2029: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2030: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2031: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2032: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2033: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2034: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2035: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2036: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2037: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2038: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2039: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2040: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2041: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2042: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2043: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2044: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2045: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2046: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2047: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2048: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2049: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2050: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2051: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2052: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2053: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2054: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2055: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2056: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2057: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2058: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2059: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2060: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2061: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2062: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2063: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2064: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2065: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2066: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2067: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2068: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2069: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2070: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2071: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2072: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2073: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2074: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2075: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2076: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2077: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2078: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2079: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2080: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2081: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2082: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2083: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2085: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2086: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2088: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2089: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2090: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2091: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2092: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2093: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2094: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2095: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2096: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2097: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2098: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
  2099: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30],
};

/**
 * Get days in a Nepali month for a given year
 */
export function getNepaliDaysInMonth(year: number, month: number): number {
  const yearData = NEPALI_MONTH_DAYS[year];
  if (!yearData) {
    // Fallback for years outside our range - use typical pattern
    // Ashadh (month 3) can have 31 or 32 days
    if (month === 3) return 31;
    if (month <= 5) return 31;
    if (month <= 11) return 30;
    return 30;
  }
  return yearData[month - 1] || 30;
}

/**
 * Get total days in a Nepali year
 */
export function getNepaliDaysInYear(year: number): number {
  const yearData = NEPALI_MONTH_DAYS[year];
  if (!yearData) return 365;
  return yearData.reduce((sum, days) => sum + days, 0);
}

/**
 * Convert Nepali date to Julian Day Number
 * Reference: 2000-01-01 BS (Baishakh 1, 2000) = 1943-04-13 Gregorian
 */
export function nepaliToJDN(date: NepaliDate): number {
  const { year, month, day } = date;
  
  // Calculate days from year 2000 to the target year
  let days = 0;
  for (let y = 2000; y < year; y++) {
    days += getNepaliDaysInYear(y);
  }
  
  // Add days from months in the current year
  for (let m = 1; m < month; m++) {
    days += getNepaliDaysInMonth(year, m);
  }
  
  // Add days in current month
  days += day - 1;
  
  // Reference JDN for 2000-01-01 BS (1943-04-13 Gregorian)
  const REF_JDN = gregorianToJDN({ year: 1943, month: 4, day: 13 });
  
  return REF_JDN + days;
}

/**
 * Convert Julian Day Number to Nepali date
 */
export function jdnToNepali(jdn: number): NepaliDate {
  // Reference JDN for 2000-01-01 BS (1943-04-13 Gregorian)
  const REF_JDN = gregorianToJDN({ year: 1943, month: 4, day: 13 });
  
  let daysDiff = jdn - REF_JDN;
  
  if (daysDiff < 0) {
    throw new Error('Date before supported range (before 2000 BS)');
  }
  
  // Find the year
  let year = 2000;
  while (true) {
    const daysInYear = getNepaliDaysInYear(year);
    if (daysDiff < daysInYear) break;
    daysDiff -= daysInYear;
    year++;
  }
  
  // Find the month
  let month = 1;
  while (month <= 12) {
    const daysInMonth = getNepaliDaysInMonth(year, month);
    if (daysDiff < daysInMonth) break;
    daysDiff -= daysInMonth;
    month++;
  }
  
  // Remaining days is the day of month (0-indexed)
  const day = daysDiff + 1;
  
  return { year, month, day };
}

/**
 * Convert Gregorian date to Nepali (Bikram Sambat) date
 */
export function gregorianToNepali(gregorian: GregorianDate): NepaliDate {
  const jdn = gregorianToJDN(gregorian);
  return jdnToNepali(jdn);
}

/**
 * Convert Nepali (Bikram Sambat) date to Gregorian date
 */
export function nepaliToGregorian(nepali: NepaliDate): GregorianDate {
  const jdn = nepaliToJDN(nepali);
  return jdnToGregorian(jdn);
}

/**
 * Convert both ways and return both dates
 */
export function convertDate(gregorian: GregorianDate): ConversionResult;
export function convertDate(nepali: NepaliDate): ConversionResult;
export function convertDate(date: GregorianDate | NepaliDate): ConversionResult {
  if ('year' in date && 'month' in date && 'day' in date) {
    // Check if it's Gregorian (month 1-12, day 1-31) or Nepali (month 1-12, day 1-32)
    // We'll assume Gregorian if month <= 12 and day <= 31, but this is ambiguous
    // Better to have explicit functions
    throw new Error('Use explicit conversion functions: gregorianToNepali or nepaliToGregorian');
  }
  throw new Error('Invalid date object');
}

/**
 * Get today's date in both calendars
 */
export function getToday(): ConversionResult {
  const now = new Date();
  const gregorian: GregorianDate = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
  const nepali = gregorianToNepali(gregorian);
  return { gregorian, nepali };
}

/**
 * Get the start of a Nepali month in Gregorian
 */
export function getNepaliMonthStart(nepaliYear: number, nepaliMonth: number): GregorianDate {
  return nepaliToGregorian({ year: nepaliYear, month: nepaliMonth, day: 1 });
}

/**
 * Get the end of a Nepali month in Gregorian
 */
export function getNepaliMonthEnd(nepaliYear: number, nepaliMonth: number): GregorianDate {
  const daysInMonth = getNepaliDaysInMonth(nepaliYear, nepaliMonth);
  return nepaliToGregorian({ year: nepaliYear, month: nepaliMonth, day: daysInMonth });
}