import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

const Origins = () => {
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
              <img
                src="/founder-saragabani-gopu-1947.jpg"
                alt="Founder Saragabani Gopu"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6200] shadow-sm mb-1.5"
              />
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
                <div className="rounded-xl overflow-hidden border-2 border-[#FF6200]/30 shadow-md bg-canvas">
                  <img
                    src="/founder-saragabani-gopu-1947.jpg"
                    alt="Founder Saragabani Gopu - 1947 Foundation"
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-3 bg-canvas border-t border-hairline text-center">
                    <div className="text-xs font-semibold text-[#FF6200] uppercase tracking-wider">Historical Proclamation 1947</div>
                    <div className="font-serif text-sm text-ink font-medium mt-0.5">Founder Saragabani Gopu</div>
                  </div>
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
                <div className="pt-2 flex items-center gap-4 text-xs text-muted-editorial font-medium">
                  <span>• Established 1947</span>
                  <span>• Non-Political Seva Cadre</span>
                  <span>• Nationwide Reach</span>
                </div>
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
    </PageLayout>
  );
};

export default Origins;
