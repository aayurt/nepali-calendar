'use strict';

// src/converter.ts
var GREGORIAN_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isGregorianLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
function getGregorianDaysInMonth(year, month) {
  if (month === 2 && isGregorianLeapYear(year)) {
    return 29;
  }
  return GREGORIAN_MONTH_DAYS[month - 1];
}
function gregorianToJDN(date) {
  const { year, month, day } = date;
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}
function jdnToGregorian(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}
var NEPALI_MONTH_DAYS = {
  2e3: [30, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30],
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
  2099: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30]
};
function getNepaliDaysInMonth(year, month) {
  const yearData = NEPALI_MONTH_DAYS[year];
  if (!yearData) {
    if (month === 3) return 31;
    if (month <= 5) return 31;
    if (month <= 11) return 30;
    return 30;
  }
  return yearData[month - 1] || 30;
}
function getNepaliDaysInYear(year) {
  const yearData = NEPALI_MONTH_DAYS[year];
  if (!yearData) return 365;
  return yearData.reduce((sum, days) => sum + days, 0);
}
function nepaliToJDN(date) {
  const { year, month, day } = date;
  let days = 0;
  for (let y = 2e3; y < year; y++) {
    days += getNepaliDaysInYear(y);
  }
  for (let m = 1; m < month; m++) {
    days += getNepaliDaysInMonth(year, m);
  }
  days += day - 1;
  const REF_JDN = gregorianToJDN({ year: 1943, month: 4, day: 13 });
  return REF_JDN + days;
}
function jdnToNepali(jdn) {
  const REF_JDN = gregorianToJDN({ year: 1943, month: 4, day: 13 });
  let daysDiff = jdn - REF_JDN;
  if (daysDiff < 0) {
    throw new Error("Date before supported range (before 2000 BS)");
  }
  let year = 2e3;
  while (true) {
    const daysInYear = getNepaliDaysInYear(year);
    if (daysDiff < daysInYear) break;
    daysDiff -= daysInYear;
    year++;
  }
  let month = 1;
  while (month <= 12) {
    const daysInMonth = getNepaliDaysInMonth(year, month);
    if (daysDiff < daysInMonth) break;
    daysDiff -= daysInMonth;
    month++;
  }
  const day = daysDiff + 1;
  return { year, month, day };
}
function gregorianToNepali(gregorian) {
  const jdn = gregorianToJDN(gregorian);
  return jdnToNepali(jdn);
}
function nepaliToGregorian(nepali) {
  const jdn = nepaliToJDN(nepali);
  return jdnToGregorian(jdn);
}
function convertDate(date) {
  if ("year" in date && "month" in date && "day" in date) {
    throw new Error("Use explicit conversion functions: gregorianToNepali or nepaliToGregorian");
  }
  throw new Error("Invalid date object");
}
function getToday() {
  const now = /* @__PURE__ */ new Date();
  const gregorian = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
  const nepali = gregorianToNepali(gregorian);
  return { gregorian, nepali };
}
function getNepaliMonthStart(nepaliYear, nepaliMonth) {
  return nepaliToGregorian({ year: nepaliYear, month: nepaliMonth, day: 1 });
}
function getNepaliMonthEnd(nepaliYear, nepaliMonth) {
  const daysInMonth = getNepaliDaysInMonth(nepaliYear, nepaliMonth);
  return nepaliToGregorian({ year: nepaliYear, month: nepaliMonth, day: daysInMonth });
}

// src/calendar.ts
var NEPALI_MONTHS = [
  { number: 1, nameEn: "Baishakh", nameNp: "\u092C\u0948\u0936\u093E\u0916", daysInMonth: (y) => getNepaliDaysInMonth(y, 1) },
  { number: 2, nameEn: "Jestha", nameNp: "\u091C\u0947\u0920", daysInMonth: (y) => getNepaliDaysInMonth(y, 2) },
  { number: 3, nameEn: "Ashadh", nameNp: "\u0905\u0938\u093E\u0930", daysInMonth: (y) => getNepaliDaysInMonth(y, 3) },
  { number: 4, nameEn: "Shrawan", nameNp: "\u0936\u094D\u0930\u093E\u0935\u0923", daysInMonth: (y) => getNepaliDaysInMonth(y, 4) },
  { number: 5, nameEn: "Bhadra", nameNp: "\u092D\u0926\u094C", daysInMonth: (y) => getNepaliDaysInMonth(y, 5) },
  { number: 6, nameEn: "Ashwin", nameNp: "\u0906\u0936\u094D\u0935\u093F\u0928", daysInMonth: (y) => getNepaliDaysInMonth(y, 6) },
  { number: 7, nameEn: "Kartik", nameNp: "\u0915\u093E\u0930\u094D\u0924\u093F\u0915", daysInMonth: (y) => getNepaliDaysInMonth(y, 7) },
  { number: 8, nameEn: "Mangsir", nameNp: "\u092E\u0902\u0938\u093F\u0930", daysInMonth: (y) => getNepaliDaysInMonth(y, 8) },
  { number: 9, nameEn: "Poush", nameNp: "\u092A\u0941\u0937", daysInMonth: (y) => getNepaliDaysInMonth(y, 9) },
  { number: 10, nameEn: "Magh", nameNp: "\u092E\u093E\u0918", daysInMonth: (y) => getNepaliDaysInMonth(y, 10) },
  { number: 11, nameEn: "Falgun", nameNp: "\u092B\u093E\u0932\u094D\u0917\u0941\u0928", daysInMonth: (y) => getNepaliDaysInMonth(y, 11) },
  { number: 12, nameEn: "Chaitra", nameNp: "\u091A\u0948\u0924\u094D\u0930", daysInMonth: (y) => getNepaliDaysInMonth(y, 12) }
];
var GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var WEEK_DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var WEEK_DAYS_NP = ["\u0906\u0907\u0924", "\u0938\u094B\u092E", "\u092E\u0919\u094D\u0917\u0932", "\u092C\u0941\u0927", "\u092C\u093F\u0939\u093F", "\u0936\u0941\u0915\u094D\u0930", "\u0936\u0928\u093F"];
var WEEK_DAYS_EN_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var WEEK_DAYS_NP_FULL = ["\u0906\u0907\u0924\u092C\u093E\u0930", "\u0938\u094B\u092E\u092C\u093E\u0930", "\u092E\u0919\u094D\u0917\u0932\u092C\u093E\u0930", "\u092C\u0941\u0927\u092C\u093E\u0930", "\u092C\u093F\u0939\u093F\u092C\u093E\u0930", "\u0936\u0941\u0915\u094D\u0930\u092C\u093E\u0930", "\u0936\u0928\u093F\u092C\u093E\u0930"];
function getGregorianWeekDay(date) {
  const d = new Date(date.year, date.month - 1, date.day);
  return d.getDay();
}
function getNepaliWeekDay(date) {
  const gregorian = nepaliToGregorian(date);
  return getGregorianWeekDay(gregorian);
}
function getNepaliMonthInfo(year, month) {
  const base = NEPALI_MONTHS[month - 1];
  return {
    ...base,
    daysInMonth: (y) => getNepaliDaysInMonth(y, month)
  };
}
function generateNepaliMonthCalendar(year, month, festivals = /* @__PURE__ */ new Map(), holidays = /* @__PURE__ */ new Map()) {
  const monthInfo = getNepaliMonthInfo(year, month);
  const daysInMonth = monthInfo.daysInMonth(year);
  const firstDayGregorian = nepaliToGregorian({ year, month, day: 1 });
  const firstWeekDay = getGregorianWeekDay(firstDayGregorian);
  const today = getToday();
  const weeks = [];
  let currentWeek = [];
  for (let i = 0; i < firstWeekDay; i++) {
    currentWeek.unshift({
      nepaliDay: 0,
      gregorianDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: firstWeekDay - 1 - i,
      festivals: [],
      holidays: []
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const nepaliDate = { year, month, day };
    const gregorianDate = nepaliToGregorian(nepaliDate);
    const weekDay = getGregorianWeekDay(gregorianDate);
    const isToday = today.nepali.year === year && today.nepali.month === month && today.nepali.day === day;
    const key = `${year}-${month}-${day}`;
    const dayFestivals = festivals.get(key)?.map((f) => f.id) || [];
    const dayHolidays = holidays.get(key)?.map((h) => h.id) || [];
    currentWeek.push({
      nepaliDay: day,
      gregorianDate,
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
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    currentWeek.push({
      nepaliDay: 0,
      gregorianDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: currentWeek.length,
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
function generateGregorianMonthCalendar(year, month, festivals = /* @__PURE__ */ new Map(), holidays = /* @__PURE__ */ new Map()) {
  const daysInMonth = getGregorianDaysInMonth(year, month);
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekDay = firstDay.getDay();
  const today = getToday();
  const weeks = [];
  let currentWeek = [];
  for (let i = 0; i < firstWeekDay; i++) {
    currentWeek.push({
      gregorianDay: 0,
      nepaliDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: i,
      festivals: [],
      holidays: []
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const gregorianDate = { year, month, day };
    const nepaliDate = gregorianToNepali(gregorianDate);
    const weekDay = getGregorianWeekDay(gregorianDate);
    const isToday = today.gregorian.year === year && today.gregorian.month === month && today.gregorian.day === day;
    const key = `${nepaliDate.year}-${nepaliDate.month}-${nepaliDate.day}`;
    const dayFestivals = festivals.get(key)?.map((f) => f.id) || [];
    const dayHolidays = holidays.get(key)?.map((h) => h.id) || [];
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
  while (currentWeek.length < 7 && currentWeek.length > 0) {
    currentWeek.push({
      gregorianDay: 0,
      nepaliDate: { year: 0, month: 0, day: 0 },
      isCurrentMonth: false,
      isToday: false,
      weekDay: currentWeek.length,
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
function getWeekRange(date) {
  const weekDay = getGregorianWeekDay(date);
  const startJDN = gregorianToJDN(date) - weekDay;
  const endJDN = startJDN + 6;
  const start = jdnToGregorian(startJDN);
  const end = jdnToGregorian(endJDN);
  return { start, end };
}
function isValidNepaliDate(date) {
  if (date.year < 2e3 || date.year > 2099) return false;
  if (date.month < 1 || date.month > 12) return false;
  const daysInMonth = getNepaliDaysInMonth(date.year, date.month);
  return date.day >= 1 && date.day <= daysInMonth;
}
function isValidGregorianDate(date) {
  if (date.year < 1943 || date.year > 2100) return false;
  if (date.month < 1 || date.month > 12) return false;
  const daysInMonth = getGregorianDaysInMonth(date.year, date.month);
  return date.day >= 1 && date.day <= daysInMonth;
}
function addDaysToNepali(date, days) {
  const jdn = nepaliToJDN(date) + days;
  return jdnToNepali(jdn);
}
function subtractDaysFromNepali(date, days) {
  return addDaysToNepali(date, -days);
}
function nepaliDaysDifference(date1, date2) {
  return nepaliToJDN(date2) - nepaliToJDN(date1);
}
function getNepaliYearRangeForGregorianYear(gregorianYear) {
  const startOfYear = gregorianToNepali({ year: gregorianYear, month: 1, day: 1 });
  const endOfYear = gregorianToNepali({ year: gregorianYear, month: 12, day: 31 });
  return {
    start: startOfYear.year,
    end: endOfYear.year
  };
}
function getGregorianYearRangeForNepaliYear(nepaliYear) {
  const startOfYear = nepaliToGregorian({ year: nepaliYear, month: 1, day: 1 });
  const endOfYear = nepaliToGregorian({ year: nepaliYear, month: 12, day: getNepaliDaysInMonth(nepaliYear, 12) });
  return {
    start: startOfYear.year,
    end: endOfYear.year
  };
}

// src/holidays.ts
var FIXED_HOLIDAYS = {
  // Baishakh 1 - Nepali New Year
  "01-01": {
    id: "nepali-new-year",
    nameEn: "Nepali New Year",
    nameNp: "\u0928\u0935\u0935\u0930\u094D\u0937",
    date: { year: 0, month: 1, day: 1 },
    // year 0 = every year
    type: "holiday",
    description: "First day of Bikram Sambat (Nepali New Year)",
    isNationalHoliday: true
  },
  // Baishakh 30 - Loktantra Diwas (Democracy Day) - actually varies
  // Let me add the major fixed ones
  // Jestha 15 - Republic Day (sometimes)
  // Actually Republic Day is Jestha 15 (2063 BS onwards)
  "02-15": {
    id: "republic-day",
    nameEn: "Republic Day",
    nameNp: "\u0917\u0923\u0924\u0928\u094D\u0924\u094D\u0930 \u0926\u093F\u0935\u0938",
    date: { year: 0, month: 2, day: 15 },
    type: "holiday",
    description: "Commemorates the establishment of the Federal Democratic Republic of Nepal",
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
  "10-01": {
    id: "maghe-sankranti",
    nameEn: "Maghe Sankranti",
    nameNp: "\u092E\u093E\u0918\u0947 \u0938\u0919\u094D\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
    date: { year: 0, month: 10, day: 1 },
    type: "festival",
    description: "Festival marking the end of winter solstice",
    isNationalHoliday: false
  }
  // Falgun 7 - Democracy Day (before 2063)
  // Falgun 14 - Maha Shivaratri (varies by lunar calendar)
  // Chaitra 15-30 - Not fixed
};
var MAJOR_FESTIVALS = [
  {
    id: "dashain",
    nameEn: "Dashain",
    nameNp: "\u0926\u0936\u0948\u0902",
    date: { year: 0, month: 6, day: 1 },
    // Starts on Ashwin 1 (Ghatasthapana)
    type: "festival",
    description: "Longest and most auspicious festival in Nepal (15 days)",
    isNationalHoliday: true
  },
  {
    id: "tihar",
    nameEn: "Tihar",
    nameNp: "\u0924\u093F\u0939\u093E\u0930",
    date: { year: 0, month: 7, day: 1 },
    // Starts on Kartik 1 (Kag Tihar)
    type: "festival",
    description: "Festival of lights (5 days)",
    isNationalHoliday: true
  },
  {
    id: "holi",
    nameEn: "Holi",
    nameNp: "\u0939\u094B\u0932\u0940",
    date: { year: 0, month: 11, day: 15 },
    // Falgun 15 (varies)
    type: "festival",
    description: "Festival of colors",
    isNationalHoliday: true
  },
  {
    id: "buddha-jayanti",
    nameEn: "Buddha Jayanti",
    nameNp: "\u092C\u0941\u0926\u094D\u0927 \u091C\u092F\u0928\u094D\u0924\u0940",
    date: { year: 0, month: 1, day: 15 },
    // Baishakh 15 (Buddha Purnima)
    type: "festival",
    description: "Birth, enlightenment, and death anniversary of Lord Buddha",
    isNationalHoliday: true
  },
  {
    id: "constitution-day",
    nameEn: "Constitution Day",
    nameNp: "\u0938\u0902\u0935\u093F\u0927\u093E\u0928 \u0926\u093F\u0935\u0938",
    date: { year: 0, month: 6, day: 3 },
    // Ashwin 3 (sometimes)
    type: "holiday",
    description: "Promulgation of Constitution of Nepal",
    isNationalHoliday: true
  },
  {
    id: "prithvi-jayanti",
    nameEn: "Prithvi Jayanti",
    nameNp: "\u092A\u0943\u0925\u094D\u0935\u0940 \u091C\u092F\u0928\u094D\u0924\u0940",
    date: { year: 0, month: 9, day: 11 },
    // Poush 11
    type: "holiday",
    description: "Birth anniversary of King Prithvi Narayan Shah (National Unity Day)",
    isNationalHoliday: true
  },
  {
    id: "martyrs-day",
    nameEn: "Martyrs Day",
    nameNp: "\u0936\u0939\u0940\u0926 \u0926\u093F\u0935\u0938",
    date: { year: 0, month: 10, day: 16 },
    // Magh 16
    type: "holiday",
    description: "Commemorates martyrs who sacrificed for democracy",
    isNationalHoliday: true
  },
  {
    id: "womens-day",
    nameEn: "International Women's Day",
    nameNp: "\u0905\u0928\u094D\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u092E\u0939\u093F\u0932\u093E \u0926\u093F\u0935\u0938",
    date: { year: 0, month: 11, day: 23 },
    // Falgun 23 (March 8)
    type: "observance",
    description: "International Women's Day",
    isNationalHoliday: false
  },
  {
    id: "labor-day",
    nameEn: "Labor Day",
    nameNp: "\u092E\u091C\u0926\u0941\u0930 \u0926\u093F\u0935\u0938",
    date: { year: 0, month: 12, day: 18 },
    // Chaitra 18 (May 1)
    type: "holiday",
    description: "International Workers' Day",
    isNationalHoliday: true
  },
  {
    id: "raksha-bandhan",
    nameEn: "Raksha Bandhan",
    nameNp: "\u0930\u0915\u094D\u0937\u093E \u092C\u0928\u094D\u0927\u0928",
    date: { year: 0, month: 4, day: 15 },
    // Shrawan 15 (varies)
    type: "festival",
    description: "Celebration of brother-sister bond",
    isNationalHoliday: false
  },
  {
    id: "janai-purnima",
    nameEn: "Janai Purnima",
    nameNp: "\u091C\u0928\u0947\u0907 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E",
    date: { year: 0, month: 4, day: 15 },
    // Shrawan 15
    type: "festival",
    description: "Sacred thread changing ceremony",
    isNationalHoliday: false
  },
  {
    id: "gaijatra",
    nameEn: "Gai Jatra",
    nameNp: "\u0917\u093E\u0908\u091C\u093E\u0924\u094D\u0930\u093E",
    date: { year: 0, month: 4, day: 16 },
    // Shrawan 16
    type: "festival",
    description: "Festival of cows, commemorating deceased",
    isNationalHoliday: false
  },
  {
    id: "krishna-janmashtami",
    nameEn: "Krishna Janmashtami",
    nameNp: "\u0915\u0943\u0937\u094D\u0923 \u091C\u0928\u094D\u092E\u093E\u0937\u094D\u091F\u092E\u0940",
    date: { year: 0, month: 4, day: 23 },
    // Shrawan 23 (varies)
    type: "festival",
    description: "Birth anniversary of Lord Krishna",
    isNationalHoliday: true
  },
  {
    id: "teeja",
    nameEn: "Teeja (Haritalika Teej)",
    nameNp: "\u0924\u0940\u091C (\u0939\u0930\u093F\u0924\u093E\u0932\u093F\u0915\u093E \u0924\u0940\u091C)",
    date: { year: 0, month: 5, day: 15 },
    // Bhadra 15 (varies)
    type: "festival",
    description: "Women's festival for marital bliss",
    isNationalHoliday: true
  },
  {
    id: "indrajatra",
    nameEn: "Indra Jatra",
    nameNp: "\u0907\u0928\u094D\u0926\u094D\u0930\u091C\u093E\u0924\u094D\u0930\u093E",
    date: { year: 0, month: 5, day: 25 },
    // Bhadra 25 (varies)
    type: "festival",
    description: "Festival honoring Indra, Kathmandu's biggest street festival",
    isNationalHoliday: false
  },
  {
    id: "chhath",
    nameEn: "Chhath Puja",
    nameNp: "\u091B\u0920 \u092A\u0942\u091C\u093E",
    date: { year: 0, month: 7, day: 10 },
    // Kartik 10 (varies)
    type: "festival",
    description: "Sun worship festival, major in Terai region",
    isNationalHoliday: true
  },
  {
    id: "losar",
    nameEn: "Losar (Tibetan New Year)",
    nameNp: "\u0932\u094B\u0938\u0930",
    date: { year: 0, month: 11, day: 1 },
    // Falgun 1 (varies)
    type: "festival",
    description: "Tibetan New Year celebrated by Sherpa, Tamang, Gurung communities",
    isNationalHoliday: false
  },
  {
    id: "christmas",
    nameEn: "Christmas",
    nameNp: "\u0915\u094D\u0930\u093F\u0938\u092E\u0938",
    date: { year: 0, month: 9, day: 25 },
    // Poush 25 (Dec 25)
    type: "holiday",
    description: "Christmas Day",
    isNationalHoliday: true
  },
  {
    id: "eid",
    nameEn: "Eid al-Fitr",
    nameNp: "\u0908\u0926 \u0905\u0932-\u092B\u093F\u0924\u0930",
    date: { year: 0, month: 1, day: 1 },
    // Varies by lunar calendar
    type: "holiday",
    description: "End of Ramadan",
    isNationalHoliday: true
  },
  {
    id: "eid-adha",
    nameEn: "Eid al-Adha",
    nameNp: "\u0908\u0926 \u0905\u0932-\u0905\u0927\u093E",
    date: { year: 0, month: 1, day: 1 },
    // Varies by lunar calendar
    type: "holiday",
    description: "Festival of Sacrifice",
    isNationalHoliday: true
  }
];
function getHolidaysForYear(year) {
  const holidays = [];
  for (const [key, festival] of Object.entries(FIXED_HOLIDAYS)) {
    const [month, day] = key.split("-").map(Number);
    holidays.push({
      ...festival,
      date: { ...festival.date, year }
    });
  }
  for (const festival of MAJOR_FESTIVALS) {
    holidays.push({
      ...festival,
      date: { ...festival.date, year }
    });
  }
  return holidays;
}
function getHolidaysForMonth(year, month) {
  return getHolidaysForYear(year).filter((h) => h.date.month === month);
}
function isHoliday(date) {
  const holidays = getHolidaysForYear(date.year);
  return holidays.find((h) => h.date.month === date.month && h.date.day === date.day) || null;
}
function getNationalHolidays(year) {
  return getHolidaysForYear(year).filter((h) => h.isNationalHoliday);
}

// src/festivals.ts
function getTithi(date) {
  const REF_NEW_MOON_JDN = 24515501e-1;
  const jdn = gregorianToJDN(date);
  const daysSinceRef = jdn - REF_NEW_MOON_JDN;
  const LUNAR_MONTH = 29.53059;
  let lunarDays = daysSinceRef % LUNAR_MONTH;
  if (lunarDays < 0) lunarDays += LUNAR_MONTH;
  const TITHI_DURATION = LUNAR_MONTH / 30;
  const tithiNumber = Math.floor(lunarDays / TITHI_DURATION) + 1;
  const paksha = tithiNumber <= 15 ? "shukla" : "krishna";
  const phase = paksha === "shukla" ? tithiNumber : tithiNumber - 15;
  return { tithi: tithiNumber, paksha, phase };
}
function computeLunarFestivals(year) {
  const festivals = [];
  return festivals;
}
function getDashainDates(year) {
  const dates = [];
  for (let day = 1; day <= 15; day++) {
    dates.push({ year, month: 6, day });
  }
  return dates;
}
function getTiharDates(year) {
  const dates = [];
  const daysInKartik = getNepaliDaysInMonth(year, 7);
  for (let day = daysInKartik - 2; day <= daysInKartik; day++) {
    dates.push({ year, month: 7, day });
  }
  for (let day = 1; day <= 2; day++) {
    dates.push({ year, month: 7, day });
  }
  return dates;
}
function getHoliDate(year) {
  return { year, month: 11, day: 15 };
}
function getBuddhaJayantiDate(year) {
  return { year, month: 1, day: 15 };
}
function getMahaShivaratriDate(year) {
  return { year, month: 11, day: 14 };
}
function getJanaiPurnimaDate(year) {
  return { year, month: 4, day: 15 };
}
function getGaijatraDate(year) {
  const janai = getJanaiPurnimaDate(year);
  const nextDay = janai.day + 1;
  if (nextDay > getNepaliDaysInMonth(year, 4)) {
    return { year, month: 5, day: 1 };
  }
  return { year, month: 4, day: nextDay };
}
function getKrishnaJanmashtamiDate(year) {
  return { year, month: 4, day: 23 };
}
function getTeejDate(year) {
  return { year, month: 5, day: 3 };
}
function getIndraJatraDates(year) {
  const dates = [];
  const startDay = getNepaliDaysInMonth(year, 5) - 1;
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
function getChhathDates(year) {
  return [
    { year, month: 7, day: 6 },
    { year, month: 7, day: 7 }
  ];
}
function getAllFestivalsForYear(year) {
  const festivals = [];
  const fixedHolidays = getHolidaysForYear(year);
  festivals.push(...fixedHolidays);
  const lunarFestivals = [
    {
      id: "dashain-full",
      nameEn: "Dashain (Full 15 days)",
      nameNp: "\u0926\u0936\u0948\u0902 (\u0967\u096B \u0926\u093F\u0928)",
      date: { year, month: 6, day: 1 },
      type: "festival",
      description: "Ghatasthapana to Kojagrat Purnima",
      isNationalHoliday: true
    },
    {
      id: "tihar-full",
      nameEn: "Tihar (Full 5 days)",
      nameNp: "\u0924\u093F\u0939\u093E\u0930 (\u096B \u0926\u093F\u0928)",
      date: { year, month: 7, day: 1 },
      type: "festival",
      description: "Kag Tihar to Bhai Tika",
      isNationalHoliday: true
    },
    {
      id: "holi-computed",
      nameEn: "Holi (Fagu Purnima)",
      nameNp: "\u0939\u094B\u0932\u0940 (\u092B\u093E\u0917\u0941 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E)",
      date: getHoliDate(year),
      type: "festival",
      description: "Festival of colors on Falgun full moon",
      isNationalHoliday: true
    },
    {
      id: "buddha-jayanti-computed",
      nameEn: "Buddha Jayanti",
      nameNp: "\u092C\u0941\u0926\u094D\u0927 \u091C\u092F\u0928\u094D\u0924\u0940",
      date: getBuddhaJayantiDate(year),
      type: "festival",
      description: "Buddha Purnima - Birth, enlightenment, and death of Buddha",
      isNationalHoliday: true
    },
    {
      id: "maha-shivaratri-computed",
      nameEn: "Maha Shivaratri",
      nameNp: "\u092E\u0939\u093E \u0936\u093F\u0935\u0930\u093E\u0924\u094D\u0930\u093F",
      date: getMahaShivaratriDate(year),
      type: "festival",
      description: "Great night of Shiva",
      isNationalHoliday: true
    },
    {
      id: "janai-purnima-computed",
      nameEn: "Janai Purnima",
      nameNp: "\u091C\u0928\u0947\u0907 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E",
      date: getJanaiPurnimaDate(year),
      type: "festival",
      description: "Sacred thread ceremony on Shrawan full moon",
      isNationalHoliday: false
    },
    {
      id: "raksha-bandhan-computed",
      nameEn: "Raksha Bandhan",
      nameNp: "\u0930\u0915\u094D\u0937\u093E \u092C\u0928\u094D\u0927\u0928",
      date: getJanaiPurnimaDate(year),
      // Same day as Janai Purnima
      type: "festival",
      description: "Brother-sister bond celebration",
      isNationalHoliday: false
    },
    {
      id: "gaijatra-computed",
      nameEn: "Gai Jatra",
      nameNp: "\u0917\u093E\u0908\u091C\u093E\u0924\u094D\u0930\u093E",
      date: getGaijatraDate(year),
      type: "festival",
      description: "Festival of cows, day after Janai Purnima",
      isNationalHoliday: false
    },
    {
      id: "krishna-janmashtami-computed",
      nameEn: "Krishna Janmashtami",
      nameNp: "\u0915\u0943\u0937\u094D\u0923 \u091C\u0928\u094D\u092E\u093E\u0937\u094D\u091F\u092E\u0940",
      date: getKrishnaJanmashtamiDate(year),
      type: "festival",
      description: "Birth of Lord Krishna",
      isNationalHoliday: true
    },
    {
      id: "teeja-computed",
      nameEn: "Haritalika Teej",
      nameNp: "\u0939\u0930\u093F\u0924\u093E\u0932\u093F\u0915\u093E \u0924\u0940\u091C",
      date: getTeejDate(year),
      type: "festival",
      description: "Women's fasting festival for marital bliss",
      isNationalHoliday: true
    },
    {
      id: "indra-jatra-computed",
      nameEn: "Indra Jatra",
      nameNp: "\u0907\u0928\u094D\u0926\u094D\u0930\u091C\u093E\u0924\u094D\u0930\u093E",
      date: getIndraJatraDates(year)[0],
      type: "festival",
      description: "Kathmandu's biggest street festival (8 days)",
      isNationalHoliday: false
    },
    {
      id: "chhath-computed",
      nameEn: "Chhath Puja",
      nameNp: "\u091B\u0920 \u092A\u0942\u091C\u093E",
      date: getChhathDates(year)[0],
      type: "festival",
      description: "Sun worship festival",
      isNationalHoliday: true
    }
  ];
  festivals.push(...lunarFestivals);
  return festivals;
}
function getFestivalsByMonth(year) {
  const festivals = getAllFestivalsForYear(year);
  const byMonth = /* @__PURE__ */ new Map();
  for (const festival of festivals) {
    const key = `${year}-${festival.date.month}`;
    if (!byMonth.has(key)) {
      byMonth.set(key, []);
    }
    byMonth.get(key).push(festival);
  }
  return byMonth;
}
function getFestivalById(id, year) {
  const festivals = getAllFestivalsForYear(year);
  return festivals.find((f) => f.id === id);
}
function hasFestival(date) {
  const festivals = getAllFestivalsForYear(date.year);
  return festivals.filter(
    (f) => f.date.month === date.month && f.date.day === date.day
  );
}

// src/utils.ts
var NEPALI_DIGITS = ["\u0966", "\u0967", "\u0968", "\u0969", "\u096A", "\u096B", "\u096C", "\u096D", "\u096E", "\u096F"];
function toNepaliDigits(num) {
  return String(num).replace(/[0-9]/g, (d) => NEPALI_DIGITS[parseInt(d)]);
}
function fromNepaliDigits(str) {
  const arabic = str.replace(/[०-९]/g, (d) => NEPALI_DIGITS.indexOf(d).toString());
  return parseInt(arabic, 10);
}
function formatNepaliDate(date, options = {}) {
  const { locale = "np", format = "full", showEra = false } = options;
  const monthInfo = NEPALI_MONTHS[date.month - 1];
  if (!monthInfo) return "Invalid date";
  const dayStr = locale === "np" ? toNepaliDigits(date.day) : String(date.day);
  const yearStr = locale === "np" ? toNepaliDigits(date.year) : String(date.year);
  const monthStr = locale === "np" ? monthInfo.nameNp : monthInfo.nameEn;
  if (format === "short") {
    return `${dayStr}/${date.month}/${yearStr}`;
  }
  if (format === "long") {
    return `${dayStr} ${monthStr}, ${yearStr}`;
  }
  const era = showEra ? locale === "np" ? " \u092C\u093F.\u0938\u0902." : " BS" : "";
  return `${dayStr} ${monthStr}, ${yearStr}${era}`;
}
function formatGregorianDate(date, options = {}) {
  const { locale = "en", format = "full" } = options;
  const months = locale === "np" ? NEPALI_MONTHS.map((m) => m.nameNp) : [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const monthStr = months[date.month - 1] || "Invalid";
  const dayStr = locale === "np" ? toNepaliDigits(date.day) : String(date.day);
  const yearStr = locale === "np" ? toNepaliDigits(date.year) : String(date.year);
  if (format === "short") {
    return `${date.month}/${date.day}/${yearStr}`;
  }
  if (format === "long") {
    return `${monthStr} ${dayStr}, ${yearStr}`;
  }
  return `${dayStr} ${monthStr}, ${yearStr}`;
}
function formatDualDate(gregorian, nepali, options = {}) {
  const gregStr = formatGregorianDate(gregorian, { ...options, locale: "en" });
  const nepStr = formatNepaliDate(nepali, { ...options, locale: "np" });
  return `${gregStr} | ${nepStr}`;
}
function parseNepaliDate(str) {
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
        [, yearStr, monthStr, dayStr] = match;
        const year2 = fromNepaliDigits(yearStr);
        const month2 = fromNepaliDigits(monthStr);
        const day2 = fromNepaliDigits(dayStr);
        if (month2 >= 1 && month2 <= 12 && year2 >= 2e3 && year2 <= 2099 && day2 >= 1 && day2 <= 32) {
          return { year: year2, month: month2, day: day2 };
        }
        continue;
      } else {
        [, monthStr, dayStr, yearStr] = match;
      }
      const year = fromNepaliDigits(yearStr);
      const day = fromNepaliDigits(dayStr);
      const month = NEPALI_MONTHS.findIndex(
        (m) => m.nameNp === monthStr || m.nameEn.toLowerCase() === monthStr.toLowerCase()
      ) + 1;
      if (month > 0 && year >= 2e3 && year <= 2099 && day >= 1 && day <= 32) {
        return { year, month, day };
      }
    }
  }
  return null;
}
function parseGregorianDate(str) {
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
        const months = [
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december"
        ];
        month = months.findIndex((m) => m.startsWith(monthName.toLowerCase())) + 1;
      }
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1943 && year <= 2100) {
        const maxDay = getGregorianDaysInMonth(year, month);
        if (day <= maxDay) {
          return { year, month, day };
        }
      }
    }
  }
  return null;
}
function getRelativeTime(from, to, locale = "en") {
  const fromJDN = "month" in from && from.month <= 12 && from.day <= 31 ? gregorianToJDN(from) : nepaliToJDN(from);
  const toJDN = "month" in to && to.month <= 12 && to.day <= 31 ? gregorianToJDN(to) : nepaliToJDN(to);
  const diff = toJDN - fromJDN;
  if (diff === 0) return locale === "np" ? "\u0906\u091C" : "Today";
  if (diff === 1) return locale === "np" ? "\u092D\u094B\u0932\u0940" : "Tomorrow";
  if (diff === -1) return locale === "np" ? "\u0939\u093F\u091C\u094B" : "Yesterday";
  if (diff > 0) {
    if (diff < 7) return locale === "np" ? `${toNepaliDigits(diff)} \u0926\u093F\u0928 \u092A\u091B\u093F` : `in ${diff} day${diff > 1 ? "s" : ""}`;
    if (diff < 30) {
      const weeks = Math.floor(diff / 7);
      return locale === "np" ? `${toNepaliDigits(weeks)} \u0939\u092A\u094D\u0924\u093E \u092A\u091B\u093F` : `in ${weeks} week${weeks > 1 ? "s" : ""}`;
    }
    if (diff < 365) {
      const months = Math.floor(diff / 30);
      return locale === "np" ? `${toNepaliDigits(months)} \u092E\u0939\u093F\u0928\u093E \u092A\u091B\u093F` : `in ${months} month${months > 1 ? "s" : ""}`;
    }
    const years2 = Math.floor(diff / 365);
    return locale === "np" ? `${toNepaliDigits(years2)} \u0935\u0930\u094D\u0937 \u092A\u091B\u093F` : `in ${years2} year${years2 > 1 ? "s" : ""}`;
  }
  const absDiff = Math.abs(diff);
  if (absDiff < 7) return locale === "np" ? `${toNepaliDigits(absDiff)} \u0926\u093F\u0928 \u0905\u0917\u093E\u0921\u093F` : `${absDiff} day${absDiff > 1 ? "s" : ""} ago`;
  if (absDiff < 30) {
    const weeks = Math.floor(absDiff / 7);
    return locale === "np" ? `${toNepaliDigits(weeks)} \u0939\u092A\u094D\u0924\u093E \u0905\u0917\u093E\u0921\u093F` : `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (absDiff < 365) {
    const months = Math.floor(absDiff / 30);
    return locale === "np" ? `${toNepaliDigits(months)} \u092E\u0939\u093F\u0928\u093E \u0905\u0917\u093E\u0921\u093F` : `${months} month${months > 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(absDiff / 365);
  return locale === "np" ? `${toNepaliDigits(years)} \u0935\u0930\u094D\u0937 \u0905\u0917\u093E\u0921\u093F` : `${years} year${years > 1 ? "s" : ""} ago`;
}
function getZodiacSign(date) {
  const signs = [
    { sign: "Capricorn", signNp: "\u092E\u0915\u0930", start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    { sign: "Aquarius", signNp: "\u0915\u0941\u092E\u094D\u092D", start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    { sign: "Pisces", signNp: "\u092E\u0940\u0928", start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    { sign: "Aries", signNp: "\u092E\u0947\u0937", start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    { sign: "Taurus", signNp: "\u0935\u0943\u0937", start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    { sign: "Gemini", signNp: "\u092E\u093F\u0925\u0941\u0928", start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    { sign: "Cancer", signNp: "\u0915\u0930\u094D\u0915\u091F", start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    { sign: "Leo", signNp: "\u0938\u093F\u0902\u0939", start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    { sign: "Virgo", signNp: "\u0915\u0928\u094D\u092F\u093E", start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    { sign: "Libra", signNp: "\u0924\u0941\u0932\u093E", start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    { sign: "Scorpio", signNp: "\u0935\u0943\u0936\u094D\u091A\u093F\u0915", start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
    { sign: "Sagittarius", signNp: "\u0927\u0928\u0941", start: { month: 12, day: 22 }, end: { month: 1, day: 19 } }
  ];
  for (const s of signs) {
    const start = new Date(date.year, s.start.month - 1, s.start.day);
    const end = new Date(date.year, s.end.month - 1, s.end.day);
    const check = new Date(date.year, date.month - 1, date.day);
    if (s.start.month <= s.end.month) {
      if (check >= start && check <= end) return { sign: s.sign, signNp: s.signNp };
    } else {
      if (check >= start || check <= end) return { sign: s.sign, signNp: s.signNp };
    }
  }
  return { sign: "Unknown", signNp: "\u0905\u091C\u094D\u091E\u093E\u0924" };
}
function getNepaliRashi(date) {
  const month = date.month;
  const day = date.day;
  const rashis = [
    { rashi: "Mesha", rashiNp: "\u092E\u0947\u0937", startMonth: 1, startDay: 14 },
    // Baishakh 14
    { rashi: "Brisha", rashiNp: "\u0935\u0943\u0937", startMonth: 2, startDay: 15 },
    // Jestha 15
    { rashi: "Mithuna", rashiNp: "\u092E\u093F\u0925\u0941\u0928", startMonth: 3, startDay: 15 },
    // Ashadh 15
    { rashi: "Karkat", rashiNp: "\u0915\u0930\u094D\u0915\u091F", startMonth: 4, startDay: 16 },
    // Shrawan 16
    { rashi: "Simha", rashiNp: "\u0938\u093F\u0902\u0939", startMonth: 5, startDay: 16 },
    // Bhadra 16
    { rashi: "Kanya", rashiNp: "\u0915\u0928\u094D\u092F\u093E", startMonth: 6, startDay: 17 },
    // Ashwin 17
    { rashi: "Tula", rashiNp: "\u0924\u0941\u0932\u093E", startMonth: 7, startDay: 17 },
    // Kartik 17
    { rashi: "Brishchik", rashiNp: "\u0935\u0943\u0936\u094D\u091A\u093F\u0915", startMonth: 8, startDay: 16 },
    // Mangsir 16
    { rashi: "Dhanu", rashiNp: "\u0927\u0928\u0941", startMonth: 9, startDay: 15 },
    // Poush 15
    { rashi: "Makar", rashiNp: "\u092E\u0915\u0930", startMonth: 10, startDay: 14 },
    // Magh 14
    { rashi: "Kumbha", rashiNp: "\u0915\u0941\u092E\u094D\u092D", startMonth: 11, startDay: 13 },
    // Falgun 13
    { rashi: "Meena", rashiNp: "\u092E\u0940\u0928", startMonth: 12, startDay: 13 }
    // Chaitra 13
  ];
  for (let i = rashis.length - 1; i >= 0; i--) {
    const r = rashis[i];
    if (month > r.startMonth || month === r.startMonth && day >= r.startDay) {
      return { rashi: r.rashi, rashiNp: r.rashiNp };
    }
  }
  return { rashi: rashis[11].rashi, rashiNp: rashis[11].rashiNp };
}
function normalizeNepaliDate(date) {
  const year = date.year || 2080;
  const month = Math.max(1, Math.min(12, date.month || 1));
  const maxDay = getNepaliDaysInMonth(year, month);
  const day = Math.max(1, Math.min(maxDay, date.day || 1));
  return { year, month, day };
}
function normalizeGregorianDate(date) {
  const year = date.year || (/* @__PURE__ */ new Date()).getFullYear();
  const month = Math.max(1, Math.min(12, date.month || 1));
  const maxDay = getGregorianDaysInMonth(year, month);
  const day = Math.max(1, Math.min(maxDay, date.day || 1));
  return { year, month, day };
}
function* dateRange(start, end) {
  const startJDN = gregorianToJDN(start);
  const endJDN = gregorianToJDN(end);
  for (let jdn = startJDN; jdn <= endJDN; jdn++) {
    yield jdnToGregorian(jdn);
  }
}
function* nepaliDateRange(start, end) {
  const startJDN = nepaliToJDN(start);
  const endJDN = nepaliToJDN(end);
  for (let jdn = startJDN; jdn <= endJDN; jdn++) {
    yield jdnToNepali(jdn);
  }
}

exports.FIXED_HOLIDAYS = FIXED_HOLIDAYS;
exports.GREGORIAN_MONTHS = GREGORIAN_MONTHS;
exports.MAJOR_FESTIVALS = MAJOR_FESTIVALS;
exports.NEPALI_MONTHS = NEPALI_MONTHS;
exports.WEEK_DAYS_EN = WEEK_DAYS_EN;
exports.WEEK_DAYS_EN_FULL = WEEK_DAYS_EN_FULL;
exports.WEEK_DAYS_NP = WEEK_DAYS_NP;
exports.WEEK_DAYS_NP_FULL = WEEK_DAYS_NP_FULL;
exports.addDaysToNepali = addDaysToNepali;
exports.computeLunarFestivals = computeLunarFestivals;
exports.convertDate = convertDate;
exports.dateRange = dateRange;
exports.formatDualDate = formatDualDate;
exports.formatGregorianDate = formatGregorianDate;
exports.formatNepaliDate = formatNepaliDate;
exports.fromNepaliDigits = fromNepaliDigits;
exports.generateGregorianMonthCalendar = generateGregorianMonthCalendar;
exports.generateNepaliMonthCalendar = generateNepaliMonthCalendar;
exports.getAllFestivalsForYear = getAllFestivalsForYear;
exports.getBuddhaJayantiDate = getBuddhaJayantiDate;
exports.getChhathDates = getChhathDates;
exports.getDashainDates = getDashainDates;
exports.getFestivalById = getFestivalById;
exports.getFestivalsByMonth = getFestivalsByMonth;
exports.getGaijatraDate = getGaijatraDate;
exports.getGregorianDaysInMonth = getGregorianDaysInMonth;
exports.getGregorianWeekDay = getGregorianWeekDay;
exports.getGregorianYearRangeForNepaliYear = getGregorianYearRangeForNepaliYear;
exports.getHoliDate = getHoliDate;
exports.getHolidaysForMonth = getHolidaysForMonth;
exports.getHolidaysForYear = getHolidaysForYear;
exports.getIndraJatraDates = getIndraJatraDates;
exports.getJanaiPurnimaDate = getJanaiPurnimaDate;
exports.getKrishnaJanmashtamiDate = getKrishnaJanmashtamiDate;
exports.getMahaShivaratriDate = getMahaShivaratriDate;
exports.getNationalHolidays = getNationalHolidays;
exports.getNepaliDaysInMonth = getNepaliDaysInMonth;
exports.getNepaliDaysInYear = getNepaliDaysInYear;
exports.getNepaliMonthEnd = getNepaliMonthEnd;
exports.getNepaliMonthInfo = getNepaliMonthInfo;
exports.getNepaliMonthStart = getNepaliMonthStart;
exports.getNepaliRashi = getNepaliRashi;
exports.getNepaliWeekDay = getNepaliWeekDay;
exports.getNepaliYearRangeForGregorianYear = getNepaliYearRangeForGregorianYear;
exports.getRelativeTime = getRelativeTime;
exports.getTeejDate = getTeejDate;
exports.getTiharDates = getTiharDates;
exports.getTithi = getTithi;
exports.getToday = getToday;
exports.getWeekRange = getWeekRange;
exports.getZodiacSign = getZodiacSign;
exports.gregorianToJDN = gregorianToJDN;
exports.gregorianToNepali = gregorianToNepali;
exports.hasFestival = hasFestival;
exports.isGregorianLeapYear = isGregorianLeapYear;
exports.isHoliday = isHoliday;
exports.isValidGregorianDate = isValidGregorianDate;
exports.isValidNepaliDate = isValidNepaliDate;
exports.jdnToGregorian = jdnToGregorian;
exports.jdnToNepali = jdnToNepali;
exports.nepaliDateRange = nepaliDateRange;
exports.nepaliDaysDifference = nepaliDaysDifference;
exports.nepaliToGregorian = nepaliToGregorian;
exports.nepaliToJDN = nepaliToJDN;
exports.normalizeGregorianDate = normalizeGregorianDate;
exports.normalizeNepaliDate = normalizeNepaliDate;
exports.parseGregorianDate = parseGregorianDate;
exports.parseNepaliDate = parseNepaliDate;
exports.subtractDaysFromNepali = subtractDaysFromNepali;
exports.toNepaliDigits = toNepaliDigits;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map