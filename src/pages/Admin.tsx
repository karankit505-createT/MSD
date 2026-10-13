import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";
import { getApiUrl } from "@/config/api";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  ShieldCheck,
  X,
  LogOut,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
  Scale,
  Sparkles,
  FileJson,
  RotateCcw,
  Award,
  Upload,
  CreditCard,
  Check,
  FileText,
  Copy,
  ExternalLink,
  Droplet,
  User,
} from "lucide-react";
import QRCode from "qrcode";
import DigitalIdCard, {
  OfficialSealSvg,
  OfficialSignatureSvg,
  generateIdCardPdf,
  generateIdCardCanvas,
} from "@/components/DigitalIdCard";

interface Member {
  _id: string;
  registrationId: string;
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  bloodGroup: string;
  photoUrl: string;
  state: string;
  district: string;
  taluk?: string;
  address: string;
  pincode: string;
  qualification?: string;
  profession?: string;
  wing: string;
  hoursAvailable?: string;
  idProofType?: string;
  idProofNumber?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const INDIAN_STATES = [
  "ALL",
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
];

const WINGS = [
  "ALL",
  "Legal Wing",
  "Medical & Health Wing",
  "Education & Child Welfare",
  "Youth & Sports Wing",
  "Community Seva & Mahaprasadam",
  "General Seva Cadre",
];

const Admin = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("msd_admin_token")
  );

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("ALL");
  const [filterWing, setFilterWing] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Selected Member for Dossier Modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ID Card Seal & Signature Settings State
  const [cardSettingsModalOpen, setCardSettingsModalOpen] = useState(false);
  const [cardSettings, setCardSettings] = useState({
    customSealUrl: localStorage.getItem("msd_seal_image_url") || "",
    customSignatureUrl: localStorage.getItem("msd_signature_image_url") || "",
    signatoryName: localStorage.getItem("msd_signatory_name") || "Authorized Signatory",
    signatoryTitle: localStorage.getItem("msd_signatory_title") || "Central Executive Committee",
  });
  const [savingCardSettings, setSavingCardSettings] = useState(false);
  const [uploadingSeal, setUploadingSeal] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);

  // Dossier Tab & QR State
  const [dossierTab, setDossierTab] = useState<"dossier" | "card">("dossier");
  const [selectedMemberQr, setSelectedMemberQr] = useState<string>("");

  // Delete Confirmation Modal State
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Card Download & Copy State inside Modal
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleDownloadPdf = async (member: Member) => {
    setDownloadingPdf(true);
    try {
      await generateIdCardPdf(member, selectedMemberQr, cardSettings);
    } catch (err: any) {
      alert("PDF download failed: " + (err.message || "Unknown error"));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadPng = async (member: Member) => {
    setDownloadingPng(true);
    try {
      const dataUrl = await generateIdCardCanvas(member, selectedMemberQr, cardSettings);
      if (!dataUrl) throw new Error("Could not render card canvas.");
      const link = document.createElement("a");
      link.download = `MSD_ID_Card_${member.registrationId || "member"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert("Download error: " + (err.message || "Failed to download card"));
    } finally {
      setDownloadingPng(false);
    }
  };

  const handleCopyRegistrationId = (regId: string) => {
    navigator.clipboard.writeText(regId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Fetch Card Settings from API
  const fetchCardSettings = async () => {
    try {
      const res = await fetch(getApiUrl("/api/members/card-settings"));
      const data = await res.json();
      if (data && data.success && data.settings) {
        setCardSettings({
          customSealUrl: data.settings.customSealUrl || "",
          customSignatureUrl: data.settings.customSignatureUrl || "",
          signatoryName: data.settings.signatoryName || "Authorized Signatory",
          signatoryTitle: data.settings.signatoryTitle || "Central Executive Committee",
        });
      }
    } catch (e) {
      console.warn("Could not load card settings:", e);
    }
  };

  useEffect(() => {
    fetchCardSettings();
  }, []);

  // Generate QR code for selected member in dossier
  useEffect(() => {
    if (selectedMember) {
      const qrText = `https://mahasevadal.com/verify?id=${selectedMember.registrationId}&name=${encodeURIComponent(
        selectedMember.fullName
      )}&wing=${encodeURIComponent(selectedMember.wing)}`;
      QRCode.toDataURL(qrText, { width: 180, margin: 1 })
        .then(setSelectedMemberQr)
        .catch(() => setSelectedMemberQr(""));
    } else {
      setSelectedMemberQr("");
      setDossierTab("dossier");
    }
  }, [selectedMember]);

  // Upload Custom Seal
  const handleSealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingSeal(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(getApiUrl("/api/upload"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCardSettings((prev) => ({ ...prev, customSealUrl: data.url }));
        setStatusMessage("Official seal image uploaded successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert("Seal upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Seal upload failed: " + err.message);
    } finally {
      setUploadingSeal(false);
    }
  };

  // Upload Custom Signature
  const handleSignatureFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingSignature(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(getApiUrl("/api/upload"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCardSettings((prev) => ({ ...prev, customSignatureUrl: data.url }));
        setStatusMessage("Official signature image uploaded successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert("Signature upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Signature upload failed: " + err.message);
    } finally {
      setUploadingSignature(false);
    }
  };

  // Save Card Settings to Backend
  const handleSaveCardSettings = async () => {
    if (!token) return;
    setSavingCardSettings(true);
    try {
      const res = await fetch(getApiUrl("/api/members/admin/card-settings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cardSettings),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("msd_seal_image_url", cardSettings.customSealUrl || "");
        localStorage.setItem("msd_signature_image_url", cardSettings.customSignatureUrl || "");
        localStorage.setItem("msd_signatory_name", cardSettings.signatoryName || "");
        localStorage.setItem("msd_signatory_title", cardSettings.signatoryTitle || "");
        setStatusMessage("ID Card seal & signature settings saved successfully!");
        setTimeout(() => setStatusMessage(null), 4000);
        setCardSettingsModalOpen(false);
      } else {
        alert("Error saving settings: " + (data.error || "Failed"));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setSavingCardSettings(false);
    }
  };

  // Fetch Members
  const fetchMembers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        state: filterState,
        wing: filterWing,
        status: filterStatus,
      });

      const res = await fetch(
        getApiUrl(`/api/members/admin/all?${queryParams.toString()}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("msd_admin_token");
        setToken(null);
        return;
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load members.");
      }

      setMembers(json.data || []);
      if (json.stats) {
        setStats(json.stats);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMembers();
    }
  }, [token, filterState, filterWing, filterStatus]);

  // Debounced Search Trigger
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      fetchMembers();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Lock body & html scroll and handle Escape key when modals are open
  useEffect(() => {
    if (selectedMember || cardSettingsModalOpen || memberToDelete) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (memberToDelete) {
            setMemberToDelete(null);
          } else if (cardSettingsModalOpen) {
            setCardSettingsModalOpen(false);
          } else if (selectedMember) {
            setSelectedMember(null);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.classList.remove("modal-open");
        document.body.classList.remove("modal-open");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedMember, cardSettingsModalOpen, memberToDelete]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(getApiUrl("/api/members/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401 || res.status === 403) {
        setLoginError("Invalid username or password");
        return;
      }

      if (!res.ok) {
        setLoginError("Something went wrong. Please try again.");
        return;
      }

      const json = await res.json();
      if (!json?.token) {
        setLoginError("Something went wrong. Please try again.");
        return;
      }

      localStorage.setItem("msd_admin_token", json.token);
      setToken(json.token);
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("msd_admin_token");
    setToken(null);
    setMembers([]);
  };

  // Open Member Dossier
  const handleOpenMember = (member: Member) => {
    setSelectedMember(member);
  };

  // Update Member Status (Supports PENDING, APPROVED, REJECTED)
  const handleUpdateStatus = async (
    memberId: string,
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    if (!token) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch(
        getApiUrl(`/api/members/admin/${memberId}/status`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update status");

      // Update in local members list
      setMembers((prev) =>
        prev.map((m) => (m._id === memberId ? json.member : m))
      );

      // If currently opened in modal, update selectedMember
      if (selectedMember && selectedMember._id === memberId) {
        setSelectedMember(json.member);
      }

      setStatusMessage(`Status updated to ${status} for ${json.member.fullName}`);
      setTimeout(() => setStatusMessage(null), 4000);

      fetchMembers(); // refresh stats counts
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger Delete Confirmation Modal
  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
  };

  // Perform Permanent Member Deletion
  const confirmDeleteMember = async () => {
    if (!token || !memberToDelete) return;
    setDeleteLoading(true);

    try {
      const id = memberToDelete._id;
      const res = await fetch(getApiUrl(`/api/members/admin/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete member");

      setMembers((prev) => prev.filter((m) => m._id !== id));
      if (selectedMember?._id === id) {
        setSelectedMember(null);
      }
      setStatusMessage(`Member ${memberToDelete.fullName} (${memberToDelete.registrationId}) has been permanently deleted.`);
      setTimeout(() => setStatusMessage(null), 4000);
      setMemberToDelete(null);
      fetchMembers();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };


  // Download MongoDB Data Backup File (.json)
  const handleDownloadMongoBackup = async () => {
    if (!token) return;
    try {
      const res = await fetch(getApiUrl("/api/members/admin/export-json"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to export MongoDB data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `msd_members_mongodb_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (members.length === 0) {
      alert("No records to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Full Name",
      "Father Name",
      "Mobile",
      "Email",
      "Blood Group",
      "State",
      "District",
      "Address",
      "Pincode",
      "Wing",
      "Profession",
      "Status",
      "Date Enrolled",
    ];

    const rows = members.map((m) => [
      `"${m.registrationId}"`,
      `"${m.fullName}"`,
      `"${m.fatherName}"`,
      `"${m.mobile}"`,
      `"${m.email || ""}"`,
      `"${m.bloodGroup}"`,
      `"${m.state}"`,
      `"${m.district}"`,
      `"${m.address.replace(/"/g, '""')}"`,
      `"${m.pincode}"`,
      `"${m.wing}"`,
      `"${m.profession || ""}"`,
      `"${m.status}"`,
      `"${new Date(m.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `msd_members_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <PageLayout>
        <section className="py-16 lg:py-24 bg-canvas min-h-[85vh] flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="card-feature-cream bg-white border border-hairline shadow-xl rounded-2xl p-8 relative overflow-hidden">
              {/* Tricolor Stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6200] via-[#FF9933] to-[#138808] absolute top-0 left-0 right-0" />

              <div className="text-center mb-8">
                <img
                  src="https://res.cloudinary.com/wq9znxvs/image/upload/v1785928702/msd/brand/logo.png"
                  alt="MSD Logo"
                  className="w-16 h-16 rounded-full mx-auto mb-3 border border-hairline shadow-sm"
                />
                <h1 className="font-serif text-2xl font-bold text-ink">Maha Seva Dal</h1>
                <p className="text-xs text-[#FF6200] font-medium uppercase tracking-wider mt-0.5">
                  Central Cadre Administration Portal
                </p>
                <p className="text-xs text-muted-editorial mt-1">
                  Access official member registry & verification panel
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-username" className="block text-xs font-medium text-ink mb-1.5">
                    Admin Username
                  </label>
                  <input
                    id="admin-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter admin username"
                    value={username}
                    disabled={loginLoading}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    required
                    className="admin-login-input w-full text-sm px-3.5 py-2.5 rounded-lg bg-surface-soft text-ink placeholder:text-muted-editorial/60 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="admin-password" className="block text-xs font-medium text-ink mb-1.5">
                    Security Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      disabled={loginLoading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginError) setLoginError("");
                      }}
                      required
                      className="admin-login-input w-full text-sm pl-3.5 pr-11 py-2.5 rounded-lg bg-surface-soft text-ink placeholder:text-muted-editorial/60 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      disabled={loginLoading}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2.5 p-1 text-muted-editorial hover:text-ink focus:text-[#ff6200] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2.5 p-3 text-xs font-medium text-[#d92d20] bg-[#fef3f2] border border-[#fecdca] rounded-xl shadow-xs transition-all duration-200"
                  >
                    <AlertCircle size={15} className="shrink-0 text-[#d92d20]" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full btn-primary-coral text-xs py-3 font-semibold flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2 transition-all duration-200"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In to Admin Portal</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ───────────────────────────────────────────────
  return (
    <PageLayout>
      <section className="py-8 bg-canvas min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Admin Navigation Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-hairline mb-8">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/wq9znxvs/image/upload/v1785928702/msd/brand/logo.png"
                alt="MSD Logo"
                className="w-10 h-10 rounded-full border border-hairline"
              />
              <div>
                <h1 className="font-serif text-2xl font-bold text-ink">Central Cadre Directory</h1>
                <p className="text-xs text-muted-editorial">
                  Maha Seva Dal (Estd. 1947) · National Cadre Management & Approvals
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setCardSettingsModalOpen(true)}
                className="bg-[#faf3ee] hover:bg-[#faede3] text-[#FF6200] border border-[#e8d2be] text-xs px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Configure Official Seal and Signature"
              >
                <Award size={13} />
                <span>Card Seal & Signature</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
                title="Download CSV"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={fetchMembers}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
                title="Refresh list"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in shadow-xs">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* KPI Statistics Row (Clickable to Filter) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
              onClick={() => setFilterStatus("ALL")}
              className={`bg-white border p-5 rounded-2xl shadow-xs cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 select-none ${
                filterStatus === "ALL"
                  ? "border-[#FF6200] ring-2 ring-[#FF6200]/30 bg-[#faf6ee]/50"
                  : "border-hairline hover:border-[#FF6200]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-editorial uppercase tracking-wider">
                  Total Registrations
                </span>
                <Users size={18} className="text-[#FF6200]" />
              </div>
              <div className="font-serif text-3xl font-bold text-ink">{stats.total}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-muted-editorial">All Central Cadre</span>
                <span className="text-[10px] text-[#FF6200] font-bold">View All →</span>
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("PENDING")}
              className={`bg-white border p-5 rounded-2xl shadow-xs cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 select-none ${
                filterStatus === "PENDING"
                  ? "border-amber-500 ring-2 ring-amber-400/40 bg-amber-50/70"
                  : "border-amber-200/80 hover:border-amber-400 bg-amber-50/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Pending Verification
                </span>
                <Clock size={18} className="text-amber-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-amber-900">{stats.pending}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-amber-700">Awaiting Action</span>
                <span className="text-[10px] text-amber-700 font-bold">Filter Pending →</span>
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("APPROVED")}
              className={`bg-white border p-5 rounded-2xl shadow-xs cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 select-none ${
                filterStatus === "APPROVED"
                  ? "border-emerald-500 ring-2 ring-emerald-400/40 bg-emerald-50/70"
                  : "border-emerald-200/80 hover:border-emerald-400 bg-emerald-50/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Approved Members
                </span>
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-900">{stats.approved}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-emerald-700">Active Official Cadre</span>
                <span className="text-[10px] text-emerald-700 font-bold">Filter Approved →</span>
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("REJECTED")}
              className={`bg-white border p-5 rounded-2xl shadow-xs cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 select-none ${
                filterStatus === "REJECTED"
                  ? "border-rose-500 ring-2 ring-rose-400/40 bg-rose-50/70"
                  : "border-rose-200/80 hover:border-rose-400 bg-rose-50/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  Rejected
                </span>
                <XCircle size={18} className="text-rose-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-rose-900">{stats.rejected}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-rose-700">Declined Records</span>
                <span className="text-[10px] text-rose-700 font-bold">Filter Rejected →</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls Panel */}
          <div className="bg-white border border-hairline rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
            <div className="flex flex-col lg:flex-row gap-3.5 items-stretch lg:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-editorial" />
                <input
                  type="text"
                  placeholder="Search by Name, Phone, Reg ID, District..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl border border-hairline bg-surface-soft text-ink placeholder:text-muted-editorial focus:outline-none focus:border-[#FF6200] focus:bg-white transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-editorial hover:text-ink text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dropdown Filters & Reset */}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="text-xs px-3.5 py-2.5 rounded-xl border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] font-medium"
                >
                  <option value="ALL">All States (Jurisdiction)</option>
                  {INDIAN_STATES.filter((s) => s !== "ALL").map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <select
                  value={filterWing}
                  onChange={(e) => setFilterWing(e.target.value)}
                  className="text-xs px-3.5 py-2.5 rounded-xl border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] font-medium"
                >
                  <option value="ALL">All Assigned Wings</option>
                  {WINGS.filter((w) => w !== "ALL").map((wg) => (
                    <option key={wg} value={wg}>
                      {wg}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs px-3.5 py-2.5 rounded-xl border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] font-semibold"
                >
                  <option value="ALL">Status: All Records</option>
                  <option value="PENDING">Status: 🟡 Pending Only</option>
                  <option value="APPROVED">Status: 🟢 Approved Only</option>
                  <option value="REJECTED">Status: 🔴 Rejected Only</option>
                </select>

                {(search || filterState !== "ALL" || filterWing !== "ALL" || filterStatus !== "ALL") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterState("ALL");
                      setFilterWing("ALL");
                      setFilterStatus("ALL");
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl font-medium transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Live Count Bar */}
            <div className="flex items-center justify-between text-[11px] text-muted-editorial pt-3 mt-3 border-t border-hairline">
              <span>
                Showing <strong className="text-ink">{members.length}</strong> of{" "}
                <strong className="text-ink">{stats.total}</strong> registered members
              </span>
              {filterStatus !== "ALL" && (
                <span className="font-semibold text-[#FF6200]">
                  Active filter: Status is {filterStatus}
                </span>
              )}
            </div>
          </div>

          {/* Members Data Table */}
          <div className="bg-white border border-hairline rounded-xl shadow-sm overflow-hidden mb-12">
            {loading ? (
              <div className="p-16 text-center text-muted-editorial text-sm">
                <span className="animate-spin inline-block mr-2">⏳</span>
                <span>Loading member records from MongoDB...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="p-16 text-center">
                <Users size={36} className="mx-auto text-muted-editorial mb-3" />
                <h3 className="font-serif font-bold text-base text-ink mb-1">No Members Found</h3>
                <p className="text-xs text-muted-editorial mb-4">
                  There are no registrations matching your active filters.
                </p>
                <Link to="/register" className="btn-primary-coral text-xs px-4 py-2 inline-flex">
                  Enroll First Member
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-[11px] font-semibold text-muted-editorial uppercase tracking-wider">
                      <th className="py-3.5 px-4">Member Profile</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Registration ID</th>
                      <th className="py-3.5 px-4">State & District</th>
                      <th className="py-3.5 px-4">Selected Wing</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4 whitespace-nowrap">Enrolled On</th>
                      <th className="py-3.5 px-4 text-center whitespace-nowrap w-36">Status</th>
                      <th className="py-3.5 px-4 text-center whitespace-nowrap w-52">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline text-xs">
                    {members.map((member) => (
                      <tr key={member._id} className="hover:bg-surface-soft/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {member.photoUrl ? (
                              <img
                                src={member.photoUrl}
                                alt={member.fullName}
                                className="w-9 h-9 rounded-full object-cover border border-hairline shadow-sm"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-surface-soft border border-hairline flex items-center justify-center font-bold text-[#FF6200]">
                                {member.fullName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-ink font-sans text-sm">{member.fullName}</div>
                              <div className="text-[11px] text-muted-editorial">{member.profession || "Volunteer"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-ink text-[11px]">
                          <span className="bg-surface-soft px-2 py-1 rounded border border-hairline">
                            {member.registrationId}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-ink">{member.state}</div>
                          <div className="text-[11px] text-muted-editorial">{member.district}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="badge-coral-fill text-[10px] whitespace-nowrap">
                            {member.wing}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono text-ink text-[11px]">{member.mobile}</div>
                          <div className="text-[11px] text-muted-editorial truncate max-w-[140px]">
                            {member.email || "—"}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-muted-editorial whitespace-nowrap">
                          {new Date(member.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Status Badge - Centered under Status Header */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex justify-center">
                            {member.status === "APPROVED" ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                                <CheckCircle2 size={12} /> Approved
                              </span>
                            ) : member.status === "REJECTED" ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full shadow-2xs">
                                <XCircle size={12} /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                                <Clock size={12} /> Pending
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Member Actions: Review Dossier & Delete - Centered under Actions Header */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenMember(member)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 h-8.5 rounded-lg bg-[#FF6200] hover:bg-[#D65000] text-white font-medium text-xs shadow-xs hover:shadow transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.98]"
                              title="Review Member Dossier & Official ID Card"
                            >
                              <Eye size={13} />
                              <span>Review Dossier</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMember(member);
                              }}
                              className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer flex-shrink-0 active:scale-[0.98]"
                              title="Permanently Delete Member Record"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── MEMBER REVIEW DOSSIER & DIGITAL ID MODAL ───────────────────────── */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4 md:p-6 backdrop-blur-sm animate-fade-in overflow-hidden overscroll-none"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMember(null);
          }}
        >
          <div
            className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-5xl w-full flex flex-col h-[88vh] max-h-[850px] min-h-[480px] overflow-hidden"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-soft/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6200]/10 text-[#FF6200] flex items-center justify-center border border-[#FF6200]/20 flex-shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-ink">Official Member Dossier</h3>
                    <span className="font-mono text-xs font-semibold text-[#FF6200] bg-white px-2 py-0.5 rounded border border-hairline">
                      {selectedMember.registrationId}
                    </span>
                  </div>
                  <p className="text-xs text-muted-editorial">
                    National Socio-Cultural Cadre Registry · Verification & ID Management
                  </p>
                </div>
              </div>

              {/* Tabs & Close Button */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-hairline shadow-2xs">
                  <button
                    onClick={() => setDossierTab("dossier")}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      dossierTab === "dossier"
                        ? "bg-[#FF6200] text-white shadow-xs font-semibold"
                        : "text-muted-editorial hover:text-ink hover:bg-surface-soft"
                    }`}
                  >
                    <FileText size={13} />
                    <span>Dossier Details</span>
                  </button>
                  <button
                    onClick={() => setDossierTab("card")}
                    className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      dossierTab === "card"
                        ? "bg-[#FF6200] text-white shadow-xs font-semibold"
                        : "text-muted-editorial hover:text-ink hover:bg-surface-soft"
                    }`}
                  >
                    <CreditCard size={13} />
                    <span>Official ID Card & PDF</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft border border-hairline transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div
              tabIndex={0}
              className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar overscroll-contain space-y-6 focus:outline-none"
            >
              {dossierTab === "dossier" ? (
                <>
                  {/* Top Cadre Profile Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-surface-soft/80 via-white to-surface-soft/60 border border-hairline flex flex-col md:flex-row items-center md:items-start gap-5 shadow-2xs">
                    {/* Photo with status ring */}
                    <div className="relative flex-shrink-0">
                      {selectedMember.photoUrl ? (
                        <img
                          src={selectedMember.photoUrl}
                          alt={selectedMember.fullName}
                          className="w-24 h-28 rounded-xl object-cover border-2 border-hairline shadow-md"
                        />
                      ) : (
                        <div className="w-24 h-28 rounded-xl bg-surface-card border border-hairline flex flex-col items-center justify-center text-muted-editorial">
                          <User size={36} className="text-[#FF6200]" />
                          <span className="text-[10px] font-mono mt-1">No Photo</span>
                        </div>
                      )}
                      {selectedMember.status === "APPROVED" && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1 shadow-sm" title="Approved Cadre Member">
                          <CheckCircle2 size={15} />
                        </div>
                      )}
                    </div>

                    {/* Basic Info & Badges */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                        <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
                          {selectedMember.fullName}
                        </h2>
                        <span className="badge-coral-fill text-xs font-semibold px-2.5 py-0.5">
                          {selectedMember.wing}
                        </span>
                        {selectedMember.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 size={12} /> Approved Cadre
                          </span>
                        ) : selectedMember.status === "REJECTED" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full">
                            <XCircle size={12} /> Application Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                        <span className="text-muted-editorial font-medium">Registration ID:</span>
                        <span className="font-mono font-bold text-ink bg-surface-soft px-2 py-0.5 rounded border border-hairline">
                          {selectedMember.registrationId}
                        </span>
                        <button
                          onClick={() => handleCopyRegistrationId(selectedMember.registrationId)}
                          className="text-[11px] text-[#FF6200] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          title="Copy Registration ID"
                        >
                          {copiedId ? (
                            <>
                              <Check size={11} className="text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Quick Contact & Location Ribbon */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1.5 text-xs text-muted-editorial pt-1 border-t border-hairline/60">
                        <span className="flex items-center gap-1.5 text-body">
                          <MapPin size={13} className="text-[#FF6200]" />
                          <span>{selectedMember.district}, {selectedMember.state}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-body font-mono">
                          <Phone size={13} className="text-[#FF6200]" />
                          <span>{selectedMember.mobile}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                          <Droplet size={13} className="text-rose-500" />
                          <span>Blood: {selectedMember.bloodGroup}</span>
                        </span>
                        {selectedMember.email && (
                          <span className="flex items-center gap-1.5 text-muted-editorial">
                            <Mail size={13} className="text-[#FF6200]" />
                            <span>{selectedMember.email}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 Structured Information Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Personal & Demographic Info */}
                    <div className="bg-surface-soft/40 p-4 rounded-xl border border-hairline space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-hairline text-ink font-semibold text-xs">
                        <User size={14} className="text-[#FF6200]" />
                        <span>Personal Demographics</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Father / Spouse
                          </span>
                          <span className="font-medium text-ink">{selectedMember.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Date of Birth
                          </span>
                          <span className="font-medium text-ink">{selectedMember.dob}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Gender
                          </span>
                          <span className="font-medium text-ink">{selectedMember.gender}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Blood Group
                          </span>
                          <span className="font-semibold text-rose-600">{selectedMember.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Cadre Role & Service Commitment */}
                    <div className="bg-surface-soft/40 p-4 rounded-xl border border-hairline space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-hairline text-ink font-semibold text-xs">
                        <Briefcase size={14} className="text-[#FF6200]" />
                        <span>Cadre Role & Engagement</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Assigned Wing
                          </span>
                          <span className="font-semibold text-[#FF6200]">{selectedMember.wing}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Time Commitment
                          </span>
                          <span className="font-medium text-ink">{selectedMember.hoursAvailable || "Active volunteer"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Current Profession
                          </span>
                          <span className="font-medium text-ink">{selectedMember.profession || "Volunteer"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Highest Qualification
                          </span>
                          <span className="font-medium text-ink">{selectedMember.qualification || "Not specified"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Identification & KYC Proof */}
                    <div className="bg-surface-soft/40 p-4 rounded-xl border border-hairline space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-hairline text-ink font-semibold text-xs">
                        <ShieldCheck size={14} className="text-[#FF6200]" />
                        <span>Identity Proof & Verification</span>
                      </div>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-editorial">Government ID Type:</span>
                          <span className="font-semibold text-ink">{selectedMember.idProofType || "Government ID"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-editorial">ID Proof Number:</span>
                          <span className="font-mono font-semibold text-ink bg-white px-2 py-0.5 rounded border border-hairline">
                            {selectedMember.idProofNumber || "Verified"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-hairline/60">
                          <span className="text-muted-editorial">Online Verification:</span>
                          <a
                            href={`https://mahasevadal.com/verify?id=${selectedMember.registrationId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#FF6200] hover:underline font-mono text-[11px] flex items-center gap-1 font-semibold"
                          >
                            <span>mahasevadal.com</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Contact & Residential Location */}
                    <div className="bg-surface-soft/40 p-4 rounded-xl border border-hairline space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-hairline text-ink font-semibold text-xs">
                        <MapPin size={14} className="text-[#FF6200]" />
                        <span>Residential & Postal Details</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                            Full Street Address
                          </span>
                          <span className="font-medium text-ink">{selectedMember.address}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-hairline/60">
                          <div>
                            <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                              District & State
                            </span>
                            <span className="font-medium text-ink">{selectedMember.district}, {selectedMember.state}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-editorial block font-semibold uppercase tracking-wider">
                              PIN Code
                            </span>
                            <span className="font-mono font-medium text-ink">{selectedMember.pincode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* TAB 2: OFFICIAL PVC ID CARD & PDF DOWNLOAD CENTER */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (Card Preview) */}
                  <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-hairline">
                      <span className="text-xs font-bold text-ink uppercase tracking-wider">
                        Official PVC Identity Card
                      </span>
                      <span className="text-[11px] text-muted-editorial font-mono">
                        Standard PVC (85.6mm × 54mm equivalent ratio)
                      </span>
                    </div>

                    <DigitalIdCard
                      member={selectedMember}
                      qrDataUrl={selectedMemberQr}
                      customSealUrl={cardSettings.customSealUrl}
                      customSignatureUrl={cardSettings.customSignatureUrl}
                      signatoryName={cardSettings.signatoryName}
                      signatoryTitle={cardSettings.signatoryTitle}
                      hideActionButtons={true}
                    />
                  </div>

                  {/* Right Column: Card Actions & PDF Download Center */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Status & Seal Notice Card */}
                    <div className={`p-4 rounded-xl border ${
                      selectedMember.status === "APPROVED"
                        ? "bg-emerald-50/70 border-emerald-200"
                        : "bg-amber-50/70 border-amber-200"
                    }`}>
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          {selectedMember.status === "APPROVED" ? (
                            <span className="text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              Official Card Approved (Seal & Signature Active)
                            </span>
                          ) : (
                            <span className="text-amber-800 flex items-center gap-1">
                              <Clock size={14} className="text-amber-600" />
                              Provisional ID Card (Pending Approval)
                            </span>
                          )}
                        </span>
                        {selectedMember.status !== "APPROVED" && (
                          <button
                            onClick={() => handleUpdateStatus(selectedMember._id, "APPROVED")}
                            disabled={actionLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 shadow-xs cursor-pointer flex-shrink-0"
                          >
                            <CheckCircle2 size={12} />
                            <span>Approve & Seal</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-editorial leading-relaxed">
                        {selectedMember.status === "APPROVED"
                          ? "The official Maha Seva Dal seal and executive signature are digitally stamped onto this card and included in all downloads."
                          : "This card is marked PROVISIONAL. Approving this cadre member will instantly apply the authorized seal and signature."}
                      </p>
                    </div>

                    {/* Download Hub Options */}
                    <div className="p-4 rounded-xl bg-surface-soft/60 border border-hairline space-y-3">
                      <span className="text-[10px] font-bold text-muted-editorial uppercase tracking-wider block">
                        Download & Print Options
                      </span>

                      {/* Download PDF Button */}
                      <button
                        onClick={() => handleDownloadPdf(selectedMember)}
                        disabled={downloadingPdf || downloadingPng}
                        className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white p-3 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-white group-hover:underline">
                              Download ID Card (PDF)
                            </div>
                            <div className="text-[10px] text-blue-200">
                              A4 Printable Certificate with Verification Notice & Crop Lines
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-blue-200">
                          {downloadingPdf ? "Generating..." : "PDF →"}
                        </span>
                      </button>

                      {/* Download PNG Button */}
                      <button
                        onClick={() => handleDownloadPng(selectedMember)}
                        disabled={downloadingPdf || downloadingPng}
                        className="w-full btn-primary-coral p-3 rounded-xl flex items-center justify-between gap-3 shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 text-white">
                            <Download size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-white group-hover:underline">
                              Download Digital Card (PNG)
                            </div>
                            <div className="text-[10px] text-white/80">
                              Ultra-crisp 800×1200 PVC graphic for mobile or plastic card printers
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-white/90">
                          {downloadingPng ? "Rendering..." : "PNG →"}
                        </span>
                      </button>
                    </div>

                    {/* Seal & Signatory Settings Quick Box */}
                    <div className="p-3.5 rounded-xl bg-white border border-hairline flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                          Signatory Authority
                        </span>
                        <span className="font-bold text-ink">
                          {cardSettings.signatoryName} · {cardSettings.signatoryTitle}
                        </span>
                      </div>
                      <button
                        onClick={() => setCardSettingsModalOpen(true)}
                        className="text-[#FF6200] hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Change Seal / Sign</span> →
                      </button>
                    </div>

                    {/* Verification Notice */}
                    <div className="p-3 rounded-xl bg-surface-soft/40 border border-hairline text-[11px] text-muted-editorial space-y-1">
                      <div className="font-semibold text-ink flex items-center gap-1">
                        <ShieldCheck size={12} className="text-[#FF6200]" />
                        <span>National Cadre Registry Verification</span>
                      </div>
                      <p>
                        Scanning the card's QR code validates genuine membership at{" "}
                        <span className="font-mono text-[#FF6200]">https://mahasevadal.com/verify?id={selectedMember.registrationId}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Sticky Bottom Action Footer */}
            <div className="px-6 py-3.5 border-t border-hairline bg-surface-soft/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              {/* Left: Active Delete Option */}
              <button
                onClick={() => handleDeleteMember(selectedMember)}
                disabled={actionLoading}
                className="text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all border border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white cursor-pointer shadow-2xs"
                title="Permanently Delete this Cadre Member Record"
              >
                <Trash2 size={13} />
                <span>Delete Record</span>
              </button>

              {/* Right: Operational Status Controls & Close */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-muted-editorial font-medium mr-1 hidden sm:inline">
                  Change Status:
                </span>

                <button
                  onClick={() => handleUpdateStatus(selectedMember._id, "APPROVED")}
                  disabled={actionLoading}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs cursor-pointer ${
                    selectedMember.status === "APPROVED"
                      ? "bg-emerald-700 text-white ring-2 ring-emerald-500/30"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>{selectedMember.status === "APPROVED" ? "✓ Approved" : "Approve"}</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedMember._id, "REJECTED")}
                  disabled={actionLoading}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs cursor-pointer ${
                    selectedMember.status === "REJECTED"
                      ? "bg-rose-700 text-white ring-2 ring-rose-500/30"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                >
                  <XCircle size={13} />
                  <span>{selectedMember.status === "REJECTED" ? "✕ Rejected" : "Reject"}</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedMember._id, "PENDING")}
                  disabled={actionLoading}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs cursor-pointer ${
                    selectedMember.status === "PENDING"
                      ? "bg-amber-600 text-white ring-2 ring-amber-400/30"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                  }`}
                >
                  <RotateCcw size={13} />
                  <span>Pending</span>
                </button>

                <div className="h-6 w-px bg-hairline mx-1" />

                <button
                  onClick={() => setSelectedMember(null)}
                  className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CARD SEAL & SIGNATURE CONFIGURATION MODAL ───────────────────────── */}
      {cardSettingsModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-sm animate-fade-in overflow-hidden overscroll-none"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCardSettingsModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-xl w-full flex flex-col max-h-[88vh] overflow-hidden relative"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface-soft/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6200]/10 text-[#FF6200] flex items-center justify-center border border-[#FF6200]/20 flex-shrink-0">
                  <Award size={19} />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-ink">ID Card Seal & Signature Settings</h3>
                  <p className="text-[11px] sm:text-xs text-muted-editorial">
                    Configure authorized seal and digital signature applied to ID cards
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCardSettingsModalOpen(false)}
                className="p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft border border-hairline transition-colors cursor-pointer flex-shrink-0"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div
              tabIndex={0}
              className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 max-h-[calc(88vh-130px)] custom-scrollbar overscroll-contain space-y-5 focus:outline-none"
            >
              {/* Live Preview Card Box */}
              <div className="p-4 rounded-xl bg-surface-soft border border-hairline">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-editorial block mb-2">
                  Live Stamp & Signature Preview
                </span>
                <div className="bg-white p-4 rounded-lg border border-[#e8ddcb] flex items-center justify-around gap-4">
                  {/* Seal Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-muted-editorial mb-1">Official Seal</span>
                    {cardSettings.customSealUrl ? (
                      <div className="relative group">
                        <img
                          src={cardSettings.customSealUrl}
                          alt="Custom Seal"
                          className="w-16 h-16 object-contain rounded-full border border-hairline p-0.5"
                        />
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded block text-center mt-1">
                          Custom Image
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <OfficialSealSvg className="w-16 h-16" />
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded block text-center mt-1">
                          Official Digital Stamp
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-16 w-px bg-hairline" />

                  {/* Signature Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-medium text-muted-editorial mb-1">Authorized Signature</span>
                    {cardSettings.customSignatureUrl ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={cardSettings.customSignatureUrl}
                          alt="Custom Signature"
                          className="h-10 max-w-[130px] object-contain"
                        />
                        <div className="w-24 border-t border-ink/70 mt-1" />
                        <span className="text-[8px] font-bold text-ink mt-0.5">{cardSettings.signatoryName}</span>
                        <span className="text-[7px] text-muted-editorial">{cardSettings.signatoryTitle}</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded block text-center mt-1">
                          Custom Image
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <OfficialSignatureSvg className="h-10 w-28 text-blue-900" />
                        <div className="w-24 border-t border-ink/70 mt-1" />
                        <span className="text-[8px] font-bold text-ink mt-0.5">{cardSettings.signatoryName}</span>
                        <span className="text-[7px] text-muted-editorial">{cardSettings.signatoryTitle}</span>
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded block text-center mt-1">
                          Official Digital Signature
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Official Seal Image */}
              <div className="border border-hairline rounded-xl p-3.5 bg-white">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <label className="text-xs font-bold text-ink block">Official Organization Seal (Stamp)</label>
                    <p className="text-[11px] text-muted-editorial">
                      Upload your high-res seal (PNG with transparent background recommended) or leave empty for the built-in official seal.
                    </p>
                  </div>
                  {cardSettings.customSealUrl && (
                    <button
                      type="button"
                      onClick={() => setCardSettings((p) => ({ ...p, customSealUrl: "" }))}
                      className="text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <Trash2 size={11} />
                      <span>Use Default Stamp</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="btn-secondary text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1.5 hover:bg-surface-soft">
                    <Upload size={13} />
                    <span>{uploadingSeal ? "Uploading..." : "Upload Seal Image (PNG)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSealFileUpload}
                      disabled={uploadingSeal}
                      className="hidden"
                    />
                  </label>
                  {cardSettings.customSealUrl && (
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium truncate">
                      <Check size={12} /> Custom seal active
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Authorized Signature Image */}
              <div className="border border-hairline rounded-xl p-3.5 bg-white">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <label className="text-xs font-bold text-ink block">Authorized Signature</label>
                    <p className="text-[11px] text-muted-editorial">
                      Upload scanned signature (transparent PNG recommended) or leave empty for the built-in authorized digital signature.
                    </p>
                  </div>
                  {cardSettings.customSignatureUrl && (
                    <button
                      type="button"
                      onClick={() => setCardSettings((p) => ({ ...p, customSignatureUrl: "" }))}
                      className="text-[10px] text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <Trash2 size={11} />
                      <span>Use Default Signature</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="btn-secondary text-xs px-3 py-1.5 cursor-pointer flex items-center gap-1.5 hover:bg-surface-soft">
                    <Upload size={13} />
                    <span>{uploadingSignature ? "Uploading..." : "Upload Signature (PNG)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureFileUpload}
                      disabled={uploadingSignature}
                      className="hidden"
                    />
                  </label>
                  {cardSettings.customSignatureUrl && (
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium truncate">
                      <Check size={12} /> Custom signature active
                    </span>
                  )}
                </div>
              </div>

              {/* Signatory Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Signatory Title / Name</label>
                  <input
                    type="text"
                    value={cardSettings.signatoryName}
                    onChange={(e) => setCardSettings((p) => ({ ...p, signatoryName: e.target.value }))}
                    placeholder="Authorized Signatory"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Committee / Designation</label>
                  <input
                    type="text"
                    value={cardSettings.signatoryTitle}
                    onChange={(e) => setCardSettings((p) => ({ ...p, signatoryTitle: e.target.value }))}
                    placeholder="Central Executive Committee"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Sticky Bottom Action Footer */}
            <div className="px-6 py-3.5 border-t border-hairline bg-surface-soft/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setCardSettings({
                    customSealUrl: "",
                    customSignatureUrl: "",
                    signatoryName: "Authorized Signatory",
                    signatoryTitle: "Central Executive Committee",
                  })
                }
                className="text-xs text-muted-editorial hover:text-ink hover:underline cursor-pointer"
              >
                Reset all to defaults
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCardSettingsModalOpen(false)}
                  className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCardSettings}
                  disabled={savingCardSettings}
                  className="btn-primary-coral text-xs px-4 py-1.5 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {savingCardSettings ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check size={13} />
                      <span>Save & Apply Settings</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ─────────────────────────────────────── */}
      {memberToDelete && (
        <div
          className="fixed inset-0 z-[70] bg-black/65 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-hidden overscroll-none"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 relative"
            onWheel={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMemberToDelete(null)}
              disabled={deleteLoading}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 flex-shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">Delete Member Record</h3>
                <p className="text-xs text-rose-600 font-medium">Permanent & Irreversible Action</p>
              </div>
            </div>

            <div className="bg-surface-soft p-3.5 rounded-xl border border-hairline mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-editorial">Cadre Name:</span>
                <span className="font-bold text-ink">{memberToDelete.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-editorial">Registration ID:</span>
                <span className="font-mono font-bold text-[#FF6200]">{memberToDelete.registrationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-editorial">Wing / Region:</span>
                <span className="text-ink">
                  {memberToDelete.wing} ({memberToDelete.district})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-editorial">Current Status:</span>
                <span className="font-semibold">{memberToDelete.status}</span>
              </div>
            </div>

            <p className="text-xs text-muted-editorial mb-6 leading-relaxed">
              Are you sure you want to permanently delete this member record? This will remove all personal details, ID card registration, and stored photo from the database.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                disabled={deleteLoading}
                className="btn-secondary text-xs px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                disabled={deleteLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleteLoading ? (
                  <span>Deleting Record...</span>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Admin;
