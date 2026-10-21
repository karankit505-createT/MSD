import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Network, Sparkles } from "lucide-react";

const Legacy = () => {
  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Post-Independence Development"
            title="Growth and Legacy"
            subtitle="Network expansion, cultural continuity, and modern social service initiatives."
          />

          <div className="card-feature-cream space-y-6 text-body text-base leading-relaxed font-sans mb-12">
            <h2 className="font-serif text-2xl text-ink">
              Institutional Expansion
            </h2>
            <p>
              Following India's independence, Maha Seva Dal expanded its activities through the establishment of shakhas (branches) and a broad network of affiliated organizations. These included educational programs, women's forums, and youth student groups, aimed at strengthening social engagement and cultural continuity.
            </p>
            <p>
              Through its origins, ideological focus, role during Partition, and post-independence expansion, Maha Seva Dal developed into a significant social and cultural organization in independent India. Over time, it came to be regarded as a major cultural force grounded in social organization rather than political participation.
            </p>
          </div>

          {/* Historic Leadership Succession */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6200]">Decades of Service</span>
                <h3 className="font-serif text-2xl text-ink mt-1">Historic Presidents & National Leadership</h3>
                <p className="text-xs text-muted-editorial mt-1">
                  From its 1947 establishment to nationwide expansion, Maha Seva Dal was guided by dedicated visionary leaders.
                </p>
              </div>
              <Link to="/leadership" className="btn-secondary-cream text-xs shrink-0 self-start sm:self-auto">
                <span>View Full Presidents Archive</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {/* Leader 1 */}
              <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <Link
                    to="/leadership#gopu-1947"
                    className="relative block aspect-[2/3] bg-surface-card overflow-hidden border-b border-hairline cursor-pointer"
                    title="Click photo to view biography & details"
                  >
                    <img
                      src="/presidents/president-1947.jpg"
                      alt="Founder Sharagabani Gopu"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#FF6200] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      1947 Proclamation
                    </div>
                  </Link>
                  <div className="p-4 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#FF6200] font-semibold">Founder & 1st President</div>
                    <Link to="/leadership#gopu-1947" className="block hover:text-[#FF6200] transition-colors">
                      <h4 className="font-serif text-base text-ink font-semibold">Sharagabani Gopu</h4>
                    </Link>
                    <p className="text-[11px] text-muted-editorial leading-relaxed line-clamp-3">
                      Established foundational values: Service, Discipline, and Unity across grassroots youth assemblies.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-hairline text-center text-[10px] text-muted-editorial font-medium">
                    1947 Foundation
                  </div>
                </div>
              </div>

              {/* Leader 2 */}
              <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <Link
                    to="/leadership#gopu-1949"
                    className="relative block aspect-[2/3] bg-surface-card overflow-hidden border-b border-hairline cursor-pointer"
                    title="Click photo to view biography & details"
                  >
                    <img
                      src="/presidents/president-1949.jpg"
                      alt="National President Sharagabani Gopu"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#FF6200] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      1949 Era
                    </div>
                  </Link>
                  <div className="p-4 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#FF6200] font-semibold">National President</div>
                    <Link to="/leadership#gopu-1949" className="block hover:text-[#FF6200] transition-colors">
                      <h4 className="font-serif text-base text-ink font-semibold">Sharagabani Gopu</h4>
                    </Link>
                    <p className="text-[11px] text-muted-editorial leading-relaxed line-clamp-3">
                      Codified the volunteer constitution, daily shakha routines, and continuous mass Annadanam.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-hairline text-center text-[10px] text-muted-editorial font-medium">
                    1949 Governance
                  </div>
                </div>
              </div>

              {/* Leader 3 (Narendra Singh) */}
              <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <Link
                    to="/leadership#narendra-1961"
                    className="relative block aspect-[2/3] bg-surface-card overflow-hidden border-b border-hairline cursor-pointer"
                    title="Click photo to view biography & details"
                  >
                    <img
                      src="/presidents/president-1961.jpg"
                      alt="National President Narendra Singh"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#FF6200] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      1961 Expansion
                    </div>
                  </Link>
                  <div className="p-4 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#FF6200] font-semibold">National President</div>
                    <Link to="/leadership#narendra-1961" className="block hover:text-[#FF6200] transition-colors">
                      <h4 className="font-serif text-base text-ink font-semibold">Narendra Singh</h4>
                    </Link>
                    <p className="text-[11px] text-muted-editorial leading-relaxed line-clamp-3">
                      Steered the 1961 expansion phase, strengthening cultural assemblies, student forums, and community seva.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-hairline text-center text-[10px] text-muted-editorial font-medium">
                    1961 Expansion
                  </div>
                </div>
              </div>

              {/* Leader 4 (Krishna Gowda) */}
              <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <Link
                    to="/leadership#krishna-gowda-1986"
                    className="relative block aspect-[2/3] bg-surface-card overflow-hidden border-b border-hairline cursor-pointer"
                    title="Click photo to view biography & details"
                  >
                    <img
                      src="/presidents/president-1986.jpg"
                      alt="National President M. H. Krishna Gowda"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#FF6200] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      1986 Era
                    </div>
                  </Link>
                  <div className="p-4 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#FF6200] font-semibold">National President</div>
                    <Link to="/leadership#krishna-gowda-1986" className="block hover:text-[#FF6200] transition-colors">
                      <h4 className="font-serif text-base text-ink font-semibold">M. H. Krishna Gowda</h4>
                    </Link>
                    <p className="text-[11px] text-muted-editorial leading-relaxed line-clamp-3">
                      Expanded nationwide volunteer brigades, formalized youth coordinator training, and spearheaded rural aid.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-hairline text-center text-[10px] text-muted-editorial font-medium">
                    1986 Leadership
                  </div>
                </div>
              </div>

              {/* Leader 5 (1997) */}
              <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden hover:border-[#FF6200]/40 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <Link
                    to="/leadership#president-1997"
                    className="relative block aspect-[2/3] bg-surface-card overflow-hidden border-b border-hairline cursor-pointer"
                    title="Click photo to view biography & details"
                  >
                    <img
                      src="/presidents/president-1997.jpg"
                      alt="National President 1997"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 bg-[#FF6200] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      1997 Jubilee
                    </div>
                  </Link>
                  <div className="p-4 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-[#FF6200] font-semibold">National President</div>
                    <Link to="/leadership#president-1997" className="block hover:text-[#FF6200] transition-colors">
                      <h4 className="font-serif text-base text-ink font-semibold">National Leadership (1997)</h4>
                    </Link>
                    <p className="text-[11px] text-muted-editorial leading-relaxed line-clamp-3">
                      Led the 50-year Golden Jubilee celebrations uniting thousands of grassroots cadre members across India.
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-hairline text-center text-[10px] text-muted-editorial font-medium">
                    1997 Golden Jubilee
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="tile-connector">
              <Network className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Branch Network</h3>
              <p className="text-xs text-muted-editorial">
                Widespread shakhas (local chapters) promoting daily physical and social discipline.
              </p>
            </div>
            <div className="tile-connector">
              <Sparkles className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Cultural Assemblies</h3>
              <p className="text-xs text-muted-editorial">
                Annual celebrations including Guru Poornima food drives and Mahashivratri jagarans.
              </p>
            </div>
            <div className="tile-connector">
              <Award className="text-coral mb-3" size={20} />
              <h3 className="font-serif text-lg text-ink mb-1">Youth Leadership</h3>
              <p className="text-xs text-muted-editorial">
                Continuous training of selfless community volunteers and nation-building leaders.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-hairline">
            <Link to="/partition" className="text-sm text-muted-editorial hover:text-ink">
              ← Previous: Partition Period
            </Link>
            <Link to="/events" className="btn-primary-coral text-xs">
              <span>Explore Modern Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default Legacy;
