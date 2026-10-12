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
  Trash2,
  ShieldCheck,
  Printer,
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
} from "lucide-react";

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
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("adminmsd1947");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

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

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Invalid username or password");
      }

      localStorage.setItem("msd_admin_token", json.token);
      setToken(json.token);
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
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

  // Delete Member
  const handleDeleteMember = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to permanently delete this member record?")) {
      return;
    }

    try {
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
      fetchMembers();
    } catch (err: any) {
      alert(err.message);
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
                <p className="text-xs text-[#cc785c] font-medium uppercase tracking-wider mt-0.5">
                  Central Cadre Administration Portal
                </p>
                <p className="text-xs text-muted-editorial mt-1">
                  Access official member registry & verification panel
                </p>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 mb-5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                  <AlertCircle size={15} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Admin Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Security Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full btn-primary-coral text-xs py-3 font-semibold justify-center shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
                >
                  {loginLoading ? "Authenticating..." : "Sign In to Admin Portal"}
                </button>

                <div className="mt-4 p-3 rounded-lg bg-surface-soft/80 border border-hairline text-center text-[11px] text-muted-editorial">
                  <span>Default Credentials: </span>
                  <span className="font-mono text-ink font-semibold">admin</span> /{" "}
                  <span className="font-mono text-ink font-semibold">adminmsd1947</span>
                </div>
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

          {/* KPI Statistics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card-feature-cream bg-white border border-hairline p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-editorial uppercase tracking-wider">
                  Total Registrations
                </span>
                <Users size={18} className="text-[#cc785c]" />
              </div>
              <div className="font-serif text-3xl font-bold text-ink">{stats.total}</div>
              <span className="text-[11px] text-muted-editorial mt-1 block">In Central MongoDB Store</span>
            </div>

            <div className="card-feature-cream bg-amber-50/50 border border-amber-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Pending Verification
                </span>
                <Clock size={18} className="text-amber-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-amber-900">{stats.pending}</div>
              <span className="text-[11px] text-amber-700 mt-1 block">Awaiting Committee Action</span>
            </div>

            <div className="card-feature-cream bg-emerald-50/50 border border-emerald-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Approved Members
                </span>
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-900">{stats.approved}</div>
              <span className="text-[11px] text-emerald-700 mt-1 block">Active Official Cadre</span>
            </div>

            <div className="card-feature-cream bg-rose-50/50 border border-rose-200 p-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  Rejected
                </span>
                <XCircle size={18} className="text-rose-600" />
              </div>
              <div className="font-serif text-3xl font-bold text-rose-900">{stats.rejected}</div>
              <span className="text-[11px] text-rose-700 mt-1 block">Incomplete / Declined</span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white border border-hairline rounded-xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-editorial" />
              <input
                type="text"
                placeholder="Search by Name, Phone, ID, District..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-2 rounded-lg border border-hairline bg-surface-soft text-ink placeholder:text-muted-editorial focus:outline-none focus:border-[#cc785c]"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c]"
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
                className="text-xs px-3 py-2 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c]"
              >
                <option value="ALL">All Wings</option>
                {WINGS.filter((w) => w !== "ALL").map((wg) => (
                  <option key={wg} value={wg}>
                    {wg}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-hairline bg-surface-soft text-ink focus:outline-none focus:border-[#cc785c]"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">🟡 Pending Only</option>
                <option value="APPROVED">🟢 Approved Only</option>
                <option value="REJECTED">🔴 Rejected Only</option>
              </select>
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
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-soft border-b border-hairline text-[11px] font-semibold text-muted-editorial uppercase tracking-wider">
                      <th className="py-3 px-4">Member Profile</th>
                      <th className="py-3 px-4">Registration ID</th>
                      <th className="py-3 px-4">State & District</th>
                      <th className="py-3 px-4">Selected Wing</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Enrolled On</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Quick Action</th>
                      <th className="py-3 px-4 text-right">Dossier</th>
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
                              <div className="w-9 h-9 rounded-full bg-surface-soft border border-hairline flex items-center justify-center font-bold text-[#cc785c]">
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

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {member.status === "APPROVED" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 size={11} /> Approved
                            </span>
                          ) : member.status === "REJECTED" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                              <XCircle size={11} /> Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <Clock size={11} /> Pending
                            </span>
                          )}
                        </td>

                        {/* Quick Table-Row Status Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 p-1 bg-surface-soft/80 rounded-lg border border-hairline">
                            <button
                              onClick={() => handleUpdateStatus(member._id, "APPROVED")}
                              disabled={actionLoading}
                              title="Approve Member"
                              className={`p-1.5 rounded transition-all ${member.status === "APPROVED"
                                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                                  : "text-muted-editorial hover:text-emerald-700 hover:bg-emerald-50"
                                }`}
                            >
                              <CheckCircle2 size={14} />
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(member._id, "REJECTED")}
                              disabled={actionLoading}
                              title="Reject Application"
                              className={`p-1.5 rounded transition-all ${member.status === "REJECTED"
                                  ? "bg-rose-600 text-white shadow-xs font-bold"
                                  : "text-muted-editorial hover:text-rose-700 hover:bg-rose-50"
                                }`}
                            >
                              <XCircle size={14} />
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(member._id, "PENDING")}
                              disabled={actionLoading}
                              title="Reset to Pending Review"
                              className={`p-1.5 rounded transition-all ${member.status === "PENDING"
                                  ? "bg-amber-500 text-white shadow-xs font-bold"
                                  : "text-muted-editorial hover:text-amber-700 hover:bg-amber-50"
                                }`}
                            >
                              <RotateCcw size={14} />
                            </button>
                          </div>
                        </td>

                        {/* Dossier Review & Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenMember(member)}
                              className="btn-primary-coral text-[11px] px-3 py-1.5 flex items-center gap-1 shadow-2xs"
                            >
                              <Eye size={12} />
                              <span>Review Dossier</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member._id)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 transition-colors"
                              title="Delete Record"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft border border-hairline transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="border-b border-hairline pb-4 mb-6">
              <h3 className="font-serif text-lg font-bold text-ink">Official Member Dossier</h3>
              <p className="text-xs text-muted-editorial">Cadre Verification & Enrolled Record Details</p>
            </div>

            {/* Member Full Dossier Details */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-surface-soft/60 border border-hairline">
                  {selectedMember.photoUrl ? (
                    <img
                      src={selectedMember.photoUrl}
                      alt={selectedMember.fullName}
                      className="w-24 h-24 rounded-xl object-cover border-2 border-hairline shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-surface-card border border-hairline flex items-center justify-center text-muted-editorial">
                      <Users size={32} />
                    </div>
                  )}

                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <h2 className="font-serif text-xl font-bold text-ink">{selectedMember.fullName}</h2>
                      <span className="badge-coral-fill text-[10px]">{selectedMember.wing}</span>
                    </div>
                    <div className="font-mono text-xs text-muted-editorial mb-2">
                      ID: {selectedMember.registrationId}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-body justify-center sm:justify-start">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#cc785c]" />
                        {selectedMember.district}, {selectedMember.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-[#cc785c]" />
                        {selectedMember.mobile}
                      </span>
                      <span className="font-semibold text-rose-600">
                        Blood: {selectedMember.bloodGroup}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-surface-soft/40 p-4 rounded-xl border border-hairline">
                  <div>
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Father's / Spouse's Name
                    </span>
                    <span className="font-medium text-ink">{selectedMember.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Date of Birth & Gender
                    </span>
                    <span className="font-medium text-ink">
                      {selectedMember.dob} ({selectedMember.gender})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Educational Qualification
                    </span>
                    <span className="font-medium text-ink">
                      {selectedMember.qualification || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Current Profession
                    </span>
                    <span className="font-medium text-ink">
                      {selectedMember.profession || "Volunteer"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Government ID Type & Number
                    </span>
                    <span className="font-mono text-ink">
                      {selectedMember.idProofType}: {selectedMember.idProofNumber || "Verified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Time Commitment
                    </span>
                    <span className="font-medium text-ink">{selectedMember.hoursAvailable}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-editorial block text-[10px] uppercase font-semibold">
                      Residential Address
                    </span>
                    <span className="font-medium text-ink">
                      {selectedMember.address}, PIN: {selectedMember.pincode}
                    </span>
                  </div>
                </div>

                {/* Status Bar & Actions */}
                <div className="p-4 rounded-xl bg-surface-soft border border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-muted-editorial uppercase font-semibold block">
                      Current Approval Status
                    </span>
                    <span className="font-bold text-sm">
                      {selectedMember.status === "APPROVED" ? (
                        <span className="text-emerald-700">🟢 Approved Cadre Member</span>
                      ) : selectedMember.status === "REJECTED" ? (
                        <span className="text-rose-700">🔴 Application Rejected</span>
                      ) : (
                        <span className="text-amber-700">🟡 Pending Committee Review</span>
                      )}
                    </span>
                  </div>

                  {/* Operational Status Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedMember._id, "APPROVED")}
                      disabled={actionLoading}
                      className={`text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${selectedMember.status === "APPROVED"
                          ? "bg-emerald-700 text-white ring-2 ring-emerald-500/30"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                    >
                      <CheckCircle2 size={13} />
                      <span>{selectedMember.status === "APPROVED" ? "✓ Approved" : "Approve Member"}</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedMember._id, "REJECTED")}
                      disabled={actionLoading}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${selectedMember.status === "REJECTED"
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
                      className={`text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${selectedMember.status === "PENDING"
                          ? "bg-amber-600 text-white ring-2 ring-amber-400/30"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                        }`}
                    >
                      <RotateCcw size={13} />
                      <span>Set Pending</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-hairline">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="btn-secondary text-xs px-4 py-2 hover:bg-surface-soft"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Admin;
