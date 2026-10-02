# Nepali Calendar UI — Three Design Variants

## Overview
Three distinct design directions for the Nepali Calendar web application, each targeting different user needs and contexts.

---

## Comparison Table

| Dimension | **01 Editorial Clean** | **02 Dense Utilitarian** | **03 Split Dashboard** |
|-----------|------------------------|--------------------------|------------------------|
| **Core Stance** | Content-first, calm, trustworthy | Tool-first, keyboard-centric, maximum density | Balanced, modern SaaS feel |
| **Layout** | Asymmetric 2-col, generous whitespace | Resizable 3-pane, collapsible splitter | 12-col grid (8/4), card-based |
| **Theme** | Light, airy | Dark, terminal-like | Light gradient, elevated cards |
| **Typography** | Inter + Noto Sans Devanagari | JetBrains Mono + Inter | Inter throughout |
| **Density** | Low | Very High | Medium |
| **Bilingual** | Equal visual weight, large | Compact, monospace | Equal weight, card-separated |
| **Converter** | Sidebar, always visible (both directions) | Tab-swapped, keyboard-driven | Card, tab-swapped |
| **Events** | Slide-down panel on click | Inline right panel, instant | Expandable card below calendar |
| **Festivals** | Sidebar list | Always-visible right panel | Dedicated card with badges |
| **Timezone** | Header dropdown | Header dropdown + live clocks | Dedicated card with 4 live clocks |
| **Zodiac/Rashi** | Not shown | Not shown | Dedicated card (Western + Nepali) |
| **Keyboard** | Basic | Full (arrows, T, C, S, etc.) | Basic |
| **Animations** | Subtle fade/slide | None (instant) | Staggered entrance, hover lift |
| **Responsive** | Stacks on mobile | Horizontal scroll | Stacks on mobile |
| **Print** | Excellent | Poor | Good |

---

## Feature Coverage Matrix

| Feature | 01 Editorial | 02 Dense | 03 Dashboard |
|---------|--------------|----------|--------------|
| AD ↔ BS Calendar | ✅ | ✅ | ✅ |
| Bilingual Month/Day Names | ✅ | ✅ | ✅ |
| Holiday Dots (Red) | ✅ | ✅ | ✅ |
| Festival Dots (Amber) | ✅ | ✅ | ✅ |
| Date Converter (AD→BS) | ✅ | ✅ | ✅ |
| Date Converter (BS→AD) | ✅ | ✅ | ✅ |
| Timezone Selector | ✅ | ✅ | ✅ |
| Live Timezone Clocks | ❌ | ❌ | ✅ |
| Click Date → Events | ✅ | ✅ | ✅ |
| Upcoming Festivals List | ✅ | ✅ | ✅ |
| Month Stats (days, festivals) | ❌ | ✅ | ✅ |
| Zodiac (Western) | ❌ | ❌ | ✅ |
| Rashi (Nepali) | ❌ | ❌ | ✅ |
| Keyboard Navigation | Basic | Full | Basic |
| Compact/Dense Toggle | ❌ | ✅ | ❌ |
| Drag-Resize Panel | ❌ | ✅ | ❌ |
| Quick Actions (Export, Print) | ✅ | ❌ | ❌ |

---

## My Recommendation

### For a Consumer Product → **Variant 03 (Split Dashboard)**
- Feels like a polished, modern app
- Best feature discovery for casual users
- Mobile-responsive out of the box
- Stakeholder-demo ready
- Good balance of density and breathing room

### For a Developer/Power-User Tool → **Variant 02 (Dense Utilitarian)**
- Unbeatable speed and keyboard flow
- Maximum context always visible
- Terminal aesthetic appeals to technical users
- Timezone awareness built-in

### For Content/Education/Diaspora → **Variant 01 (Editorial Clean)**
- Best bilingual readability
- Print-friendly for physical calendars
- Least intimidating for non-technical users
- Strong visual hierarchy for understanding

---

## Suggested Hybrid (Production Direction)

Take **Variant 03 as the base** and incorporate:

1. **From 02**: Keyboard shortcuts (T=Today, ←/→=Month, S=Swap converter), compact mode toggle
2. **From 01**: Larger bilingual date display, print/export actions, slightly more whitespace option
3. **From 03**: Card-based layout, live timezone clocks, zodiac/rashi, stats cards

### Implementation Priority
1. Core calendar + converter (using `@8848/nepali-calendar` package)
2. Festival/holiday data integration
3. Timezone support (Intl.DateTimeFormat)
4. Keyboard shortcuts
5. Responsive breakpoint refinements
6. Animations & polish
7. PWA / offline support

---

## Files Created

```
sketches/
├── 001-editorial-clean/
│   ├── index.html    (29KB - full interactive mockup)
│   └── README.md
├── 002-dense-utilitarian/
│   ├── index.html    (23KB - dark, keyboard-driven)
│   └── README.md
├── 003-split-dashboard/
│   ├── index.html    (36KB - card-based dashboard)
│   └── README.md
└── COMPARISON.md     (this file)
```

## How to View

```bash
# macOS
open sketches/001-editorial-clean/index.html
open sketches/002-dense-utilitarian/index.html
open sketches/003-split-dashboard/index.html

# Linux
xdg-open sketches/001-editorial-clean/index.html

# Windows
start sketches/001-editorial-clean/index.html
```

Each variant is a **single self-contained HTML file** with:
- Inline CSS (Tailwind via CDN)
- Inline JavaScript (no build step)
- Realistic Nepali calendar data (approximate conversions)
- Working interactions (click dates, convert, navigate months, switch converter direction)
- Live timezone clocks (Variant 03)

---

## Next Steps

1. **Pick a direction** (or hybrid)
2. **Build production components** in `apps/web` using the `@8848/nepali-calendar` package for accurate conversions
3. **Add proper festival calculation** (lunar/tithi-based via the package)
4. **Implement i18n** for full Nepali/English support
5. **Add tests** for the UI components