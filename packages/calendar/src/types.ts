/**
 * Type definitions for Nepali Calendar (Bikram Sambat)
 */

/** Gregorian date representation */
export interface GregorianDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

/** Bikram Sambat (Nepali) date representation */
export interface NepaliDate {
  year: number;
  month: number; // 1-12 (Baishakh to Chaitra)
  day: number;   // 1-32 (varies by month/year)
}

/** Month names in Nepali and English */
export interface MonthInfo {
  number: number;
  nameEn: string;
  nameNp: string;
  daysInMonth: (year: number) => number;
}

/** Festival/holiday entry */
export interface Festival {
  id: string;
  nameEn: string;
  nameNp: string;
  date: NepaliDate; // BS date when it occurs
  type: 'festival' | 'holiday' | 'observance';
  description?: string;
  isNationalHoliday?: boolean;
}

/** Calendar configuration options */
export interface CalendarConfig {
  /** Starting year for calendar data (inclusive) */
  minYear: number;
  /** Ending year for calendar data (inclusive) */
  maxYear: number;
  /** Default locale for display */
  locale?: 'en' | 'np';
}

/** Result of date conversion */
export interface ConversionResult {
  gregorian: GregorianDate;
  nepali: NepaliDate;
}

/** Options for date formatting */
export interface FormatOptions {
  locale?: 'en' | 'np';
  format?: 'short' | 'long' | 'full';
  showEra?: boolean;
}

/** Nepali digit mapping */
export type NepaliDigit = '०' | '१' | '२' | '३' | '४' | '५' | '६' | '७' | '८' | '९';

/** Week day names */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday