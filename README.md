# Nepali Calendar (@8848/nepali-calendar)

A comprehensive **Nepali Calendar (Bikram Sambat / विक्रम संवत)** library for JavaScript/TypeScript with date conversion, holidays, festivals, and calendar utilities.

## Features

- **Accurate Date Conversion**: Gregorian ⇄ Bikram Sambat (2000–2099 BS / 1943–2043 AD)
- **Calendar Generation**: Month/week views for both calendars with festival overlays
- **Holidays & Festivals**: 20+ national holidays + major festivals (Dashain, Tihar, Holi, Buddha Jayanti, etc.)
- **Lunar Calculations**: Tithi-based festival dates (Dashain 15 days, Tihar 5 days, etc.)
- **Formatting & Parsing**: Multi-locale (English/Nepali), multiple formats, ISO support
- **Utilities**: Nepali digits, relative time, zodiac (Rashi/Western), date iterators
- **TypeScript**: Full type definitions included

## Installation

```bash
pnpm add @8848/nepali-calendar
# or
npm install @8848/nepali-calendar
# or
yarn add @8848/nepali-calendar
```

## Quick Start

```typescript
import { 
  gregorianToNepali, 
  nepaliToGregorian, 
  getToday,
  formatNepaliDate,
  formatGregorianDate,
  generateNepaliMonthCalendar,
  getHolidaysForMonth,
  hasFestival
} from '@8848/nepali-calendar';

// Current date in both calendars
const today = getToday();
console.log(today.gregorian); // { year: 2024, month: 1, day: 15 }
console.log(today.nepali);    // { year: 2080, month: 10, day: 1 }

// Convert dates
const bs = gregorianToNepali({ year: 2024, month: 4, day: 13 }); // Nepali New Year
// { year: 2081, month: 1, day: 1 }

const ad = nepaliToGregorian({ year: 2081, month: 1, day: 1 });
// { year: 2024, month: 4, day: 13 }

// Format dates
formatNepaliDate({ year: 2081, month: 1, day: 1 }, { locale: 'np' });
// "१ बैशाख, २०८१"

formatGregorianDate({ year: 2024, month: 4, day: 13 }, { locale: 'np' });
// "१३ अप्रिल, २०२४"

// Generate calendar month view
const calendar = generateNepaliMonthCalendar(2081, 1); // Baishakh 2081
// Returns weeks with day objects including Gregorian dates, festivals, holidays

// Check holidays & festivals
const holidays = getHolidaysForMonth(2081, 1); // Baishakh holidays
const festivals = hasFestival({ year: 2081, month: 6, day: 1 }); // Dashain start
```

## API Overview

### Date Conversion
| Function | Description |
|----------|-------------|
| `gregorianToNepali(date)` | Gregorian → Bikram Sambat |
| `nepaliToGregorian(date)` | Bikram Sambat → Gregorian |
| `getToday()` | Current date in both calendars |

### Calendar Generation
| Function | Description |
|----------|-------------|
| `generateNepaliMonthCalendar(year, month)` | Nepali month grid with Gregorian dates |
| `generateGregorianMonthCalendar(year, month)` | Gregorian month grid with Nepali dates |
| `getWeekRange(date)` | Sunday–Saturday week range |

### Holidays & Festivals
| Function | Description |
|----------|-------------|
| `getHolidaysForYear(year)` | All holidays for a BS year |
| `getHolidaysForMonth(year, month)` | Holidays for a specific month |
| `isHoliday(date)` | Check if a date is a holiday |
| `getNationalHolidays(year)` | Only national holidays |
| `getAllFestivalsForYear(year)` | All festivals (fixed + computed) |
| `getFestivalsByMonth(year)` | Festivals grouped by month |
| `hasFestival(date)` | Festivals on a specific date |
| `getDashainDates(year)` | 15 days of Dashain |
| `getTiharDates(year)` | 5 days of Tihar |

### Formatting & Parsing
| Function | Description |
|----------|-------------|
| `formatNepaliDate(date, options)` | Format BS date (EN/NP, short/long/full) |
| `formatGregorianDate(date, options)` | Format AD date (EN/NP) |
| `formatDualDate(gregorian, nepali)` | Side-by-side display |
| `parseNepaliDate(str)` | Parse "2081-01-15", "२०८१ बैशाख १५", etc. |
| `parseGregorianDate(str)` | Parse "2024-04-13", "April 13, 2024", etc. |
| `toNepaliDigits(num)` | 123 → "१२३" |
| `fromNepaliDigits(str)` | "१२३" → 123 |

### Utilities
| Function | Description |
|----------|-------------|
| `getRelativeTime(from, to, locale)` | "3 days ago", "भोली", etc. |
| `getZodiacSign(date)` | Western zodiac (Aries, Taurus, ...) |
| `getNepaliRashi(date)` | Nepali zodiac (Mesha, Brisha, ...) |
| `normalizeNepaliDate(date)` | Clamp invalid values |
| `normalizeGregorianDate(date)` | Clamp invalid values |
| `dateRange(start, end)` | Iterator for Gregorian dates |
| `nepaliDateRange(start, end)` | Iterator for Nepali dates |

### Constants
- `NEPALI_MONTHS` — Array of 12 months with EN/NP names
- `WEEK_DAYS_EN`, `WEEK_DAYS_NP` — Short weekday names
- `WEEK_DAYS_EN_FULL`, `WEEK_DAYS_NP_FULL` — Full weekday names

## Nepali Months (Bikram Sambat)

| # | English | Nepali | Days |
|---|---------|--------|------|
| 1 | Baishakh | बैशाख | 30–31 |
| 2 | Jestha | जेठ | 31–32 |
| 3 | Ashadh | असार | 31–32 |
| 4 | Shrawan | श्रावण | 31–32 |
| 5 | Bhadra | भदौ | 31–32 |
| 6 | Ashwin | आश्विन | 30–31 |
| 7 | Kartik | कार्तिक | 30–31 |
| 8 | Mangsir | मंसिर | 30–31 |
| 9 | Poush | पुष | 30–31 |
| 10 | Magh | माघ | 30 |
| 11 | Falgun | फाल्गुन | 30 |
| 12 | Chaitra | चैत्र | 30 |

*Ashadh (month 3) has 32 days in leap years*

## Major Festivals Included

- **Dashain** (15 days) — National holiday
- **Tihar** (5 days) — National holiday  
- **Holi** (Fagu Purnima) — National holiday
- **Buddha Jayanti** — National holiday
- **Maha Shivaratri** — National holiday
- **Janai Purnima / Raksha Bandhan**
- **Gai Jatra**
- **Krishna Janmashtami** — National holiday
- **Haritalika Teej** — National holiday
- **Indra Jatra** (8 days)
- **Chhath Puja** — National holiday
- **Losar** (Tibetan New Year)
- **Maghe Sankranti**
- **Constitution Day**, **Republic Day**, **Martyrs' Day**, **Prithvi Jayanti**
- **Christmas**, **Eid al-Fitr**, **Eid al-Adha**

## Requirements

- Node.js ≥ 18
- TypeScript ≥ 5.0 (for type definitions)

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm --filter @8848/nepali-calendar build

# Test
pnpm --filter @8848/nepali-calendar test

# Type check
pnpm --filter @8848/nepali-calendar typecheck

# Dev mode (watch)
pnpm --filter @8848/nepali-calendar dev
```

## Project Structure

```
nepali-calendar/
├── packages/
│   └── calendar/          # @8848/nepali-calendar (this package)
├── apps/
│   ├── web/               # Next.js web app (coming soon)
│   └── mobile/            # Capacitor mobile app (coming soon)
├── pnpm-workspace.yaml
└── turbo.json
```

## Publishing

```bash
# Version bump (uses changesets)
pnpm changeset

# Build & publish
pnpm --filter @8848/nepali-calendar build
pnpm --filter @8848/nepali-calendar publish
```

## License

MIT © Aayur Shrestha

## Related

- **kritikka-mcp** — Repository governance MCP server (used in this monorepo)
- **8848-ui** — Design system components for Nepali apps