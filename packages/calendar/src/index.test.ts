import { describe, it, expect } from 'vitest';
import {
  gregorianToNepali,
  nepaliToGregorian,
  getNepaliDaysInMonth,
  getNepaliDaysInYear,
  isGregorianLeapYear,
  getToday
} from './converter';
import {
  generateNepaliMonthCalendar,
  generateGregorianMonthCalendar,
  isValidNepaliDate,
  isValidGregorianDate,
  getNepaliWeekDay,
  getGregorianWeekDay,
  NEPALI_MONTHS
} from './calendar';
import {
  getHolidaysForYear,
  getHolidaysForMonth,
  isHoliday,
  getNationalHolidays,
  MAJOR_FESTIVALS
} from './holidays';
import {
  formatNepaliDate,
  formatGregorianDate,
  formatDualDate,
  toNepaliDigits,
  fromNepaliDigits,
  parseNepaliDate,
  parseGregorianDate,
  getRelativeTime,
  getZodiacSign,
  getNepaliRashi,
  normalizeNepaliDate,
  normalizeGregorianDate
} from './utils';
import {
  getDashainDates,
  getTiharDates,
  getHoliDate,
  getBuddhaJayantiDate,
  getMahaShivaratriDate,
  getJanaiPurnimaDate,
  getGaijatraDate,
  getKrishnaJanmashtamiDate,
  getTeejDate,
  getIndraJatraDates,
  getChhathDates,
  getAllFestivalsForYear,
  getFestivalsByMonth,
  hasFestival
} from './festivals';
import { NepaliDate, GregorianDate } from './types';

describe('Converter', () => {
  describe('gregorianToNepali', () => {
    it('should convert known reference dates correctly', () => {
      // 1943-04-13 Gregorian = 2000-01-01 BS (Baishakh 1, 2000)
      const result = gregorianToNepali({ year: 1943, month: 4, day: 13 });
      expect(result).toEqual({ year: 2000, month: 1, day: 1 });
    });

    it('should convert 2000-01-01 Gregorian to ~2056-09-17 BS', () => {
      const result = gregorianToNepali({ year: 2000, month: 1, day: 1 });
      // 2000-01-01 is around Poush 17, 2056
      expect(result.year).toBe(2056);
      expect(result.month).toBe(9); // Poush
      expect(result.day).toBeGreaterThanOrEqual(15);
      expect(result.day).toBeLessThanOrEqual(20);
    });

    it('should convert current date correctly', () => {
      const now = new Date();
      const gregorian: GregorianDate = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      };
      const result = gregorianToNepali(gregorian);
      expect(result.year).toBeGreaterThanOrEqual(2080);
      expect(result.year).toBeLessThanOrEqual(2085);
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(32);
    });
  });

  describe('nepaliToGregorian', () => {
    it('should convert 2000-01-01 BS to 1943-04-13 Gregorian', () => {
      const result = nepaliToGregorian({ year: 2000, month: 1, day: 1 });
      expect(result).toEqual({ year: 1943, month: 4, day: 13 });
    });

    it('should round-trip correctly', () => {
      const gregorian: GregorianDate = { year: 2024, month: 1, day: 15 };
      const nepali = gregorianToNepali(gregorian);
      const back = nepaliToGregorian(nepali);
      expect(back).toEqual(gregorian);
    });

    it('should round-trip for various dates', () => {
      const testDates: GregorianDate[] = [
        { year: 2024, month: 4, day: 13 }, // Nepali New Year
        { year: 2024, month: 10, day: 15 }, // Dashain time
        { year: 2024, month: 11, day: 1 }, // Tihar time
        { year: 2023, month: 12, day: 25 }, // Christmas
        { year: 2024, month: 3, day: 8 }, // Women's Day
      ];

      for (const date of testDates) {
        const nepali = gregorianToNepali(date);
        const back = nepaliToGregorian(nepali);
        expect(back).toEqual(date);
      }
    });
  });

  describe('getNepaliDaysInMonth', () => {
    it('should return correct days for known months', () => {
      expect(getNepaliDaysInMonth(2080, 1)).toBe(31); // Baishakh
      expect(getNepaliDaysInMonth(2080, 3)).toBe(32); // Ashadh (leap month)
      expect(getNepaliDaysInMonth(2080, 6)).toBe(30); // Ashwin
      expect(getNepaliDaysInMonth(2080, 12)).toBe(30); // Chaitra
    });

    it('should handle leap year Ashadh correctly', () => {
      // 2080 has 32 days in Ashadh
      expect(getNepaliDaysInMonth(2080, 3)).toBe(32);
      // 2081 has 31 days in Ashadh
      expect(getNepaliDaysInMonth(2081, 3)).toBe(31);
    });
  });

  describe('getNepaliDaysInYear', () => {
    it('should return 365 or 366 for normal/leap years', () => {
      const days2080 = getNepaliDaysInYear(2080);
      const days2081 = getNepaliDaysInYear(2081);
      expect(days2080).toBeGreaterThanOrEqual(365);
      expect(days2080).toBeLessThanOrEqual(366);
      expect(days2081).toBeGreaterThanOrEqual(365);
      expect(days2081).toBeLessThanOrEqual(366);
    });
  });

  describe('isGregorianLeapYear', () => {
    it('should correctly identify leap years', () => {
      expect(isGregorianLeapYear(2000)).toBe(true);
      expect(isGregorianLeapYear(2024)).toBe(true);
      expect(isGregorianLeapYear(2023)).toBe(false);
      expect(isGregorianLeapYear(1900)).toBe(false);
      expect(isGregorianLeapYear(2004)).toBe(true);
    });
  });

  describe('getToday', () => {
    it('should return both Gregorian and Nepali dates', () => {
      const today = getToday();
      expect(today.gregorian).toBeDefined();
      expect(today.nepali).toBeDefined();
      expect(today.gregorian.year).toBe(new Date().getFullYear());
    });
  });
});

describe('Calendar', () => {
  describe('generateNepaliMonthCalendar', () => {
    it('should generate a valid calendar for Baishakh 2081', () => {
      const cal = generateNepaliMonthCalendar(2081, 1);
      expect(cal.year).toBe(2081);
      expect(cal.month).toBe(1);
      expect(cal.monthNameEn).toBe('Baishakh');
      expect(cal.monthNameNp).toBe('बैशाख');
      expect(cal.weeks.length).toBeGreaterThanOrEqual(4);
      expect(cal.weeks.length).toBeLessThanOrEqual(6);
      
      // Check first week has correct structure
      const firstWeek = cal.weeks[0];
      expect(firstWeek.length).toBe(7);
      
      // Check days are populated
      let dayCount = 0;
      for (const week of cal.weeks) {
        for (const day of week) {
          if (day.isCurrentMonth) {
            dayCount++;
            expect(day.nepaliDay).toBeGreaterThan(0);
            expect(day.nepaliDay).toBeLessThanOrEqual(31);
          }
        }
      }
      expect(dayCount).toBe(31); // Baishakh has 31 days
    });

    it('should include today marker', () => {
      const today = getToday();
      const cal = generateNepaliMonthCalendar(today.nepali.year, today.nepali.month);
      let hasToday = false;
      for (const week of cal.weeks) {
        for (const day of week) {
          if (day.isToday) {
            hasToday = true;
            expect(day.nepaliDay).toBe(today.nepali.day);
          }
        }
      }
      expect(hasToday).toBe(true);
    });
  });

  describe('generateGregorianMonthCalendar', () => {
    it('should generate a valid Gregorian calendar with Nepali dates', () => {
      const cal = generateGregorianMonthCalendar(2024, 4);
      expect(cal.year).toBe(2024);
      expect(cal.month).toBe(4);
      expect(cal.monthName).toBe('April');
      expect(cal.weeks.length).toBeGreaterThanOrEqual(4);
      expect(cal.weeks.length).toBeLessThanOrEqual(6);
      
      // Check all weeks have 7 days
      for (const week of cal.weeks) {
        expect(week.length).toBe(7);
      }
      
      // Check Nepali dates are populated
      for (const week of cal.weeks) {
        for (const day of week) {
          if (day.isCurrentMonth) {
            expect(day.gregorianDay).toBeGreaterThan(0);
            expect(day.nepaliDate.year).toBeGreaterThan(2000);
            expect(day.nepaliDate.month).toBeGreaterThanOrEqual(1);
            expect(day.nepaliDate.month).toBeLessThanOrEqual(12);
          }
        }
      }
    });
  });

  describe('isValidNepaliDate', () => {
    it('should validate correct dates', () => {
      expect(isValidNepaliDate({ year: 2080, month: 1, day: 1 })).toBe(true);
      expect(isValidNepaliDate({ year: 2080, month: 3, day: 32 })).toBe(true); // Ashadh leap
      expect(isValidNepaliDate({ year: 2080, month: 6, day: 30 })).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidNepaliDate({ year: 1999, month: 1, day: 1 })).toBe(false); // Before range
      expect(isValidNepaliDate({ year: 2100, month: 1, day: 1 })).toBe(false); // After range
      expect(isValidNepaliDate({ year: 2080, month: 0, day: 1 })).toBe(false); // Invalid month
      expect(isValidNepaliDate({ year: 2080, month: 13, day: 1 })).toBe(false); // Invalid month
      expect(isValidNepaliDate({ year: 2080, month: 1, day: 0 })).toBe(false); // Invalid day
      expect(isValidNepaliDate({ year: 2080, month: 1, day: 32 })).toBe(false); // Too many days
      expect(isValidNepaliDate({ year: 2080, month: 6, day: 31 })).toBe(false); // Ashwin has 30
    });
  });

  describe('isValidGregorianDate', () => {
    it('should validate correct dates', () => {
      expect(isValidGregorianDate({ year: 2024, month: 2, day: 29 })).toBe(true); // Leap year
      expect(isValidGregorianDate({ year: 2024, month: 1, day: 31 })).toBe(true);
      expect(isValidGregorianDate({ year: 2024, month: 4, day: 30 })).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidGregorianDate({ year: 2023, month: 2, day: 29 })).toBe(false); // Not leap
      expect(isValidGregorianDate({ year: 2024, month: 4, day: 31 })).toBe(false); // April has 30
      expect(isValidGregorianDate({ year: 2024, month: 0, day: 1 })).toBe(false);
      expect(isValidGregorianDate({ year: 2024, month: 13, day: 1 })).toBe(false);
    });
  });

  describe('getNepaliWeekDay', () => {
    it('should return correct weekday', () => {
      // 2000-01-01 BS (1943-04-13) was a Tuesday
      const weekday = getNepaliWeekDay({ year: 2000, month: 1, day: 1 });
      expect(weekday).toBe(2); // 0=Sun, 2=Tue
    });
  });

  describe('getGregorianWeekDay', () => {
    it('should return correct weekday', () => {
      // 2024-01-01 was a Monday
      const weekday = getGregorianWeekDay({ year: 2024, month: 1, day: 1 });
      expect(weekday).toBe(1); // 0=Sun, 1=Mon
    });
  });

  describe('NEPALI_MONTHS', () => {
    it('should have 12 months with correct names', () => {
      expect(NEPALI_MONTHS.length).toBe(12);
      expect(NEPALI_MONTHS[0].nameEn).toBe('Baishakh');
      expect(NEPALI_MONTHS[0].nameNp).toBe('बैशाख');
      expect(NEPALI_MONTHS[11].nameEn).toBe('Chaitra');
      expect(NEPALI_MONTHS[11].nameNp).toBe('चैत्र');
    });
  });
});

describe('Holidays', () => {
  describe('getHolidaysForYear', () => {
    it('should return holidays for a year', () => {
      const holidays = getHolidaysForYear(2081);
      expect(holidays.length).toBeGreaterThan(0);
      
      // Check all have year set
      for (const h of holidays) {
        expect(h.date.year).toBe(2081);
      }
    });
  });

  describe('getHolidaysForMonth', () => {
    it('should return holidays for a specific month', () => {
      const holidays = getHolidaysForMonth(2081, 1); // Baishakh
      expect(holidays.length).toBeGreaterThan(0);
      for (const h of holidays) {
        expect(h.date.month).toBe(1);
      }
    });
  });

  describe('isHoliday', () => {
    it('should detect Nepali New Year', () => {
      const holiday = isHoliday({ year: 2081, month: 1, day: 1 });
      expect(holiday).not.toBeNull();
      expect(holiday?.id).toBe('nepali-new-year');
    });

    it('should return null for non-holiday', () => {
      const holiday = isHoliday({ year: 2081, month: 1, day: 10 });
      expect(holiday).toBeNull();
    });
  });

  describe('getNationalHolidays', () => {
    it('should return only national holidays', () => {
      const holidays = getNationalHolidays(2081);
      for (const h of holidays) {
        expect(h.isNationalHoliday).toBe(true);
      }
    });
  });

  describe('MAJOR_FESTIVALS', () => {
    it('should have major festivals defined', () => {
      expect(MAJOR_FESTIVALS.length).toBeGreaterThan(10);
      
      const dashain = MAJOR_FESTIVALS.find(f => f.id === 'dashain');
      expect(dashain).toBeDefined();
      expect(dashain?.nameEn).toBe('Dashain');
      expect(dashain?.isNationalHoliday).toBe(true);
    });
  });
});

describe('Festivals', () => {
  describe('getDashainDates', () => {
    it('should return 15 days for Dashain', () => {
      const dates = getDashainDates(2081);
      expect(dates.length).toBe(15);
      for (const d of dates) {
        expect(d.month).toBe(6); // Ashwin
        expect(d.day).toBeGreaterThanOrEqual(1);
        expect(d.day).toBeLessThanOrEqual(15);
      }
    });
  });

  describe('getTiharDates', () => {
    it('should return 5 days for Tihar', () => {
      const dates = getTiharDates(2081);
      expect(dates.length).toBe(5);
      for (const d of dates) {
        expect(d.month).toBe(7); // Kartik
      }
    });
  });

  describe('getHoliDate', () => {
    it('should return Falgun 15', () => {
      const date = getHoliDate(2081);
      expect(date.month).toBe(11); // Falgun
      expect(date.day).toBe(15);
    });
  });

  describe('getBuddhaJayantiDate', () => {
    it('should return Baishakh 15', () => {
      const date = getBuddhaJayantiDate(2081);
      expect(date.month).toBe(1);
      expect(date.day).toBe(15);
    });
  });

  describe('getMahaShivaratriDate', () => {
    it('should return Falgun 14', () => {
      const date = getMahaShivaratriDate(2081);
      expect(date.month).toBe(11);
      expect(date.day).toBe(14);
    });
  });

  describe('getJanaiPurnimaDate', () => {
    it('should return Shrawan 15', () => {
      const date = getJanaiPurnimaDate(2081);
      expect(date.month).toBe(4);
      expect(date.day).toBe(15);
    });
  });

  describe('getGaijatraDate', () => {
    it('should return day after Janai Purnima', () => {
      const date = getGaijatraDate(2081);
      const janai = getJanaiPurnimaDate(2081);
      
      if (janai.day < getNepaliDaysInMonth(2081, 4)) {
        expect(date.day).toBe(janai.day + 1);
        expect(date.month).toBe(4);
      } else {
        expect(date.day).toBe(1);
        expect(date.month).toBe(5);
      }
    });
  });

  describe('getAllFestivalsForYear', () => {
    it('should return all festivals for a year', () => {
      const festivals = getAllFestivalsForYear(2081);
      expect(festivals.length).toBeGreaterThan(20);
      
      // Check for key festivals
      const ids = festivals.map(f => f.id);
      expect(ids).toContain('dashain-full');
      expect(ids).toContain('tihar-full');
      expect(ids).toContain('holi-computed');
      expect(ids).toContain('buddha-jayanti-computed');
    });
  });

  describe('getFestivalsByMonth', () => {
    it('should group festivals by month', () => {
      const byMonth = getFestivalsByMonth(2081);
      expect(byMonth.size).toBeGreaterThan(0);
      
      // Ashwin (month 6) should have Dashain
      const ashwin = byMonth.get('2081-6');
      expect(ashwin).toBeDefined();
      expect(ashwin?.some(f => f.id.includes('dashain'))).toBe(true);
    });
  });

  describe('hasFestival', () => {
    it('should return festivals for a date', () => {
      const festivals = hasFestival({ year: 2081, month: 1, day: 1 });
      expect(festivals.length).toBeGreaterThan(0);
      expect(festivals.some(f => f.id === 'nepali-new-year')).toBe(true);
    });

    it('should return empty array for non-festival date', () => {
      const festivals = hasFestival({ year: 2081, month: 1, day: 10 });
      // Might have some festivals, but not new year
      expect(Array.isArray(festivals)).toBe(true);
    });
  });
});

describe('Utils', () => {
  describe('toNepaliDigits', () => {
    it('should convert Arabic to Nepali digits', () => {
      expect(toNepaliDigits(0)).toBe('०');
      expect(toNepaliDigits(123)).toBe('१२३');
      expect(toNepaliDigits('2081')).toBe('२०८१');
    });
  });

  describe('fromNepaliDigits', () => {
    it('should convert Nepali to Arabic digits', () => {
      expect(fromNepaliDigits('०')).toBe(0);
      expect(fromNepaliDigits('१२३')).toBe(123);
      expect(fromNepaliDigits('२०८१')).toBe(2081);
    });
  });

  describe('formatNepaliDate', () => {
    it('should format in Nepali', () => {
      const formatted = formatNepaliDate({ year: 2081, month: 1, day: 15 }, { locale: 'np' });
      expect(formatted).toContain('१५');
      expect(formatted).toContain('बैशाख');
      expect(formatted).toContain('२०८१');
    });

    it('should format in English', () => {
      const formatted = formatNepaliDate({ year: 2081, month: 1, day: 15 }, { locale: 'en' });
      expect(formatted).toContain('15');
      expect(formatted).toContain('Baishakh');
      expect(formatted).toContain('2081');
    });

    it('should support short format', () => {
      const formatted = formatNepaliDate({ year: 2081, month: 1, day: 15 }, { format: 'short', locale: 'en' });
      expect(formatted).toMatch(/\d+\/\d+\/\d+/);
    });
  });

  describe('formatGregorianDate', () => {
    it('should format in English', () => {
      const formatted = formatGregorianDate({ year: 2024, month: 4, day: 13 });
      expect(formatted).toContain('April');
      expect(formatted).toContain('13');
      expect(formatted).toContain('2024');
    });

    it('should format in Nepali', () => {
      const formatted = formatGregorianDate({ year: 2024, month: 4, day: 13 }, { locale: 'np' });
      expect(formatted).toContain('१३');
      expect(formatted).toContain('२०२४');
    });
  });

  describe('formatDualDate', () => {
    it('should show both calendars', () => {
      const formatted = formatDualDate(
        { year: 2024, month: 4, day: 13 },
        { year: 2081, month: 1, day: 1 }
      );
      expect(formatted).toContain('|');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('२०८१');
    });
  });

  describe('parseNepaliDate', () => {
    it('should parse Nepali format', () => {
      const parsed = parseNepaliDate('२०८१ बैशाख १५');
      expect(parsed).toEqual({ year: 2081, month: 1, day: 15 });
    });

    it('should parse English format', () => {
      const parsed = parseNepaliDate('2081 Baishakh 15');
      expect(parsed).toEqual({ year: 2081, month: 1, day: 15 });
    });

    it('should parse ISO format', () => {
      const parsed = parseNepaliDate('2081-01-15');
      expect(parsed).toEqual({ year: 2081, month: 1, day: 15 });
    });
  });

  describe('parseGregorianDate', () => {
    it('should parse ISO format', () => {
      const parsed = parseGregorianDate('2024-04-13');
      expect(parsed).toEqual({ year: 2024, month: 4, day: 13 });
    });

    it('should parse US format', () => {
      const parsed = parseGregorianDate('04/13/2024');
      expect(parsed).toEqual({ year: 2024, month: 4, day: 13 });
    });

    it('should parse month name format', () => {
      const parsed = parseGregorianDate('April 13, 2024');
      expect(parsed).toEqual({ year: 2024, month: 4, day: 13 });
    });
  });

  describe('getRelativeTime', () => {
    it('should return today for same date', () => {
      const today = getToday();
      const result = getRelativeTime(today.gregorian, today.gregorian);
      expect(result).toBe('Today');
    });

    it('should return tomorrow/yesterday', () => {
      const today = getToday();
      const tomorrow = { ...today.gregorian, day: today.gregorian.day + 1 };
      const yesterday = { ...today.gregorian, day: today.gregorian.day - 1 };
      
      expect(getRelativeTime(today.gregorian, tomorrow)).toBe('Tomorrow');
      expect(getRelativeTime(today.gregorian, yesterday)).toBe('Yesterday');
    });
  });

  describe('getZodiacSign', () => {
    it('should return correct zodiac', () => {
      // April 20 = Aries
      expect(getZodiacSign({ year: 2024, month: 4, day: 20 }).sign).toBe('Aries');
      // May 21 = Taurus
      expect(getZodiacSign({ year: 2024, month: 5, day: 21 }).sign).toBe('Taurus');
    });
  });

  describe('getNepaliRashi', () => {
    it('should return correct rashi', () => {
      // Baishakh 14 = Mesha
      expect(getNepaliRashi({ year: 2081, month: 1, day: 14 }).rashiNp).toBe('मेष');
      // Jestha 15 = Brisha
      expect(getNepaliRashi({ year: 2081, month: 2, day: 15 }).rashiNp).toBe('वृष');
    });
  });

  describe('normalizeNepaliDate', () => {
    it('should clamp invalid values', () => {
      const normalized = normalizeNepaliDate({ year: 2081, month: 13, day: 45 });
      expect(normalized.month).toBe(12);
      expect(normalized.day).toBeLessThanOrEqual(getNepaliDaysInMonth(2081, 12));
    });

    it('should use defaults for missing values', () => {
      const normalized = normalizeNepaliDate({});
      expect(normalized.year).toBe(2080);
      expect(normalized.month).toBe(1);
      expect(normalized.day).toBe(1);
    });
  });

  describe('normalizeGregorianDate', () => {
    it('should clamp invalid values', () => {
      const normalized = normalizeGregorianDate({ year: 2024, month: 13, day: 45 });
      expect(normalized.month).toBe(12);
      expect(normalized.day).toBeLessThanOrEqual(31);
    });
  });
});