# 🏛️ Maha Seva Dal (MSD) — Stage 04: Component Execution Plan

**Project**: Maha Seva Dal (MSD) Web Platform  
**Design Reference**: `outputs/03_msd_visual_redesign_direction.md`  
**Output Path**: `outputs/04_msd_component_execution_plan.md`

---

## # Frontend Implementation Overview

This plan details exact component-level code modifications for the Vite React + Tailwind CSS application located in `src/`.

---

## # Component Tasks

### 1. `Header.tsx`
- **Mobile Drawer Containment**: Add `max-h-[85vh] overflow-y-auto` to the mobile menu container (`isMobileMenuOpen`).
- **Appointments Accordion**: Convert the static appointments list into an accordion grouped by region.

### 2. `Events.tsx`
- **Interactive State Filter**: Add `activeTab` React state (`"all" | "cultural" | "food"`). Filter `eventCards` dynamically based on selected tab.

### 3. `GuruPoornima.tsx` & `Mahashivratri.tsx`
- **Modal Lightbox Close Button**: Reposition close button inside the modal image container (`top-4 right-4 bg-ink/70 p-2 rounded-full text-white`).
- **Keyboard Navigation**: Add `useEffect` event listener for `Escape` key and `ArrowLeft` / `ArrowRight` image switching.

### 4. `Support.tsx`
- **Copy Toast Alert**: Add animated ephemeral toast state (`showToast`) when copying UPI ID or bank account details.

---

## # Component Implementation Order

1. `Events.tsx` dynamic filter logic
2. `Header.tsx` mobile drawer containment & ARIA labels
3. `GuruPoornima.tsx` & `Mahashivratri.tsx` lightbox close button fix & keyboard shortcuts
4. `Support.tsx` toast alert feedback
