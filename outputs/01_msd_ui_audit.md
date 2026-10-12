# 🏛️ Maha Seva Dal (MSD) — Stage 01: UI & UX Audit Document

**Project**: Maha Seva Dal (MSD) Web Platform  
**Audit Date**: August 5, 2026  
**Auditor**: Senior UI/UX & Product Design Auditor  
**Output Path**: `outputs/01_msd_ui_audit.md`

---

## # Executive Summary

Maha Seva Dal (MSD) is a socio-cultural non-profit organisation established in 1947 by Saragabani Gopu during India’s independence. The platform serves as both a historical repository and a community engagement hub, highlighting annual cultural assemblies (Guru Poornima, Mahashivratri), official state appointment registries, and donor transparency mechanisms.

While recent refactoring converted dark navy containers to a cohesive **Warm Editorial Design System** (Cream Canvas `#faf9f5`, Surface `#efe9de`, Coral `#cc785c`, Modern Sans typography), a comprehensive UI/UX audit reveals key opportunities to further streamline user journeys, eliminate residual interaction friction, and optimize mobile responsiveness.

---

## # Major UX Problems

### 1. Multi-Step Event-to-Appointment Booking Gap
- **Issue**: Visitors viewing an event (e.g. Guru Poornima or Mahashivratri) must click "Book Event Appointment", which redirects them to `/appointment/guru-poornima-2025`. However, the appointment page assumes the user understands the official state registry system rather than providing an instant inline RSVP/registration confirmation.
- **Why it matters**: Introduces cognitive friction for users who simply want to attend an event or sign up as a volunteer.

### 2. State Appointment Lookup Navigation Friction
- **Issue**: The Header navigation contains an "Appointments" dropdown listing all regions directly in a long scrollable menu (`max-h-80 overflow-y-auto`). On mobile devices, this creates excessive vertical scrolling.
- **Why it matters**: Users looking for specific regional state teams (e.g., Tamil Nadu, Telangana, Nagaland) experience menu clutter instead of a clean searchable directory.

---

## # Major UI Problems

### 1. Banner Aspect Ratio & Frame Fit
- **Issue**: The homepage hero graphic features a panoramic 2.8:1 graphic (Dr. B.R. Ambedkar, central MSD emblem, Swami Vivekananda). While set to `w-full h-auto block rounded-2xl`, on ultra-wide desktop monitors (>1600px), the hero height compresses relative to the 5-column left text block.
- **Why it matters**: Visual balance between headline text and graphic image varies across screen resolutions.

### 2. Photo Lightbox Mobile Padding
- **Issue**: Photo gallery modals on `GuruPoornima.tsx` and `Mahashivratri.tsx` render full-screen overlays (`fixed inset-0 z-50 bg-ink/80`). On mobile screens, the close button (`X`) is positioned `-top-10 right-0`, which can collide with mobile browser status bars.
- **Why it matters**: Mobile users may struggle to close lightboxes on iOS Safari or Android Chrome.

---

## # User Friction Points

1. **UPI VPA Copying Indication**: On `Support.tsx`, clicking "Copy" copies `MAB.037349044880004@AXISBANK` and changes button text to "Copied!". However, no toast notification or visual feedback appears near the QR code itself.
2. **Tab Category Switching in Events**: On `Events.tsx`, category filter buttons ("Cultural Assemblies", "Food Drives") are static UI elements and do not dynamically filter the card array.

---

## # Visual Hierarchy Problems

1. **Section Heading Sizing**: Page headers across `Origins.tsx`, `Ideology.tsx`, and `Partition.tsx` use varying top padding (`py-16` vs `section-editorial py-20`).
2. **Stat Bar Contrast**: On `Home.tsx`, the stat bar ("1947 Year Established", "Saragabani Gopu Founder") uses `text-xs text-muted-editorial`, which is low-contrast against `#faf9f5` on sub-optimal displays.

---

## # Typography Problems

1. **Heading Weight Consistency**: `h1` headings use `font-serif font-normal`, while card titles use `font-serif text-2xl font-semibold`. Unifying heading font weight rules will strengthen editorial structure.
2. **Line Height on Mobile**: Lead paragraph text on mobile screens (`text-base leading-relaxed`) creates long text blocks on small devices.

---

## # Accessibility Problems (WCAG 2.1 AA)

1. **Contrast Ratio on Secondary Pills**: `badge-pill-cream` uses `text-muted-editorial` (`#6c6a64`) on `bg-surface-soft` (`#f5f0e8`), resulting in a 4.1:1 contrast ratio (slightly below WCAG AA requirement of 4.5:1 for small text).
2. **ARIA Labels on Interactive Icons**: Chevron arrows, modal close buttons, and social links lack explicit `aria-label` descriptors in several sub-components.

---

## # Mobile Responsiveness Problems

1. **Drawer Height Overflow**: On mobile screens with height < 650px, the mobile menu drawer in `Header.tsx` overflows the viewport without internal scrolling enabled.
2. **Grid Collapse on Small Tablets**: 3-column feature cards in `Ideology.tsx` drop from 3 columns directly to 1 column without a 2-column intermediate state for tablets (`768px - 1024px`).

---

## # Cognitive Load Analysis

- **Information Density**: Pages present historical context, event programs, and donation options clearly. However, event cards contain tags, chief guest boxes, summary text, and dual CTAs, creating high visual density per card.
- **Scanning Clarity**: Clear section eyebrows (`UPPERCASE TRACKING-WIDEST TEXT-CORAL`) effectively guide eye movement across page sections.

---

## # Trust & Clarity Issues

- **Strength**: High transparency with official Axis Bank account numbers (`925010021495473`), IFSC code (`UTIB0004488`), and 80G tax exemption badge.
- **Opportunity**: Displaying an explicit "Verified Non-Profit Status" badge on the primary header bar would immediately assure first-time visitors.

---

## # Recommended Priority Fixes

| Priority | Component / Page | Issue | Fix |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | `Header.tsx` | Mobile drawer overflow & scroll lock | Add `max-h-[85vh] overflow-y-auto` to mobile drawer container |
| **P1 (High)** | `Events.tsx` | Category tabs non-functional | Connect state filter logic to filter event cards dynamically |
| **P1 (High)** | `GuruPoornima` / `Mahashivratri` | Lightbox close button positioning | Position close button inside modal card header (`top-4 right-4`) |
| **P2 (Medium)** | `index.css` | `badge-pill-cream` text contrast | Update text color from `text-muted-editorial` to `text-ink` |
| **P2 (Medium)** | `Support.tsx` | Toast feedback on UPI copy | Add animated toast alert on successful clipboard copy |
