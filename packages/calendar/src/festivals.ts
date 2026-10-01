/**
 * Nepali Festivals with Lunar Calendar Calculations
 * 
 * Many Nepali festivals follow the lunar calendar (tithi-based).
 * This module provides calculations for those dates.
 */

import { Festival, NepaliDate, GregorianDate } from './types';
import { gregorianToNepali, nepaliToGregorian, getNepaliDaysInMonth, gregorianToJDN } from './converter';
import { MAJOR_FESTIVALS, getHolidaysForYear } from './holidays';

/**
 * Lunar phase calculation (simplified)
 * Returns the tithi (lunar day) for a given Gregorian date
 * Tithi 1-15: Shukla Paksha (waxing), 16-30: Krishna Paksha (waning)
 */
export function getTithi(date: GregorianDate): { tithi: number; paksha: 'shukla' | 'krishna'; phase: number } {
  // Simplified calculation - in reality this needs precise astronomical calculation
  // Using a reference new moon: 2000-01-06 Gregorian
  const REF_NEW_MOON_JDN = 2451550.1; // Approximate JDN for new moon Jan 6, 2000
  
  // Convert Gregorian to JDN
  const jdn = gregorianToJDN(date);
  
  // Days since reference new moon
  const daysSinceRef = jdn - REF_NEW_MOON_JDN;
  
  // Lunar month ≈ 29.53059 days
  const LUNAR_MONTH = 29.53059;
  let lunarDays = daysSinceRef % LUNAR_MONTH;
  if (lunarDays < 0) lunarDays += LUNAR_MONTH;
  
  // Each tithi ≈ 0.984 days (lunar month / 30)
  const TITHI_DURATION = LUNAR_MONTH / 30;
  const tithiNumber = Math.floor(lunarDays / TITHI_DURATION) + 1;
  
  const paksha = tithiNumber <= 15 ? 'shukla' : 'krishna';
  const phase = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  
  return { tithi: tithiNumber, paksha, phase };
}

/**
 * Calculate festival dates for a given year using lunar calendar
 * Returns festivals with computed dates for the specific year
 */
export function computeLunarFestivals(year: number): Festival[] {
  const festivals: Festival[] = [];
  
  // We need to find Gregorian dates that correspond to specific tithis in the Nepali year
  // This is complex - for now, we'll use approximations based on known dates
  
  // For a production version, you'd use a proper astronomical library
  // like 'astronomia' or 'sun-calc' for precise calculations
  
  return festivals;
}

/**
 * Get Dashain dates for a year (15 days starting from Ashwin Shukla Pratipada)
 */
export function getDashainDates(year: number): NepaliDate[] {
  // Dashain starts on Ashwin Shukla Pratipada (first day of bright fortnight in Ashwin)
  // This typically falls in late September/early October
  // For accuracy, we'd compute the exact tithi
  
  // Approximate: Ashwin 1-15
  const dates: NepaliDate[] = [];
  for (let day = 1; day <= 15; day++) {
    dates.push({ year, month: 6, day });
  }
  return dates;
}

/**
 * Get Tihar dates for a year (5 days starting from Kartik Krishna Trayodashi)
 */
export function getTiharDates(year: number): NepaliDate[] {
  // Tihar: Kag Tihar (Kartik Krishna Trayodashi) to Bhai Tika (Kartik Shukla Dwitiya)
  // Approximate: Kartik 1-5 (last days of Krishna + first days of Shukla)
  const dates: NepaliDate[] = [];
  const daysInKartik = getNepaliDaysInMonth(year, 7);
  
  // Last 3 days of Krishna paksha + first 2 days of Shukla paksha
  for (let day = daysInKartik - 2; day <= daysInKartik; day++) {
    dates.push({ year, month: 7, day });
  }
  for (let day = 1; day <= 2; day++) {
    dates.push({ year, month: 7, day });
  }
  return dates;
}

/**
 * Get Holi date for a year (Falgun Shukla Purnima)
 */
export function getHoliDate(year: number): NepaliDate {
  // Holi is on Falgun Shukla Purnima (full moon)
  // Typically Falgun 14 or 15
  return { year, month: 11, day: 15 };
}

/**
 * Get Buddha Jayanti date (Baishakh Shukla Purnima)
 */
export function getBuddhaJayantiDate(year: number): NepaliDate {
  // Buddha Jayanti is on Baishakh Shukla Purnima
  return { year, month: 1, day: 15 };
}

/**
 * Get Maha Shivaratri date (Falgun Krishna Chaturdashi)
 */
export function getMahaShivaratriDate(year: number): NepaliDate {
  // Maha Shivaratri is on Falgun Krishna Chaturdashi (14th day of dark fortnight)
  // This is typically Falgun 13 or 14
  return { year, month: 11, day: 14 };
}

/**
 * Get Janai Purnima / Raksha Bandhan date (Shrawan Shukla Purnima)
 */
export function getJanaiPurnimaDate(year: number): NepaliDate {
  // Janai Purnima is on Shrawan Shukla Purnima
  return { year, month: 4, day: 15 };
}

/**
 * Get Gaijatra date (Shrawan Krishna Pratipada - day after Janai Purnima)
 */
export function getGaijatraDate(year: number): NepaliDate {
  // Gaijatra is the day after Janai Purnima
  const janai = getJanaiPurnimaDate(year);
  // Next day in Nepali calendar
  const nextDay = janai.day + 1;
  if (nextDay > getNepaliDaysInMonth(year, 4)) {
    return { year, month: 5, day: 1 };
  }
  return { year, month: 4, day: nextDay };
}

/**
 * Get Krishna Janmashtami date (Shrawan Krishna Ashtami)
 */
export function getKrishnaJanmashtamiDate(year: number): NepaliDate {
  // Krishna Janmashtami is on Shrawan Krishna Ashtami (8th day of dark fortnight)
  // Typically Shrawan 23 or 24
  return { year, month: 4, day: 23 };
}

/**
 * Get Teej date (Bhadra Shukla Tritiya)
 */
export function getTeejDate(year: number): NepaliDate {
  // Haritalika Teej is on Bhadra Shukla Tritiya (3rd day of bright fortnight)
  return { year, month: 5, day: 3 };
}

/**
 * Get Indra Jatra date (Bhadra Shukla Chaturdashi to Ashwin Krishna Pratipada)
 */
export function getIndraJatraDates(year: number): NepaliDate[] {
  // Indra Jatra is 8 days from Bhadra Shukla Chaturdashi
  const dates: NepaliDate[] = [];
  const startDay = getNepaliDaysInMonth(year, 5) - 1; // Chaturdashi = day before full moon
  for (let i = 0; i < 8; i++) {
    const day = startDay + i;
    if (day <= getNepaliDaysInMonth(year, 5)) {
      dates.push({ year, month: 5, day });
    } else {
      dates.push({ year, month: 6, day: day - getNepaliDaysInMonth(year, 5) });
    }
  }
  return dates;
}

/**
 * Get Chhath Puja dates (Kartik Shukla Shashthi to Saptami)
 */
export function getChhathDates(year: number): NepaliDate[] {
  // Chhath is on Kartik Shukla Shashthi (6th day) and Saptami (7th day)
  return [
    { year, month: 7, day: 6 },
    { year, month: 7, day: 7 }
  ];
}

/**
 * Get all computed festivals for a year with accurate dates
 */
export function getAllFestivalsForYear(year: number): Festival[] {
  const festivals: Festival[] = [];
  
  // Fixed date festivals (from holidays.ts)
  const fixedHolidays = getHolidaysForYear(year);
  festivals.push(...fixedHolidays);
  
  // Computed lunar festivals
  const lunarFestivals: Festival[] = [
    {
      id: 'dashain-full',
      nameEn: 'Dashain (Full 15 days)',
      nameNp: 'दशैं (१५ दिन)',
      date: { year, month: 6, day: 1 },
      type: 'festival',
      description: 'Ghatasthapana to Kojagrat Purnima',
      isNationalHoliday: true
    },
    {
      id: 'tihar-full',
      nameEn: 'Tihar (Full 5 days)',
      nameNp: 'तिहार (५ दिन)',
      date: { year, month: 7, day: 1 },
      type: 'festival',
      description: 'Kag Tihar to Bhai Tika',
      isNationalHoliday: true
    },
    {
      id: 'holi-computed',
      nameEn: 'Holi (Fagu Purnima)',
      nameNp: 'होली (फागु पूर्णिमा)',
      date: getHoliDate(year),
      type: 'festival',
      description: 'Festival of colors on Falgun full moon',
      isNationalHoliday: true
    },
    {
      id: 'buddha-jayanti-computed',
      nameEn: 'Buddha Jayanti',
      nameNp: 'बुद्ध जयन्ती',
      date: getBuddhaJayantiDate(year),
      type: 'festival',
      description: 'Buddha Purnima - Birth, enlightenment, and death of Buddha',
      isNationalHoliday: true
    },
    {
      id: 'maha-shivaratri-computed',
      nameEn: 'Maha Shivaratri',
      nameNp: 'महा शिवरात्रि',
      date: getMahaShivaratriDate(year),
      type: 'festival',
      description: 'Great night of Shiva',
      isNationalHoliday: true
    },
    {
      id: 'janai-purnima-computed',
      nameEn: 'Janai Purnima',
      nameNp: 'जनेइ पूर्णिमा',
      date: getJanaiPurnimaDate(year),
      type: 'festival',
      description: 'Sacred thread ceremony on Shrawan full moon',
      isNationalHoliday: false
    },
    {
      id: 'raksha-bandhan-computed',
      nameEn: 'Raksha Bandhan',
      nameNp: 'रक्षा बन्धन',
      date: getJanaiPurnimaDate(year), // Same day as Janai Purnima
      type: 'festival',
      description: 'Brother-sister bond celebration',
      isNationalHoliday: false
    },
    {
      id: 'gaijatra-computed',
      nameEn: 'Gai Jatra',
      nameNp: 'गाईजात्रा',
      date: getGaijatraDate(year),
      type: 'festival',
      description: 'Festival of cows, day after Janai Purnima',
      isNationalHoliday: false
    },
    {
      id: 'krishna-janmashtami-computed',
      nameEn: 'Krishna Janmashtami',
      nameNp: 'कृष्ण जन्माष्टमी',
      date: getKrishnaJanmashtamiDate(year),
      type: 'festival',
      description: 'Birth of Lord Krishna',
      isNationalHoliday: true
    },
    {
      id: 'teeja-computed',
      nameEn: 'Haritalika Teej',
      nameNp: 'हरितालिका तीज',
      date: getTeejDate(year),
      type: 'festival',
      description: 'Women\'s fasting festival for marital bliss',
      isNationalHoliday: true
    },
    {
      id: 'indra-jatra-computed',
      nameEn: 'Indra Jatra',
      nameNp: 'इन्द्रजात्रा',
      date: getIndraJatraDates(year)[0],
      type: 'festival',
      description: 'Kathmandu\'s biggest street festival (8 days)',
      isNationalHoliday: false
    },
    {
      id: 'chhath-computed',
      nameEn: 'Chhath Puja',
      nameNp: 'छठ पूजा',
      date: getChhathDates(year)[0],
      type: 'festival',
      description: 'Sun worship festival',
      isNationalHoliday: true
    }
  ];
  
  festivals.push(...lunarFestivals);
  
  return festivals;
}

/**
 * Get festivals organized by month for a year
 */
export function getFestivalsByMonth(year: number): Map<string, Festival[]> {
  const festivals = getAllFestivalsForYear(year);
  const byMonth = new Map<string, Festival[]>();
  
  for (const festival of festivals) {
    const key = `${year}-${festival.date.month}`;
    if (!byMonth.has(key)) {
      byMonth.set(key, []);
    }
    byMonth.get(key)!.push(festival);
  }
  
  return byMonth;
}

/**
 * Get festival details by ID
 */
export function getFestivalById(id: string, year: number): Festival | undefined {
  const festivals = getAllFestivalsForYear(year);
  return festivals.find(f => f.id === id);
}

/**
 * Check if a date has any festival
 */
export function hasFestival(date: NepaliDate): Festival[] {
  const festivals = getAllFestivalsForYear(date.year);
  return festivals.filter(f => 
    f.date.month === date.month && f.date.day === date.day
  );
}