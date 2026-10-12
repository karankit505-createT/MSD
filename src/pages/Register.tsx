import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import DigitalIdCard from "@/components/DigitalIdCard";
import { getApiUrl } from "@/config/api";
import {
  User,
  MapPin,
  Briefcase,
  ShieldCheck,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Printer,
  Sparkles,
  AlertCircle,
  Clock,
  Heart,
  Phone,
  Mail,
  Scale,
  Stethoscope,
  GraduationCap,
  Trophy,
  UtensilsCrossed,
  Users,
  UserPlus,
  Search,
  Copy,
  Check,
  RefreshCw,
  FileText,
} from "lucide-react";

const INDIAN_STATES = [
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Andhra Pradesh",
  "Jharkhand",
  "Maharashtra",
  "Kerala",
  "Delhi",
  "Uttar Pradesh",
  "Bihar",
  "Gujarat",
  "Rajasthan",
  "Punjab",
  "Haryana",
  "Odisha",
  "West Bengal",
  "Assam",
  "Other",
];

const WINGS = [
  {
    id: "Legal Wing",
    title: "Legal Wing",
    description: "Pro-bono legal counsel, citizen rights protection, and statutory advocacy.",
    icon: Scale,
  },
  {
    id: "Medical & Health Wing",
    title: "Medical & Health Wing",
    description: "Free medical health check-up camps, blood donation drives, and emergency aid.",
    icon: Stethoscope,
  },
  {
    id: "Education & Child Welfare",
    title: "Education & Child Welfare",
    description: "Academic coaching for underprivileged youth, book distribution, and scholarships.",
    icon: GraduationCap,
  },
  {
    id: "Youth & Sports Wing",
    title: "Youth & Sports Wing",
    description: "Athletics training, regional tournaments, discipline, and youth leadership camps.",
    icon: Trophy,
  },
  {
    id: "Community Seva & Mahaprasadam",
    title: "Community Seva & Mahaprasadam",
    description: "Mass food distribution at annual assemblies (Guru Poornima, Mahashivratri).",
    icon: UtensilsCrossed,
  },
  {
    id: "General Seva Cadre",
    title: "General Seva Cadre",
    description: "Multi-disciplinary volunteers for community development and on-ground activities.",
    icon: Users,
  },
];

interface RegisterProps {
  defaultTab?: "register" | "status";
}

const Register: React.FC<RegisterProps> = ({ defaultTab = "register" }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const urlQuery = searchParams.get("id") || searchParams.get("query") || searchParams.get("mobile") || "";
  const initialTab =
    defaultTab === "status" ||
    location.pathname === "/status" ||
    location.pathname === "/verify" ||
    searchParams.get("tab") === "status" ||
    !!urlQuery
      ? "status"
      : "register";

  const [activeTab, setActiveTab] = useState<"register" | "status">(initialTab);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [registeredMember, setRegisteredMember] = useState<any>(null);

  // Status Check Portal State
  const [statusQuery, setStatusQuery] = useState(urlQuery);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusQrUrl, setStatusQrUrl] = useState<string>("");
  const [copiedId, setCopiedId] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    gender: "Male",
    mobile: "",
    whatsapp: "",
    email: "",
    bloodGroup: "",
    state: "Karnataka",
    district: "",
    taluk: "",
    address: "",
    pincode: "",
    qualification: "Graduate",
    profession: "",
    wing: "Legal Wing",
    hoursAvailable: "5-10 hours/month",
    idProofType: "Aadhaar Card",
    idProofNumber: "",
    pledgeAccepted: true,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (urlQuery) {
      setActiveTab("status");
      fetchStatus(urlQuery);
    }
  }, []);

  const handleCopyId = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const fetchStatus = async (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : statusQuery).trim();
    if (!q) {
      setStatusError("Please enter your Registration ID or 10-digit mobile number.");
      return;
    }

    setStatusLoading(true);
    setStatusError("");
    setStatusResult(null);
    setStatusQrUrl("");

    try {
      const res = await fetch(getApiUrl(`/api/members/status?query=${encodeURIComponent(q)}`));
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "No member application found with the given details.");
      }

      setStatusResult(json.member);

      // If member is APPROVED, generate QR code for the ID card
      if (json.member.status === "APPROVED") {
        const qrText = `https://mahasevadal.org/verify?id=${json.member.registrationId}&name=${encodeURIComponent(
          json.member.fullName
        )}&wing=${encodeURIComponent(json.member.wing)}`;
        const qr = await QRCode.toDataURL(qrText, { width: 180, margin: 1 });
        setStatusQrUrl(qr);
      }
    } catch (err: any) {
      setStatusError(err.message || "Failed to check member status. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validateStep = (currentStep: number) => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!formData.fullName.trim()) return "Please enter your full name.";
      if (!formData.fatherName.trim()) return "Please enter father's / guardian's name.";
      if (!formData.dob) return "Please select your date of birth.";
      if (!formData.mobile.trim() || formData.mobile.trim().length < 10)
        return "Please enter a valid 10-digit mobile number.";
    }
    if (currentStep === 2) {
      if (!formData.state) return "Please select your state.";
      if (!formData.district.trim()) return "Please enter your district.";
      if (!formData.address.trim()) return "Please enter your residential address.";
      if (!formData.pincode.trim() || formData.pincode.trim().length < 6)
        return "Please enter a valid 6-digit PIN code.";
    }
    if (currentStep === 3) {
      if (!formData.wing) return "Please choose an MSD Wing.";
    }
    if (currentStep === 4) {
      if (!formData.pledgeAccepted)
        return "You must accept the Maha Seva Dal 1947 Seva Pledge to enroll.";
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep(4);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, String(val));
      });
      if (photoFile) {
        data.append("photo", photoFile);
      }

      const res = await fetch(getApiUrl("/api/members/register"), {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit registration");
      }

      // Record submitted member for official acknowledgment slip
      // CRITICAL: No ID card or download options are shown at registration time!
      setRegisteredMember(json.member);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-8 lg:py-14 bg-canvas min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            category="Estd. 1947 · National Cadre Registry"
            title="Cadre Membership & Verification"
            subtitle="Enroll as an official Maha Seva Dal member or track your application status to retrieve your verified PVC Digital Identity Card once approved."
          />

          {/* Top Toggle Tabs */}
          <div className="flex border-b border-hairline mb-8 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`pb-3 px-4 font-semibold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "register"
                  ? "border-[#cc785c] text-[#cc785c]"
                  : "border-transparent text-muted-editorial hover:text-ink"
              }`}
            >
              <UserPlus size={16} />
              <span>1. Cadre Registration</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("status")}
              className={`pb-3 px-4 font-semibold text-xs sm:text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "status"
                  ? "border-[#cc785c] text-[#cc785c]"
                  : "border-transparent text-muted-editorial hover:text-ink"
              }`}
            >
              <Search size={16} />
              <span>2. Check Status & Download ID Card</span>
            </button>
          </div>

          {activeTab === "register" ? (
            /* If successfully registered, show official acknowledgment slip (NO CARD, NO DOWNLOAD OPTIONS) */
            registeredMember ? (
              <div className="card-feature-cream bg-white border border-hairline shadow-lg rounded-2xl p-6 sm:p-10 animate-fade-in">
                {/* Submission Success Alert */}
                <div className="flex items-start gap-4 text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-4 sm:p-5 mb-6">
                  <CheckCircle2 size={26} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-emerald-900">
                      Enrollment Application Submitted Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                      Your membership application has been received and saved in the National Cadre registry. Application Status:{" "}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 ml-1">
                        <Clock size={12} /> Pending Committee Verification
                      </span>
                    </p>
                  </div>
                </div>

                {/* Important Policy Notice: NO Card at registration time */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 mb-6 text-xs text-amber-900 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-950 mb-0.5">
                      Identity Card Issuance Notice:
                    </p>
                    <p className="text-amber-800 leading-relaxed">
                      In accordance with Maha Seva Dal cadre bylaws, official PVC Digital Identity Cards and card download options are unlocked <strong>only after administrative committee verification and approval</strong>. No ID card is issued at the time of registration.
                    </p>
                  </div>
                </div>

                {/* Official Application Receipt Card */}
                <div className="border border-hairline rounded-xl bg-surface-soft/40 p-5 sm:p-6 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline mb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-muted-editorial uppercase tracking-wider block">
                        Official Registration Number
                      </span>
                      <span className="text-xl sm:text-2xl font-mono font-bold text-ink">
                        {registeredMember.registrationId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyId(registeredMember.registrationId)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-hairline bg-white hover:bg-surface-soft text-body hover:text-ink transition-colors self-start sm:self-auto shadow-xs"
                    >
                      {copiedId ? (
                        <>
                          <Check size={14} className="text-emerald-600" />
                          <span className="text-emerald-700">Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Registration ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-muted-editorial block mb-0.5">Applicant Name</span>
                      <span className="font-semibold text-ink text-sm">{registeredMember.fullName}</span>
                    </div>
                    <div>
                      <span className="text-muted-editorial block mb-0.5">Assigned Wing</span>
                      <span className="font-semibold text-ink text-sm">{registeredMember.wing}</span>
                    </div>
                    <div>
                      <span className="text-muted-editorial block mb-0.5">State & District</span>
                      <span className="font-semibold text-ink text-sm">{registeredMember.district}, {registeredMember.state}</span>
                    </div>
                    <div>
                      <span className="text-muted-editorial block mb-0.5">Registered Mobile</span>
                      <span className="font-medium text-ink">{registeredMember.mobile}</span>
                    </div>
                    <div>
                      <span className="text-muted-editorial block mb-0.5">Blood Group</span>
                      <span className="font-medium text-ink">{registeredMember.bloodGroup || "Not Specified"}</span>
                    </div>
                    <div>
                      <span className="text-muted-editorial block mb-0.5">Application Date</span>
                      <span className="font-medium text-ink">
                        {new Date(registeredMember.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Track Status, Register Another, Home */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-hairline">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusQuery(registeredMember.registrationId);
                      setActiveTab("status");
                      fetchStatus(registeredMember.registrationId);
                      setRegisteredMember(null);
                    }}
                    className="btn-primary-coral w-full sm:w-auto flex items-center justify-center gap-2 text-xs px-5 py-2.5 font-bold shadow-md hover:shadow-lg"
                  >
                    <Search size={14} />
                    <span>Track Approval Status</span>
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setRegisteredMember(null);
                        setStep(1);
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="text-xs text-body hover:text-ink font-medium px-4 py-2 border border-hairline rounded-lg bg-surface-soft hover:bg-surface-card transition-colors w-full sm:w-auto text-center"
                    >
                      Register Another Member
                    </button>
                    <Link
                      to="/"
                      className="text-xs text-[#cc785c] hover:underline font-medium px-3 py-2 flex items-center justify-center whitespace-nowrap"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
            /* Multi-Step Enrollment Form */
            <div className="card-feature-cream bg-white border border-hairline shadow-md rounded-2xl p-6 sm:p-10">
              {/* Stepper Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {[
                    { num: 1, label: "Personal Profile", icon: User },
                    { num: 2, label: "Jurisdiction", icon: MapPin },
                    { num: 3, label: "Professional & Wing", icon: Briefcase },
                    { num: 4, label: "Oath & Verification", icon: ShieldCheck },
                  ].map((s) => {
                    const IconComp = s.icon;
                    const isActive = step === s.num;
                    const isCompleted = step > s.num;
                    return (
                      <div key={s.num} className="flex-1 flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                            isCompleted
                              ? "bg-emerald-600 text-white shadow-sm"
                              : isActive
                              ? "bg-[#cc785c] text-white ring-4 ring-[#cc785c]/20 shadow-md"
                              : "bg-surface-soft text-muted-editorial border border-hairline"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={16} /> : <IconComp size={16} />}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-medium mt-1.5 hidden sm:block ${
                            isActive ? "text-[#cc785c] font-semibold" : "text-muted-editorial"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress bar line */}
                <div className="w-full bg-surface-soft h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#FF6200] to-[#cc785c] h-full transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3.5 mb-6 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl animate-fade-in">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* STEP 1: Personal Details */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Personal & Contact Profile</h3>
                      <p className="text-xs text-muted-editorial">
                        Provide official legal name and contact details as registered in identification documents.
                      </p>
                    </div>

                    {/* Photo Upload Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-surface-soft/60 border border-hairline">
                      <div className="relative">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-[#cc785c] shadow-sm"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-surface-card border-2 border-dashed border-hairline flex flex-col items-center justify-center text-muted-editorial">
                            <User size={32} />
                            <span className="text-[9px] mt-1">Passport Photo</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <label className="inline-flex items-center gap-2 cursor-pointer btn-secondary text-xs px-3.5 py-2">
                          <Upload size={14} />
                          <span>{photoPreview ? "Change Photograph" : "Upload Passport Photograph"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoSelect}
                          />
                        </label>
                        <p className="text-[11px] text-muted-editorial mt-1.5">
                          Recommended: Clean passport-size photo (JPG, PNG, or WEBP under 5MB).
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="e.g. S. Ramanathan"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Father's / Spouse's Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          placeholder="e.g. K. Sundaram"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Date of Birth <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Gender <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Primary Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
                          <input
                            type="tel"
                            name="mobile"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="10-digit Mobile"
                            className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="whatsapp"
                          maxLength={10}
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          placeholder="Optional if same as mobile"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Email Address <span className="text-muted-editorial font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. name@example.com (Optional)"
                            className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Blood Group <span className="text-muted-editorial font-normal">(Optional)</span>
                        </label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        >
                          <option value="">Select Blood Group (Optional)</option>
                          <option value="A+">A+ (A Positive)</option>
                          <option value="A-">A- (A Negative)</option>
                          <option value="B+">B+ (B Positive)</option>
                          <option value="B-">B- (B Negative)</option>
                          <option value="O+">O+ (O Positive)</option>
                          <option value="O-">O- (O Negative)</option>
                          <option value="AB+">AB+ (AB Positive)</option>
                          <option value="AB-">AB- (AB Negative)</option>
                          <option value="Not Specified">Not Specified / Don't Know</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Location & Jurisdiction */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Geographical Jurisdiction</h3>
                      <p className="text-xs text-muted-editorial">
                        Maha Seva Dal coordinates grassroots programs via State Committees and District Coordinators.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          State / Union Territory <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          District <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          placeholder="e.g. Bengaluru Urban, Chennai, Ranchi"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">Taluk / Constituency</label>
                        <input
                          type="text"
                          name="taluk"
                          value={formData.taluk}
                          onChange={handleInputChange}
                          placeholder="e.g. Shivajinagar, Mylapore"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          PIN Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="6-digit PIN"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-ink mb-1">
                          Full Residential Address <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          rows={3}
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Door No, Street Name, Landmark, Area..."
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Professional & Wing Allocation */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Professional Skills & Wing Choice</h3>
                      <p className="text-xs text-muted-editorial">
                        Select the specialized wing where your talent and skills can contribute to the society.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Highest Educational Qualification
                        </label>
                        <select
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        >
                          <option value="Matriculation (10th)">Matriculation (10th)</option>
                          <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                          <option value="Graduate (BA/B.Sc/B.Com/B.Tech)">Graduate (BA/B.Sc/B.Com/B.Tech)</option>
                          <option value="Post Graduate (MA/M.Sc/M.Tech)">Post Graduate (MA/M.Sc/M.Tech)</option>
                          <option value="Legal (LLB / LLM)">Legal Professional (LLB / LLM)</option>
                          <option value="Medical (MBBS / MD / BAMS)">Medical Professional (MBBS / MD / BAMS)</option>
                          <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Current Profession / Occupation
                        </label>
                        <input
                          type="text"
                          name="profession"
                          value={formData.profession}
                          onChange={handleInputChange}
                          placeholder="e.g. High Court Advocate, Teacher, Student, Doctor"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Wing Selection Grid */}
                    <div>
                      <label className="block text-xs font-medium text-ink mb-3">
                        Choose Primary MSD Wing <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {WINGS.map((w) => {
                          const IconComp = w.icon;
                          const isSelected = formData.wing === w.id;
                          return (
                            <div
                              key={w.id}
                              onClick={() => setFormData((prev) => ({ ...prev, wing: w.id }))}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "border-[#cc785c] bg-[#cc785c]/5 ring-2 ring-[#cc785c]/30 shadow-sm"
                                  : "border-hairline bg-surface-soft/60 hover:bg-surface-soft"
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-1.5">
                                <div
                                  className={`p-2 rounded-lg ${
                                    isSelected
                                      ? "bg-[#cc785c] text-white"
                                      : "bg-surface-card text-muted-editorial border border-hairline"
                                  }`}
                                >
                                  <IconComp size={16} />
                                </div>
                                <span className="font-serif font-bold text-sm text-ink">{w.title}</span>
                              </div>
                              <p className="text-[11px] text-muted-editorial leading-relaxed pl-1">
                                {w.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink mb-1">Time Commitment Available</label>
                      <select
                        name="hoursAvailable"
                        value={formData.hoursAvailable}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                      >
                        <option value="2-5 hours/month">2–5 hours / month</option>
                        <option value="5-10 hours/month">5–10 hours / month</option>
                        <option value="Weekends Only">Weekends Only</option>
                        <option value="On-Call for Cultural Assemblies & Drives">
                          On-Call for Cultural Assemblies & Food Drives
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 4: Verification & The 1947 Seva Pledge */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-hairline pb-3">
                      <h3 className="font-serif text-lg font-bold text-ink">Identity Verification & Oath</h3>
                      <p className="text-xs text-muted-editorial">
                        Confirm government identification details and take the founding pledge of Maha Seva Dal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          Government ID Type
                        </label>
                        <select
                          name="idProofType"
                          value={formData.idProofType}
                          onChange={handleInputChange}
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors"
                        >
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="Voter ID Card">Voter ID Card</option>
                          <option value="Bar Council ID">Bar Council Enrollment ID</option>
                          <option value="Driving License">Driving License</option>
                          <option value="Passport">Passport</option>
                          <option value="College / Student ID">College / Student ID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-ink mb-1">
                          ID Number / Enrollment Ref
                        </label>
                        <input
                          type="text"
                          name="idProofNumber"
                          value={formData.idProofNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. Last 4 digits of Aadhaar or Bar Council No"
                          className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c] transition-colors font-mono"
                        />
                      </div>
                    </div>

                    {/* Official 1947 Seva Pledge Box */}
                    <div className="bg-gradient-to-r from-[#faf7ee] to-[#f4ece0] border-2 border-[#e6dbc8] rounded-xl p-5 sm:p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-[#cc785c]">
                        <ShieldCheck size={18} />
                        <span className="font-serif font-bold text-sm uppercase tracking-wider text-ink">
                          The 1947 Maha Seva Dal Pledge
                        </span>
                      </div>
                      <blockquote className="font-serif text-xs sm:text-sm text-ink/80 italic leading-relaxed border-l-2 border-[#cc785c] pl-4 my-3">
                        “I solemnly pledge to dedicate my service toward the foundational motto of Maha Seva Dal: Unity of People, selfless social welfare, youth empowerment, and communal harmony without bias of caste, creed, or regional differences.”
                      </blockquote>
                      <div className="mt-4 pt-3 border-t border-[#e2d6c1]">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.pledgeAccepted}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, pledgeAccepted: e.target.checked }))
                            }
                            className="mt-1 w-4 h-4 rounded text-[#cc785c] border-hairline focus:ring-[#cc785c]"
                          />
                          <span className="text-xs text-ink font-medium">
                            I accept the Maha Seva Dal Oath of Service and certify that all details provided are true and accurate.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Navigation Controls */}
                <div className="flex items-center justify-between pt-8 border-t border-hairline mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-secondary flex items-center gap-2 text-xs px-4 py-2.5"
                    >
                      <ArrowLeft size={14} />
                      <span>Previous Step</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary-coral flex items-center gap-2 text-xs px-5 py-2.5"
                    >
                      <span>Continue</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary-coral flex items-center gap-2 text-xs px-6 py-2.5 font-bold shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-1">⏳</span>
                          <span>Enrolling Member...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Submit Official Enrollment</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )
        ) : (
            /* Check Status & Download ID Card Portal */
            <div className="card-feature-cream bg-white border border-hairline shadow-lg rounded-2xl p-6 sm:p-10 animate-fade-in">
              {/* Portal Header */}
              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#cc785c]/10 text-[#cc785c] mb-3">
                  <ShieldCheck size={14} />
                  <span>National Cadre Verification</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
                  Check Membership Status & Download ID Card
                </h2>
                <p className="text-xs sm:text-sm text-muted-editorial mt-2">
                  Enter your Registration ID or 10-digit registered mobile number to check committee approval status. Once approved, your official Digital PVC Identity Card and download options will be unlocked.
                </p>
              </div>

              {/* Search Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchStatus();
                }}
                className="max-w-xl mx-auto mb-8"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={statusQuery}
                      onChange={(e) => {
                        setStatusQuery(e.target.value);
                        setStatusError("");
                      }}
                      placeholder="e.g. MSD-IND-2026-0001 or 9840123456"
                      className="w-full px-4 py-3 text-sm bg-surface-soft/60 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cc785c]/30 font-medium text-ink placeholder:text-muted-editorial/60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={statusLoading}
                    className="btn-primary-coral flex items-center justify-center gap-2 text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 whitespace-nowrap"
                  >
                    {statusLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} />
                        <span>Check Status</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Helper Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-muted-editorial">
                  <span>Quick search:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusQuery("MSD-IND-2026-0001");
                      fetchStatus("MSD-IND-2026-0001");
                    }}
                    className="text-[#cc785c] hover:underline font-mono font-medium bg-[#cc785c]/10 px-2 py-0.5 rounded"
                  >
                    MSD-IND-2026-0001 (Approved)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusQuery("MSD-IND-2026-0002");
                      fetchStatus("MSD-IND-2026-0002");
                    }}
                    className="text-amber-700 hover:underline font-mono font-medium bg-amber-100 px-2 py-0.5 rounded"
                  >
                    MSD-IND-2026-0002 (Pending)
                  </button>
                </div>
              </form>

              {/* Error Alert */}
              {statusError && (
                <div className="max-w-xl mx-auto flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 mb-8 text-xs animate-fade-in">
                  <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Application Not Found</p>
                    <p className="text-rose-700 mt-0.5">{statusError}</p>
                  </div>
                </div>
              )}

              {/* Status Results Display */}
              {statusResult && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                  {/* CASE 1: PENDING - NO CARD, NO DOWNLOAD OPTIONS */}
                  {statusResult.status === "PENDING" && (
                    <div className="border border-amber-200 bg-amber-50/70 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-300">
                        <Clock size={24} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 mb-2">
                        Status: Under Review (Pending)
                      </span>
                      <h3 className="text-lg font-bold text-amber-950">
                        Application Awaiting Committee Verification
                      </h3>
                      <p className="text-xs text-amber-800 mt-2 max-w-lg mx-auto">
                        Your application has been received and is currently under statutory review by the Maha Seva Dal Executive Committee. 
                        <strong> Official Digital Identity Cards and card download options are unlocked only after committee approval.</strong>
                      </p>

                      {/* Member Details */}
                      <div className="bg-white/80 border border-amber-200 rounded-xl p-4 mt-6 text-left grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-editorial block">Registration ID</span>
                          <span className="font-mono font-bold text-ink">{statusResult.registrationId}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Full Name</span>
                          <span className="font-semibold text-ink">{statusResult.fullName}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Wing</span>
                          <span className="font-medium text-ink">{statusResult.wing}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Region</span>
                          <span className="font-medium text-ink">{statusResult.district}, {statusResult.state}</span>
                        </div>
                      </div>

                      <div className="mt-5 text-[11px] text-amber-700 bg-amber-100/60 rounded-lg p-3">
                        💡 Please check back after 24-48 hours. Once the Admin approves your membership in the secretariat portal, your ID card download options will appear right here.
                      </div>
                    </div>
                  )}

                  {/* CASE 2: REJECTED - NO CARD, NO DOWNLOAD OPTIONS */}
                  {statusResult.status === "REJECTED" && (
                    <div className="border border-rose-200 bg-rose-50/70 rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3 border border-rose-300">
                        <AlertCircle size={24} />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-200 text-rose-900 mb-2">
                        Status: Application Not Approved (Rejected)
                      </span>
                      <h3 className="text-lg font-bold text-rose-950">
                        Membership Application Not Accepted
                      </h3>
                      <p className="text-xs text-rose-800 mt-2 max-w-lg mx-auto">
                        Your application could not be verified by the committee at this time. For clarification or to re-apply with corrected credentials, please reach out to the Maha Seva Dal Secretariat.
                      </p>

                      <div className="bg-white/80 border border-rose-200 rounded-xl p-4 mt-6 text-left grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-muted-editorial block">Registration ID</span>
                          <span className="font-mono font-bold text-ink">{statusResult.registrationId}</span>
                        </div>
                        <div>
                          <span className="text-muted-editorial block">Full Name</span>
                          <span className="font-semibold text-ink">{statusResult.fullName}</span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("register");
                            setStep(1);
                            setRegisteredMember(null);
                          }}
                          className="btn-secondary text-xs px-4 py-2 font-medium"
                        >
                          Submit New Application
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CASE 3: APPROVED - SHOW THE CARD AND DOWNLOAD OPTIONS */}
                  {statusResult.status === "APPROVED" && (
                    <div className="space-y-6">
                      {/* Approval Banner */}
                      <div className="flex items-start gap-4 text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-300">
                          <ShieldCheck size={22} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-emerald-950">
                              Membership Approved · Official Cadre Member
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 size={12} /> Verified
                            </span>
                          </div>
                          <p className="text-xs text-emerald-700 mt-1">
                            Congratulations! Your membership has been approved by the Maha Seva Dal Secretariat. Your official Digital PVC Identity Card is ready below with download and print options.
                          </p>
                        </div>
                      </div>

                      {/* Official PVC Digital Identity Card with Download & Print Options */}
                      <div className="flex justify-center pt-2">
                        <DigitalIdCard member={statusResult} qrDataUrl={statusQrUrl} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Register;
