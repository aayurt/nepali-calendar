## Variant: Split Dashboard

### Design Stance
Balanced, modern dashboard — card-based layout with clear visual separation of concerns. Designed for users who want an overview at a glance but can drill down. Feels like a modern SaaS product.

### Key Choices
- **Layout**: 12-col grid (8/4 split), card-based components with elevation, staggered entrance animations
- **Typography**: Inter throughout, consistent scale; Nepali text gets equal visual weight
- **Color**: Light gradient background, card elevation, sky/amber/green/purple/indigo semantic accents per card
- **Interaction**: Tab-swapped converter, click-to-expand events card, live timezone clocks, zodiac/rashi cards, stats summary

### Trade-offs
- **Strong at**: Visual polish, feature discovery, balanced density, responsive (stacks on mobile), delightful animations
- **Weak at**: Extreme density (not for power users), more clicks for some actions, heavier JS

### Best For
Product teams building a consumer app, users who want a "finished" feeling UI, mobile-first contexts, stakeholder demos.