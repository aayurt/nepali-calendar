// Core types matching the @8848/nepali-calendar package
export interface GregorianDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export interface NepaliDate {
  year: number;
  month: number; // 1-12
  day: number;   // 1-32
}

export interface CalendarEvent {
  id: string;
  title: string;
  titleNp: string;
  date: NepaliDate | GregorianDate;
  type: 'holiday' | 'festival' | 'observance' | 'custom';
  isNationalHoliday?: boolean;
  description?: string;
  tithi?: string; // Lunar day
  tithiNp?: string;
  paksha?: 'shukla' | 'krishna';
}

export interface TithiInfo {
  tithi: number; // 1-30
  paksha: 'shukla' | 'krishna';
  name: string;
  nameNp: string;
}

export interface PanchangData {
  tithi: {
    name: string;
    nameNp: string;
    paksha: 'shukla' | 'krishna';
    number: number;
    endsAt: string;
  };
  nakshatra: {
    name: string;
    nameNp: string;
    endsAt: string;
  };
  yoga: {
    name: string;
    nameNp: string;
    endsAt: string;
  };
  karana: {
    name: string;
    nameNp: string;
    endsAt: string;
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  rahuKaal: { start: string; end: string };
  gulikaKaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  abhijitMuhurta: { start: string; end: string };
  dayDuration: string;
  nightDuration: string;
}

export interface CalendarDayData {
  nepaliDay: number;
  gregorianDate: GregorianDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  weekDay: number; // 0-6
  events: CalendarEvent[];
  tithi?: TithiInfo;
  panchang?: PanchangData;
  hasMultipleEvents: boolean;
  eventCount: number;
}

export interface MonthCalendarData {
  year: number;
  month: number;
  monthNameEn: string;
  monthNameNp: string;
  weeks: CalendarDayData[][];
  prevMonthDays: number;
  nextMonthDays: number;
}

export type Timezone = 'Asia/Kathmandu' | 'UTC' | 'America/New_York' | 'Europe/London' | 'Asia/Dubai' | 'Asia/Singapore';

export interface ConverterState {
  mode: 'ad2bs' | 'bs2ad';
  adDate: GregorianDate;
  bsDate: NepaliDate;
}

export interface ZodiacInfo {
  western: { sign: string; signNp: string };
  nepali: { rashi: string; rashiNp: string };
}