import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Printer,
  ChevronUp,
  ChevronDown,
  UserCheck,
  UserX,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  Activity,
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Image as ImageIcon,
  Loader2,
  Upload,
  Trash2,
  Globe,
  HelpCircle,
  Check,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";
import { adminService } from "../services/adminService";
import { authService } from "../services/authService";
import { Registration, Stats } from "../types";

export default function Admin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Sorting state
  const [sortField, setSortField] = useState<keyof Registration>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Settings modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [securityNotifications, setSecurityNotifications] = useState<any[]>([]);

  // Tab Control and state
  const [activeTab, setActiveTab] = useState<"registrations">("registrations");

  const loadNotifications = async () => {
    try {
      const res = await adminService.getNotifications();
      if (res.success) {
        setSecurityNotifications(res.notifications);
      }
    } catch (err) {
      console.error("Failed to load security notifications", err);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError(null);
    setSettingsSuccess(null);

    if (!currentPassword) {
      setSettingsError("Current password is required.");
      return;
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setSettingsError("New passwords do not match.");
        return;
      }

      if (newPassword.length < 8) {
        setSettingsError("New password must be at least 8 characters long.");
        return;
      }

      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        setSettingsError(
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
      }
    }

    if (!newEmail && !newPassword) {
      setSettingsError("Please provide a new email or new password to update.");
      return;
    }

    setSettingsLoading(true);
    try {
      const response = await adminService.changeCredentials({
        currentPassword,
        newEmail: newEmail || undefined,
        newPassword: newPassword || undefined
      });

      if (response.success) {
        setSettingsSuccess(response.message || "Credentials updated successfully!");
        setCurrentPassword("");
        setNewEmail("");
        setNewPassword("");
        setConfirmPassword("");
        
        setTimeout(() => {
          authService.logout();
          navigate("/login");
        }, 3000);
      } else {
        setSettingsError(response.message || "Failed to update credentials.");
      }
    } catch (err: any) {
      setSettingsError(
        err.response?.data?.message || "Error updating credentials. Please try again."
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  // Load Admin Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const regsRes = await adminService.getRegistrations();
      const statsRes = await adminService.getStats();

      if (regsRes.success) setRegistrations(regsRes.data);
      if (statsRes.success) setStats(statsRes.stats);
      await loadNotifications();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load admin data");
      // If unauthorized, logout and go to login
      if (err.response?.status === 401) {
        authService.logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    } else {
      loadDashboardData();
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  // Change Application Status (Approve/Reject)
  const handleStatusUpdate = async (id: string, newStatus: "Approved" | "Rejected") => {
    try {
      const response = await adminService.updateRegistrationStatus(id, newStatus);
      if (response.success) {
        // Optimistically update or just reload both lists to get accurate stats
        await loadDashboardData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // CSV Export Trigger
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      "Registration ID",
      "Timestamp",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Gender",
      "Church/Ministry",
      "Referral Source",
      "Status",
      "Created By"
    ];

    const rows = registrations.map((r) => [
      r.id,
      r.timestamp,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      r.phoneNumber,
      r.gender,
      `"${r.church.replace(/"/g, '""')}"`,
      r.referralSource,
      r.status,
      r.createdBy
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nbi_registrations_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting helper
  const handleSort = (field: keyof Registration) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter & Search logic combined
  const filteredRegs = registrations
    .filter((reg) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        reg.id.toLowerCase().includes(searchLower) ||
        reg.fullName.toLowerCase().includes(searchLower) ||
        reg.email.toLowerCase().includes(searchLower) ||
        reg.church.toLowerCase().includes(searchLower);

      const matchesGender = filterGender === "All" || reg.gender === filterGender;
      const matchesStatus = filterStatus === "All" || reg.status === filterStatus;

      return matchesSearch && matchesGender && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "string") {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination calculation
  const totalItems = filteredRegs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedRegs = filteredRegs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    // Reset to page 1 on search / filter updates
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterStatus]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold text-[10px] font-black uppercase rounded-sm">
                REGISTRAR CONSOLE
              </span>
              <Sparkles className="w-4.5 h-4.5 text-brand-gold animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold text-brand-blue dark:text-white tracking-tight">
              Cohort Management Dashboard
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
              Authenticated Registrar: <span className="font-bold text-slate-600 dark:text-slate-300">{currentUser?.name || "NBI Admin"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-btn-export-csv"
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              id="admin-btn-print"
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print view</span>
            </button>

            <button
              id="admin-btn-settings"
              onClick={() => {
                setIsSettingsOpen(true);
                loadNotifications();
              }}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-brand-accent dark:text-brand-gold" />
              <span>Security Settings</span>
            </button>

            <button
              id="admin-btn-logout"
              onClick={handleLogout}
              className="px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>


            {/* Dashboard Cards (Stats Grid) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">Total Registrations</span>
                  <span className="text-3xl font-black text-brand-blue dark:text-white block mt-1">{stats.total}</span>
                  <span className="text-[10px] font-bold text-emerald-600 block mt-1">Cohort 2026 active</span>
                </div>
                <div className="p-4 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Pending Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">Pending Review</span>
                  <span className="text-3xl font-black text-amber-500 block mt-1">{stats.pending}</span>
                  <span className="text-[10px] font-bold text-amber-500 block mt-1">Requires registrar verification</span>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Approved Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">Approved Students</span>
                  <span className="text-3xl font-black text-emerald-600 block mt-1">{stats.approved}</span>
                  <span className="text-[10px] font-bold text-emerald-600 block mt-1">Voucher codes generated</span>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-2xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              {/* Gender Distribution Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">Gender Mix</span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.gender.male}M</span>
                    <span className="text-sm font-extrabold text-slate-400">/</span>
                    <span className="text-2xl font-black text-pink-500">{stats.gender.female}F</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 block mt-1">Balanced enrollment</span>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-950/20 text-pink-500 rounded-2xl">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
              </div>

            </div>
          )
        )}

        {/* Charts & Graphs Grid */}
        {!loading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
            
            {/* Referrals - Custom SVG Bar Chart (4 columns) */}
            <div className="lg:col-span-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <BarChart2 className="w-5 h-5 text-brand-accent dark:text-brand-gold" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Referral Distribution</h3>
              </div>
              
              {/* Custom SVG Bar Chart */}
              <div className="h-56 relative flex items-end justify-around pt-6 border-b border-slate-100 dark:border-slate-800">
                {Object.keys(stats.referrals).map((source) => {
                  const count = stats.referrals[source] || 0;
                  const maxCount = Math.max(...Object.keys(stats.referrals).map((k) => stats.referrals[k]), 1);
                  const percentage = (count / maxCount) * 100;

                  return (
                    <div key={source} className="flex flex-col items-center gap-2 group w-12">
                      <div className="text-[10px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1">
                        {count}
                      </div>
                      <div
                        className="w-6 bg-gradient-to-t from-brand-blue to-brand-accent dark:from-indigo-900 dark:to-brand-gold rounded-t-md transition-all duration-500 ease-out hover:brightness-110"
                        style={{ height: `${percentage * 0.7}%` }}
                      />
                      <span className="text-[9px] font-bold text-slate-500 truncate max-w-full">{source}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-center">Enrollees split by their promotional hearing source.</p>
            </div>

            {/* Daily registrations Timeline - Custom SVG Line Chart (8 columns) */}
            <div className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Activity className="w-5 h-5 text-brand-accent dark:text-brand-gold" />
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Enrollment Growth Trend</h3>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="h-56 relative border-b border-slate-100 dark:border-slate-800 pt-4 px-2">
                {stats.timeline && stats.timeline.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Generate continuous path */}
                    {(() => {
                      const maxVal = Math.max(...stats.timeline.map((d) => d.count), 2);
                      const points = stats.timeline.map((d, index) => {
                        const x = (index / Math.max(stats.timeline.length - 1, 1)) * 480 + 10;
                        const y = 100 - (d.count / maxVal) * 80;
                        return { x, y };
                      });

                      const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                      const fillD = `${pathD} L ${points[points.length - 1]?.x} 110 L ${points[0]?.x} 110 Z`;

                      return (
                        <>
                          {/* Filled area */}
                          <path d={fillD} fill="url(#chartGradient)" />
                          {/* Top stroke line */}
                          <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="2.5" />
                          {/* Circle indicators */}
                          {points.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill="#FFC107"
                              stroke="#0A2A66"
                              strokeWidth="1.5"
                              title={`${stats.timeline[i].date}: ${stats.timeline[i].count}`}
                            />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400">
                    Growth charts populate on subsequent days.
                  </div>
                )}
                {/* Timeline axis descriptors */}
                <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-2 px-1">
                  <span>{stats.timeline?.[0]?.date || "Genesis"}</span>
                  <span>{stats.timeline?.[Math.floor(stats.timeline.length / 2)]?.date || "Midpoint"}</span>
                  <span>{stats.timeline?.[stats.timeline.length - 1]?.date || "Current"}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-center">Registrations frequency logged chronologically.</p>
            </div>

          </div>
        )}

        {/* Database Filters & Actions Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                id="admin-search-input"
                type="text"
                placeholder="Search by ID, Name, Email, or Church..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-xs font-bold text-slate-700 dark:text-white"
              />
            </div>

            {/* Filter Selections */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Gender selector */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  id="admin-filter-gender"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Status Selector */}
              <div className="flex items-center space-x-2">
                <select
                  id="admin-filter-status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

            </div>

          </div>

          {/* Registrations Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left text-xs font-bold border-collapse">
              
              {/* Table Header */}
              <thead className="bg-slate-100/85 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-700/55">
                <tr>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-1">
                      <span>Registration ID</span>
                      {sortField === "id" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort("fullName")}>
                    <div className="flex items-center gap-1">
                      <span>Applicant Name</span>
                      {sortField === "fullName" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4">Contacts</th>
                  <th className="px-6 py-4">Ministry Info</th>
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-200/50" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      {sortField === "status" && (sortOrder === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right print:hidden">Administrative Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {loading ? (
                  [...Array(3)].map((_, rIdx) => (
                    <tr key={rIdx}>
                      {[...Array(6)].map((_, cIdx) => (
                        <td key={cIdx} className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-sm animate-pulse w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedRegs.length > 0 ? (
                  paginatedRegs.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                      
                      {/* ID */}
                      <td className="px-6 py-4 font-mono font-black text-brand-accent dark:text-brand-gold">
                        {reg.id}
                      </td>

                      {/* Name & Gender */}
                      <td className="px-6 py-4">
                        <span className="block font-extrabold text-slate-900 dark:text-white text-sm">{reg.fullName}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{reg.gender}</span>
                      </td>

                      {/* Contacts */}
                      <td className="px-6 py-4 space-y-0.5">
                        <span className="block text-xs font-semibold">{reg.email}</span>
                        <span className="block text-[10px] font-bold text-slate-400">{reg.phoneNumber}</span>
                      </td>

                      {/* Ministry */}
                      <td className="px-6 py-4 space-y-0.5 max-w-[200px] truncate">
                        <span className="block font-semibold text-slate-800 dark:text-slate-200">{reg.church}</span>
                        <span className="text-[10px] font-bold text-slate-400">Via: {reg.referralSource}</span>
                      </td>

                      {/* Status Badges */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg tracking-wider ${
                            reg.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : reg.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right print:hidden">
                        <div className="flex items-center justify-end gap-2">
                          {reg.status !== "Approved" && (
                            <button
                              id={`btn-approve-${reg.id}`}
                              onClick={() => handleStatusUpdate(reg.id, "Approved")}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40 rounded-lg shadow-xs transition-colors cursor-pointer"
                              title="Approve Applicant"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          {reg.status !== "Rejected" && (
                            <button
                              id={`btn-reject-${reg.id}`}
                              onClick={() => handleStatusUpdate(reg.id, "Rejected")}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200/50 dark:border-red-800/40 rounded-lg shadow-xs transition-colors cursor-pointer"
                              title="Reject Applicant"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-bold text-slate-400">
                      No registrations match your search filters.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          {/* Table Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 print:hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Showing Page {currentPage} of {totalPages} ({totalItems} enrollees total)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  id="admin-btn-page-prev"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>

                <button
                  id="admin-btn-page-next"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          )}

        </div>


      {/* Security Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-brand-blue/10 dark:bg-brand-accent/20 text-brand-blue dark:text-brand-gold rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Security & Credentials</h3>
                    <p className="text-xs text-slate-400 font-bold">Manage admin authentication details and check security alerts.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setSettingsError(null);
                    setSettingsSuccess(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Change Credentials Form */}
                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Update Credentials</h4>
                  
                  {/* Current Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block">Current Password <span className="text-red-500">*</span></label>
                    <input
                      type="password"
                      required
                      placeholder="Verify current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* New Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block">New Admin Email</label>
                    <input
                      type="email"
                      placeholder="e.g. registrar@domain.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block">New Password</label>
                    <input
                      type="password"
                      placeholder="Min. 8 chars, mixed case & sym"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase block">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50 text-slate-800 dark:text-white"
                    />
                  </div>

                  {/* Messages */}
                  {settingsError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{settingsError}</span>
                    </div>
                  )}

                  {settingsSuccess && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{settingsSuccess}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="w-full py-2.5 bg-brand-blue hover:bg-brand-accent text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>Save Settings</span>
                  </button>
                </form>

                {/* Security Alerts / Audit Logs */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 max-h-[400px] overflow-y-auto">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-brand-gold animate-bounce" />
                    <span>Security Logs</span>
                  </h4>

                  {securityNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {securityNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-widest text-brand-accent dark:text-brand-gold uppercase">
                              {notif.type} Event
                            </span>
                            <span className="text-[9px] font-bold text-slate-400">
                              {new Date(notif.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] font-bold text-slate-400">No recent credentials modifications logged.</p>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
