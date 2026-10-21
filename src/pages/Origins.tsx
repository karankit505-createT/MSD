import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, ShieldCheck, Award, Landmark, X } from "lucide-react";
import { PRESIDENTS } from "./Leadership";

const Origins = () => {
  const [showFounderModal, setShowFounderModal] = useState(false);
  const founder = PRESIDENTS.find((p) => p.id === "gopu-1947") || PRESIDENTS[0];

  // Lock background scroll when modal is active
  useEffect(() => {
    if (showFounderModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showFounderModal]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showFounderModal) {
        setShowFounderModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFounderModal]);
  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="1947 Historical Record"
            title="Origins and Foundation"
            subtitle="The historic emergence of Maha Seva Dal during India's transition to independence."
          />

          {/* Key Facts Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="tile-connector text-center flex flex-col items-center justify-center">
              <Calendar className="mx-auto text-coral mb-2" size={24} />
              <div className="text-xs uppercase tracking-wider text-muted-editorial font-medium">Founding Year</div>
              <div className="font-serif text-2xl text-ink font-normal mt-1">1947</div>
            </div>
            <div className="tile-connector text-center flex flex-col items-center justify-center">
              <div className="text-xs uppercase tracking-wider text-muted-editorial font-medium">Founder & President</div>
              <div className="font-serif text-xl text-ink font-normal mt-0.5">Saragabani Gopu</div>
            </div>
            <div className="tile-connector text-center flex flex-col items-center justify-center">
              <MapPin className="mx-auto text-coral mb-2" size={24} />
              <div className="text-xs uppercase tracking-wider text-muted-editorial font-medium">Initial Scope</div>
              <div className="font-serif text-2xl text-ink font-normal mt-1">National & Social</div>
            </div>
          </div>

          {/* Featured Founder Archival Card */}
          <div className="bg-surface-soft border border-[#E8E2D9] rounded-2xl p-6 sm:p-8 mb-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              <div className="md:col-span-5">
                <div
                  onClick={() => setShowFounderModal(true)}
                  className="block rounded-xl overflow-hidden border-2 border-[#FF6200]/30 shadow-md bg-canvas group cursor-pointer hover:border-[#FF6200]/60 transition-colors"
                  title="Click to view Founder details"
                >
                  <img
                    src="/founder-saragabani-gopu-1947.jpg"
                    alt="Founder Saragabani Gopu - 1947 Foundation"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FF6200]/10 text-xs font-semibold text-[#FF6200]">
                  <span>ARCHIVAL RECORD</span>
                </div>
                <h3 className="font-serif text-2xl text-ink">
                  The Vision of Founder Saragabani Gopu
                </h3>
                <p className="text-sm text-body leading-relaxed">
                  Established in 1947 as India crossed into sovereignty, Founder Saragabani Gopu mobilized young volunteers under the guiding beacon of <strong className="text-ink font-medium">Service, Discipline, and Unity (Seva, Niyama, Ekata)</strong>.
                </p>
                <p className="text-sm text-body leading-relaxed">
                  Steering clear of partisan politics, his focus was dedicated to instilling physical fitness, community defense, emergency relief, and ethical leadership among grassroots citizens across states.
                </p>
              </div>
            </div>
          </div>

          {/* Main Editorial Text */}
          <div className="card-feature-cream space-y-6 text-body text-base leading-relaxed font-sans mb-12">
            <h2 className="font-serif text-2xl text-ink">
              Emergence During National Transition
            </h2>
            <p>
              Maha Seva Dal emerged during a defining moment in India's history, as the country moved toward independence in 1947. In this period of national transition, the organization directed its efforts toward the organization and strengthening of Hindu society, viewing social cohesion as a necessary foundation for an independent nation.
            </p>
            <p>
              Rather than engaging in direct anti-British political movements, MSD maintained a non-political stance during the freedom struggle. Its focus remained on cultural organization, social discipline, and community structure, guided by the belief that long-term national stability depended on a strong and unified social framework.
            </p>
            <blockquote className="border-l-2 border-coral pl-4 py-2 font-serif text-xl text-ink italic my-6 bg-canvas/60 rounded-r-md">
              "Long-term national stability depends upon a disciplined, compassionate, and culturally rooted social framework."
            </blockquote>
            <p>
              Founder Saragabani Gopu established the organization with a focus on selflessness, community service, and physical discipline among youth, forming early assemblies across key states.
            </p>
          </div>

          {/* Presidential Succession Callout */}
          <div className="bg-surface-card border border-hairline rounded-xl p-6 mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 overflow-hidden shrink-0">
                <img src="/presidents/president-1947.jpg" alt="1947" className="w-10 h-10 rounded-full ring-2 ring-[#FF6200] object-cover" />
                <img src="/presidents/president-1949.jpg" alt="1949" className="w-10 h-10 rounded-full ring-2 ring-[#FF6200] object-cover" />
                <img src="/presidents/president-1961.jpg" alt="1961" className="w-10 h-10 rounded-full ring-2 ring-[#FF6200] object-cover" />
                <img src="/presidents/president-1986.jpg" alt="1986" className="w-10 h-10 rounded-full ring-2 ring-[#FF6200] object-cover" />
                <img src="/presidents/president-1997.jpg" alt="1997" className="w-10 h-10 rounded-full ring-2 ring-[#FF6200] object-cover" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[#FF6200] font-semibold">Leadership Succession</div>
                <h4 className="font-serif text-base sm:text-lg text-ink font-semibold">Explore All National Presidents</h4>
                <p className="text-xs text-muted-editorial">Chronological leadership lineage: 1947, 1949, 1961, 1986, and 1997.</p>
              </div>
            </div>
            <Link to="/leadership" className="btn-secondary-cream text-xs shrink-0 self-start sm:self-auto">
              <span>View Presidents Archive</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Bottom Navigation links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-hairline">
            <Link to="/" className="text-sm text-muted-editorial hover:text-ink">
              ← Return to Home
            </Link>
            <Link to="/ideology" className="btn-primary-coral text-xs">
              <span>Next: Ideology & Principles</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* Individual Presidential Biography Modal Popup */}
      {showFounderModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto no-scrollbar animate-in fade-in duration-200"
          onClick={() => setShowFounderModal(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] bg-surface-card rounded-2xl overflow-y-auto no-scrollbar shadow-2xl border border-hairline p-4 sm:p-7 lg:p-8 my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Single "Cut" (X) Button to Close */}
            <button
              type="button"
              onClick={() => setShowFounderModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full bg-white/95 hover:bg-[#FF6200] text-ink hover:text-white border border-hairline flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 touch-manipulation"
              title="Close popup"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Modal Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
              {/* Photo Column */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center pt-2 sm:pt-0">
                <div className="relative group w-full max-w-[190px] sm:max-w-[260px] lg:max-w-none rounded-2xl overflow-hidden border-2 border-[#FF6200]/30 shadow-lg bg-surface-card aspect-[2/3]">
                  <img
                    src={founder.image}
                    alt={`${founder.name} - ${founder.role}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 bg-gradient-to-r from-[#FF6200] to-[#FF9933] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 sm:gap-1.5">
                    <ShieldCheck size={13} />
                    <span>{founder.badge}</span>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/25 text-xs font-semibold text-[#FF6200] mb-1.5">
                    <Landmark size={12} />
                    <span>{founder.tenure}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight font-semibold">
                    {founder.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-medium text-[#FF6200] mt-0.5">
                    {founder.role}
                  </div>
                  <div className="text-[11px] text-muted-editorial mt-0.5 italic">
                    {founder.motto}
                  </div>
                </div>

                <blockquote className="border-l-4 border-[#FF6200] pl-4 py-2 bg-canvas/80 rounded-r-xl italic font-serif text-sm sm:text-base text-ink leading-relaxed">
                  "{founder.quote}"
                  <div className="mt-1.5 text-xs font-sans not-italic text-muted-editorial font-medium">
                    — {founder.quoteAttribution}
                  </div>
                </blockquote>

                <div className="space-y-2 text-body text-xs sm:text-sm leading-relaxed">
                  <p>{founder.historicalContext}</p>
                </div>

                <div className="bg-canvas p-4 rounded-xl border border-hairline space-y-2">
                  <div className="text-xs uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
                    <Award size={14} className="text-[#FF6200]" />
                    <span>Tenure Highlights & Achievements</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-xs text-body">
                    {founder.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-[#FF6200] font-bold mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Origins;
