# 🏛️ Maha Seva Dal (MSD) — Stage 03: Visual Redesign Direction

**Project**: Maha Seva Dal (MSD) Web Platform  
**Strategy Reference**: `outputs/02_msd_ux_improvement_strategy.md`  
**Output Path**: `outputs/03_msd_visual_redesign_direction.md`

---

## # Visual Design Philosophy

Maha Seva Dal employs a **Warm Editorial Design System** inspired by classical journalism, archival documentation, and human-centered non-profit design. The visual identity avoids cold corporate blues or overly harsh dark mode containers, utilizing soft organic cream surfaces (`#faf9f5` canvas, `#efe9de` cards), warm coral accents (`#cc785c`), and high-contrast dark ink typography (`#141413`).

---

## # Typography Recommendations

| Purpose | Font Family | Weight | Tracking | Case / Style |
| :--- | :--- | :--- | :--- | :--- |
| **Display Headings (H1, H2)** | `Outfit`, `Plus Jakarta Sans` | SemiBold (600) / Bold (700) | `-0.025em` | Sentence case |
| **Section Headings (H3, H4)** | `Outfit` | Medium (500) / SemiBold | `-0.015em` | Sentence case |
| **Eyebrows / Badges** | `Outfit`, `Inter` | SemiBold (600) | `+0.05em` | UPPERCASE |
| **Body & Lead Text** | `Inter` | Regular (400) / Medium (500) | Normal | Sentence case |
| **Numbers & Dates** | `JetBrains Mono`, `Inter` | Medium / SemiBold | Normal | Tabular figures |

---

## # Layout & Color System Rules

1. **Canvas Surface**: `#faf9f5` (Tinted Cream) — primary page backdrop.
2. **Soft Surface**: `#f5f0e8` — section bands and alternate rows.
3. **Card Surface**: `#efe9de` — elevated card containers with 1px hairline border (`#e6dfd8`).
4. **Primary Brand Accent**: `#cc785c` (Warm Coral) — buttons, active indicators, key links.
5. **Dark Ink**: `#141413` — primary body text and titles (minimum 7:1 contrast ratio against cream).

---

## # Component Primitives & Redesign Rules

### 1. Card Component Standard (`card-feature-cream`)
- Background: `bg-surface-card` (`#efe9de`)
- Border: `border border-hairline` (`#e6dfd8`)
- Radius: `rounded-xl`
- Padding: `p-6` to `p-8`
- Hover state: `hover:border-coral/40 hover:shadow-md transition-all duration-300`

### 2. Button System
- **Primary**: `bg-coral text-white hover:bg-coral-active rounded-lg px-5 py-2.5 font-medium text-sm`
- **Secondary**: `bg-surface-card border border-hairline text-ink hover:border-coral hover:text-coral rounded-lg px-5 py-2.5 text-sm`

---

## # Mobile-First Design Adjustments

- Ensure all button touch targets maintain a minimum dimension of `44px x 44px`.
- Maintain `16px` padding (`px-4 sm:px-6 lg:px-8`) on mobile viewports to prevent content edge crowding.
