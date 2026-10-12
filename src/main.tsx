import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Lenis from "lenis";

// ── Lenis smooth scroll ──────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.88,
  touchMultiplier: 1.5,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
// ────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(<App />);
