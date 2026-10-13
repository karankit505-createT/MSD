import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Origins from "./pages/Origins";
import Ideology from "./pages/Ideology";
import Partition from "./pages/Partition";
import Legacy from "./pages/Legacy";
import Events from "./pages/Events";
import GuruPoornima from "./pages/GuruPoornima";
import Mahashivratri from "./pages/Mahashivratri";
import Appointment from "./pages/Appointment";
import Support from "./pages/Support";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/origins" element={<Origins />} />
          <Route path="/ideology" element={<Ideology />} />
          <Route path="/partition" element={<Partition />} />
          <Route path="/legacy" element={<Legacy />} />
          {/* Events */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/guru-poornima" element={<GuruPoornima />} />
          <Route path="/events/mahashivratri" element={<Mahashivratri />} />
          {/* Appointments */}
          <Route path="/appointment/:id" element={<Appointment />} />
          {/* Support / Donate */}
          <Route path="/support" element={<Support />} />
          {/* Cadre Registration, Status Check & Admin Portal */}
          <Route path="/register" element={<Register />} />
          <Route path="/status" element={<Register defaultTab="status" />} />
          <Route path="/verify" element={<Register defaultTab="status" />} />
          <Route path="/admin" element={<Admin />} />
          {/* Legal: Privacy Policy & Terms of Service */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
