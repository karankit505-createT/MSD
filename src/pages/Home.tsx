import PageLayout from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { Heart, Calendar, ArrowRight, ShieldCheck, Users, Flame, Landmark } from "lucide-react";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const UPI_LINK = "upi://pay?pa=MAB.037349044880004@AXISBANK&pn=Maha+Seva+Dal+Foundation&cu=INR";

const Home = () => {
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, UPI_LINK, {
        width: 180,
        margin: 2,
        color: { dark: "#1a0a00", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
    }
  }, []);

  return (
    <PageLayout>

      {/* ══════════════════════════════════════════
          HERO BAND — Tinted Cream Canvas (#faf9f5)
      ══════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-canvas border-b border-hairline relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Headline & Actions (5 columns) */}
            <div className="lg:col-span-5 space-y-6 order-last lg:order-first">
              
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-xs font-medium text-ink">
                <span className="w-2 h-2 rounded-full bg-[#FF6200] inline-block" />
                <span>Est. 1947 · Historical & Social Organization</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink tracking-tight font-normal leading-[1.1]">
                Unity of People, Development of Society & Power of Youth
              </h1>

              {/* Sub-headline / Lead text */}
              <p className="text-base text-body leading-relaxed max-w-xl font-sans">
                Founded in 1947 by Saragabani Gopu during India's independence, Maha Seva Dal (MSD) has stood as a dedicated pillar for social harmony, cultural preservation, and nation-building across India.
              </p>

              {/* Primary Action Row */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/events" className="btn-primary-coral">
                  <span>Explore Events & Activities</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/origins" className="btn-secondary-cream">
                  <span>Read 1947 Origins</span>
                </Link>
              </div>

              {/* Quick Stat Bar */}
              <div className="pt-6 border-t border-hairline grid grid-cols-3 gap-4">
                <div>
                  <div className="font-serif text-xl text-ink">1947</div>
                  <div className="text-xs text-muted-editorial">Year Established</div>
                </div>
                <div>
                  <div className="font-serif text-xl text-ink">Saragabani Gopu</div>
                  <div className="text-xs text-muted-editorial">Founder</div>
                </div>
                <div>
                  <div className="font-serif text-xl text-ink">Nationwide</div>
                  <div className="text-xs text-muted-editorial">Service Reach</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Banner Image — shown FIRST on mobile */}
            <div className="lg:col-span-7 order-first lg:order-last">
              <div className="rounded-2xl overflow-hidden border border-hairline shadow-md bg-canvas group hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                <picture className="w-full">
                  {/* Desktop / Tablet: constrained height, object-contain */}
                  <source
                    media="(min-width: 768px)"
                    srcSet="https://res.cloudinary.com/wq9znxvs/image/upload/v1785992787/msd/brand/banner-desktop.png"
                  />
                  {/* Mobile: full-width natural height */}
                  <img
                    src="https://res.cloudinary.com/wq9znxvs/image/upload/v1785994768/msd/brand/banner-mobile.png"
                    alt="Maha Seva Dal Banner"
                    className="w-full md:max-h-[380px] md:object-contain h-auto block group-hover:scale-[1.01] transition-transform duration-500"
                  />
                </picture>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT SECTION — Cream Surface Soft (#f5f0e8)
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-surface-soft border-b border-hairline">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6200]">About the Organisation</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-ink mb-6">
            A Heritage of Selfless Service and Cultural Preservation
          </h2>

          <div className="space-y-6 text-body text-base leading-relaxed font-sans">
            <p>
              Maha Seva Dal (MSD) emerged in 1947, during the defining moment of India's independence. Founded by Saragabani Gopu, the organization focused on organizing society, cultivating disciplined leadership, and assisting communities during times of historical transition.
            </p>
            <p>
              Emphasizing social unity, cultural strength, and youth volunteerism, MSD has consistently stood for humanitarian service, organizing grand socio-cultural assemblies, food relief drives, and spiritual celebrations like Guru Poornima and Mahashivratri.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-hairline">
            <Link to="/origins" className="text-sm font-medium text-[#FF6200] hover:underline inline-flex items-center gap-1">
              <span>Read the detailed history of 1947 origins</span>
              <ArrowRight size={14} />
            </Link>
            <span className="text-hairline">|</span>
            <Link to="/ideology" className="text-sm font-medium text-[#FF6200] hover:underline inline-flex items-center gap-1">
              <span>Explore core principles & ideology</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          3-UP FEATURE CARDS GRID — Light Cream Cards (#efe9de)
      ══════════════════════════════════════════ */}
      <section className="section-editorial bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6200]">Core Pillars</span>
            <h2 className="text-3xl md:text-4xl font-serif text-ink mt-2">
              Our Foundational Commitments
            </h2>
            <p className="text-muted-editorial text-sm mt-3">
              Grounded in the values established in 1947, MSD continues to guide communities through social, cultural, and educational initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-[#FF6200] mb-6">
                  <Users size={20} />
                </div>
                <h3 className="font-serif text-xl text-ink mb-3">
                  Social Harmony & Unity
                </h3>
                <p className="text-sm text-body leading-relaxed">
                  Building strong, compassionate communities across India by fostering mutual respect, social cooperation, and solidarity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline">
                <Link to="/ideology" className="text-xs font-semibold text-ink hover:text-[#FF6200] flex items-center justify-between">
                  <span>Learn more</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-[#FF6200] mb-6">
                  <Flame size={20} />
                </div>
                <h3 className="font-serif text-xl text-ink mb-3">
                  Cultural Heritage & Traditions
                </h3>
                <p className="text-sm text-body leading-relaxed">
                  Preserving and celebrating timeless festivals, ceremonies, and cultural gatherings like Mahashivratri and Guru Poornima.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline">
                <Link to="/events" className="text-xs font-semibold text-ink hover:text-[#FF6200] flex items-center justify-between">
                  <span>View event calendar</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-[#FF6200] mb-6">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-serif text-xl text-ink mb-3">
                  Youth Empowerment
                </h3>
                <p className="text-sm text-body leading-relaxed">
                  Instilling discipline, service values, and leadership capabilities in youth to drive constructive societal growth.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline">
                <Link to="/legacy" className="text-xs font-semibold text-ink hover:text-[#FF6200] flex items-center justify-between">
                  <span>Read growth legacy</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EVENTS SHOWCASE CARDS — Light Theme (#efe9de)
      ══════════════════════════════════════════ */}
      <section className="section-editorial bg-surface-soft border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6200]">Annual Celebrations</span>
              <h2 className="text-3xl md:text-4xl font-serif text-ink mt-2">
                Major Events & Community Assemblies
              </h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/events" className="btn-secondary-cream text-xs">
                <span>All Events Directory</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Event Card 1 */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="badge-coral-fill">Featured Event</span>
                  <span className="text-xs text-muted-editorial font-mono">July 2025</span>
                </div>
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Guru Poornima Celebration & Mahaprasadam
                </h3>
                <p className="text-sm text-body leading-relaxed mb-6">
                  Annual honor to spiritual gurus and teachers, featuring community prayers, cultural performances, and large-scale Mahaprasadam distribution.
                </p>

                <div className="p-4 rounded-lg bg-canvas border border-hairline space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-editorial">Expected Attendees:</span>
                    <span className="text-ink font-semibold">5,000+ Volunteers</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-editorial">Location:</span>
                    <span className="text-ink font-semibold">MSD Grounds, Telangana</span>
                  </div>
                </div>
              </div>

              <div>
                <Link to="/events/guru-poornima" className="btn-primary-coral text-xs">
                  <span>View Details & Schedule</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="badge-coral-fill">Grand Celebration</span>
                  <span className="text-xs text-muted-editorial font-mono">September 2025</span>
                </div>
                <h3 className="font-serif text-2xl text-ink mb-3">
                  Mahashivratri Jagaran & Cultural Assembly
                </h3>
                <p className="text-sm text-body leading-relaxed mb-6">
                  Overnight spiritual vigil, Rudrabhishekam rituals, devotional bhajans, and community service activities.
                </p>

                <div className="p-4 rounded-lg bg-canvas border border-hairline space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-editorial">Rituals & Seva:</span>
                    <span className="text-ink font-semibold">Rudrabhishekam & Annadanam</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-editorial">Entry:</span>
                    <span className="text-ink font-semibold">Open to All Devotees</span>
                  </div>
                </div>
              </div>

              <div>
                <Link to="/events/mahashivratri" className="btn-primary-coral text-xs">
                  <span>View Event Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FULL-BLEED CORAL CALLOUT BAND (#cc785c)
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-callout-coral text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-serif text-white font-normal">
                Join Hands with Maha Seva Dal
              </h2>
              <p className="text-white/90 text-base leading-relaxed">
                Whether through volunteer service, organizing local community events, or financial contributions — your participation strengthens our service to the nation.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link to="/support" className="btn-secondary-cream text-ink font-semibold hover:bg-canvas">
                <Heart size={16} className="text-[#FF6200]" />
                <span>Support & Donate</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DONATION & BANK ACCOUNT SECTION
      ══════════════════════════════════════════ */}
      <section className="section-editorial bg-canvas">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6200]">Transparency & Support</span>
            <h2 className="text-3xl md:text-4xl font-serif text-ink mt-2">
              Support Maha Seva Dal Foundation
            </h2>
            <p className="text-muted-editorial text-sm mt-3">
              Direct contributions power our community food drives, educational aid, and socio-cultural events.
            </p>
          </div>

          <div className="bg-surface-card rounded-xl border border-hairline overflow-hidden p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* QR Code Column — Cloudinary CDN Image */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-canvas rounded-lg border border-hairline">
                <div className="rounded-lg overflow-hidden bg-white p-3 border border-hairline mb-3 flex items-center justify-center">
                  <canvas
                    ref={qrRef}
                    className="rounded-md"
                    style={{ width: 180, height: 180 }}
                  />
                </div>
                <div className="text-center">
                  <span className="badge-pill-cream font-semibold text-xs text-ink">Scan & Pay via UPI</span>
                  <div className="text-[11px] text-muted-editorial mt-1">Maha Seva Dal Foundation</div>
                </div>
              </div>

              {/* Bank Details Column */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="font-serif text-2xl text-ink">
                  Bank Account Details
                </h3>
                
                <div className="space-y-3 font-sans text-sm">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 border-b border-hairline">
                    <span className="text-muted-editorial font-medium shrink-0">Account Name</span>
                    <span className="text-ink font-semibold text-right">MAHA SEVA DAL FOUNDATION</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 border-b border-hairline">
                    <span className="text-muted-editorial font-medium shrink-0">Account Number</span>
                    <span className="font-mono text-[#FF6200] font-bold tracking-wider text-right break-all">925010021495473</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 border-b border-hairline">
                    <span className="text-muted-editorial font-medium shrink-0">IFSC Code</span>
                    <span className="font-mono text-ink font-semibold text-right">UTIB0004488</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 border-b border-hairline">
                    <span className="text-muted-editorial font-medium shrink-0">Bank Name</span>
                    <span className="text-ink font-semibold text-right">Axis Bank</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2">
                    <span className="text-muted-editorial font-medium shrink-0">Account Type</span>
                    <span className="text-ink font-semibold text-right">Savings</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link to="/support" className="btn-primary-coral text-xs w-full justify-center">
                    <span>View Full Support Page & Tax Exemption Info</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </PageLayout>
  );
};

export default Home;
