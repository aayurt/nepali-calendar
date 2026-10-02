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

type Language = "en" | "np";

// ===== Components =====

const CalendarDay: React.FC<{
  day: CalendarDayData;
  onClick: (day: CalendarDayData) => void;
  showEnglishDate: boolean;
  language: Language;
  compact?: boolean;
}> = ({ day, onClick, showEnglishDate, language, compact }) => {
  if (!day.isCurrentMonth) {
    return (
      <button
        className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition disabled:opacity-50 border-r border-b border-slate-100 ${
          compact ? "text-sm" : "text-base"
        }`}
        disabled
      >
        <span className="font-medium">{day.nepaliDay}</span>
      </button>
    );
  }

  const isToday = day.isToday;
  const hasEvents = day.events.length > 0;
  const hasMultipleEvents = day.hasMultipleEvents;
  const eventCount = day.eventCount;

  // Check if it's a government holiday (national holiday)
  const isGovHoliday = day.events.some(
    (e) => e.type === "holiday" && e.isNationalHoliday,
  );

  // Get primary event name for display (holiday > festival > observance > custom)
  const primaryEvent = day.events.find((e) => e.type === "holiday" && e.isNationalHoliday) ||
    day.events.find((e) => e.type === "festival") ||
    day.events.find((e) => e.type === "observance") ||
    day.events.find((e) => e.type === "custom") ||
    day.events[0];

  // Check if it's the first day of the month
  const isFirstDayOfMonth = day.nepaliDay === 1;

  return (
    <button
      onClick={() => onClick(day)}
      className={`relative w-full aspect-square rounded-none flex flex-col items-center justify-between p-1.5 transition-all border-r border-b border-slate-100 ${
        isToday
          ? "bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25"
          : isGovHoliday
            ? "bg-red-50 hover:bg-red-100 text-slate-900"
            : "hover:bg-sky-50 text-slate-900"
      } ${compact ? "text-sm" : ""}`}
      style={{ borderRadius: 0 }}
    >
      {/* Top Center: Event Name (like पञ्चमी श्राद्ध) */}
      {primaryEvent && (
        <div className="w-full text-center mb-0.5">
          <span
            className={`inline-block px-1.5 py-0.5 text-[9px] font-medium rounded ${
              primaryEvent.type === "holiday"
                ? isToday
                  ? "bg-white text-sky-600"
                  : "bg-red-100 text-red-700"
                : primaryEvent.type === "festival"
                ? isToday
                  ? "bg-white text-sky-600"
                  : "bg-amber-100 text-amber-700"
                : isToday
                  ? "bg-white text-sky-600"
                  : "bg-sky-100 text-sky-700"
            }`}
          >
            {language === "np" ? primaryEvent.titleNp : primaryEvent.title}
          </span>
        </div>
      )}

      {/* Middle: Day Number */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <span
          className={`font-bold text-2xl ${isToday ? "text-white" : "text-slate-900"}`}
        >
          {language === "np" ? toNepaliDigits(day.nepaliDay) : day.nepaliDay}
        </span>
        {isFirstDayOfMonth && (
          <span
            className={`text-[8px] font-medium ${isToday ? "text-sky-100" : "text-sky-600"}`}
          >
            {AD_MONTHS_SHORT[day.gregorianDate.month - 1]}
          </span>
        )}
      </div>

      {/* Bottom Row: Panchang Left | Date Right */}
      <div className="w-full flex items-end justify-between px-0.5">
        {/* Bottom Left: Panchang (नक्षत्र, योग, करण) */}
        {day.panchang && !compact && (
          <div className="text-left text-[7px] devanagari-font text-slate-500">
            {day.panchang.nakshatra && (
              <span className="line-clamp-1">नक्षत्र: {day.panchang.nakshatra.nameNp}</span>
            )}
            {day.panchang.yoga && (
              <span className="line-clamp-1">योग: {day.panchang.yoga.nameNp}</span>
            )}
            {day.panchang.karana && (
              <span className="line-clamp-1">करण: {day.panchang.karana.nameNp}</span>
            )}
          </div>
        )}

        {/* Bottom Right: Date (AD) - First day shows month like "Oct" else just number */}
        {showEnglishDate && (
          <div className="text-right text-[8px] font-mono text-slate-400">
            {isFirstDayOfMonth ? (
              <>
                {AD_MONTHS_SHORT[day.gregorianDate.month - 1]} {day.gregorianDate.day}
              </>
            ) : (
              <>{day.gregorianDate.day}</>
            )}
          </div>
        )}

        {/* Event dots at bottom center */}
        {hasEvents && (
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
            {day.events.slice(0, 3).map((event, i) => (
              <span
                key={event.id}
                className={`w-1.5 h-1.5 rounded-full ${
                  event.type === "holiday"
                    ? isToday
                      ? "bg-white"
                      : "bg-red-500"
                    : event.type === "festival"
                    ? isToday
                      ? "bg-white"
                      : "bg-amber-500"
                    : isToday
                      ? "bg-white"
                      : "bg-sky-500"
                }`}
                title={event.title}
              />
            ))}
            {day.events.length > 3 && (
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" title="More events" />
            )}
          </div>
        )}
      </div>
    </button>
  );
};

// Get primary event for a day (priority: holiday > festival > observance > custom)
function getPrimaryEvent(day: CalendarDayData) {
  return day.events.find((e) => e.type === "holiday" && e.isNationalHoliday) ||
    day.events.find((e) => e.type === "festival") ||
    day.events.find((e) => e.type === "observance") ||
    day.events.find((e) => e.type === "custom") ||
    day.events[0];
}

export default CalendarDay;