// lib/panchang.ts - Panchang calculations for Hamro Patro style calendar
import type { GregorianDate, NepaliDate } from '@/types';

export interface PanchangData {
  // Tithi
  tithi: {
    name: string;
    nameNp: string;
    paksha: 'shukla' | 'krishna';
    number: number;
    endsAt: string; // time when tithi ends
  };
  // Nakshatra
  nakshatra: {
    name: string;
    nameNp: string;
    endsAt: string;
  };
  // Yoga
  yoga: {
    name: string;
    nameNp: string;
    endsAt: string;
  };
  // Karana
  karana: {
    name: string;
    nameNp: string;
    endsAt: string;
  };
  // Sun/Moon
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  // Rahu Kaal
  rahuKaal: { start: string; end: string };
  // Gulika Kaal
  gulikaKaal: { start: string; end: string };
  // Yamaganda
  yamaganda: { start: string; end: string };
  // Abhijit Muhurta
  abhijitMuhurta: { start: string; end: string };
  // Day duration
  dayDuration: string;
  nightDuration: string;
}

// Nakshatra names (27)
const NAKSHATRAS = [
  { en: 'Ashwini', np: 'अश्विनी' },
  { en: 'Bharani', np: 'भरणी' },
  { en: 'Krittika', np: 'कृत्तिका' },
  { en: 'Rohini', np: 'रोहिणी' },
  { en: 'Mrigashira', np: 'मृगशिरा' },
  { en: 'Ardra', np: 'आर्द्रा' },
  { en: 'Punarvasu', np: 'पुनर्वसु' },
  { en: 'Pushya', np: 'पुष्य' },
  { en: 'Ashlesha', np: 'आश्लेषा' },
  { en: 'Magha', np: 'मघा' },
  { en: 'Purva Phalguni', np: 'पूर्व फाल्गुनी' },
  { en: 'Uttara Phalguni', np: 'उत्तर फाल्गुनी' },
  { en: 'Hasta', np: 'हस्त' },
  { en: 'Chitra', np: 'चित्रा' },
  { en: 'Swati', np: 'स्वाती' },
  { en: 'Vishakha', np: 'विशाखा' },
  { en: 'Anuradha', np: 'अनुराधा' },
  { en: 'Jyeshtha', np: 'ज्येष्ठा' },
  { en: 'Mula', np: 'मूल' },
  { en: 'Purva Ashadha', np: 'पूर्वाषाढा' },
  { en: 'Uttara Ashadha', np: 'उत्तराषाढा' },
  { en: 'Shravana', np: 'श्रवण' },
  { en: 'Dhanishtha', np: 'धनिष्ठा' },
  { en: 'Shatabhisha', np: 'शतभिषा' },
  { en: 'Purva Bhadrapada', np: 'पूर्वभाद्रपदा' },
  { en: 'Uttara Bhadrapada', np: 'उत्तरभाद्रपदा' },
  { en: 'Revati', np: 'रेवती' },
];

// Yoga names (27)
const YOGAS = [
  { en: 'Vishkambha', np: 'विष्कम्भ' },
  { en: 'Priti', np: 'प्रीति' },
  { en: 'Ayushman', np: 'आयुष्मान' },
  { en: 'Saubhagya', np: 'सौभाग्य' },
  { en: 'Shobhana', np: 'शोभन' },
  { en: 'Atiganda', np: 'अतिगण्ड' },
  { en: 'Sukarma', np: 'सुकर्मा' },
  { en: 'Dhriti', np: 'धृति' },
  { en: 'Shoola', np: 'शूल' },
  { en: 'Ganda', np: 'गण्ड' },
  { en: 'Vriddhi', np: 'वृद्धि' },
  { en: 'Dhruva', np: 'ध्रुव' },
  { en: 'Vyaghata', np: 'व्याघात' },
  { en: 'Harshana', np: 'हर्षण' },
  { en: 'Vajra', np: 'वज्र' },
  { en: 'Siddhi', np: 'सिद्धि' },
  { en: 'Vyatipata', np: 'व्यतिपात' },
  { en: 'Variyan', np: 'वरीयान्' },
  { en: 'Parigha', np: 'परिघ' },
  { en: 'Shiva', np: 'शिव' },
  { en: 'Siddha', np: 'सिद्ध' },
  { en: 'Sadhya', np: 'साध्य' },
  { en: 'Shubha', np: 'शुभ' },
  { en: 'Shukla', np: 'शुक्ल' },
  { en: 'Brahma', np: 'ब्रह्म' },
  { en: 'Indra', np: 'इन्द्र' },
  { en: 'Vaidhriti', np: 'वैधृति' },
];

// Karana names (11)
const KARANAS = [
  { en: 'Bava', np: 'बव' },
  { en: 'Balava', np: 'बालव' },
  { en: 'Kaulava', np: 'कौलव' },
  { en: 'Taitila', np: 'तैतिल' },
  { en: 'Gara', np: 'गर' },
  { en: 'Vanija', np: 'वणिज' },
  { en: 'Vishti', np: 'विष्टि' },
  { en: 'Shakuni', np: 'शकुनि' },
  { en: 'Chatushpada', np: 'चतुष्पद' },
  { en: 'Naga', np: 'नाग' },
  { en: 'Kimstughna', np: 'किम्स्तुघ्न' },
];

// Tithi names (15 each paksha)
const TITHI_NAMES = [
  '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

const TITHI_NAMES_NP = [
  '', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'
];

// Simple sunrise/sunset calculation for Kathmandu
function getSunTimes(date: Date, lat = 27.7172, lon = 85.324): { sunrise: string; sunset: string } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  // Simplified calculation for Kathmandu
  const sunriseHour = 5 + Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 0.5;
  const sunsetHour = 18.5 - Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 0.5;
  
  const formatTime = (h: number) => {
    const hours = Math.floor(h);
    const minutes = Math.round((h - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return {
    sunrise: formatTime(sunriseHour),
    sunset: formatTime(sunsetHour)
  };
}

export function calculatePanchang(gregorian: GregorianDate, nepali: NepaliDate): PanchangData {
  const date = new Date(gregorian.year, gregorian.month - 1, gregorian.day);
  const sunTimes = getSunTimes(date);
  
  // Simplified tithi calculation (would need precise astronomical calculations in production)
  const julianDay = Math.floor(date.getTime() / 86400000) + 2440587.5;
  const lunarPhase = (julianDay - 2451550.1) % 29.53059;
  const tithiNumber = Math.floor(lunarPhase / 0.984) + 1;
  const paksha = tithiNumber <= 15 ? 'shukla' : 'krishna';
  const displayTithi = paksha === 'shukla' ? tithiNumber : tithiNumber - 15;
  
  // Nakshatra (simplified)
  const nakIndex = Math.floor((julianDay % 27.32166)) % 27;
  const nakshatra = NAKSHATRAS[nakIndex < 0 ? nakIndex + 27 : nakIndex];
  
  // Yoga (simplified)
  const yogaIndex = Math.floor(((lunarPhase * 360 / 29.53059) + (julianDay * 360 / 365.25)) / 13.3333) % 27;
  const yoga = YOGAS[yogaIndex < 0 ? yogaIndex + 27 : yogaIndex];
  
  // Karana (half tithi)
  const karanaIndex = Math.floor((tithiNumber - 1) * 2 + (lunarPhase * 2 % 1)) % 11;
  const karana = KARANAS[karanaIndex < 0 ? karanaIndex + 11 : karanaIndex];
  
  // Calculate time periods
  const sunrise = sunTimes.sunrise;
  const sunset = sunTimes.sunset;
  const [srH, srM] = sunrise.split(':').map(Number);
  const [ssH, ssM] = sunset.split(':').map(Number);
  const dayMinutes = (ssH * 60 + ssM) - (srH * 60 + srM);
  const period = dayMinutes / 8;
  
  const rahuStart = srH * 60 + srM + period * (date.getDay() === 0 ? 6 : date.getDay() === 1 ? 0 : date.getDay() === 2 ? 4 : date.getDay() === 3 ? 2 : date.getDay() === 4 ? 3 : date.getDay() === 5 ? 5 : 1);
  const rahuEnd = rahuStart + 90;
  const formatTime = (m: number) => `${Math.floor(m/60).toString().padStart(2,'0')}:${(m%60).toString().padStart(2,'0')}`;
  
  const dayDuration = `${Math.floor(dayMinutes/60)}h ${dayMinutes%60}m`;
  const nightDuration = `${Math.floor((1440-dayMinutes)/60)}h ${(1440-dayMinutes)%60}m`;
  
  return {
    tithi: {
      name: `${paksha === 'shukla' ? 'Shukla' : 'Krishna'} ${TITHI_NAMES[displayTithi]}`,
      nameNp: `${paksha === 'shukla' ? 'शुक्ल' : 'कृष्ण'} ${TITHI_NAMES_NP[displayTithi]}`,
      paksha,
      number: displayTithi,
      endsAt: '18:30' // placeholder
    },
    nakshatra: {
      name: nakshatra.en,
      nameNp: nakshatra.np,
      endsAt: '22:45' // placeholder
    },
    yoga: {
      name: yoga.en,
      nameNp: yoga.np,
      endsAt: '20:15' // placeholder
    },
    karana: {
      name: karana.en,
      nameNp: karana.np,
      endsAt: '14:20' // placeholder
    },
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    moonrise: '20:15', // placeholder
    moonset: '08:30', // placeholder
    rahuKaal: { start: formatTime(rahuStart), end: formatTime(rahuEnd) },
    gulikaKaal: { start: formatTime(rahuStart + 90), end: formatTime(rahuStart + 180) },
    yamaganda: { start: formatTime(rahuStart + 180), end: formatTime(rahuStart + 270) },
    abhijitMuhurta: { start: formatTime((srH * 60 + srM + ssH * 60 + ssM) / 2 - 24), end: formatTime((srH * 60 + srM + ssH * 60 + ssM) / 2 + 24) },
    dayDuration,
    nightDuration
  };
}

// Nepali Samvat (Nepal Sambat) calculation
export function getNepalSambat(bsYear: number): number {
  // Nepal Sambat started in 880 AD = 941 BS
  return bsYear - 941;
}

// Get detailed Nepali month info
export function getMonthDetails(bsYear: number, bsMonth: number) {
  const monthNames = [
    { en: 'Baishakh', np: 'बैशाख', days: 31, zodiac: 'Mesha' },
    { en: 'Jestha', np: 'जेठ', days: 31, zodiac: 'Brisha' },
    { en: 'Ashadh', np: 'असार', days: 32, zodiac: 'Mithuna' },
    { en: 'Shrawan', np: 'श्रावण', days: 31, zodiac: 'Karkat' },
    { en: 'Bhadra', np: 'भदौ', days: 31, zodiac: 'Simha' },
    { en: 'Ashwin', np: 'आश्विन', days: 30, zodiac: 'Kanya' },
    { en: 'Kartik', np: 'कार्तिक', days: 30, zodiac: 'Tula' },
    { en: 'Mangsir', np: 'मंसिर', days: 30, zodiac: 'Brishchik' },
    { en: 'Poush', np: 'पुष', days: 30, zodiac: 'Dhanu' },
    { en: 'Magh', np: 'माघ', days: 30, zodiac: 'Makar' },
    { en: 'Falgun', np: 'फाल्गुन', days: 30, zodiac: 'Kumbha' },
    { en: 'Chaitra', np: 'चैत्र', days: 30, zodiac: 'Meena' },
  ];
  
  return monthNames[bsMonth - 1];
}

export function getRashiInfo(bsMonth: number, bsDay: number) {
  const rashis = [
    { en: 'Mesha', np: 'मेष', start: { m: 1, d: 14 }, end: { m: 2, d: 13 } },
    { en: 'Brisha', np: 'वृष', start: { m: 2, d: 14 }, end: { m: 3, d: 13 } },
    { en: 'Mithuna', np: 'मिथुन', start: { m: 3, d: 14 }, end: { m: 4, d: 13 } },
    { en: 'Karkat', np: 'कर्कट', start: { m: 4, d: 14 }, end: { m: 5, d: 14 } },
    { en: 'Simha', np: 'सिंह', start: { m: 5, d: 15 }, end: { m: 6, d: 14 } },
    { en: 'Kanya', np: 'कन्या', start: { m: 6, d: 15 }, end: { m: 7, d: 14 } },
    { en: 'Tula', np: 'तुला', start: { m: 7, d: 15 }, end: { m: 8, d: 14 } },
    { en: 'Brishchik', np: 'वृश्चिक', start: { m: 8, d: 15 }, end: { m: 9, d: 14 } },
    { en: 'Dhanu', np: 'धनु', start: { m: 9, d: 15 }, end: { m: 10, d: 14 } },
    { en: 'Makar', np: 'मकर', start: { m: 10, d: 15 }, end: { m: 11, d: 13 } },
    { en: 'Kumbha', np: 'कुम्भ', start: { m: 11, d: 14 }, end: { m: 12, d: 12 } },
    { en: 'Meena', np: 'मीन', start: { m: 12, d: 13 }, end: { m: 1, d: 13 } },
  ];
  
  for (const r of rashis) {
    if ((bsMonth > r.start.m || (bsMonth === r.start.m && bsDay >= r.start.d)) &&
        (bsMonth < r.end.m || (bsMonth === r.end.m && bsDay <= r.end.d))) {
      return r;
    }
    if (r.start.m > r.end.m) {
      if ((bsMonth > r.start.m || (bsMonth === r.start.m && bsDay >= r.start.d)) ||
          (bsMonth < r.end.m || (bsMonth === r.end.m && bsDay <= r.end.d))) {
        return r;
      }
    }
  }
  return rashis[11];
}