import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Heart, Check, QrCode, Building2, Copy, ShieldCheck, X, Sparkles, ExternalLink } from "lucide-react";
import QRCode from "qrcode";

const UPI_ID = "MAB.037349044880004@AXISBANK";

interface DonationTier {
  id: string;
  badge: string;
  name: string;
  amount: number;
  amountLabel: string;
  popular?: boolean;
  description: string;
  benefits: string[];
  upiLink: string;
}

const DONATION_TIERS: DonationTier[] = [
  {
    id: "tier-1000",
    badge: "Community Supporter",
    name: "Seva Patron",
    amount: 1000,
    amountLabel: "₹ 1,000",
    description: "Supports food distribution and educational materials for 10 underprivileged children.",
    benefits: [
      "Food drive sponsorship",
      "Quarterly newsletter update",
      "80G Tax exemption receipt",
    ],
    upiLink: `upi://pay?pa=${UPI_ID}&pn=Maha+Seva+Dal+Foundation&am=1000&cu=INR&tn=Seva+Patron+₹1000`,
  },
  {
    id: "tier-5000",
    badge: "Featured Support",
    name: "Cultural Guardian",
    amount: 5000,
    amountLabel: "₹ 5,000",
    popular: true,
    description: "Sponsors full event logistics, Mahaprasadam, and youth volunteer kits for annual festivals.",
    benefits: [
      "Event sponsorship & banner recognition",
      "VIP seating at Mahashivratri & Guru Poornima",
      "Official MSD certificate of gratitude",
      "80G Tax exemption receipt",
    ],
    upiLink: `upi://pay?pa=${UPI_ID}&pn=Maha+Seva+Dal+Foundation&am=5000&cu=INR&tn=Cultural+Guardian+₹5000`,
  },
  {
    id: "tier-25000",
    badge: "Patron & Sponsor",
    name: "Rashtra Builder",
    amount: 25000,
    amountLabel: "₹ 25,000+",
    description: "Empowers year-round social outreach, tribal school aid in Nagaland, and disability assistive device drives.",
    benefits: [
      "State-level program patronage",
      "Permanent donor roll mention",
      "Executive board invitation to annual gala",
      "80G Tax exemption receipt",
    ],
    upiLink: `upi://pay?pa=${UPI_ID}&pn=Maha+Seva+Dal+Foundation&am=25000&cu=INR&tn=Rashtra+Builder+₹25000`,
  },
];

const Support = () => {
  const [copied, setCopied] = useState(false);
  const [qrUrls, setQrUrls] = useState<{ [key: string]: string }>({});
  const [selectedModalTier, setSelectedModalTier] = useState<DonationTier | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState<string>("open");

  const openUpiLink = `upi://pay?pa=${UPI_ID}&pn=Maha+Seva+Dal+Foundation&cu=INR`;

  // Generate 3 Separate QR codes + 1 Open Any Amount QR Code
  useEffect(() => {
    const generateAllQRs = async () => {
      try {
        const urls: { [key: string]: string } = {};

        // 1. Open QR (Any custom amount)
        urls["open"] = await QRCode.toDataURL(openUpiLink, {
          width: 320,
          margin: 2,
          color: { dark: "#1a0a00", light: "#ffffff" },
          errorCorrectionLevel: "H",
        });

        // 2. Three Dedicated Tier QR Codes
        for (const tier of DONATION_TIERS) {
          urls[tier.id] = await QRCode.toDataURL(tier.upiLink, {
            width: 320,
            margin: 2,
            color: { dark: "#1a0a00", light: "#ffffff" },
            errorCorrectionLevel: "H",
          });
        }

        setQrUrls(urls);
      } catch (err) {
        console.error("Failed to generate QR codes:", err);
      }
    };

    generateAllQRs();
  }, []);

  // Handle ESC key for enlarged modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedModalTier(null);
      }
    };
    if (selectedModalTier) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedModalTier]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentBottomTier = DONATION_TIERS.find((t) => t.id === activeBottomTab);
  const currentBottomQrUrl = qrUrls[activeBottomTab] || qrUrls["open"];

  return (
    <PageLayout>
      <section className="py-8 lg:py-12 bg-canvas relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <PageHeader
            category="Support & Donation"
            title="Contribute to Maha Seva Dal"
            subtitle="Your financial and volunteer contributions directly empower social welfare, cultural heritage, and youth service initiatives across India."
          />

          {/* 3-Tier Contribution Grid: Each with Dedicated Separate QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
            {DONATION_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`card-feature-cream flex flex-col justify-between ${
                  tier.popular
                    ? "border-coral/50 ring-2 ring-coral/30 shadow-md relative overflow-hidden bg-surface-soft"
                    : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="badge-coral-fill text-[10px]">Most Popular</span>
                  </div>
                )}

                <div>
                  <span
                    className={
                      tier.popular
                        ? "text-xs text-coral font-semibold uppercase tracking-wider font-mono inline-block mb-1"
                        : "badge-pill-cream mb-4 inline-block"
                    }
                  >
                    {tier.badge}
                  </span>
                  <h3 className="font-serif text-2xl text-ink mb-1">{tier.name}</h3>
                  <div className="font-serif text-3xl text-coral font-normal mb-3">
                    {tier.amountLabel}
                  </div>
                  <p className="text-xs text-body leading-relaxed mb-4">
                    {tier.description}
                  </p>

                  <ul className="space-y-2 text-xs text-body mb-5">
                    {tier.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={14} className="text-coral shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Dedicated Separate QR Code Box for this Tier */}
                  <div className="bg-white p-3.5 rounded-xl border border-hairline shadow-xs mb-4 flex flex-col items-center text-center">
                    <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#FF6200] mb-2 bg-[#FF6200]/10 px-2.5 py-0.5 rounded-full">
                      Scan to Pay {tier.amountLabel}
                    </div>

                    {qrUrls[tier.id] ? (
                      <img
                        src={qrUrls[tier.id]}
                        alt={`Separate QR Code for ${tier.name} ${tier.amountLabel}`}
                        className="w-36 h-36 rounded-lg object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedModalTier(tier)}
                        title="Click to enlarge QR Code"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-xs text-muted-editorial">
                        Generating QR...
                      </div>
                    )}

                    <div className="text-[10px] text-muted-editorial font-mono mt-1.5 flex items-center gap-1">
                      <span>Pre-set Amount:</span>
                      <strong className="text-ink">{tier.amountLabel}</strong>
                    </div>
                  </div>
                </div>

                {/* Actions: Direct Mobile UPI App & Enlarge QR */}
                <div className="space-y-2 pt-2">
                  <a
                    href={tier.upiLink}
                    className={`w-full text-xs justify-center flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all ${
                      tier.popular
                        ? "bg-[#FF6200] hover:bg-[#e05600] text-white shadow-sm hover:shadow"
                        : "bg-canvas hover:bg-surface-soft text-ink border border-hairline"
                    }`}
                  >
                    <Heart size={14} className={tier.popular ? "stroke-white fill-transparent" : "text-coral"} />
                    <span>Pay {tier.amountLabel} via UPI App</span>
                  </a>

                  <button
                    onClick={() => setSelectedModalTier(tier)}
                    className="w-full text-[11px] text-muted-editorial hover:text-[#FF6200] font-medium flex items-center justify-center gap-1.5 transition-colors py-1"
                  >
                    <QrCode size={13} />
                    <span>Enlarge QR / Copy UPI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods Section (Interactive QR Switcher & Bank Transfer) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Interactive Multi-Tier UPI & QR Code Box */}
            <div className="card-feature-cream flex flex-col items-center text-center p-6 sm:p-8">
              <div className="w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center text-coral mb-3">
                <QrCode size={24} />
              </div>
              <h3 className="font-serif text-xl text-ink mb-1">Scan & Pay via UPI / QR Code</h3>
              <p className="text-xs text-body mb-4 max-w-sm">
                Select your contribution tier below to switch the QR code with pre-set amount:
              </p>

              {/* Tier Switcher Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-surface-card rounded-xl border border-hairline mb-5 max-w-full">
                <button
                  onClick={() => setActiveBottomTab("open")}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeBottomTab === "open"
                      ? "bg-[#FF6200] text-white shadow-xs font-semibold"
                      : "text-muted-editorial hover:text-ink hover:bg-canvas"
                  }`}
                >
                  Any Amount
                </button>
                {DONATION_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setActiveBottomTab(tier.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      activeBottomTab === tier.id
                        ? "bg-[#FF6200] text-white shadow-xs font-semibold"
                        : "text-muted-editorial hover:text-ink hover:bg-canvas"
                    }`}
                  >
                    {tier.amountLabel}
                  </button>
                ))}
              </div>

              {/* Selected QR Display */}
              <div className="bg-white p-4 rounded-xl border border-hairline shadow-sm mb-4 flex flex-col items-center justify-center">
                {currentBottomQrUrl ? (
                  <img
                    src={currentBottomQrUrl}
                    alt="Active UPI QR Code"
                    className="w-48 h-48 rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-muted-editorial">
                    Generating QR...
                  </div>
                )}
                <div className="text-[11px] text-muted-editorial mt-2 font-mono flex items-center gap-1">
                  <span>Selected:</span>
                  <strong className="text-[#FF6200] font-bold">
                    {currentBottomTier ? `${currentBottomTier.name} (${currentBottomTier.amountLabel})` : "Open Contribution"}
                  </strong>
                </div>
              </div>

              {/* Copy UPI VPA Box */}
              <div className="w-full max-w-sm bg-canvas p-3 rounded-lg border border-hairline flex items-center justify-between gap-2 mb-2">
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

              <p className="text-[10px] text-muted-editorial">
                Compatible with Google Pay, PhonePe, Paytm, BHIM, Cred, and all UPI mobile banking apps.
              </p>
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

        {/* Enlarged Dedicated QR Payment Modal */}
        {selectedModalTier && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedModalTier(null)}
          >
            <div
              className="bg-canvas border border-[#E8E2D9] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedModalTier(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-soft hover:bg-[#FF6200] hover:text-white text-ink flex items-center justify-center transition-colors border border-hairline shadow-sm"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <span className="inline-block px-3 py-1 rounded-full bg-[#FF6200]/10 text-xs font-semibold text-[#FF6200] uppercase tracking-wider mb-2 font-mono">
                {selectedModalTier.badge}
              </span>

              <h3 className="font-serif text-2xl text-ink font-semibold">
                {selectedModalTier.name}
              </h3>

              <div className="font-serif text-3xl text-coral font-bold mt-1 mb-4">
                {selectedModalTier.amountLabel}
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-xl border border-hairline shadow-sm inline-block mx-auto mb-4">
                {qrUrls[selectedModalTier.id] && (
                  <img
                    src={qrUrls[selectedModalTier.id]}
                    alt={`QR Code for ${selectedModalTier.name}`}
                    className="w-56 h-56 rounded-lg object-contain mx-auto"
                  />
                )}
                <div className="mt-2 text-xs font-mono text-muted-editorial">
                  Scan with GPay, PhonePe, Paytm, or BHIM
                </div>
              </div>

              {/* UPI ID with Copy */}
              <div className="w-full bg-surface-soft p-3 rounded-lg border border-hairline flex items-center justify-between gap-2 mb-4">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] text-muted-editorial uppercase font-mono">UPI ID (Maha Seva Dal)</div>
                  <div className="text-xs font-mono font-bold text-coral truncate">{UPI_ID}</div>
                </div>
                <button
                  onClick={handleCopyUPI}
                  className="btn-secondary-cream text-xs px-3 py-1.5 shrink-0"
                >
                  <Copy size={12} />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Mobile Direct Pay Link */}
              <a
                href={selectedModalTier.upiLink}
                className="btn-primary-coral w-full text-xs justify-center flex items-center gap-2 mb-3 py-2.5 rounded-full"
              >
                <Heart size={14} />
                <span>Open in UPI App (Pay {selectedModalTier.amountLabel})</span>
              </a>

              <p className="text-[11px] text-muted-editorial">
                Pre-configured for <strong>{selectedModalTier.amountLabel}</strong> · Eligible for 80G tax exemption
              </p>
            </div>
          </div>
        )}

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
