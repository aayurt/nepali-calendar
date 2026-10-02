"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  type NepaliDate,
  type GregorianDate,
  type CalendarDayData,
  type MonthCalendarData,
  type CalendarEvent,
  type Timezone,
  type TithiInfo,
} from "@/types";
import {
  generateMonthCalendar,
  getToday,
  getUpcomingFestivals,
  getZodiacInfo,
  getTimezoneTimes,
  toNepaliDigits,
  gregorianToNepali,
  nepaliToGregorian,
  NEPALI_MONTHS,
  AD_MONTHS,
  AD_MONTHS_SHORT,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  WEEKDAYS_NP,
  WEEKDAYS_NP_SHORT,
  calculatePanchang,
  getNepalSambat,
  getMonthDetails,
  getRashiInfo,
} from "@/lib/calendar";
import CalendarDay from "./CalendarDay";

type Language = "en" | "np";



// ===== Main Calendar Component =====

const EventModal: React.FC<{
  day: CalendarDayData | null;
  onClose: () => void;
  onAddEvent: (date: NepaliDate | GregorianDate) => void;
  nepaliYear: number;
  nepaliMonth: number;
}> = ({ day, onClose, onAddEvent, nepaliYear, nepaliMonth }) => {
  if (!day) return null;

  const monthInfo = NEPALI_MONTHS[nepaliMonth - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-slide-up">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                <span className="devanagari-font">
                  {toNepaliDigits(day.nepaliDay)} {monthInfo.nameNp}{" "}
                  {toNepaliDigits(nepaliYear)}
                </span>
              </h3>
              <p className="text-sm text-slate-500">
                {day.gregorianDate.day} {AD_MONTHS[day.gregorianDate.month - 1]}{" "}
                {day.gregorianDate.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {day.tithi && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-700 font-medium uppercase tracking-wider">
                Tithi
              </p>
              <p className="font-medium text-amber-900 devanagari-font">
                {day.tithi.nameNp}
              </p>
              <p className="text-xs text-amber-600">
                {day.tithi.name} ({day.tithi.paksha} paksha)
              </p>
            </div>
          )}

          {day.panchang && (
            <div className="space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Panchang
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Nakshatra</p>
                  <p className="font-medium devanagari-font">
                    {day.panchang.nakshatra?.nameNp}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Ends: {day.panchang.nakshatra?.endsAt}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Yoga</p>
                  <p className="font-medium devanagari-font">
                    {day.panchang.yoga?.nameNp}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Ends: {day.panchang.yoga?.endsAt}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Karana</p>
                  <p className="font-medium devanagari-font">
                    {day.panchang.karana?.nameNp}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Ends: {day.panchang.karana?.endsAt}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Rahu Kaal</p>
                  <p className="font-medium text-red-600">
                    {day.panchang.rahuKaal?.start} -{" "}
                    {day.panchang.rahuKaal?.end}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-2 border-t border-slate-200">
                <div>
                  <p className="text-slate-400">Sunrise / Sunset</p>
                  <p className="font-medium">
                    {day.panchang.sunrise} / {day.panchang.sunset}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Moonrise / Moonset</p>
                  <p className="font-medium">
                    {day.panchang.moonrise} / {day.panchang.moonset}
                  </p>
                </div>
              </div>
            </div>
          )}

          {day.events.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                Events ({day.events.length})
              </h4>
              {day.events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl hover:bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <span className={`badge badge-${event.type}`}>
                      {event.type}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {event.title}
                      </p>
                      <p className="text-sm text-slate-500 devanagari-font">
                        {event.titleNp}
                      </p>
                      {event.description && (
                        <p className="text-xs text-slate-400 mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400">
              <p className="mb-3">No events scheduled</p>
              <button
                onClick={() => {
                  onAddEvent({
                    year: nepaliYear,
                    month: nepaliMonth,
                    day: day.nepaliDay,
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl font-medium text-sm hover:bg-sky-700"
              >
                + Add Event
              </button>
            </div>
          )}

          {day.events.length > 0 && (
            <button
              onClick={() => {
                onAddEvent({
                  year: nepaliYear,
                  month: nepaliMonth,
                  day: day.nepaliDay,
                });
                onClose();
              }}
              className="w-full px-4 py-2 border border-sky-300 text-sky-600 rounded-xl font-medium hover:bg-sky-50 transition"
            >
              + Add Another Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AddEventModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  initialDate?: NepaliDate | GregorianDate;
}> = ({ isOpen, onClose, onSave, initialDate }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [titleNp, setTitleNp] = useState("");
  const [type, setType] = useState<
    "holiday" | "festival" | "observance" | "custom"
  >("custom");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full animate-slide-up">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Add Event</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title (English)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="e.g., Family Gathering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title (नेपाली)
            </label>
            <input
              type="text"
              value={titleNp}
              onChange={(e) => setTitleNp(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent devanagari-font"
              placeholder="उदाहरण: पारिवारिक सभा"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="custom">Custom Event</option>
              <option value="festival">Festival</option>
              <option value="holiday">Holiday</option>
              <option value="observance">Observance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (title && initialDate) {
                  onSave({
                    title,
                    titleNp: titleNp || title,
                    date: initialDate,
                    type,
                    description: description || undefined,
                  });
                  onClose();
                }
              }}
              disabled={!title}
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 disabled:opacity-50"
            >
              Save Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConverterCard: React.FC = () => {
  const [mode, setMode] = useState<"ad2bs" | "bs2ad">("ad2bs");
  const [adDate, setAdDate] = useState<GregorianDate>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  const [bsDate, setBsDate] = useState<NepaliDate>({
    year: 2080,
    month: 9,
    day: 1,
  });
  const [result, setResult] = useState<string>("");

  const handleConvert = () => {
    if (mode === "ad2bs") {
      const bs = gregorianToNepali(adDate);
      const monthInfo = NEPALI_MONTHS[bs.month - 1];
      setResult(
        `${toNepaliDigits(bs.day)} ${monthInfo.nameNp}, ${toNepaliDigits(bs.year)}  •  ${monthInfo.nameEn} ${bs.day}, ${bs.year}`,
      );
    } else {
      const ad = nepaliToGregorian(bsDate);
      const dow = WEEKDAYS[new Date(ad.year, ad.month - 1, ad.day).getDay()];
      setResult(
        `${dow}, ${AD_MONTHS[ad.month - 1]} ${ad.day}, ${ad.year}  •  ${WEEKDAYS_NP[new Date(ad.year, ad.month - 1, ad.day).getDay()]}, ${AD_MONTHS[ad.month - 1]} ${toNepaliDigits(ad.day)}, ${toNepaliDigits(ad.year)}`,
      );
    }
  };

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
            🔄
          </span>
          Date Converter
        </h3>
        <button
          onClick={() => setMode((m) => (m === "ad2bs" ? "bs2ad" : "ad2bs"))}
          className="px-3 py-1 text-xs bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 font-medium"
        >
          ⇄ {mode === "ad2bs" ? "BS → AD" : "AD → BS"}
        </button>
      </div>

      {mode === "ad2bs" ? (
        <div className="space-y-3">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Gregorian (AD)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={adDate.year}
              onChange={(e) =>
                setAdDate((d) => ({ ...d, year: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            >
              {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={adDate.month}
              onChange={(e) =>
                setAdDate((d) => ({ ...d, month: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            >
              {AD_MONTHS_SHORT.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={adDate.day}
              onChange={(e) =>
                setAdDate((d) => ({ ...d, day: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Bikram Sambat (BS)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={bsDate.year}
              onChange={(e) =>
                setBsDate((d) => ({ ...d, year: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            >
              {Array.from({ length: 101 }, (_, i) => 2000 + i).map((y) => (
                <option key={y} value={y}>
                  {toNepaliDigits(y)} ({y})
                </option>
              ))}
            </select>
            <select
              value={bsDate.month}
              onChange={(e) =>
                setBsDate((d) => ({ ...d, month: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            >
              {NEPALI_MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m.nameNp} ({m.nameEn})
                </option>
              ))}
            </select>
            <select
              value={bsDate.day}
              onChange={(e) =>
                setBsDate((d) => ({ ...d, day: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500"
            >
              {Array.from({ length: 32 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {toNepaliDigits(d)} ({d})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button
        onClick={handleConvert}
        className="w-full py-2.5 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 mt-4"
      >
        Convert
      </button>

      {result && (
        <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-100">
          <p className="text-xs text-sky-700 font-medium mb-1">Result</p>
          <p className="font-medium text-sky-900 text-sm">{result}</p>
        </div>
      )}
    </div>
  );
};

const TimezoneCard: React.FC<{ timezone: Timezone }> = ({ timezone }) => {
  const times = getTimezoneTimes(timezone);

  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
          🌍
        </span>
        World Clocks
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(times).map(([city, time]) => (
          <div key={city} className="p-3 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {city}
            </p>
            <p className="font-mono text-lg text-sky-600">{time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ZodiacCard: React.FC<{
  gregorian: GregorianDate;
  nepali: NepaliDate;
}> = ({ gregorian, nepali }) => {
  const zodiac = getZodiacInfo(gregorian, nepali);
  const rashi = getRashiInfo(nepali.month, nepali.day);

  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          ♈
        </span>
        Zodiac / Rashi
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
          <div>
            <p className="text-xs text-indigo-600 uppercase tracking-wider mb-1">
              Western
            </p>
            <p className="font-bold text-slate-900">{zodiac.western.sign}</p>
            <p className="text-xs text-slate-500 devanagari-font">
              {zodiac.western.signNp}
            </p>
          </div>
          <div>
            <p className="text-xs text-indigo-600 uppercase tracking-wider mb-1">
              Nepali (Rashi)
            </p>
            <p className="font-bold text-slate-900 devanagari-font">
              {rashi.np}
            </p>
            <p className="text-xs text-slate-500">{rashi.en}</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            Today's Rashi Details
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400">Ruling Planet</p>
              <p className="font-medium">{getRulingPlanet(rashi.en)}</p>
            </div>
            <div>
              <p className="text-slate-400">Element</p>
              <p className="font-medium">{getElement(rashi.en)}</p>
            </div>
            <div>
              <p className="text-slate-400">Lucky Color</p>
              <p className="font-medium">{getLuckyColor(rashi.en)}</p>
            </div>
            <div>
              <p className="text-slate-400">Lucky Number</p>
              <p className="font-medium">{getLuckyNumber(rashi.en)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getRulingPlanet(rashi: string): string {
  const planets: Record<string, string> = {
    Mesha: "Mars (मङ्गल)",
    Brisha: "Venus (शुक्र)",
    Mithuna: "Mercury (बुध)",
    Karkat: "Moon (चन्द्र)",
    Simha: "Sun (सूर्य)",
    Kanya: "Mercury (बुध)",
    Tula: "Venus (शुक्र)",
    Brishchik: "Mars (मङ्गल)",
    Dhanu: "Jupiter (बृहस्पति)",
    Makar: "Saturn (शनि)",
    Kumbha: "Saturn (शनि)",
    Meena: "Jupiter (बृहस्पति)",
  };
  return planets[rashi] || "—";
}

function getElement(rashi: string): string {
  const elements: Record<string, string> = {
    Mesha: "Fire (अग्नि)",
    Brisha: "Earth (पृथ्वी)",
    Mithuna: "Air (वायु)",
    Karkat: "Water (जल)",
    Simha: "Fire (अग्नि)",
    Kanya: "Earth (पृथ्वी)",
    Tula: "Air (वायु)",
    Brishchik: "Water (जल)",
    Dhanu: "Fire (अग्नि)",
    Makar: "Earth (पृथ्वी)",
    Kumbha: "Air (वायु)",
    Meena: "Water (जल)",
  };
  return elements[rashi] || "—";
}

function getLuckyColor(rashi: string): string {
  const colors: Record<string, string> = {
    Mesha: "Red (रातो)",
    Brisha: "Pink (गुलाबी)",
    Mithuna: "Green (हरीयो)",
    Karkat: "White (सेतो)",
    Simha: "Gold (सुनौलो)",
    Kanya: "Brown (खैरे)",
    Tula: "Blue (निलो)",
    Brishchik: "Maroon (भुइँकट्टे)",
    Dhanu: "Purple (बैजनी)",
    Makar: "Black (कालो)",
    Kumbha: "Sky Blue (आकाशी)",
    Meena: "Sea Green (समुद्री हरीयो)",
  };
  return colors[rashi] || "—";
}

function getLuckyNumber(rashi: string): string {
  const numbers: Record<string, string> = {
    Mesha: "9",
    Brisha: "6",
    Mithuna: "5",
    Karkat: "2",
    Simha: "1",
    Kanya: "5",
    Tula: "6",
    Brishchik: "9",
    Dhanu: "3",
    Makar: "8",
    Kumbha: "4",
    Meena: "3",
  };
  return numbers[rashi] || "—";
}

const UpcomingFestivalsCard: React.FC = () => {
  const festivals = getUpcomingFestivals(8);

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600">
            🎉
          </span>
          Upcoming Festivals
        </h3>
        <span className="text-xs text-slate-400">
          {festivals.length} events
        </span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {festivals.map((fest, i) => (
          <div
            key={`${fest.id}-${i}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50"
          >
            <span
              className={`w-2 h-2 rounded-full ${fest.type === "holiday" ? "bg-red-500" : "bg-amber-500"}`}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">
                {fest.title}
              </p>
              <p className="text-sm text-slate-500 devanagari-font truncate">
                {fest.titleNp}
              </p>
            </div>
            <span className={`badge badge-${fest.type} text-xs`}>
              {fest.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ calendar: MonthCalendarData; bsMonth: number }> = ({
  calendar,
  bsMonth,
}) => {
  const today = getToday();
  const currentMonthDays = calendar.weeks
    .flat()
    .filter((d) => d.isCurrentMonth);
  const daysInMonth = currentMonthDays.length;
  const daysLeft = currentMonthDays.filter(
    (d) => d.nepaliDay > today.nepali.day && bsMonth === today.nepali.month,
  ).length;

  let festCount = 0,
    holCount = 0;
  currentMonthDays.forEach((d) => {
    if (d.events.some((e) => e.type === "festival")) festCount++;
    if (d.events.some((e) => e.type === "holiday")) holCount++;
  });

  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
          📊
        </span>
        This Month
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-50">
          <p className="text-2xl font-bold text-slate-900">{daysInMonth}</p>
          <p className="text-xs text-slate-500">Days in Month</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50">
          <p className="text-2xl font-bold text-sky-600">{daysLeft}</p>
          <p className="text-xs text-slate-500">Days Remaining</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50">
          <p className="text-2xl font-bold text-amber-600">{festCount}</p>
          <p className="text-xs text-slate-500">Festivals</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50">
          <p className="text-2xl font-bold text-red-600">{holCount}</p>
          <p className="text-xs text-slate-500">Holidays</p>
        </div>
      </div>
    </div>
  );
};

// ===== Main Calendar Component =====

export const NepaliCalendar: React.FC = () => {
  const [bsYear, setBsYear] = useState(() => getToday().nepali.year);
  const [bsMonth, setBsMonth] = useState(() => getToday().nepali.month);
  const [timezone, setTimezone] = useState<Timezone>("Asia/Kathmandu");
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [addEventDate, setAddEventDate] = useState<
    NepaliDate | GregorianDate | undefined
  >(undefined);
  const [showEnglishDate, setShowEnglishDate] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState<Language>("np");

  const calendar = useMemo(
    () => generateMonthCalendar(bsYear, bsMonth, timezone),
    [bsYear, bsMonth, timezone],
  );

  const today = getToday(timezone);
  const zodiac = getZodiacInfo(today.gregorian, today.nepali);
  const todayPanchang = calculatePanchang(today.gregorian, today.nepali);
  const nepalSambat = getNepalSambat(bsYear);
  const monthDetails = getMonthDetails(bsYear, bsMonth);
  const rashiInfo = getRashiInfo(bsMonth, today.nepali.day);

  const goToToday = () => {
    const t = getToday(timezone);
    setBsYear(t.nepali.year);
    setBsMonth(t.nepali.month);
  };

  const prevMonth = () => {
    setBsMonth((m) => (m === 1 ? (setBsYear((y) => y - 1), 12) : m - 1));
  };
  const nextMonth = () => {
    setBsMonth((m) => (m === 12 ? (setBsYear((y) => y + 1), 1) : m + 1));
  };

  const handleDayClick = (day: CalendarDayData) => {
    setSelectedDay(day);
  };

  const handleAddEvent = (date: NepaliDate | GregorianDate) => {
    setAddEventDate(date);
    setShowAddEvent(true);
  };

  const handleSaveEvent = (event: Omit<CalendarEvent, "id">) => {
    console.log("Save event:", event);
    // In production: save to localStorage / backend
    alert(
      `Event "${event.title}" saved for ${event.date.year}-${event.date.month}-${event.date.day}`,
    );
  };

  // Event banner logic
  const getCurrentMonthEvents = () => {
    const currentMonthDays = calendar.weeks
      .flat()
      .filter((d) => d.isCurrentMonth);
    const events: CalendarEvent[] = [];
    currentMonthDays.forEach((d) => {
      d.events.forEach((e) => {
        if (!events.some((existing) => existing.id === e.id)) {
          events.push(e);
        }
      });
    });
    return events;
  };

  const getEventName = (event: CalendarEvent) => {
    return language === "np" ? event.titleNp : event.title;
  };

  const currentMonthEvents = getCurrentMonthEvents();
  const govHolidays = currentMonthEvents.filter(
    (e) => e.type === "holiday" && e.isNationalHoliday,
  );
  const festivals = currentMonthEvents.filter((e) => e.type === "festival");
  const displayEvents = govHolidays.length > 0 ? govHolidays : festivals;
  const showEventBanner = displayEvents.length > 0;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap");
        .devanagari-font {
          font-family: "Noto Sans Devanagari", "Inter", sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Nepali Calendar
              </h1>
              <p className="text-slate-500 text-sm devanagari-font">
                विक्रम संवत {toNepaliDigits(bsYear)} • Bikram Sambat
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value as Timezone)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-sky-500 appearance-none"
            >
              <option value="Asia/Kathmandu">🇳🇵 Kathmandu (UTC+5:45)</option>
              <option value="UTC">🌍 UTC</option>
              <option value="America/New_York">🇺🇸 New York (UTC-5)</option>
              <option value="Europe/London">🇬🇧 London (UTC+0)</option>
              <option value="Asia/Dubai">🇦🇪 Dubai (UTC+4)</option>
              <option value="Asia/Singapore">🇸🇬 Singapore (UTC+8)</option>
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-sky-500 appearance-none"
            >
              <option value="np">नेपाली (Nepali)</option>
              <option value="en">English</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">
              <input
                type="checkbox"
                checked={showEnglishDate}
                onChange={(e) => setShowEnglishDate(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-slate-700">Show AD dates</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border border-slate-200 rounded-xl text-sm hover:bg-slate-50">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-slate-700">Compact</span>
            </label>
            <button
              onClick={goToToday}
              className="px-5 py-2 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 shadow-sm hover:shadow-md transition"
            >
              Today
            </button>
          </div>
        </div>
      </header>

      {/* Current Month Event Banner */}
      {showEventBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl animate-fade-in">
            <span className="text-lg">📅</span>
            <span className="font-medium text-amber-900">
              {displayEvents.map((e) => getEventName(e)).join(", ")}
            </span>
            <span className="ml-auto text-xs text-amber-700">
              {displayEvents.length} event{displayEvents.length > 1 ? "s" : ""}{" "}
              this month
            </span>
          </div>
        </div>
      )}

      {/* Dual Date Display with Panchang */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-100">
            <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-2">
              Gregorian (AD)
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {
                WEEKDAYS[
                  new Date(
                    today.gregorian.year,
                    today.gregorian.month - 1,
                    today.gregorian.day,
                  ).getDay()
                ]
              }
              ,{AD_MONTHS[today.gregorian.month - 1]} {today.gregorian.day},{" "}
              {today.gregorian.year}
            </p>
            <p className="text-sm text-sky-700 devanagari-font mt-1">
              {
                WEEKDAYS_NP[
                  new Date(
                    today.gregorian.year,
                    today.gregorian.month - 1,
                    today.gregorian.day,
                  ).getDay()
                ]
              }
              ,{AD_MONTHS[today.gregorian.month - 1]}{" "}
              {toNepaliDigits(today.gregorian.day)},{" "}
              {toNepaliDigits(today.gregorian.year)}
            </p>
          </div>
          <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
              Bikram Sambat (BS)
            </p>
            <p className="text-2xl font-bold text-amber-900 devanagari-font">
              {
                WEEKDAYS_NP[
                  new Date(
                    today.gregorian.year,
                    today.gregorian.month - 1,
                    today.gregorian.day,
                  ).getDay()
                ]
              }
              ,{toNepaliDigits(today.nepali.day)}{" "}
              {NEPALI_MONTHS[today.nepali.month - 1].nameNp}{" "}
              {toNepaliDigits(today.nepali.year)}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {
                WEEKDAYS[
                  new Date(
                    today.gregorian.year,
                    today.gregorian.month - 1,
                    today.gregorian.day,
                  ).getDay()
                ]
              }
              ,{NEPALI_MONTHS[today.nepali.month - 1].nameEn} {today.nepali.day}
              , {today.nepali.year}
            </p>
          </div>
          <div className="card p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
              Panchang / Nepal Sambat
            </p>
            <div className="space-y-1 text-sm">
              <p className="devanagari-font font-medium">
                नेपाल संवत् {toNepaliDigits(nepalSambat)}
              </p>
              <p className="devanagari-font">{todayPanchang.tithi.nameNp}</p>
              <p className="text-xs text-slate-500">
                नक्षत्र: {todayPanchang.nakshatra.nameNp} • योग:{" "}
                {todayPanchang.yoga.nameNp}
              </p>
              <p className="text-xs text-slate-500">
                करण: {todayPanchang.karana.nameNp} • राहु:{" "}
                {todayPanchang.rahuKaal.start}–{todayPanchang.rahuKaal.end}
              </p>
              <p className="text-xs text-slate-500">
                सूर्योदय: {todayPanchang.sunrise} • सूर्यास्त:{" "}
                {todayPanchang.sunset}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Calendar */}
          <section className="lg:col-span-8 space-y-6">
            {/* Month Header with Rashi and Month Info */}
            <div className="card p-4 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
                aria-label="Previous month"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex-1 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                  {NEPALI_MONTHS[bsMonth - 1].nameEn} {bsYear}
                </h2>
                <p className="text-sm text-slate-500 devanagari-font">
                  {NEPALI_MONTHS[bsMonth - 1].nameNp} {toNepaliDigits(bsYear)}
                </p>
                <div className="flex items-center justify-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="devanagari-font">राशि: {rashiInfo.np}</span>
                  <span>{monthDetails.days} days</span>
                  <span>Nepal Sambat {toNepaliDigits(nepalSambat)}</span>
                </div>
              </div>
              <button
                onClick={nextMonth}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
                aria-label="Next month"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Week Headers */}
            <div className="grid grid-cols-7 bg-slate-50 rounded-xl p-2 mb-2">
              {WEEKDAYS_SHORT.map((d, i) => (
                <div
                  key={i}
                  className="py-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {i === 6 ? (
                    <span className="devanagari-font">
                      {WEEKDAYS_NP_SHORT[i]}
                    </span>
                  ) : (
                    d
                  )}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="card overflow-hidden">
              <div className="grid grid-cols-7 gap-1 p-2 min-h-[420px]">
                {calendar.weeks.flatMap((week, wi) =>
                  week.map((day, di) => (
                    <CalendarDay
                      key={`${wi}-${di}`}
                      day={day}
                      onClick={handleDayClick}
                      showEnglishDate={showEnglishDate}
                      language={language}
                      compact={compactMode}
                    />
                  )),
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 p-2">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>{" "}
                Holiday
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300"></span>{" "}
                Govt Holiday
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>{" "}
                Festival
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-sky-500"></span>{" "}
                Observance
              </span>
              <span className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  2+
                </span>{" "}
                Multiple
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <span className="w-3 h-3 rounded-full border border-sky-500"></span>{" "}
                Tithi
              </span>
            </div>
          </section>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <ConverterCard />
            <TimezoneCard timezone={timezone} />
            <ZodiacCard gregorian={today.gregorian} nepali={today.nepali} />
            <UpcomingFestivalsCard />
            <StatsCard calendar={calendar} bsMonth={bsMonth} />
          </aside>
        </div>
      </div>

      {/* Modals */}
      <EventModal
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
        onAddEvent={handleAddEvent}
        nepaliYear={bsYear}
        nepaliMonth={bsMonth}
      />
      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => {
          setShowAddEvent(false);
          setAddEventDate(undefined);
        }}
        onSave={handleSaveEvent}
        initialDate={addEventDate}
      />
    </div>
  );
};

export default NepaliCalendar;
