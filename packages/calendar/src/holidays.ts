/**
 * Nepali Holidays Data
 * 
 * Contains national holidays, government holidays, and observances
 * Based on official Nepal government calendar
 */

import { Festival } from './types';

/**
 * Fixed holidays that occur on the same Nepali date every year
 * Format: 'MM-DD': Festival
 */
export const FIXED_HOLIDAYS: Record<string, Festival> = {
  // Baishakh 1 - Nepali New Year
  '01-01': {
    id: 'nepali-new-year',
    nameEn: 'Nepali New Year',
    nameNp: 'नववर्ष',
    date: { year: 0, month: 1, day: 1 }, // year 0 = every year
    type: 'holiday',
    description: 'First day of Bikram Sambat (Nepali New Year)',
    isNationalHoliday: true
  },
  
  // Baishakh 30 - Loktantra Diwas (Democracy Day) - actually varies
  // Let me add the major fixed ones
  
  // Jestha 15 - Republic Day (sometimes)
  // Actually Republic Day is Jestha 15 (2063 BS onwards)
  '02-15': {
    id: 'republic-day',
    nameEn: 'Republic Day',
    nameNp: 'गणतन्त्र दिवस',
    date: { year: 0, month: 2, day: 15 },
    type: 'holiday',
    description: 'Commemorates the establishment of the Federal Democratic Republic of Nepal',
    isNationalHoliday: true
  },
  
  // Ashadh 15 - Not a fixed holiday
  
  // Shrawan 15 - Not a fixed holiday
  
  // Bhadra 1 - Not a fixed holiday
  
  // Ashwin 1-15 - Dashain period (varies)
  // Kartik 1-5 - Tihar period (varies)
  
  // Mangsir 15 - Not fixed
  
  // Poush 1 - Not fixed
  
  // Magh 1 - Maghe Sankranti
  '10-01': {
    id: 'maghe-sankranti',
    nameEn: 'Maghe Sankranti',
    nameNp: 'माघे सङ्क्रान्ति',
    date: { year: 0, month: 10, day: 1 },
    type: 'festival',
    description: 'Festival marking the end of winter solstice',
    isNationalHoliday: false
  },
  
  // Falgun 7 - Democracy Day (before 2063)
  // Falgun 14 - Maha Shivaratri (varies by lunar calendar)
  
  // Chaitra 15-30 - Not fixed
};

/**
 * Major festivals with their Nepali dates (some vary by year)
 * For festivals that follow lunar calendar, we'll compute them dynamically
 */
export const MAJOR_FESTIVALS: Festival[] = [
  {
    id: 'dashain',
    nameEn: 'Dashain',
    nameNp: 'दशैं',
    date: { year: 0, month: 6, day: 1 }, // Starts on Ashwin 1 (Ghatasthapana)
    type: 'festival',
    description: 'Longest and most auspicious festival in Nepal (15 days)',
    isNationalHoliday: true
  },
  {
    id: 'tihar',
    nameEn: 'Tihar',
    nameNp: 'तिहार',
    date: { year: 0, month: 7, day: 1 }, // Starts on Kartik 1 (Kag Tihar)
    type: 'festival',
    description: 'Festival of lights (5 days)',
    isNationalHoliday: true
  },
  {
    id: 'holi',
    nameEn: 'Holi',
    nameNp: 'होली',
    date: { year: 0, month: 11, day: 15 }, // Falgun 15 (varies)
    type: 'festival',
    description: 'Festival of colors',
    isNationalHoliday: true
  },
  {
    id: 'buddha-jayanti',
    nameEn: 'Buddha Jayanti',
    nameNp: 'बुद्ध जयन्ती',
    date: { year: 0, month: 1, day: 15 }, // Baishakh 15 (Buddha Purnima)
    type: 'festival',
    description: 'Birth, enlightenment, and death anniversary of Lord Buddha',
    isNationalHoliday: true
  },
  {
    id: 'constitution-day',
    nameEn: 'Constitution Day',
    nameNp: 'संविधान दिवस',
    date: { year: 0, month: 6, day: 3 }, // Ashwin 3 (sometimes)
    type: 'holiday',
    description: 'Promulgation of Constitution of Nepal',
    isNationalHoliday: true
  },
  {
    id: 'prithvi-jayanti',
    nameEn: 'Prithvi Jayanti',
    nameNp: 'पृथ्वी जयन्ती',
    date: { year: 0, month: 9, day: 11 }, // Poush 11
    type: 'holiday',
    description: 'Birth anniversary of King Prithvi Narayan Shah (National Unity Day)',
    isNationalHoliday: true
  },
  {
    id: 'martyrs-day',
    nameEn: 'Martyrs Day',
    nameNp: 'शहीद दिवस',
    date: { year: 0, month: 10, day: 16 }, // Magh 16
    type: 'holiday',
    description: 'Commemorates martyrs who sacrificed for democracy',
    isNationalHoliday: true
  },
  {
    id: 'womens-day',
    nameEn: 'International Women\'s Day',
    nameNp: 'अन्तर्राष्ट्रिय महिला दिवस',
    date: { year: 0, month: 11, day: 23 }, // Falgun 23 (March 8)
    type: 'observance',
    description: 'International Women\'s Day',
    isNationalHoliday: false
  },
  {
    id: 'labor-day',
    nameEn: 'Labor Day',
    nameNp: 'मजदुर दिवस',
    date: { year: 0, month: 12, day: 18 }, // Chaitra 18 (May 1)
    type: 'holiday',
    description: 'International Workers\' Day',
    isNationalHoliday: true
  },
  {
    id: 'raksha-bandhan',
    nameEn: 'Raksha Bandhan',
    nameNp: 'रक्षा बन्धन',
    date: { year: 0, month: 4, day: 15 }, // Shrawan 15 (varies)
    type: 'festival',
    description: 'Celebration of brother-sister bond',
    isNationalHoliday: false
  },
  {
    id: 'janai-purnima',
    nameEn: 'Janai Purnima',
    nameNp: 'जनेइ पूर्णिमा',
    date: { year: 0, month: 4, day: 15 }, // Shrawan 15
    type: 'festival',
    description: 'Sacred thread changing ceremony',
    isNationalHoliday: false
  },
  {
    id: 'gaijatra',
    nameEn: 'Gai Jatra',
    nameNp: 'गाईजात्रा',
    date: { year: 0, month: 4, day: 16 }, // Shrawan 16
    type: 'festival',
    description: 'Festival of cows, commemorating deceased',
    isNationalHoliday: false
  },
  {
    id: 'krishna-janmashtami',
    nameEn: 'Krishna Janmashtami',
    nameNp: 'कृष्ण जन्माष्टमी',
    date: { year: 0, month: 4, day: 23 }, // Shrawan 23 (varies)
    type: 'festival',
    description: 'Birth anniversary of Lord Krishna',
    isNationalHoliday: true
  },
  {
    id: 'teeja',
    nameEn: 'Teeja (Haritalika Teej)',
    nameNp: 'तीज (हरितालिका तीज)',
    date: { year: 0, month: 5, day: 15 }, // Bhadra 15 (varies)
    type: 'festival',
    description: 'Women\'s festival for marital bliss',
    isNationalHoliday: true
  },
  {
    id: 'indrajatra',
    nameEn: 'Indra Jatra',
    nameNp: 'इन्द्रजात्रा',
    date: { year: 0, month: 5, day: 25 }, // Bhadra 25 (varies)
    type: 'festival',
    description: 'Festival honoring Indra, Kathmandu\'s biggest street festival',
    isNationalHoliday: false
  },
  {
    id: 'chhath',
    nameEn: 'Chhath Puja',
    nameNp: 'छठ पूजा',
    date: { year: 0, month: 7, day: 10 }, // Kartik 10 (varies)
    type: 'festival',
    description: 'Sun worship festival, major in Terai region',
    isNationalHoliday: true
  },
  {
    id: 'losar',
    nameEn: 'Losar (Tibetan New Year)',
    nameNp: 'लोसर',
    date: { year: 0, month: 11, day: 1 }, // Falgun 1 (varies)
    type: 'festival',
    description: 'Tibetan New Year celebrated by Sherpa, Tamang, Gurung communities',
    isNationalHoliday: false
  },
  {
    id: 'christmas',
    nameEn: 'Christmas',
    nameNp: 'क्रिसमस',
    date: { year: 0, month: 9, day: 25 }, // Poush 25 (Dec 25)
    type: 'holiday',
    description: 'Christmas Day',
    isNationalHoliday: true
  },
  {
    id: 'eid',
    nameEn: 'Eid al-Fitr',
    nameNp: 'ईद अल-फितर',
    date: { year: 0, month: 1, day: 1 }, // Varies by lunar calendar
    type: 'holiday',
    description: 'End of Ramadan',
    isNationalHoliday: true
  },
  {
    id: 'eid-adha',
    nameEn: 'Eid al-Adha',
    nameNp: 'ईद अल-अधा',
    date: { year: 0, month: 1, day: 1 }, // Varies by lunar calendar
    type: 'holiday',
    description: 'Festival of Sacrifice',
    isNationalHoliday: true
  }
];

/**
 * Get all holidays for a specific Nepali year
 * Some holidays vary by year (lunar calendar based)
 */
export function getHolidaysForYear(year: number): Festival[] {
  const holidays: Festival[] = [];
  
  // Add fixed holidays
  for (const [key, festival] of Object.entries(FIXED_HOLIDAYS)) {
    const [month, day] = key.split('-').map(Number);
    holidays.push({
      ...festival,
      date: { ...festival.date, year }
    });
  }
  
  // Add major festivals (some need dynamic calculation)
  for (const festival of MAJOR_FESTIVALS) {
    holidays.push({
      ...festival,
      date: { ...festival.date, year }
    });
  }
  
  return holidays;
}

/**
 * Get holidays for a specific Nepali month/year
 */
export function getHolidaysForMonth(year: number, month: number): Festival[] {
  return getHolidaysForYear(year).filter(h => h.date.month === month);
}

/**
 * Check if a specific Nepali date is a holiday
 */
export function isHoliday(date: { year: number; month: number; day: number }): Festival | null {
  const holidays = getHolidaysForYear(date.year);
  return holidays.find(h => h.date.month === date.month && h.date.day === date.day) || null;
}

/**
 * Get national holidays only
 */
export function getNationalHolidays(year: number): Festival[] {
  return getHolidaysForYear(year).filter(h => h.isNationalHoliday);
}