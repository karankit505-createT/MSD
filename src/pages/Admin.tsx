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
  Shield,
  Lock,
  ArrowLeft,
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
  Calendar,
  MessageCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Activity,
} from "lucide-react";
import QRCode from "qrcode";
import DigitalIdCard, {
  OfficialSealSvg,
  OfficialSignatureSvg,
  generateIdCardPdf,
  generateIdCardCanvas,
  generateIdCardBackCanvas,
  generateCombinedIdCardCanvas,
  captureCardElement,
  combineCapturedCards,
  addPaddingToCardDataUrl,
  setPng300Dpi,
} from "@/components/DigitalIdCard";

interface Member {
  _id: string;
  registrationId: string;
  fullName: string;
  fatherName: string;
  dob: string;
  age?: number;
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
  profession?: string;
  wing: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNotes?: string;
  createdAt: string;
  approvedAt?: string;
}

const INDIAN_STATES = [
  "ALL",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
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

const formatDobDisplay = (dobString?: string): string => {
  if (!dobString) return "—";
  const parts = dobString.split("-");
  if (parts.length !== 3) return dobString;
  const [y, m, d] = parts;
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const idx = parseInt(m, 10) - 1;
  const monthName = monthNames[idx] || m;
  return `${parseInt(d, 10)} ${monthName} ${y}`;
};

const WhatsAppIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const getMemberWhatsAppUrl = (member: { whatsapp?: string; mobile?: string; fullName: string; registrationId: string }) => {
  const raw = member.whatsapp && member.whatsapp.trim() && member.whatsapp.toLowerCase() !== "same"
    ? member.whatsapp
    : member.mobile;
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  const full = digits.length === 10 ? `91${digits}` : digits;
  const text = encodeURIComponent(
    `Namaste ${member.fullName}, reaching out from Maha Seva Dal Secretariat regarding your registration (${member.registrationId}).`
  );
  return `https://wa.me/${full}?text=${text}`;
};

const Admin = () => {
  const [token, setToken] = useState<string | null>(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      localStorage.setItem("msd_admin_token", urlToken);
      return urlToken;
    }
    return localStorage.getItem("msd_admin_token");
  });

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dashboard Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    wingBreakdown?: Array<{ _id: string; count: number }>;
    stateBreakdown?: Array<{ _id: string; count: number }>;
    genderBreakdown?: Array<{ _id: string; count: number }>;
  }>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    wingBreakdown: [],
    stateBreakdown: [],
    genderBreakdown: [],
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Tab & Portal View Navigation State
  const [activeAdminTab, setActiveAdminTab] = useState<"directory" | "analytics">("directory");

  // Server-Side Pagination State
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);



  // Filters State
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("ALL");
  const [filterWing, setFilterWing] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Selected Member for Dossier Modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Quick Remarks Popup Modal State (Shows ONLY remarks)
  const [remarkModalMember, setRemarkModalMember] = useState<Member | null>(null);

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

  // Status Confirmation Modal State (Prevents Accidental One-Click Actions)
  const [statusActionTarget, setStatusActionTarget] = useState<{
    member: Member;
    targetStatus: "PENDING" | "APPROVED" | "REJECTED";
  } | null>(null);
  const [statusActionNote, setStatusActionNote] = useState<string>("");
  const [statusActionError, setStatusActionError] = useState<string | null>(null);

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
      let frontUrl = "";
      let backUrl = "";
      try {
        frontUrl = await captureCardElement("msd-pvc-card-front");
        backUrl = await captureCardElement("msd-pvc-card-back");
      } catch (e) {
        console.warn("DOM capture fallback for Admin PDF:", e);
      }
      await generateIdCardPdf(member, selectedMemberQr, cardSettings, frontUrl, backUrl);
    } catch (err: any) {
      alert("PDF download failed: " + (err.message || "Unknown error"));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadPng = async (member: Member, mode: "both" | "front" | "back" = "both") => {
    setDownloadingPng(true);
    try {
      let dataUrl = "";
      let filenameSuffix = "BothSides";
      if (mode === "front") {
        try {
          dataUrl = await captureCardElement("msd-pvc-card-front");
        } catch {
          dataUrl = await generateIdCardCanvas(member, selectedMemberQr, cardSettings);
        }
        dataUrl = await addPaddingToCardDataUrl(dataUrl, 48);
        filenameSuffix = "Front";
      } else if (mode === "back") {
        try {
          dataUrl = await captureCardElement("msd-pvc-card-back");
        } catch {
          dataUrl = await generateIdCardBackCanvas(member);
        }
        dataUrl = await addPaddingToCardDataUrl(dataUrl, 48);
        filenameSuffix = "Back";
      } else {
        try {
          const frontUrl = await captureCardElement("msd-pvc-card-front");
          const backUrl = await captureCardElement("msd-pvc-card-back");
          if (frontUrl && backUrl) {
            dataUrl = await combineCapturedCards(frontUrl, backUrl, 48, 48);
          } else {
            throw new Error("Incomplete DOM capture");
          }
        } catch {
          dataUrl = await generateCombinedIdCardCanvas(member, selectedMemberQr, cardSettings, 48, 48);
        }
        filenameSuffix = "BothSides";
      }
      if (!dataUrl) throw new Error("Could not render card canvas.");
      dataUrl = setPng300Dpi(dataUrl, 300);
      const link = document.createElement("a");
      link.download = `MSD_ID_Card_${filenameSuffix}_${member.registrationId || "member"}.png`;
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
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(getApiUrl("/api/upload"), {
        method: "POST",
        headers,
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
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(getApiUrl("/api/upload"), {
        method: "POST",
        headers,
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

  // Fetch Members (Supports Server-Side Pagination & Aggregations)
  const fetchMembers = async (targetPage = page, targetLimit = limit) => {
    if (!token) return;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        state: filterState,
        wing: filterWing,
        status: filterStatus,
        page: String(targetPage),
        limit: String(targetLimit),
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
      if (json.meta) {
        setPage(json.meta.page || 1);
        setTotalPages(json.meta.totalPages || 1);
        setTotalCount(json.meta.total || 0);
      }
      if (json.stats) {
        setStats((prev) => ({
          ...prev,
          total: json.stats.total ?? prev.total,
          pending: json.stats.pending ?? prev.pending,
          approved: json.stats.approved ?? prev.approved,
          rejected: json.stats.rejected ?? prev.rejected,
          wingBreakdown: json.stats.wingBreakdown || prev.wingBreakdown,
          stateBreakdown: json.stats.stateBreakdown || prev.stateBreakdown,
          genderBreakdown: json.stats.genderBreakdown || prev.genderBreakdown,
        }));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setPage(1);
      fetchMembers(1, limit);
    }
  }, [token, filterState, filterWing, filterStatus, limit]);

  // Debounced Search Trigger
  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchMembers(1, limit);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Lock body & html scroll and handle Escape key when modals are open
  useEffect(() => {
    if (selectedMember || cardSettingsModalOpen || memberToDelete || remarkModalMember || statusActionTarget) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (statusActionTarget) {
            setStatusActionTarget(null);
          } else if (remarkModalMember) {
            setRemarkModalMember(null);
          } else if (memberToDelete) {
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
  }, [selectedMember, cardSettingsModalOpen, memberToDelete, remarkModalMember, statusActionTarget]);

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

  // Trigger Status Confirmation Modal (Prevents Unintended One-Click Approval / Rejection)
  const handlePromptStatusChange = (
    member: Member,
    targetStatus: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    setStatusActionTarget({ member, targetStatus });
    setStatusActionNote(member.adminNotes || "");
    setStatusActionError(null);
  };

  // Perform Confirmed Status Update (Supports PENDING, APPROVED, REJECTED)
  const confirmStatusChange = async () => {
    if (!token || !statusActionTarget) return;
    const { member, targetStatus } = statusActionTarget;
    const memberId = member._id;

    // Compulsory rejection remarks validation
    if (targetStatus === "REJECTED" && !statusActionNote.trim()) {
      setStatusActionError("Rejection remarks are compulsory. Please select a preset or type a reason.");
      return;
    }

    setActionLoading(true);
    setStatusMessage(null);
    setStatusActionError(null);

    try {
      const payload: { status: "PENDING" | "APPROVED" | "REJECTED"; adminNotes?: string } = {
        status: targetStatus,
      };
      if (targetStatus === "PENDING") {
        payload.adminNotes = "";
      } else {
        payload.adminNotes = statusActionNote.trim();
      }

      const res = await fetch(
        getApiUrl(`/api/members/admin/${memberId}/status`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
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

      setStatusMessage(
        targetStatus === "APPROVED"
          ? `Cadre ${json.member.fullName} (${json.member.registrationId}) approved successfully! Official ID card activated.`
          : targetStatus === "REJECTED"
          ? `Application ${json.member.registrationId} marked as Rejected.`
          : `Application ${json.member.registrationId} reset to Pending Review.`
      );
      setTimeout(() => setStatusMessage(null), 4000);

      setStatusActionTarget(null);
      setStatusActionNote("");
      setStatusActionError(null);
      fetchMembers(page, limit);
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Quick Remarks Popup Modal
  const handleOpenQuickRemarks = (member: Member) => {
    setRemarkModalMember(member);
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
      "Admin Notes",
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
      `"${(m.adminNotes || "").replace(/"/g, '""')}"`,
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
      <PageLayout hideHeader hideFooter>
        <section className="relative h-screen max-h-screen bg-[#faf9f5] flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Background Lighting & Architectural Dot Grid */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Architectural Matrix Grid */}
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage: `radial-gradient(#d6cfc4 1px, transparent 1px)`,
                backgroundSize: "22px 22px",
              }}
            />
            {/* Tricolor Ambient Glow Orbs */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-gradient-to-b from-[#FF6200]/12 via-[#FF9933]/6 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-[360px] h-[360px] bg-[#138808]/8 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -left-24 w-[300px] h-[300px] bg-[#FF9933]/7 rounded-full blur-3xl" />
          </div>

          {/* Top Executive Navigation Bar */}
          <header className="relative z-10 w-full px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between border-b border-stone-200/60 bg-white/70 backdrop-blur-md shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-[#FF6200] transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-100/80 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to Public Portal</span>
            </Link>
          </header>

          {/* Main Login Card Container */}
          <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 sm:py-4 overflow-y-auto no-scrollbar">
            <div className="max-w-[420px] w-full mx-auto my-auto">
              {/* Card Container */}
              <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_20px_50px_rgba(20,20,19,0.07)] rounded-2xl p-6 sm:p-7 relative overflow-hidden transition-all">
                {/* Tricolor National Stripe */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6200] via-[#FF9933] to-[#138808] absolute top-0 left-0 right-0" />

                {/* Header Branding */}
                <div className="flex flex-col items-center text-center mb-5 pt-0.5">
                  {/* Emblem */}
                  <div className="mb-2.5">
                    <img
                      src="https://res.cloudinary.com/wq9znxvs/image/upload/v1792742541/msd/brand/logo.png"
                      alt="MSD Official Logo"
                      className="w-14 h-14 rounded-full mx-auto object-contain"
                    />
                  </div>

                  {/* Restricted Access Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[10px] font-bold tracking-wider uppercase text-[#c74c00] mb-2.5 shadow-2xs">
                    <Shield size={11} className="text-[#FF6200]" />
                    <span>Restricted Cadre Access</span>
                  </div>

                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    Maha Seva Dal
                  </h1>
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#FF6200] uppercase tracking-wider mt-0.5">
                    Central Cadre Administration Portal
                  </p>
                  <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                    Official Member Registry & Credential Management
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="admin-username"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Admin Username
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                        <User size={15} />
                      </div>
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
                        className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50/60 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#FF6200] focus:ring-4 focus:ring-[#FF6200]/15 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-semibold text-stone-700 mb-1"
                    >
                      Security Password
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-stone-400 pointer-events-none">
                        <Lock size={15} />
                      </div>
                      <input
                        id="admin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter security password"
                        value={password}
                        disabled={loginLoading}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (loginError) setLoginError("");
                        }}
                        required
                        className="w-full text-sm pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 bg-stone-50/60 text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-[#FF6200] focus:ring-4 focus:ring-[#FF6200]/15 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                      />
                      <button
                        type="button"
                        disabled={loginLoading}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 p-1 text-stone-400 hover:text-stone-700 focus:text-[#FF6200] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Session */}
                  <div className="flex items-center text-[11px] pt-0.5">
                    <label className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-stone-300 text-[#FF6200] focus:ring-[#FF6200]/30 accent-[#FF6200] cursor-pointer"
                        defaultChecked
                      />
                      <span>Remember session</span>
                    </label>
                  </div>

                  {loginError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2.5 p-2.5 text-xs font-medium text-[#d92d20] bg-[#fef3f2] border border-[#fecdca] rounded-xl shadow-xs transition-all duration-200"
                    >
                      <AlertCircle size={15} className="shrink-0 text-[#d92d20]" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full text-xs sm:text-sm py-2.5 sm:py-3 font-semibold text-white bg-gradient-to-r from-[#FF6200] to-[#E55500] hover:from-[#E55500] hover:to-[#CC4400] rounded-xl flex justify-center items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Sign In to Admin Portal</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Security Advisory */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
                  <Shield size={12} className="text-stone-400 shrink-0" />
                  <span>Authorized Central Secretariat & State Cadre Incharges Only</span>
                </div>
              </div>
            </div>
          </main>

          {/* Minimalist Dedicated Admin Footer */}
          <footer className="relative z-10 py-2.5 px-4 sm:px-8 text-center text-[11px] text-stone-500 border-t border-stone-200/60 bg-white/60 backdrop-blur-sm shrink-0">
            <span>
              Maha Seva Dal (Estd. 1947) · National Cadre Management System · All rights reserved
            </span>
          </footer>


        </section>
      </PageLayout>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ───────────────────────────────────────────────
  return (
    <PageLayout hideHeader>
      <section className="py-6 sm:py-8 bg-canvas min-h-screen">
        <div
          className="mx-auto px-2 sm:px-4"
          style={{ maxWidth: "1600px", width: "95%", margin: "0 auto" }}
        >
          {/* Top Admin Navigation Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-hairline mb-3">
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/wq9znxvs/image/upload/v1792742541/msd/brand/logo.png"
                alt="MSD Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0 object-contain shadow-xs"
              />
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-ink leading-tight">Central Cadre Directory</h1>
                <p className="text-[11px] text-muted-editorial">
                  Maha Seva Dal (Estd. 1947) · National Cadre Management & Approvals
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5"
                title="Download CSV"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => fetchMembers(page, limit)}
                className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1.5"
                title="Refresh list"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Portal Navigation Mode Switcher: Cadre Directory vs Intelligence & Analytics */}
          <div className="flex items-center gap-2 mb-3 border-b border-hairline/80 pb-2">
            <button
              type="button"
              onClick={() => setActiveAdminTab("directory")}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeAdminTab === "directory"
                  ? "bg-[#FF6200] text-white shadow-xs"
                  : "bg-white text-muted-editorial hover:text-ink border border-hairline hover:bg-surface-soft"
              }`}
            >
              <Users size={14} />
              <span>Cadre Directory</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  activeAdminTab === "directory" ? "bg-white/20 text-white" : "bg-surface-soft text-ink"
                }`}
              >
                {totalCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab("analytics")}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeAdminTab === "analytics"
                  ? "bg-[#FF6200] text-white shadow-xs"
                  : "bg-white text-muted-editorial hover:text-ink border border-hairline hover:bg-surface-soft"
              }`}
            >
              <BarChart3 size={14} />
              <span>Cadre Intelligence & Demographics</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeAdminTab === "analytics" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
                }`}
              >
                Live Metrics
              </span>
            </button>
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in shadow-2xs">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {activeAdminTab === "directory" ? (
            <>
              {/* KPI Statistics Row (Clickable to Filter) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3">
            <div
              onClick={() => setFilterStatus("ALL")}
              className={`bg-white border p-3 sm:p-3.5 rounded-xl shadow-2xs cursor-pointer transition-all hover:shadow-xs hover:-translate-y-0.5 select-none ${
                filterStatus === "ALL"
                  ? "border-[#FF6200] ring-1.5 ring-[#FF6200]/30 bg-[#faf6ee]/50"
                  : "border-hairline hover:border-[#FF6200]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-bold text-muted-editorial uppercase tracking-wider">
                  Total Registrations
                </span>
                <Users size={15} className="text-[#FF6200]" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-2xl font-black text-ink leading-none">{stats.total}</div>
                <span className="text-[10px] text-[#FF6200] font-semibold hover:underline">View All →</span>
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("PENDING")}
              className={`bg-white border p-3 sm:p-3.5 rounded-xl shadow-2xs cursor-pointer transition-all hover:shadow-xs hover:-translate-y-0.5 select-none ${
                filterStatus === "PENDING"
                  ? "border-amber-500 ring-1.5 ring-amber-400/40 bg-amber-50/70"
                  : "border-amber-200/80 hover:border-amber-400 bg-amber-50/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wider">
                  Pending Verification
                </span>
                <Clock size={15} className="text-amber-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-2xl font-black text-amber-900 leading-none">{stats.pending}</div>
                <span className="text-[10px] text-amber-700 font-semibold hover:underline">Filter Pending →</span>
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("APPROVED")}
              className={`bg-white border p-3 sm:p-3.5 rounded-xl shadow-2xs cursor-pointer transition-all hover:shadow-xs hover:-translate-y-0.5 select-none ${
                filterStatus === "APPROVED"
                  ? "border-emerald-500 ring-1.5 ring-emerald-400/40 bg-emerald-50/70"
                  : "border-emerald-200/80 hover:border-emerald-400 bg-emerald-50/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider">
                  Approved Members
                </span>
                <CheckCircle2 size={15} className="text-emerald-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-2xl font-black text-emerald-900 leading-none">{stats.approved}</div>
                <span className="text-[10px] text-emerald-700 font-semibold hover:underline">Filter Approved →</span>
              </div>
            </div>

            <div
              onClick={() => setFilterStatus("REJECTED")}
              className={`bg-white border p-3 sm:p-3.5 rounded-xl shadow-2xs cursor-pointer transition-all hover:shadow-xs hover:-translate-y-0.5 select-none ${
                filterStatus === "REJECTED"
                  ? "border-rose-500 ring-1.5 ring-rose-400/40 bg-rose-50/70"
                  : "border-rose-200/80 hover:border-rose-400 bg-rose-50/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] font-bold text-rose-800 uppercase tracking-wider">
                  Rejected
                </span>
                <XCircle size={15} className="text-rose-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-serif text-2xl font-black text-rose-900 leading-none">{stats.rejected}</div>
                <span className="text-[10px] text-rose-700 font-semibold hover:underline">Filter Rejected →</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls Panel */}
          <div className="bg-white border border-hairline rounded-xl p-2.5 sm:p-3 shadow-2xs mb-3">
            <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
                <input
                  type="text"
                  placeholder="Search by Name, Phone, Reg ID, District..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-8 py-1.5 h-9 rounded-lg border border-hairline bg-surface-soft text-ink placeholder:text-muted-editorial focus:outline-none focus:border-[#FF6200] focus:bg-white transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-editorial hover:text-ink text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dropdown Filters & Inline Count */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="text-xs px-2.5 py-1.5 h-9 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] font-medium"
                >
                  <option value="ALL">All States</option>
                  {INDIAN_STATES.filter((s) => s !== "ALL").map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <select
                  value={filterWing}
                  onChange={(e) => setFilterWing(e.target.value)}
                  className="text-xs px-2.5 py-1.5 h-9 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] font-medium"
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
                  className="text-xs px-2.5 py-1.5 h-9 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#FF6200] font-semibold"
                >
                  <option value="ALL">Status: All</option>
                  <option value="PENDING">🟡 Pending</option>
                  <option value="APPROVED">🟢 Approved</option>
                  <option value="REJECTED">🔴 Rejected</option>
                </select>

                {(search || filterState !== "ALL" || filterWing !== "ALL" || filterStatus !== "ALL") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setFilterState("ALL");
                      setFilterWing("ALL");
                      setFilterStatus("ALL");
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 h-9 rounded-lg font-medium transition-colors"
                  >
                    Reset
                  </button>
                )}

                <div className="hidden lg:flex items-center text-[11px] text-muted-editorial ml-2 pl-2 border-l border-hairline whitespace-nowrap">
                  <span>
                    <strong className="text-ink font-semibold">{totalCount}</strong> matching records
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: CADRE DIRECTORY TABLE */}
          <div className="bg-white border border-hairline rounded-xl shadow-xs overflow-hidden mb-6">
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
                <div className="overflow-x-auto w-full">
                  <table
                    className="w-full text-left border-collapse table-auto"
                    style={{ tableLayout: "auto", width: "100%" }}
                  >
                    <thead>
                      <tr className="bg-surface-soft border-b border-hairline text-[11px] font-semibold text-muted-editorial uppercase tracking-wider">
                        <th className="py-3 px-3 text-left min-w-[170px] 2xl:min-w-[210px]">Member Profile</th>
                        <th className="py-3 px-2 text-left min-w-[145px] 2xl:min-w-[180px] whitespace-nowrap" style={{ whiteSpace: "nowrap" }}>Reg ID</th>
                        <th className="py-3 px-2 text-left min-w-[140px] 2xl:min-w-[175px]">State & District</th>
                        <th className="py-3 px-2 text-left min-w-[135px] 2xl:min-w-[170px]">Wing</th>
                        <th className="py-3 px-2 text-left min-w-[145px] 2xl:min-w-[175px]">Contact</th>
                        <th className="py-3 px-2 text-left min-w-[95px] 2xl:min-w-[115px] whitespace-nowrap" style={{ whiteSpace: "nowrap" }}>Enrolled</th>
                        <th className="py-3 px-3.5 text-center min-w-[110px] 2xl:min-w-[130px] whitespace-nowrap" style={{ whiteSpace: "nowrap" }}>Status</th>
                        <th className="py-3 px-3 text-center min-w-[195px] whitespace-nowrap" style={{ whiteSpace: "nowrap" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline text-[13px]">
                      {members.map((member) => {
                        return (
                          <tr
                            key={member._id}
                            className="hover:bg-surface-soft/60 transition-colors"
                          >
                            <td className="py-3 px-3 min-w-[170px] 2xl:min-w-[210px]">
                              <div className="flex items-center gap-2.5">
                                {member.photoUrl ? (
                                  <img
                                    src={member.photoUrl}
                                    alt={member.fullName}
                                    className="w-9 h-9 rounded-full object-cover border border-hairline shadow-2xs flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-surface-soft border border-hairline flex items-center justify-center font-bold text-[#FF6200] text-xs flex-shrink-0">
                                    {member.fullName.charAt(0)}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-bold text-ink font-sans text-[13px] leading-tight truncate">{member.fullName}</div>
                                  <div className="text-[11px] text-muted-editorial leading-tight truncate">{member.profession || "Volunteer"}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-2 font-mono font-semibold text-ink text-[12px] whitespace-nowrap min-w-[145px] 2xl:min-w-[180px]" style={{ whiteSpace: "nowrap" }}>
                              <span className="bg-surface-soft px-2 py-1 rounded border border-hairline whitespace-nowrap">
                                {member.registrationId}
                              </span>
                            </td>

                            <td className="py-3 px-2 min-w-[140px] 2xl:min-w-[175px]">
                              <div className="font-medium text-ink text-[13px] leading-tight truncate">{member.state}</div>
                              <div className="text-[11px] text-muted-editorial leading-tight truncate">{member.district}</div>
                            </td>

                            <td className="py-3 px-2 min-w-[135px] 2xl:min-w-[170px]">
                              <span className="badge-coral-fill text-[10.5px] px-2 py-1 inline-block">
                                {member.wing}
                              </span>
                            </td>

                            <td className="py-3 px-2 min-w-[145px] 2xl:min-w-[175px]">
                              <div className="font-mono text-ink text-[12px] leading-tight truncate">{member.mobile}</div>
                              <div className="text-[11px] text-muted-editorial truncate max-w-[145px] leading-tight">
                                {member.email || "—"}
                              </div>
                            </td>

                            <td className="py-3 px-2 text-muted-editorial whitespace-nowrap text-[12px] min-w-[95px] 2xl:min-w-[115px]" style={{ whiteSpace: "nowrap" }}>
                              {new Date(member.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>

                            {/* Status Badge & Admin Note Preview */}
                            <td className="py-3 px-3.5 text-center whitespace-nowrap min-w-[110px] 2xl:min-w-[130px]" style={{ whiteSpace: "nowrap" }}>
                              <div className="flex flex-col items-center justify-center gap-1">
                                {member.status === "APPROVED" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap">
                                    <CheckCircle2 size={12} className="shrink-0" /> Approved
                                  </span>
                                ) : member.status === "REJECTED" ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenQuickRemarks(member);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap cursor-pointer transition-all active:scale-95"
                                    title={member.adminNotes ? `Click to view rejection reason: "${member.adminNotes}"` : "Click to view rejection reason"}
                                  >
                                    <XCircle size={12} className="shrink-0" /> Rejected
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap">
                                    <Clock size={12} className="shrink-0" /> Pending
                                  </span>
                                )}
                                {member.status === "REJECTED" && member.adminNotes && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenQuickRemarks(member);
                                    }}
                                    className="inline-flex items-center gap-1 max-w-[125px] text-[10px] font-medium text-rose-800 bg-rose-50/90 hover:bg-rose-100 hover:border-rose-300 border border-rose-200 px-2 py-0.5 rounded-full shadow-2xs truncate cursor-pointer transition-all active:scale-95"
                                    title={`Click to view reason: "${member.adminNotes}"`}
                                  >
                                    <FileText size={9} className="shrink-0 text-rose-600" />
                                    <span className="truncate">{member.adminNotes}</span>
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Member Actions: Review, Call, WhatsApp, Delete */}
                            <td className="py-3 px-3 text-center whitespace-nowrap min-w-[195px]" style={{ whiteSpace: "nowrap" }}>
                              <div
                                className="flex items-center justify-center gap-1.5 flex-nowrap"
                                style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "center", flexWrap: "nowrap" }}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleOpenMember(member)}
                                  className="flex-shrink-0 shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 h-8 rounded-md bg-[#FF6200] hover:bg-[#D65000] text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.98]"
                                  style={{ flexShrink: 0 }}
                                  title="Review & Verify Member Details & ID Card"
                                >
                                  <ShieldCheck size={13} className="shrink-0" />
                                  <span>Review</span>
                                </button>

                                {member.mobile && (
                                  <a
                                    href={`tel:+91${member.mobile.replace(/\D/g, "")}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-shrink-0 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200 hover:border-sky-600 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.98]"
                                    style={{ flexShrink: 0 }}
                                    title={`Direct Call: ${member.fullName} (+91 ${member.mobile})`}
                                    aria-label="Call Member"
                                  >
                                    <Phone size={13} className="shrink-0" />
                                  </a>
                                )}

                                {(member.whatsapp || member.mobile) && (
                                  <a
                                    href={getMemberWhatsAppUrl(member)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-shrink-0 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.98]"
                                    style={{ flexShrink: 0 }}
                                    title={`WhatsApp Chat: ${member.fullName}`}
                                    aria-label="WhatsApp Member"
                                  >
                                    <WhatsAppIcon size={13} />
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMember(member);
                                  }}
                                  className="flex-shrink-0 shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.98]"
                                  style={{ flexShrink: 0 }}
                                  title="Delete Member Record"
                                  aria-label="Delete Member"
                                >
                                  <Trash2 size={13} className="shrink-0" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Server-Side Pagination Bar */}
              <div className="px-4 py-3 bg-white border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-muted-editorial">
                  <span>
                    Showing{" "}
                    <strong className="text-ink font-semibold">
                      {totalCount === 0 ? 0 : (page - 1) * limit + 1}
                    </strong>{" "}
                    to{" "}
                    <strong className="text-ink font-semibold">
                      {Math.min(page * limit, totalCount)}
                    </strong>{" "}
                    of{" "}
                    <strong className="text-ink font-semibold">{totalCount}</strong>{" "}
                    records
                  </span>
                  <div className="h-3 w-px bg-hairline hidden sm:block" />
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        const newLim = parseInt(e.target.value, 10);
                        setLimit(newLim);
                        setPage(1);
                        fetchMembers(1, newLim);
                      }}
                      className="text-xs px-2 py-1 rounded border border-hairline bg-surface-soft text-ink font-medium focus:outline-none focus:border-[#FF6200]"
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => {
                      setPage(1);
                      fetchMembers(1, limit);
                    }}
                    className="px-2 py-1 rounded border border-hairline bg-surface-soft hover:bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                    title="First Page"
                  >
                    « First
                  </button>
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => {
                      const prev = Math.max(1, page - 1);
                      setPage(prev);
                      fetchMembers(prev, limit);
                    }}
                    className="px-2.5 py-1 rounded border border-hairline bg-surface-soft hover:bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
                    title="Previous Page"
                  >
                    <ChevronLeft size={13} />
                    <span>Prev</span>
                  </button>

                  <span className="px-2.5 py-1 font-semibold text-ink">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => {
                      const next = Math.min(totalPages, page + 1);
                      setPage(next);
                      fetchMembers(next, limit);
                    }}
                    className="px-2.5 py-1 rounded border border-hairline bg-surface-soft hover:bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
                    title="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => {
                      setPage(totalPages);
                      fetchMembers(totalPages, limit);
                    }}
                    className="px-2 py-1 rounded border border-hairline bg-surface-soft hover:bg-white text-ink disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
                    title="Last Page"
                  >
                    Last »
                  </button>
                </div>
              </div>
            </div>
            </>
          ) : (
            /* VIEW MODE 2: CADRE INTELLIGENCE & DEMOGRAPHICS ANALYTICS TAB */
            <div className="space-y-4 mb-6">
              {/* Analytics Top KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white border border-hairline p-4 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-muted-editorial text-xs mb-1">
                    <span className="uppercase font-bold tracking-wider">Total Enrolled</span>
                    <Users size={16} className="text-[#FF6200]" />
                  </div>
                  <div className="font-serif text-3xl font-black text-ink">{stats.total}</div>
                  <div className="text-[11px] text-muted-editorial mt-1">
                    National cadre registry baseline
                  </div>
                </div>

                <div className="bg-white border border-hairline p-4 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-emerald-800 text-xs mb-1">
                    <span className="uppercase font-bold tracking-wider">Approval Rate</span>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="font-serif text-3xl font-black text-emerald-900">
                    {stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}%` : "0%"}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">
                    {stats.approved} approved verified cadres
                  </div>
                </div>

                <div className="bg-white border border-hairline p-4 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
                    <span className="uppercase font-bold tracking-wider">Pending Review</span>
                    <Clock size={16} className="text-amber-600" />
                  </div>
                  <div className="font-serif text-3xl font-black text-amber-900">
                    {stats.pending}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">
                    Awaiting committee clearance
                  </div>
                </div>

                <div className="bg-white border border-hairline p-4 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-rose-800 text-xs mb-1">
                    <span className="uppercase font-bold tracking-wider">Rejected Queue</span>
                    <XCircle size={16} className="text-rose-600" />
                  </div>
                  <div className="font-serif text-3xl font-black text-rose-900">
                    {stats.rejected}
                  </div>
                  <div className="text-[11px] text-rose-700 mt-1">
                    Requiring applicant rectifications
                  </div>
                </div>
              </div>

              {/* Visual Breakdown Columns: Wing Distribution & Top States */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Wing Distribution Card */}
                <div className="bg-white border border-hairline rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-[#FF6200]" />
                      <h3 className="font-serif font-bold text-sm text-ink">
                        MSD Operational Wing Distribution
                      </h3>
                    </div>
                    <span className="text-[11px] text-muted-editorial">All Wings</span>
                  </div>

                  <div className="space-y-3">
                    {WINGS.filter((w) => w !== "ALL").map((wingName) => {
                      const match = (stats.wingBreakdown || []).find((w) => w._id === wingName);
                      const count = match ? match.count : 0;
                      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                      return (
                        <div key={wingName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-ink">{wingName}</span>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-[#FF6200]">{count}</span>
                              <span className="text-muted-editorial text-[11px]">({pct}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-surface-soft overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#FF6200] to-[#E05500] rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(2, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top States & Territorial Footprint */}
                <div className="bg-white border border-hairline rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#FF6200]" />
                      <h3 className="font-serif font-bold text-sm text-ink">
                        Top States & Territorial Footprint
                      </h3>
                    </div>
                    <span className="text-[11px] text-muted-editorial">Top 10 Regions</span>
                  </div>

                  <div className="space-y-2.5">
                    {(stats.stateBreakdown || []).length === 0 ? (
                      <p className="text-xs text-muted-editorial py-6 text-center">No state data available yet.</p>
                    ) : (
                      (stats.stateBreakdown || []).slice(0, 8).map((st, idx) => {
                        const pct = stats.total > 0 ? Math.round((st.count / stats.total) * 100) : 0;
                        return (
                          <div key={st._id} className="flex items-center gap-3 text-xs">
                            <span className="w-5 text-right font-mono font-bold text-muted-editorial text-[11px]">
                              #{idx + 1}
                            </span>
                            <span className="w-36 truncate font-medium text-ink">{st._id || "Unspecified"}</span>
                            <div className="flex-1 h-2 rounded-full bg-surface-soft overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(3, pct)}%` }}
                              />
                            </div>
                            <span className="w-12 text-right font-mono font-bold text-ink">{st.count}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Demographics Card */}
              <div className="bg-white border border-hairline rounded-xl p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#FF6200]" />
                    <h3 className="font-serif font-bold text-sm text-ink">
                      Demographic & Gender Diversity Ratio
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAdminTab("directory")}
                    className="text-xs text-[#FF6200] font-semibold hover:underline"
                  >
                    View in Cadre Table →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Male", "Female", "Other"].map((gender) => {
                    const match = (stats.genderBreakdown || []).find((g) => g._id === gender);
                    const count = match ? match.count : 0;
                    const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={gender} className="p-3.5 bg-surface-soft/60 rounded-xl border border-hairline">
                        <div className="flex items-center justify-between text-xs text-muted-editorial mb-1">
                          <span className="font-bold uppercase tracking-wider">{gender} Cadres</span>
                          <span className="font-mono text-ink font-bold">{pct}%</span>
                        </div>
                        <div className="font-serif text-2xl font-black text-ink">{count}</div>
                        <div className="w-full h-1.5 rounded-full bg-hairline/80 mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              gender === "Male"
                                ? "bg-sky-600"
                                : gender === "Female"
                                ? "bg-rose-500"
                                : "bg-purple-600"
                            }`}
                            style={{ width: `${Math.max(2, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
            className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-6xl xl:max-w-7xl w-full flex flex-col h-[92vh] max-h-[920px] min-h-[500px] overflow-hidden"
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
                    <h3 className="font-serif text-lg font-bold text-ink">Official Member Verification</h3>
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
                    <ShieldCheck size={13} />
                    <span>Review & Verify</span>
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
                <div className="space-y-4">
                  {/* Cadre Verification Summary Card */}
                  <div className="bg-surface-soft/80 border border-hairline rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                    {/* Header Ribbon */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 flex items-center justify-center text-[#FF6200] flex-shrink-0">
                          <FileText size={18} />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm sm:text-base text-ink block leading-tight">
                            Cadre Verification Dossier
                          </span>
                          <span className="text-[11px] text-muted-editorial">
                            Complete official registration profile & records
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-hairline shadow-2xs">
                          <span className="text-[10px] uppercase font-bold text-muted-editorial">ID:</span>
                          <span className="font-mono text-xs font-bold text-ink">
                            {selectedMember.registrationId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyRegistrationId(selectedMember.registrationId)}
                            className="text-[#FF6200] hover:text-[#d95300] ml-1 cursor-pointer transition-colors"
                            title="Copy Registration ID"
                          >
                            {copiedId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>

                        {selectedMember.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                            <CheckCircle2 size={12} /> Approved Cadre
                          </span>
                        ) : selectedMember.status === "REJECTED" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full">
                            <XCircle size={12} /> Application Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}

                      </div>
                    </div>

                    {/* SECTION 1: Personal & Contact Profile (with Passport Photo) */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 border border-hairline shadow-2xs">
                      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-hairline/60">
                        <div className="flex items-center gap-2">
                          <User size={15} className="text-[#FF6200]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-ink font-serif">
                            1. Personal & Contact Profile
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        {/* Cadre Passport Photo Preview */}
                        <div className="flex-shrink-0 self-center sm:self-start flex flex-col items-center">
                          {selectedMember.photoUrl ? (
                            <img
                              src={selectedMember.photoUrl}
                              alt={selectedMember.fullName}
                              className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl object-cover border-2 border-[#FF6200] shadow-sm bg-white"
                            />
                          ) : (
                            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-surface-card border-2 border-dashed border-hairline flex flex-col items-center justify-center text-muted-editorial text-center p-2">
                              <User size={28} className="text-muted-editorial/60" />
                              <span className="text-[9px] mt-1 font-medium text-rose-500">No Photo</span>
                            </div>
                          )}
                          <span className="text-[9px] font-semibold text-muted-editorial mt-1.5 uppercase tracking-wider">
                            Cadre Photo
                          </span>
                        </div>

                        {/* Personal Details Grid */}
                        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3.5 text-xs">
                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Full Legal Name
                            </span>
                            <span className="font-bold text-ink text-sm sm:text-base leading-tight block">
                              {selectedMember.fullName}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Father / Husband Name
                            </span>
                            <span className="font-semibold text-ink text-xs sm:text-sm block">
                              {selectedMember.fatherName}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Date of Birth & Age
                            </span>
                            <span className="font-semibold text-ink text-xs sm:text-sm block">
                              {formatDobDisplay(selectedMember.dob)}
                              {selectedMember.age ? ` (${selectedMember.age} Yrs)` : ""}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Gender
                            </span>
                            <span className="font-semibold text-ink text-xs sm:text-sm block">
                              {selectedMember.gender}
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Blood Group
                            </span>
                            {selectedMember.bloodGroup && selectedMember.bloodGroup !== "Not Specified" ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                {selectedMember.bloodGroup}
                              </span>
                            ) : (
                              <span className="text-muted-editorial text-xs sm:text-sm">Not Specified</span>
                            )}
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Primary Mobile
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono font-bold text-ink text-xs sm:text-sm block">
                                +91 {selectedMember.mobile}
                              </span>
                              <a
                                href={`tel:+91${selectedMember.mobile.replace(/\D/g, "")}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white border border-sky-200 hover:border-sky-600 text-[10px] font-semibold transition-all shadow-2xs"
                                title={`Call +91 ${selectedMember.mobile}`}
                              >
                                <Phone size={10} />
                                <span>Call</span>
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              WhatsApp Number
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-ink text-xs sm:text-sm block">
                                {selectedMember.whatsapp && selectedMember.whatsapp.trim() ? (
                                  selectedMember.whatsapp.trim() === selectedMember.mobile ? (
                                    <span className="text-muted-editorial">Same as Mobile</span>
                                  ) : (
                                    <span className="font-mono font-bold text-ink">+91 {selectedMember.whatsapp.trim()}</span>
                                  )
                                ) : (
                                  <span className="text-muted-editorial italic">Not Provided</span>
                                )}
                              </span>
                              {(selectedMember.whatsapp || selectedMember.mobile) && (
                                <a
                                  href={getMemberWhatsAppUrl(selectedMember)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 text-[10px] font-semibold transition-all shadow-2xs"
                                  title={`WhatsApp ${selectedMember.fullName}`}
                                >
                                  <WhatsAppIcon size={11} />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Email Address
                            </span>
                            <span className="font-medium text-ink text-xs sm:text-sm block break-all">
                              {selectedMember.email || <span className="text-muted-editorial italic">Not Provided</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: Address & Location Jurisdiction */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 border border-hairline shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-hairline/60">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-[#FF6200]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-ink font-serif">
                            2. Address & Location Jurisdiction
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3.5 text-xs">
                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            State Unit
                          </span>
                          <span className="font-bold text-ink text-sm sm:text-base block leading-snug">
                            {selectedMember.state}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            District Unit
                          </span>
                          <span className="font-bold text-ink text-sm sm:text-base block leading-snug">
                            {selectedMember.district}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Taluk / Tehsil / Area
                          </span>
                          <span className="font-semibold text-ink text-xs sm:text-sm block leading-snug">
                            {selectedMember.taluk?.trim() || "—"}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Postal PIN Code
                          </span>
                          <span className="font-mono font-bold text-ink text-sm block">
                            {selectedMember.pincode}
                          </span>
                        </div>

                        <div className="col-span-2 sm:col-span-4 pt-3 border-t border-hairline/60">
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Full Residential Address
                          </span>
                          <span className="font-medium text-ink text-xs sm:text-sm block leading-relaxed">
                            {selectedMember.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: Cadre Wing & Professional Details */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 border border-hairline shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-hairline/60">
                        <div className="flex items-center gap-2">
                          <Briefcase size={15} className="text-[#FF6200]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-ink font-serif">
                            3. Cadre Wing & Professional Details
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-3.5 text-xs">
                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Assigned MSD Wing
                          </span>
                          <span className="font-serif font-black text-[#FF6200] text-sm sm:text-base block">
                            {selectedMember.wing}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Current Profession / Occupation
                          </span>
                          <span className="font-semibold text-ink text-xs sm:text-sm block">
                            {selectedMember.profession?.trim() || "Volunteer / Social Worker"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: Registration & Audit Details */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 border border-hairline shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-hairline/60">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={15} className="text-[#FF6200]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-ink font-serif">
                            4. Registration & Enrollment Details
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-3.5 text-xs">
                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Cadre Registry ID
                          </span>
                          <span className="font-mono font-bold text-ink text-sm sm:text-base block">
                            {selectedMember.registrationId}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Application Date
                          </span>
                          <span className="font-semibold text-ink text-xs sm:text-sm block">
                            {selectedMember.createdAt
                              ? new Date(selectedMember.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </div>

                        <div>
                          <span className="text-muted-editorial block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Approval Date & Status
                          </span>
                          {selectedMember.status === "APPROVED" ? (
                            <span className="inline-flex items-center w-fit gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span>
                                {selectedMember.approvedAt
                                  ? new Date(selectedMember.approvedAt).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "Approved"}
                              </span>
                            </span>
                          ) : selectedMember.status === "REJECTED" ? (
                            <button
                              type="button"
                              onClick={() => handleOpenQuickRemarks(selectedMember)}
                              className="inline-flex items-center w-fit gap-1 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md border border-rose-200 hover:border-rose-300 cursor-pointer transition-all"
                              title="Click to view rejection remarks popup"
                            >
                              <XCircle size={13} className="text-rose-600" />
                              <span>Rejected (View Remarks)</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center w-fit gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                              <Clock size={13} className="text-amber-600" />
                              <span>Pending Review</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: OFFICIAL PVC ID CARD & PDF DOWNLOAD CENTER (FULL-WIDTH STUDIO) */
                <div className="space-y-4">
                  {/* Top Control Bar: Status, Signatory, and Download Action Hub */}
                  <div className="p-4 rounded-2xl bg-surface-soft/80 border border-hairline flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 shadow-2xs">
                    {/* Left: Status & Signatory Info */}
                    <div className="flex flex-wrap items-center gap-3">
                      {selectedMember.status === "APPROVED" ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>Official Card Approved · Seal & Signature Active</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 shadow-2xs">
                            <Clock size={14} className="text-amber-600 shrink-0" />
                            <span>Provisional ID Card (Pending Approval)</span>
                          </div>
                          <button
                            onClick={() => handlePromptStatusChange(selectedMember, "APPROVED")}
                            disabled={actionLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                          >
                            <CheckCircle2 size={13} />
                            <span>Approve & Seal</span>
                          </button>
                        </div>
                      )}

                      <div className="h-4 w-px bg-hairline hidden sm:block" />

                      <div className="flex items-center gap-2 text-xs text-muted-editorial">
                        <span>
                          Signatory: <strong className="text-ink font-semibold">{cardSettings.signatoryName}</strong> ({cardSettings.signatoryTitle})
                        </span>
                        <button
                          onClick={() => setCardSettingsModalOpen(true)}
                          className="text-[#FF6200] hover:underline font-semibold cursor-pointer text-[11px]"
                        >
                          Change Seal / Sign →
                        </button>
                      </div>
                    </div>

                    {/* Right: Primary Download & Print Buttons (Both Sides Only) */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Download PDF Both Sides */}
                      <button
                        onClick={() => handleDownloadPdf(selectedMember)}
                        disabled={downloadingPdf || downloadingPng}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                        title="Download Print-ready PDF with Front & Back side-by-side"
                      >
                        <FileText size={15} />
                        <span>{downloadingPdf ? "Generating PDF..." : "Download PDF (Both Sides)"}</span>
                      </button>

                      {/* Download PNG Both Sides */}
                      <button
                        onClick={() => handleDownloadPng(selectedMember, "both")}
                        disabled={downloadingPdf || downloadingPng}
                        className="btn-primary-coral inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                        title="Download Ultra-crisp PNG sheet with Front & Back"
                      >
                        <Download size={15} />
                        <span>{downloadingPng ? "Rendering..." : "Download PNG (Both Sides)"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Hero Card Stage: Full Width Side-by-Side Presentation */}
                  <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#FAF7F2] to-[#F3EDE2] rounded-2xl border border-hairline/80 shadow-inner">
                    {/* Exact Card Dimensions Badge */}
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-editorial bg-[#faf7ee] px-4 py-2 rounded-xl border border-[#e5dac8] shadow-2xs mb-4">
                      <span className="font-bold text-[#FF6200]">Card Dimensions:</span>
                      <span className="font-mono font-bold text-ink">70 mm × 100 mm (2.63" × 3.88")</span>
                      <span className="text-muted-editorial/40">•</span>
                      <span className="text-[11px]">Standard PVC ID Holder & Lamination Pouch Size</span>
                    </div>

                    <DigitalIdCard
                      member={selectedMember}
                      qrDataUrl={selectedMemberQr}
                      customSealUrl={cardSettings.customSealUrl}
                      customSignatureUrl={cardSettings.customSignatureUrl}
                      signatoryName={cardSettings.signatoryName}
                      signatoryTitle={cardSettings.signatoryTitle}
                      hideActionButtons={true}
                      stacked={false}
                      defaultView="both"
                    />
                  </div>

                  {/* Verification Notice Bar */}
                  <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-soft/60 border border-hairline text-center text-xs text-muted-editorial">
                    <ShieldCheck size={13} className="text-[#FF6200] shrink-0" />
                    <span>National Cadre Registry Verification: Scanning QR validates genuine membership at</span>
                    <span className="font-mono text-[#FF6200] font-semibold">
                      https://mahasevadal.com/verify?id={selectedMember.registrationId}
                    </span>
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
                  onClick={() => handlePromptStatusChange(selectedMember, "APPROVED")}
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
                  onClick={() => {
                    if (selectedMember.status === "REJECTED") {
                      handleOpenQuickRemarks(selectedMember);
                    } else {
                      handlePromptStatusChange(selectedMember, "REJECTED");
                    }
                  }}
                  disabled={actionLoading}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs cursor-pointer ${
                    selectedMember.status === "REJECTED"
                      ? "bg-rose-700 text-white ring-2 ring-rose-500/30"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }`}
                  title={selectedMember.status === "REJECTED" ? "Click to view rejection remarks" : "Reject Application"}
                >
                  <XCircle size={13} />
                  <span>{selectedMember.status === "REJECTED" ? "✕ Rejected (View Remarks)" : "Reject"}</span>
                </button>

                <button
                  onClick={() => handlePromptStatusChange(selectedMember, "PENDING")}
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
          className="fixed inset-0 z-[75] bg-black/65 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-hidden overscroll-none"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteLoading) setMemberToDelete(null);
          }}
        >
          <div
            className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 relative animate-scale-up"
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
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

      {/* ─── STATUS ACTION CONFIRMATION MODAL (APPROVE / REJECT / PENDING) ─── */}
      {statusActionTarget && (
        <div
          className="fixed inset-0 z-[75] bg-black/65 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-hidden overscroll-none"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget && !actionLoading) {
              setStatusActionTarget(null);
              setStatusActionError(null);
            }
          }}
        >
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border animate-scale-up ${
              statusActionTarget.targetStatus === "APPROVED"
                ? "border-emerald-300"
                : statusActionTarget.targetStatus === "REJECTED"
                ? "border-rose-300"
                : "border-amber-300"
            }`}
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setStatusActionTarget(null);
                setStatusActionError(null);
              }}
              disabled={actionLoading}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft transition-colors cursor-pointer disabled:opacity-40"
              title="Close"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${
                  statusActionTarget.targetStatus === "APPROVED"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : statusActionTarget.targetStatus === "REJECTED"
                    ? "bg-rose-100 text-rose-700 border-rose-300"
                    : "bg-amber-100 text-amber-700 border-amber-300"
                }`}
              >
                {statusActionTarget.targetStatus === "APPROVED" ? (
                  <CheckCircle2 size={24} />
                ) : statusActionTarget.targetStatus === "REJECTED" ? (
                  <XCircle size={24} />
                ) : (
                  <RotateCcw size={24} />
                )}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  {statusActionTarget.targetStatus === "APPROVED"
                    ? "Confirm Cadre Approval"
                    : statusActionTarget.targetStatus === "REJECTED"
                    ? "Confirm Application Rejection"
                    : "Reset Application to Pending"}
                </h3>
                <p
                  className={`text-xs font-medium ${
                    statusActionTarget.targetStatus === "APPROVED"
                      ? "text-emerald-700"
                      : statusActionTarget.targetStatus === "REJECTED"
                      ? "text-rose-600"
                      : "text-amber-700"
                  }`}
                >
                  {statusActionTarget.targetStatus === "APPROVED"
                    ? "Generate official ID card & activate verified status"
                    : statusActionTarget.targetStatus === "REJECTED"
                    ? "Application will be marked rejected with official reason"
                    : "Move application back to pending queue for review"}
                </p>
              </div>
            </div>

            {/* Member Details Brief */}
            <div className="bg-surface-soft/80 p-3.5 rounded-xl border border-hairline mb-4 text-xs space-y-2">
              <div className="flex items-center gap-3">
                {statusActionTarget.member.photoUrl ? (
                  <img
                    src={statusActionTarget.member.photoUrl}
                    alt={statusActionTarget.member.fullName}
                    className="w-11 h-11 rounded-full object-cover border border-hairline shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-surface-soft border border-hairline flex items-center justify-center font-bold text-[#FF6200] text-sm shrink-0">
                    {statusActionTarget.member.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-ink text-sm truncate">
                      {statusActionTarget.member.fullName}
                    </span>
                    <span className="font-mono font-bold text-[#FF6200] text-xs shrink-0">
                      {statusActionTarget.member.registrationId}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-editorial truncate mt-0.5">
                    {statusActionTarget.member.wing} · {statusActionTarget.member.district}, {statusActionTarget.member.state}
                  </div>
                  <div className="text-[11px] text-muted-editorial mt-0.5">
                    Mobile: <span className="font-mono text-ink font-medium">+91 {statusActionTarget.member.mobile}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection / Note Input */}
            {statusActionTarget.targetStatus === "REJECTED" ? (
              <div className="space-y-2.5 mb-4">
                <label className="text-xs font-semibold text-ink flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>Rejection Reason (Displayed to Applicant):</span>
                    <span className="text-rose-600 font-bold">*</span>
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 uppercase tracking-wide">
                    Compulsory
                  </span>
                </label>
                
                {/* Reason Presets */}
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {[
                    "Passport photograph blurred or invalid",
                    "Incomplete address or invalid pincode",
                    "Duplicate registration detected",
                    "Age eligibility criteria not met (Below 18)",
                    "Contact phone number unreachable or invalid",
                    "Wing qualification mismatch",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setStatusActionNote(preset);
                        setStatusActionError(null);
                      }}
                      className={`text-[10px] font-medium px-2 py-1 rounded transition-colors text-left cursor-pointer border ${
                        statusActionNote === preset
                          ? "bg-rose-100 text-rose-900 border-rose-300 font-semibold shadow-2xs"
                          : "bg-surface-soft hover:bg-rose-50 hover:text-rose-700 border-hairline hover:border-rose-200"
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={statusActionNote}
                  onChange={(e) => {
                    setStatusActionNote(e.target.value);
                    if (e.target.value.trim()) setStatusActionError(null);
                  }}
                  placeholder="Enter administrative rejection reason (compulsory)..."
                  className={`w-full text-xs p-2.5 rounded-lg border outline-none transition resize-y placeholder:text-muted-editorial/60 ${
                    statusActionError
                      ? "border-rose-500 ring-2 ring-rose-200 bg-rose-50/20"
                      : "border-hairline focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-surface-soft/40"
                  }`}
                />

                {statusActionError && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-rose-600 shrink-0" />
                    <span>{statusActionError}</span>
                  </div>
                )}

                <p className="text-[11px] text-muted-editorial">
                  The applicant will see this reason on their public status check page and can contact secretariat support.
                </p>
              </div>
            ) : statusActionTarget.targetStatus === "APPROVED" ? (
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-ink flex items-center justify-between">
                  <span>Administrative Verification Remarks (Optional):</span>
                  <span className="text-[10.5px] text-muted-editorial font-normal">Internal note</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {[
                    "Photograph & details verified",
                    "Phone contact verified",
                    "State / District unit cleared",
                    "Approved for official ID card",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStatusActionNote(preset)}
                      className={`text-[10px] font-medium px-2 py-1 rounded transition-colors text-left cursor-pointer border ${
                        statusActionNote === preset
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold shadow-2xs"
                          : "bg-surface-soft hover:bg-emerald-50 hover:text-emerald-700 border-hairline hover:border-emerald-200"
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={statusActionNote}
                  onChange={(e) => setStatusActionNote(e.target.value)}
                  placeholder="Optional internal remark (e.g. Details verified by state team)..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-hairline focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition bg-surface-soft/40 placeholder:text-muted-editorial/60"
                />
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Confirming approval will immediately generate official PVC digital ID card credentials and activate the live verification QR code.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 mb-4 flex items-start gap-2">
                <RotateCcw size={14} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Are you sure you want to move this member back to <strong>Pending Verification</strong>? Any active approval or rejection note will be cleared.
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-hairline">
              <button
                type="button"
                onClick={() => {
                  setStatusActionTarget(null);
                  setStatusActionError(null);
                }}
                disabled={actionLoading}
                className="btn-secondary text-xs px-4 py-2 cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusChange}
                disabled={
                  actionLoading ||
                  (statusActionTarget.targetStatus === "REJECTED" && !statusActionNote.trim())
                }
                title={
                  statusActionTarget.targetStatus === "REJECTED" && !statusActionNote.trim()
                    ? "Rejection remarks are compulsory before confirming rejection"
                    : undefined
                }
                className={`text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all text-white ${
                  statusActionTarget.targetStatus === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700 active:scale-95 cursor-pointer"
                    : statusActionTarget.targetStatus === "REJECTED"
                    ? !statusActionNote.trim()
                      ? "bg-rose-300 cursor-not-allowed opacity-75"
                      : "bg-rose-600 hover:bg-rose-700 active:scale-95 cursor-pointer"
                    : "bg-amber-600 hover:bg-amber-700 active:scale-95 cursor-pointer"
                } disabled:cursor-not-allowed`}
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : statusActionTarget.targetStatus === "APPROVED" ? (
                  <>
                    <CheckCircle2 size={13} />
                    <span>Confirm & Approve Cadre</span>
                  </>
                ) : statusActionTarget.targetStatus === "REJECTED" ? (
                  <>
                    <XCircle size={13} />
                    <span>Confirm Rejection</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={13} />
                    <span>Confirm Reset</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── QUICK REMARKS POPUP (SHOWS ONLY REASON TEXT, NO EXTRA) ─── */}
      {remarkModalMember && (
        <div
          className="fixed inset-0 z-[85] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-hidden overscroll-none"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget) setRemarkModalMember(null);
          }}
        >
          <div
            className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-md w-full overflow-hidden relative"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Tricolor Top Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6200] via-[#FF9933] to-[#138808]" />

            {/* Header */}
            <div className="px-5 py-3.5 border-b border-hairline flex items-center justify-between gap-3 bg-surface-soft/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-sm font-bold text-ink">
                    {remarkModalMember.status === "REJECTED" ? "Rejection Reason" : "Administrative Remark"}
                  </h3>
                  <p className="text-[11px] text-muted-editorial font-mono truncate">
                    {remarkModalMember.registrationId} · {remarkModalMember.fullName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRemarkModalMember(null)}
                className="p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content: ONLY the reason text, clean and readable */}
            <div className="p-5">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-ink text-sm font-medium leading-relaxed whitespace-pre-wrap select-text">
                {remarkModalMember.adminNotes || "No remark recorded."}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-hairline bg-surface-soft/40 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setRemarkModalMember(null)}
                className="btn-primary-coral text-xs px-4 py-1.5 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Admin;
