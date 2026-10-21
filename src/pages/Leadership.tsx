import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ShieldCheck, Award, Landmark, X } from "lucide-react";

export interface PresidentData {
  id: string;
  name: string;
  tenure: string;
  badge: string;
  role: string;
  motto: string;
  quote: string;
  quoteAttribution: string;
  image: string;
  historicalContext: string;
  achievements: string[];
}

export const PRESIDENTS: PresidentData[] = [
  {
    id: "gopu-1947",
    name: "Sharagabani Gopu",
    tenure: "1947 Foundation Era",
    badge: "1947 Founder",
    role: "Founder & 1st National President",
    motto: "Service • Discipline • Unity (Vision • Service • Nation)",
    quote: "Long-term national stability depends upon a disciplined, compassionate, and culturally rooted social framework.",
    quoteAttribution: "Founding Proclamation Address (1947)",
    image: "/presidents/president-1947.jpg",
    historicalContext:
      "Established Maha Seva Dal in 1947 during the historic dawn of India's independence. Chosen to cultivate selfless discipline rather than political factionalism, he mobilized volunteer youth for community defense, refugee food relief during Partition, and cultural integrity.",
    achievements: [
      "Founded Maha Seva Dal with non-political social service ideology",
      "Formulated daily physical and moral discipline shakhas for youth",
      "Organized large-scale Annadanam (food relief) during Partition upheaval",
      "Established nationwide grassroots assemblies across key states"
    ]
  },
  {
    id: "gopu-1949",
    name: "Sharagabani Gopu",
    tenure: "1949 Governance & Cadre Era",
    badge: "1949 National President",
    role: "National President",
    motto: "Maha Seva Dal — Service • Discipline • Unity",
    quote: "True nation-building begins with disciplined youth and unconditional service to the vulnerable.",
    quoteAttribution: "Ceremonial Presidential Address (1949)",
    image: "/presidents/president-1949.jpg",
    historicalContext:
      "In the post-independence years following 1949, President Sharagabani Gopu codified the foundational volunteer guidelines, establishing daily shakhas, spiritual discipline, and continuous community Annadanam across independent India.",
    achievements: [
      "Codified volunteer service regulations and organizational constitution",
      "Established daily morning assemblies and youth fitness training",
      "Spearheaded long-term social welfare centers and pilgrimage aid",
      "Expanded seva brigades to rural villages and temple towns"
    ]
  },
  {
    id: "narendra-1961",
    name: "Narendra Singh",
    tenure: "1961 Expansion Era",
    badge: "1961 President",
    role: "National President",
    motto: "Service • Discipline • Social Harmony — For a Stronger Hindu Society",
    quote: "Long-term national stability depends upon a disciplined, compassionate, and culturally rooted social framework.",
    quoteAttribution: "National Convention Address (1961)",
    image: "/presidents/president-1961.jpg",
    historicalContext:
      "Led Maha Seva Dal through its major post-independence institutional expansion in 1961. Championed social harmony, youth sports, student councils, and free healthcare camps, broadening the foundation's footprint across north and central India.",
    achievements: [
      "Expanded branch networks and cultural forums into tier-2 & tier-3 districts",
      "Instituted annual Guru Poornima and Mahashivratri community programs",
      "Organized student leadership academies and athletic tournaments",
      "Unified diverse communities under constructive humanitarian service"
    ]
  },
  {
    id: "krishna-gowda-1986",
    name: "M. H. Krishna Gowda",
    tenure: "1986 National Leadership Era",
    badge: "1986 National President",
    role: "National President",
    motto: "Maha Seva Dal — National Service & Youth Discipline",
    quote: "Selfless service to the community is the highest form of patriotism. When our youth unite with purpose, national progress is unstoppable.",
    quoteAttribution: "Presidential Address, National Assembly (1986)",
    image: "/presidents/president-1986.jpg",
    historicalContext:
      "Elected National President of Maha Seva Dal in 1986. Championed grassroots volunteer mobilization, rural community welfare, youth leadership camps, and the consolidation of state units under the unified Sun Om emblem.",
    achievements: [
      "Presided over the nationwide expansion of volunteer seva brigades in 1986",
      "Formalized leadership training programs for rural and urban youth coordinators",
      "Strengthened humanitarian relief missions and continuous community Annadanam",
      "Reinforced organizational unity under the sacred Maha Seva Dal Sun Om flag"
    ]
  },
  {
    id: "president-1997",
    name: "National Leadership (1997)",
    tenure: "1997 Golden Jubilee Era",
    badge: "1997 National President",
    role: "National President",
    motto: "Golden Jubilee National Convention (1947–1997)",
    quote: "When citizens dedicate their hands to selfless seva, the entire nation rises in strength and harmony.",
    quoteAttribution: "Golden Jubilee Address (1997)",
    image: "/presidents/president-1997.jpg",
    historicalContext:
      "Presided over the 50-Year Golden Jubilee milestone of Maha Seva Dal (1947–1997). Addressed massive national conventions uniting thousands of grassroots cadre members for youth education and emergency disaster relief.",
    achievements: [
      "Presided over the 50-Year Golden Jubilee milestone of Maha Seva Dal",
      "Addressed national conventions uniting thousands of grassroots cadre members",
      "Mobilized emergency disaster relief squads and medical aid networks",
      "Instituted youth scholarships and volunteer career guidance programs"
    ]
  }
];

const Leadership = () => {
  const location = useLocation();
  const [activeBiographyId, setActiveBiographyId] = useState<string | null>(null);

  // Track if this page was entered directly via a hash link from another page
  const [arrivedWithHash] = useState(() => {
    const rawHash = location.hash || (typeof window !== "undefined" ? window.location.hash : "");
    return Boolean(rawHash && rawHash.length > 1);
  });

  const handleCloseBiography = () => {
    setActiveBiographyId(null);
    // If user arrived via hash link from another page (Origins, Legacy, Home), go back to preserve previous page & location!
    if (arrivedWithHash && typeof window !== "undefined" && window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
      window.history.back();
      return;
    }
    if (typeof window !== "undefined" && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Check URL hash on mount or when hash/location changes
  useEffect(() => {
    const rawHash = location.hash || (typeof window !== "undefined" ? window.location.hash : "");
    const hash = rawHash.replace("#", "");
    if (hash && PRESIDENTS.some((p) => p.id === hash)) {
      setActiveBiographyId(hash);
    }
  }, [location.hash]);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeBiographyId) {
        handleCloseBiography();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBiographyId, arrivedWithHash]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (activeBiographyId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeBiographyId]);

  const handleViewBiography = (presidentId: string) => {
    setActiveBiographyId(presidentId);
  };

  const activeBiography = PRESIDENTS.find((p) => p.id === activeBiographyId) || null;

  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="NATIONAL LEADERSHIP ARCHIVE"
            title="Presidents of Maha Seva Dal"
            subtitle="The distinguished national leadership that established, expanded, and guided our nationwide volunteer movement across the decades."
          />

          {/* Symmetrical 5-Card Presidential Gallery: Identical Layout, Identical 2:3 Photo Align */}
          <div id="presidents-gallery" className="mb-16 scroll-mt-20">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6200]">Lineage Showcase</span>
              <h3 className="font-serif text-2xl text-ink font-semibold">Official Presidents Gallery</h3>
            </div>

            {/* Exact Same Layout & Alignment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
              {PRESIDENTS.map((pres) => (
                <div
                  key={`card-${pres.id}`}
                  className="bg-surface-soft border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col group max-w-sm sm:max-w-none mx-auto w-full"
                >
                  {/* Photo at the top - 100% Edge-to-Edge 2:3 Ratio with identical align across all 5 */}
                  <div
                    onClick={() => handleViewBiography(pres.id)}
                    className="relative aspect-[2/3] w-full overflow-hidden bg-surface-card border-b border-hairline shrink-0 cursor-pointer"
                  >
                    <img
                      src={pres.image}
                      alt={`${pres.name} - ${pres.role}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 z-20 bg-gradient-to-r from-[#FF6200] to-[#FF9933] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                      {pres.badge.split(" ")[0]}
                    </div>
                  </div>

                  {/* Downside of the Photo: Fixed Heights for Absolute Pixel-Perfect Row Alignment */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Role: Fixed Height h-6 */}
                      <div className="h-6 flex items-center text-[10px] uppercase tracking-wider text-[#FF6200] font-semibold truncate">
                        {pres.role}
                      </div>

                      {/* Name: Fixed Height h-12 */}
                      <div className="h-12 flex items-center mt-0.5">
                        <h4 className="font-serif text-base text-ink font-semibold leading-tight line-clamp-2">
                          {pres.name}
                        </h4>
                      </div>

                      {/* Tenure: Fixed Height h-5 */}
                      <div className="h-5 flex items-center text-[11px] text-muted-editorial font-medium mt-1 truncate">
                        {pres.tenure}
                      </div>

                      {/* Description: Fixed Height h-10 */}
                      <p className="h-10 text-xs text-body line-clamp-2 mt-2 leading-relaxed">
                        {pres.historicalContext}
                      </p>
                    </div>

                    {/* Action Footer: Perfectly Aligned across all 5 cards */}
                    <div className="mt-4 pt-3 border-t border-hairline flex items-center text-xs">
                      <button
                        type="button"
                        onClick={() => handleViewBiography(pres.id)}
                        className="text-[#FF6200] hover:text-[#e05600] font-semibold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-all"
                      >
                        <span>About</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Bottom Callout */}
          <div className="mt-16 card-callout-coral text-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-3">
              Carry the Torch of Maha Seva Dal Leadership
            </h3>
            <p className="text-white/90 text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
              For over seven decades, our presidents have championed selfless seva and youth discipline. Join as an active volunteer coordinator in your district.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#FF6200] font-semibold text-sm hover:bg-white/90 transition-all shadow-md">
                <span>Enroll as Volunteer Member</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/25 text-white border border-white/30 font-medium text-sm hover:bg-black/35 transition-all">
                <span>View Upcoming Seva Events</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Individual Presidential Biography Modal Popup */}
      {activeBiography && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto no-scrollbar animate-in fade-in duration-200"
          onClick={handleCloseBiography}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] bg-surface-card rounded-2xl overflow-y-auto no-scrollbar shadow-2xl border border-hairline p-4 sm:p-7 lg:p-8 my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Single "Cut" (X) Button to Close */}
            <button
              type="button"
              onClick={handleCloseBiography}
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
                    src={activeBiography.image}
                    alt={`${activeBiography.name} - ${activeBiography.role}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 bg-gradient-to-r from-[#FF6200] to-[#FF9933] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 sm:gap-1.5">
                    <ShieldCheck size={13} />
                    <span>{activeBiography.badge}</span>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/25 text-xs font-semibold text-[#FF6200] mb-1.5">
                    <Landmark size={12} />
                    <span>{activeBiography.tenure}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight font-semibold">
                    {activeBiography.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-medium text-[#FF6200] mt-0.5">
                    {activeBiography.role}
                  </div>
                  <div className="text-[11px] text-muted-editorial mt-0.5 italic">
                    {activeBiography.motto}
                  </div>
                </div>

                <blockquote className="border-l-4 border-[#FF6200] pl-4 py-2 bg-canvas/80 rounded-r-xl italic font-serif text-sm sm:text-base text-ink leading-relaxed">
                  "{activeBiography.quote}"
                  <div className="mt-1.5 text-xs font-sans not-italic text-muted-editorial font-medium">
                    — {activeBiography.quoteAttribution}
                  </div>
                </blockquote>

                <div className="space-y-2 text-body text-xs sm:text-sm leading-relaxed">
                  <p>{activeBiography.historicalContext}</p>
                </div>

                <div className="bg-canvas p-4 rounded-xl border border-hairline space-y-2">
                  <div className="text-xs uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
                    <Award size={14} className="text-[#FF6200]" />
                    <span>Tenure Highlights & Achievements</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-xs text-body">
                    {activeBiography.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#138808] font-bold">✓</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link to="/origins" className="btn-secondary-cream text-xs">
                    <span>Read 1947 Origins</span>
                    <ArrowRight size={13} />
                  </Link>
                  <Link to="/register" className="btn-primary-coral text-xs">
                    <span>Join the Cadre Today</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </PageLayout>
  );
};

export default Leadership;
