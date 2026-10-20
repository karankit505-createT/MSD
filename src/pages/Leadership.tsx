import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Award, Landmark, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);
  // Default is null so biography is completely hidden until user clicks "Full Biography"
  const [activeBiographyId, setActiveBiographyId] = useState<string | null>(null);

  // Check URL hash on mount or when hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && PRESIDENTS.some((p) => p.id === hash)) {
        setActiveBiographyId(hash);
        setTimeout(() => {
          const el = document.getElementById("individual-biography-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleViewBiography = (presidentId: string) => {
    setActiveBiographyId(presidentId);
    setTimeout(() => {
      const el = document.getElementById("individual-biography-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
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

          {/* Quick Lineage Timeline Overview Bar with All 5 Portraits */}
          <div className="bg-surface-soft border border-hairline rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6200]">
                  Decades of Guidance (1947 – Present)
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-ink mt-1">
                  Chronological Leadership Succession
                </h3>
                <p className="text-xs text-muted-editorial mt-1 max-w-xl">
                  Each National President played an indispensable role in shaping Maha Seva Dal's commitment to selfless humanitarian service, youth empowerment, and cultural preservation.
                </p>
              </div>

              {/* 5 Avatars Stack */}
              <div className="flex items-center gap-4 bg-canvas p-3 rounded-xl border border-hairline self-start md:self-auto">
                <div className="flex -space-x-3 overflow-hidden">
                  {PRESIDENTS.map((p) => (
                    <img
                      key={p.id}
                      src={p.image}
                      alt={p.name}
                      title={`${p.name} (${p.tenure})`}
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-[#FF6200] object-cover"
                    />
                  ))}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-ink">5 Presidential Eras</div>
                  <div className="text-muted-editorial text-[11px]">1947 · 1949 · 1961 · 1986 · 1997</div>
                </div>
              </div>
            </div>
          </div>

          {/* Symmetrical 5-Card Presidential Gallery: Identical Layout, Identical 2:3 Photo Align */}
          <div id="presidents-gallery" className="mb-16 scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6200]">Lineage Showcase</span>
                <h3 className="font-serif text-2xl text-ink font-semibold">Official Presidents Gallery</h3>
              </div>
              <div className="text-xs text-muted-editorial hidden sm:block">
                All 5 Presidential Posters Shown in Exact Same Layout &bull; Click About to View
              </div>
            </div>

            {/* Exact Same Layout & Alignment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
              {PRESIDENTS.map((pres) => (
                <div
                  key={`card-${pres.id}`}
                  className="bg-surface-soft border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col group"
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

                    {/* Zoom Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePhotoModal(pres.image);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-all shadow"
                      title="Inspect Archival Artwork"
                    >
                      <ZoomIn size={13} />
                    </button>
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
                    <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleViewBiography(pres.id)}
                        className="text-[#FF6200] hover:text-[#e05600] font-semibold inline-flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 transition-all"
                      >
                        <span>About</span>
                        <ArrowRight size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePhotoModal(pres.image)}
                        className="text-muted-editorial hover:text-ink text-[11px]"
                      >
                        View Photo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Biography Section: ONLY SHOWN WHEN USER CLICKS 'Full Biography' */}
          {activeBiography && (
            <div id="individual-biography-section" className="mb-16 scroll-mt-20">
              {/* Header Bar with Close Button */}
              <div className="bg-surface-soft border border-hairline rounded-2xl p-4 sm:p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FF6200]">
                    <Landmark size={14} />
                    <span>Individual Presidential Biography</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-ink font-semibold mt-0.5">
                    {activeBiography.name} ({activeBiography.badge.split(" ")[0]})
                  </h3>
                  <p className="text-xs text-muted-editorial mt-0.5">
                    {activeBiography.tenure} &bull; {activeBiography.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const gallery = document.getElementById("presidents-gallery");
                      if (gallery) gallery.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs text-muted-editorial hover:text-ink px-3 py-1.5 rounded-lg border border-hairline bg-canvas transition-colors"
                  >
                    ↑ Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBiographyId(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FF6200] hover:bg-[#e05600] text-white shadow-xs transition-all"
                    title="Close and hide biography"
                  >
                    <X size={14} />
                    <span>Close Biography</span>
                  </button>
                </div>
              </div>

              {/* Detailed Individual Biography Card */}
              {(() => {
                const currentIndex = PRESIDENTS.findIndex((p) => p.id === activeBiography.id);
                const prevPresident = currentIndex > 0 ? PRESIDENTS[currentIndex - 1] : null;
                const nextPresident = currentIndex < PRESIDENTS.length - 1 ? PRESIDENTS[currentIndex + 1] : null;

                return (
                  <div
                    key={activeBiography.id}
                    id={activeBiography.id}
                    className="bg-surface-soft border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-6 sm:p-8 lg:p-10">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Image Column - Exact Same 2:3 Frame */}
                        <div className="lg:col-span-5 flex flex-col items-center">
                          <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border-2 border-[#FF6200]/30 shadow-lg bg-surface-card aspect-[2/3]">
                            <img
                              src={activeBiography.image}
                              alt={`${activeBiography.name} - ${activeBiography.role}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            
                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-[#FF6200] to-[#FF9933] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                              <ShieldCheck size={13} />
                              <span>{activeBiography.badge}</span>
                            </div>

                            {/* Zoom Button */}
                            <button
                              type="button"
                              onClick={() => setActivePhotoModal(activeBiography.image)}
                              className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-md"
                              title="View Full Resolution Poster"
                            >
                              <ZoomIn size={16} />
                            </button>
                          </div>

                          {/* President Name and Details Downside of the Photo */}
                          <div className="w-full max-w-sm mt-3 bg-canvas p-4 rounded-xl border border-hairline text-center shadow-xs">
                            <div className="text-[11px] uppercase tracking-wider text-[#FF6200] font-semibold">{activeBiography.role}</div>
                            <div className="font-serif text-xl sm:text-2xl font-semibold text-ink mt-0.5">{activeBiography.name}</div>
                            <div className="text-xs text-muted-editorial mt-0.5">{activeBiography.tenure} &bull; Maha Seva Dal</div>
                          </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-7 space-y-6">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/25 text-xs font-semibold text-[#FF6200] mb-2">
                              <Landmark size={13} />
                              <span>{activeBiography.tenure}</span>
                            </div>
                            <h3 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
                              {activeBiography.name}
                            </h3>
                            <div className="text-sm font-medium text-[#FF6200] mt-1">
                              {activeBiography.role}
                            </div>
                            <div className="text-xs text-muted-editorial mt-0.5 italic">
                              {activeBiography.motto}
                            </div>
                          </div>

                          {/* President Quote */}
                          <blockquote className="border-l-4 border-[#FF6200] pl-5 py-3 bg-canvas/80 rounded-r-xl italic font-serif text-base sm:text-lg text-ink leading-relaxed">
                            "{activeBiography.quote}"
                            <div className="mt-2 text-xs font-sans not-italic text-muted-editorial font-medium">
                              — {activeBiography.quoteAttribution}
                            </div>
                          </blockquote>

                          {/* Historical Narrative */}
                          <div className="space-y-3 text-body text-sm leading-relaxed">
                            <p>{activeBiography.historicalContext}</p>
                          </div>

                          {/* Key Milestones & Achievements */}
                          <div className="bg-canvas p-5 rounded-xl border border-hairline space-y-2.5">
                            <div className="text-xs uppercase tracking-wider text-ink font-semibold flex items-center gap-2">
                              <Award size={15} className="text-[#FF6200]" />
                              <span>Tenure Highlights & Achievements</span>
                            </div>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-body">
                              {activeBiography.achievements.map((ach, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#138808] font-bold">✓</span>
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Navigation between presidents or close */}
                          <div className="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
                            {prevPresident ? (
                              <button
                                type="button"
                                onClick={() => handleViewBiography(prevPresident.id)}
                                className="btn-secondary-cream text-xs py-2 px-3 inline-flex items-center gap-1.5"
                              >
                                <ChevronLeft size={14} />
                                <span>Previous: {prevPresident.name.split(" ")[0]} ({prevPresident.badge.split(" ")[0]})</span>
                              </button>
                            ) : (
                              <div />
                            )}

                            <button
                              type="button"
                              onClick={() => setActiveBiographyId(null)}
                              className="text-xs text-muted-editorial hover:text-[#FF6200] transition-colors font-medium inline-flex items-center gap-1"
                            >
                              <X size={13} />
                              <span>Leave & Close Biography</span>
                            </button>

                            {nextPresident && (
                              <button
                                type="button"
                                onClick={() => handleViewBiography(nextPresident.id)}
                                className="btn-secondary-cream text-xs py-2 px-3 inline-flex items-center gap-1.5"
                              >
                                <span>Next: {nextPresident.name.split(" ")[0]} ({nextPresident.badge.split(" ")[0]})</span>
                                <ChevronRight size={14} />
                              </button>
                            )}
                          </div>

                          {/* Footer Links */}
                          <div className="flex flex-wrap items-center gap-4 pt-2">
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
                );
              })()}
            </div>
          )}

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

      {/* Lightbox Modal for High-Resolution View */}
      {activePhotoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-canvas rounded-2xl overflow-hidden shadow-2xl p-2 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-all shadow-md"
              title="Close"
            >
              <X size={20} />
            </button>
            <img
              src={activePhotoModal}
              alt="Maha Seva Dal Archival Poster"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Leadership;
