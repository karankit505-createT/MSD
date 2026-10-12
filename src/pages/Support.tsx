import { useState, useEffect, useRef } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Heart, Check, QrCode, Building2, Copy, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";

const UPI_ID = "MAB.037349044880004@AXISBANK";
const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=Maha+Seva+Dal+Foundation&cu=INR`;

const Support = () => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, UPI_LINK, {
        width: 200,
        margin: 2,
        color: { dark: "#1a0a00", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
    }
  }, []);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Support & Donation"
            title="Contribute to Maha Seva Dal"
            subtitle="Your financial and volunteer contributions directly empower social welfare, cultural heritage, and youth service initiatives across India."
          />

          {/* 3-Tier Contribution Grid (Featured Light Tier) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Tier 1: Seva Patron */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <span className="badge-pill-cream mb-4 inline-block">Community Supporter</span>
                <h3 className="font-serif text-2xl text-ink mb-1">Seva Patron</h3>
                <div className="font-serif text-3xl text-coral font-normal mb-4">₹ 1,000</div>
                <p className="text-xs text-body leading-relaxed mb-6">
                  Supports food distribution and educational materials for 10 underprivileged children.
                </p>
                <ul className="space-y-2 text-xs text-body mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-coral" />
                    <span>Food drive sponsorship</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-coral" />
                    <span>Quarterly newsletter update</span>
                  </li>
                </ul>
              </div>
              <button onClick={handleCopyUPI} className="btn-secondary-cream w-full text-xs justify-center">
                <span>Donate via UPI</span>
              </button>
            </div>

            {/* Tier 2: Featured Light Tier - Cultural Guardian */}
            <div className="card-feature-cream border-coral/50 ring-2 ring-coral/30 shadow-md flex flex-col justify-between relative overflow-hidden bg-surface-soft">
              <div className="absolute top-4 right-4">
                <span className="badge-coral-fill text-[10px]">Most Popular</span>
              </div>
              <div>
                <span className="text-xs text-coral font-semibold uppercase tracking-wider font-mono">Featured Support</span>
                <h3 className="font-serif text-2xl text-ink mt-1 mb-1">Cultural Guardian</h3>
                <div className="font-serif text-3xl text-coral font-normal mb-4">₹ 5,000</div>
                <p className="text-xs text-body leading-relaxed mb-6">
                  Sponsors full event logistics, Mahaprasadam, and youth volunteer kits for annual festivals.
                </p>
                <ul className="space-y-2 text-xs text-body mb-6">
                  <li className="flex items-center gap-2 text-ink font-medium">
                    <Check size={14} className="text-coral" />
                    <span>Event sponsorship & banner recognition</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink font-medium">
                    <Check size={14} className="text-coral" />
                    <span>VIP seating at Mahashivratri & Guru Poornima</span>
                  </li>
                  <li className="flex items-center gap-2 text-ink font-medium">
                    <Check size={14} className="text-coral" />
                    <span>Official MSD certificate of gratitude</span>
                  </li>
                </ul>
              </div>
              <button onClick={handleCopyUPI} className="btn-primary-coral w-full text-xs justify-center">
                <Heart size={14} />
                <span>Contribute ₹ 5,000 Now</span>
              </button>
            </div>

            {/* Tier 3: Rashtra Builder */}
            <div className="card-feature-cream flex flex-col justify-between">
              <div>
                <span className="badge-pill-cream mb-4 inline-block">Patron & Sponsor</span>
                <h3 className="font-serif text-2xl text-ink mb-1">Rashtra Builder</h3>
                <div className="font-serif text-3xl text-coral font-normal mb-4">₹ 25,000+</div>
                <p className="text-xs text-body leading-relaxed mb-6">
                  Empowers year-round social outreach, tribal school aid in Nagaland, and disability assistive device drives.
                </p>
                <ul className="space-y-2 text-xs text-body mb-6">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-coral" />
                    <span>State-level program patronage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-coral" />
                    <span>Permanent donor roll mention</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-coral" />
                    <span>Executive board invitation to annual gala</span>
                  </li>
                </ul>
              </div>
              <button onClick={handleCopyUPI} className="btn-secondary-cream w-full text-xs justify-center">
                <span>Custom Patron Contribution</span>
              </button>
            </div>

          </div>

          {/* Payment Methods Section (QR & Bank Transfer) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* UPI & QR Code Box */}
            <div className="card-feature-cream flex flex-col items-center text-center p-8">
              <div className="w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center text-coral mb-4">
                <QrCode size={24} />
              </div>
              <h3 className="font-serif text-xl text-ink mb-2">Scan & Pay via UPI / QR Code</h3>
              <p className="text-xs text-body mb-6 max-w-sm">
                Scan using Google Pay, PhonePe, Paytm, BHIM, or any banking app.
              </p>

              <div className="bg-white p-4 rounded-xl border border-hairline shadow-sm mb-6 flex flex-col items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg"
                  style={{ width: 200, height: 200 }}
                />
                <p className="text-[10px] text-muted-editorial mt-2 font-mono">Scan with any UPI app</p>
              </div>

              <div className="w-full max-w-sm bg-canvas p-3 rounded-lg border border-hairline flex items-center justify-between gap-2">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] text-muted-editorial uppercase font-mono">UPI VPA ID</div>
                  <div className="text-xs font-mono font-bold text-coral truncate">{UPI_ID}</div>
                </div>
                <button
                  onClick={handleCopyUPI}
                  className="btn-secondary-cream text-xs px-3 py-1.5 flex-shrink-0"
                >
                  <Copy size={12} />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Direct Bank Account Transfer */}
            <div className="card-feature-cream p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center text-coral mb-4">
                  <Building2 size={24} />
                </div>
                <h3 className="font-serif text-xl text-ink mb-2">Direct Bank Transfer (NEFT / RTGS / IMPS)</h3>
                <p className="text-xs text-body mb-6">
                  For wire transfers and corporate donations to our registered foundation account.
                </p>

                <div className="space-y-3 font-sans text-xs bg-canvas p-5 rounded-lg border border-hairline">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5 border-b border-hairline">
                    <span className="text-muted-editorial shrink-0">Account Name</span>
                    <span className="text-ink font-semibold text-right">MAHA SEVA DAL FOUNDATION</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5 border-b border-hairline">
                    <span className="text-muted-editorial shrink-0">Account Number</span>
                    <span className="font-mono text-coral font-bold tracking-wider text-right break-all">925010021495473</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5 border-b border-hairline">
                    <span className="text-muted-editorial shrink-0">IFSC Code</span>
                    <span className="font-mono text-ink font-semibold text-right">UTIB0004488</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5 border-b border-hairline">
                    <span className="text-muted-editorial shrink-0">Bank Name</span>
                    <span className="text-ink font-semibold text-right">Axis Bank</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5 border-b border-hairline">
                    <span className="text-muted-editorial shrink-0">Branch</span>
                    <span className="text-ink font-semibold text-right">Triplicane, Chennai</span>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-1.5">
                    <span className="text-muted-editorial shrink-0">Account Type</span>
                    <span className="text-ink font-semibold text-right">Savings Account</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-editorial">
                <ShieldCheck size={16} className="text-coral flex-shrink-0" />
                <span>80G Tax Exemption Eligible — Official receipts provided for all contributions.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Ephemeral Toast Alert */}
        {copied && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-white text-xs px-4 py-3 rounded-lg shadow-lg border border-hairline flex items-center gap-2 animate-fade-in">
            <Check size={16} className="text-coral" />
            <span>UPI ID copied to clipboard successfully!</span>
          </div>
        )}

      </section>
    </PageLayout>
  );
};

export default Support;
