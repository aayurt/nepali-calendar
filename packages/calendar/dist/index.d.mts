/**
 * Type definitions for Nepali Calendar (Bikram Sambat)
 */
/** Gregorian date representation */
interface GregorianDate {
    year: number;
    month: number;
    day: number;
}
/** Bikram Sambat (Nepali) date representation */
interface NepaliDate {
    year: number;
    month: number;
    day: number;
}
/** Month names in Nepali and English */
interface MonthInfo {
    number: number;
    nameEn: string;
    nameNp: string;
    daysInMonth: (year: number) => number;
}
/** Festival/holiday entry */
interface Festival {
    id: string;
    nameEn: string;
    nameNp: string;
    date: NepaliDate;
    type: 'festival' | 'holiday' | 'observance';
    description?: string;
    isNationalHoliday?: boolean;
}
/** Calendar configuration options */
interface CalendarConfig {
    /** Starting year for calendar data (inclusive) */
    minYear: number;
    /** Ending year for calendar data (inclusive) */
    maxYear: number;
    /** Default locale for display */
    locale?: 'en' | 'np';
}
/** Result of date conversion */
interface ConversionResult {
    gregorian: GregorianDate;
    nepali: NepaliDate;
}
/** Options for date formatting */
interface FormatOptions {
    locale?: 'en' | 'np';
    format?: 'short' | 'long' | 'full';
    showEra?: boolean;
}
/** Nepali digit mapping */
type NepaliDigit = '०' | '१' | '२' | '३' | '४' | '५' | '६' | '७' | '८' | '९';
/** Week day names */
type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Date conversion between Gregorian and Bikram Sambat (Nepali Calendar)
 *
 * Based on the official Nepali calendar algorithm.
 * Bikram Sambat is approximately 56 years, 8 months, and 15 days ahead of Gregorian.
 */

/** Days in each Nepali month for a given year (varies by year) */
/** We'll compute this dynamically based on the year */
/**
 * Check if a Gregorian year is a leap year
 */
declare function isGregorianLeapYear(year: number): boolean;
/**
 * Get days in a Gregorian month
 */
declare function getGregorianDaysInMonth(year: number, month: number): number;
/**
 * Convert Gregorian date to Julian Day Number
 */
declare function gregorianToJDN(date: GregorianDate): number;
/**
 * Convert Julian Day Number to Gregorian date
 */
declare function jdnToGregorian(jdn: number): GregorianDate;
/**
 * Get days in a Nepali month for a given year
 */
declare function getNepaliDaysInMonth(year: number, month: number): number;
/**
 * Get total days in a Nepali year
 */
declare function getNepaliDaysInYear(year: number): number;
/**
 * Convert Nepali date to Julian Day Number
 * Reference: 2000-01-01 BS (Baishakh 1, 2000) = 1943-04-13 Gregorian
 */
declare function nepaliToJDN(date: NepaliDate): number;
/**
 * Convert Julian Day Number to Nepali date
 */
declare function jdnToNepali(jdn: number): NepaliDate;
/**
 * Convert Gregorian date to Nepali (Bikram Sambat) date
 */
declare function gregorianToNepali(gregorian: GregorianDate): NepaliDate;
/**
 * Convert Nepali (Bikram Sambat) date to Gregorian date
 */
declare function nepaliToGregorian(nepali: NepaliDate): GregorianDate;
/**
 * Convert both ways and return both dates
 */
declare function convertDate(gregorian: GregorianDate): ConversionResult;
declare function convertDate(nepali: NepaliDate): ConversionResult;
/**
 * Get today's date in both calendars
 */
declare function getToday(): ConversionResult;
/**
 * Get the start of a Nepali month in Gregorian
 */
declare function getNepaliMonthStart(nepaliYear: number, nepaliMonth: number): GregorianDate;
/**
 * Get the end of a Nepali month in Gregorian
 */
declare function getNepaliMonthEnd(nepaliYear: number, nepaliMonth: number): GregorianDate;

/**
 * Calendar utilities for generating month views, week views, etc.
 */

/** Nepali month names */
declare const NEPALI_MONTHS: MonthInfo[];
/** Gregorian month names */
declare const GREGORIAN_MONTHS: string[];
/** Week day names (English) */
declare const WEEK_DAYS_EN: string[];
/** Week day names (Nepali) */
declare const WEEK_DAYS_NP: string[];
/** Full week day names (English) */
declare const WEEK_DAYS_EN_FULL: string[];
/** Full week day names (Nepali) */
declare const WEEK_DAYS_NP_FULL: string[];
/**
 * Get the week day (0-6, 0=Sunday) for a Gregorian date
 */
declare function getGregorianWeekDay(date: GregorianDate): WeekDay;
/**
 * Get the week day (0-6, 0=Sunday) for a Nepali date
 */
declare function getNepaliWeekDay(date: NepaliDate): WeekDay;
/**
 * Get month info for a Nepali month
 */
declare function getNepaliMonthInfo(year: number, month: number): MonthInfo;
/**
 * Generate a month calendar grid for Nepali calendar
 * Returns weeks, each containing 7 days (null for days outside the month)
 */
interface CalendarDay {
    nepaliDay: number;
    gregorianDate: GregorianDate;
    isCurrentMonth: boolean;
    isToday: boolean;
    weekDay: WeekDay;
    festivals: string[];
    holidays: string[];
}
interface MonthCalendar {
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
declare function generateNepaliMonthCalendar(year: number, month: number, festivals?: Map<string, any[]>, holidays?: Map<string, any[]>): MonthCalendar;
/**
 * Generate a Gregorian month calendar with Nepali dates overlay
 */
interface GregorianCalendarDay {
    gregorianDay: number;
    nepaliDate: NepaliDate;
    isCurrentMonth: boolean;
    isToday: boolean;
    weekDay: WeekDay;
    festivals: string[];
    holidays: string[];
}
interface GregorianMonthCalendar {
    year: number;
    month: number;
    monthName: string;
    weeks: GregorianCalendarDay[][];
}
/**
 * Generate a Gregorian month calendar with Nepali dates
 */
declare function generateGregorianMonthCalendar(year: number, month: number, festivals?: Map<string, any[]>, holidays?: Map<string, any[]>): GregorianMonthCalendar;
/**
 * Get week range for a given date (Sunday to Saturday)
 */
declare function getWeekRange(date: GregorianDate): {
    start: GregorianDate;
    end: GregorianDate;
};
/**
 * Check if a Nepali date is valid
 */
declare function isValidNepaliDate(date: NepaliDate): boolean;
/**
 * Check if a Gregorian date is valid
 */
declare function isValidGregorianDate(date: GregorianDate): boolean;
/**
 * Add days to a Nepali date
 */
declare function addDaysToNepali(date: NepaliDate, days: number): NepaliDate;
/**
 * Subtract days from a Nepali date
 */
declare function subtractDaysFromNepali(date: NepaliDate, days: number): NepaliDate;
/**
 * Difference in days between two Nepali dates
 */
declare function nepaliDaysDifference(date1: NepaliDate, date2: NepaliDate): number;
/**
 * Get the Nepali year range that overlaps with a Gregorian year
 */
declare function getNepaliYearRangeForGregorianYear(gregorianYear: number): {
    start: number;
    end: number;
};
/**
 * Get the Gregorian year range that overlaps with a Nepali year
 */
declare function getGregorianYearRangeForNepaliYear(nepaliYear: number): {
    start: number;
    end: number;
};

/**
 * Nepali Holidays Data
 *
 * Contains national holidays, government holidays, and observances
 * Based on official Nepal government calendar
 */

/**
 * Fixed holidays that occur on the same Nepali date every year
 * Format: 'MM-DD': Festival
 */
declare const FIXED_HOLIDAYS: Record<string, Festival>;
/**
 * Major festivals with their Nepali dates (some vary by year)
 * For festivals that follow lunar calendar, we'll compute them dynamically
 */
declare const MAJOR_FESTIVALS: Festival[];
/**
 * Get all holidays for a specific Nepali year
 * Some holidays vary by year (lunar calendar based)
 */
declare function getHolidaysForYear(year: number): Festival[];
/**
 * Get holidays for a specific Nepali month/year
 */
declare function getHolidaysForMonth(year: number, month: number): Festival[];
/**
 * Check if a specific Nepali date is a holiday
 */
declare function isHoliday(date: {
    year: number;
    month: number;
    day: number;
}): Festival | null;
/**
 * Get national holidays only
 */
declare function getNationalHolidays(year: number): Festival[];

/**
 * Nepali Festivals with Lunar Calendar Calculations
 *
 * Many Nepali festivals follow the lunar calendar (tithi-based).
 * This module provides calculations for those dates.
 */

/**
 * Lunar phase calculation (simplified)
 * Returns the tithi (lunar day) for a given Gregorian date
 * Tithi 1-15: Shukla Paksha (waxing), 16-30: Krishna Paksha (waning)
 */
declare function getTithi(date: GregorianDate): {
    tithi: number;
    paksha: 'shukla' | 'krishna';
    phase: number;
};
/**
 * Calculate festival dates for a given year using lunar calendar
 * Returns festivals with computed dates for the specific year
 */
declare function computeLunarFestivals(year: number): Festival[];
/**
 * Get Dashain dates for a year (15 days starting from Ashwin Shukla Pratipada)
 */
declare function getDashainDates(year: number): NepaliDate[];
/**
 * Get Tihar dates for a year (5 days starting from Kartik Krishna Trayodashi)
 */
declare function getTiharDates(year: number): NepaliDate[];
/**
 * Get Holi date for a year (Falgun Shukla Purnima)
 */
declare function getHoliDate(year: number): NepaliDate;
/**
 * Get Buddha Jayanti date (Baishakh Shukla Purnima)
 */
declare function getBuddhaJayantiDate(year: number): NepaliDate;
/**
 * Get Maha Shivaratri date (Falgun Krishna Chaturdashi)
 */
declare function getMahaShivaratriDate(year: number): NepaliDate;
/**
 * Get Janai Purnima / Raksha Bandhan date (Shrawan Shukla Purnima)
 */
declare function getJanaiPurnimaDate(year: number): NepaliDate;
/**
 * Get Gaijatra date (Shrawan Krishna Pratipada - day after Janai Purnima)
 */
declare function getGaijatraDate(year: number): NepaliDate;
/**
 * Get Krishna Janmashtami date (Shrawan Krishna Ashtami)
 */
declare function getKrishnaJanmashtamiDate(year: number): NepaliDate;
/**
 * Get Teej date (Bhadra Shukla Tritiya)
 */
declare function getTeejDate(year: number): NepaliDate;
/**
 * Get Indra Jatra date (Bhadra Shukla Chaturdashi to Ashwin Krishna Pratipada)
 */
declare function getIndraJatraDates(year: number): NepaliDate[];
/**
 * Get Chhath Puja dates (Kartik Shukla Shashthi to Saptami)
 */
declare function getChhathDates(year: number): NepaliDate[];
/**
 * Get all computed festivals for a year with accurate dates
 */
declare function getAllFestivalsForYear(year: number): Festival[];
/**
 * Get festivals organized by month for a year
 */
declare function getFestivalsByMonth(year: number): Map<string, Festival[]>;
/**
 * Get festival details by ID
 */
declare function getFestivalById(id: string, year: number): Festival | undefined;
/**
 * Check if a date has any festival
 */
declare function hasFestival(date: NepaliDate): Festival[];

/**
 * Utility functions for Nepali Calendar
 */

/** Convert Arabic numerals to Nepali digits */
declare function toNepaliDigits(num: number | string): string;
/** Convert Nepali digits to Arabic numerals */
declare function fromNepaliDigits(str: string): number;
/** Format a Nepali date as a string */
declare function formatNepaliDate(date: NepaliDate, options?: FormatOptions): string;
/** Format a Gregorian date as a string */
declare function formatGregorianDate(date: GregorianDate, options?: FormatOptions): string;
/** Format both dates together */
declare function formatDualDate(gregorian: GregorianDate, nepali: NepaliDate, options?: FormatOptions): string;
/** Parse a Nepali date string (e.g., "२०८१ बैशाख १५") */
declare function parseNepaliDate(str: string): NepaliDate | null;
/** Parse a Gregorian date string */
declare function parseGregorianDate(str: string): GregorianDate | null;
/** Get relative time description (e.g., "3 days ago", "in 2 weeks") */
declare function getRelativeTime(from: GregorianDate | NepaliDate, to: GregorianDate | NepaliDate, locale?: 'en' | 'np'): string;
/** Get zodiac sign for a Gregorian date */
declare function getZodiacSign(date: GregorianDate): {
    sign: string;
    signNp: string;
};
/** Get Nepali zodiac (Rashi) for a Nepali date */
declare function getNepaliRashi(date: NepaliDate): {
    rashi: string;
    rashiNp: string;
};
/** Validate and normalize a Nepali date */
declare function normalizeNepaliDate(date: Partial<NepaliDate> & {
    year?: number;
    month?: number;
    day?: number;
}): NepaliDate;
/** Validate and normalize a Gregorian date */
declare function normalizeGregorianDate(date: Partial<GregorianDate> & {
    year?: number;
    month?: number;
    day?: number;
}): GregorianDate;
/** Create a date range iterator */
declare function dateRange(start: GregorianDate, end: GregorianDate): Generator<GregorianDate>;
/** Create a Nepali date range iterator */
declare function nepaliDateRange(start: NepaliDate, end: NepaliDate): Generator<NepaliDate>;

export { type CalendarConfig, type CalendarDay, type ConversionResult, FIXED_HOLIDAYS, type Festival, type FormatOptions, GREGORIAN_MONTHS, type GregorianCalendarDay, type GregorianDate, type GregorianMonthCalendar, MAJOR_FESTIVALS, type MonthCalendar, type MonthInfo, NEPALI_MONTHS, type NepaliDate, type NepaliDigit, WEEK_DAYS_EN, WEEK_DAYS_EN_FULL, WEEK_DAYS_NP, WEEK_DAYS_NP_FULL, type WeekDay, addDaysToNepali, computeLunarFestivals, convertDate, dateRange, formatDualDate, formatGregorianDate, formatNepaliDate, fromNepaliDigits, generateGregorianMonthCalendar, generateNepaliMonthCalendar, getAllFestivalsForYear, getBuddhaJayantiDate, getChhathDates, getDashainDates, getFestivalById, getFestivalsByMonth, getGaijatraDate, getGregorianDaysInMonth, getGregorianWeekDay, getGregorianYearRangeForNepaliYear, getHoliDate, getHolidaysForMonth, getHolidaysForYear, getIndraJatraDates, getJanaiPurnimaDate, getKrishnaJanmashtamiDate, getMahaShivaratriDate, getNationalHolidays, getNepaliDaysInMonth, getNepaliDaysInYear, getNepaliMonthEnd, getNepaliMonthInfo, getNepaliMonthStart, getNepaliRashi, getNepaliWeekDay, getNepaliYearRangeForGregorianYear, getRelativeTime, getTeejDate, getTiharDates, getTithi, getToday, getWeekRange, getZodiacSign, gregorianToJDN, gregorianToNepali, hasFestival, isGregorianLeapYear, isHoliday, isValidGregorianDate, isValidNepaliDate, jdnToGregorian, jdnToNepali, nepaliDateRange, nepaliDaysDifference, nepaliToGregorian, nepaliToJDN, normalizeGregorianDate, normalizeNepaliDate, parseGregorianDate, parseNepaliDate, subtractDaysFromNepali, toNepaliDigits };
