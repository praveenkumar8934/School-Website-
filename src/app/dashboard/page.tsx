"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, BookOpen, Calendar, Bell, CreditCard, FileText,
  TrendingUp, Clock, Award, BarChart2, CheckCircle, XCircle,
  AlertCircle, ChevronRight, Menu, X, LogOut, Home,
  ClipboardList, Star, Zap, Target, Download, FileQuestion, QrCode, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import StudentTestsView from "@/components/StudentTestsView";
import { generateInstallments } from "@/lib/feeStructure";

const supabase = createClient();

/* ─── Mock student data ─── */
const defaultStudent = {
  id: "",
  student_id: "",
  name: "Loading...",
  rollNo: "—",
  class: "—",
  grade: "—",
  section: "—",
  photo: "https://ui-avatars.com/api/?name=Loading&background=3d6db5&color=fff&size=128&bold=true",
  admissionNo: "—",
  dob: "—",
  bloodGroup: "—",
  parentPhone: "—",
  parentEmail: "—",
  address: "—",
  status: "Loading",
  feeStatus: "Loading",
  feeDetails: null as any,
};

const defaultStats = [
  { label: "Attendance", value: "0%", sub: "Present this month", icon: CheckCircle, color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/20" },
  { label: "Overall Grade", value: "N/A", sub: "Top 5% of class", icon: Star, color: "from-blue-500 to-indigo-600", glow: "shadow-blue-500/20" },
  { label: "Class Rank", value: "N/A", sub: "Out of 42 students", icon: Target, color: "from-gold-500 to-amber-500", glow: "shadow-amber-400/20" },
  { label: "Upcoming Tests", value: "0", sub: "Next 7 days", icon: Zap, color: "from-purple-500 to-pink-600", glow: "shadow-purple-500/20" },
];

const defaultSubjects: any[] = [];

const defaultAttendance: {
  percentage: number;
  present: number;
  absent: number;
  late: number;
  total: number;
  monthly: { month: string; pct: number }[];
} = {
  percentage: 0,
  present: 0,
  absent: 0,
  late: 0,
  total: 0,
  monthly: [],
};

const defaultTimetable: any[] = [];

const defaultUpcomingExams: any[] = [];

const defaultAnnouncements: any[] = [];

const defaultFees: any[] = [];

/* ─── Sidebar nav items ─── */
const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "attendance", label: "Attendance", icon: CheckCircle },
  { id: "results", label: "Results", icon: BarChart2 },
  { id: "timetable", label: "Timetable", icon: Clock },
  { id: "exams", label: "Exams", icon: ClipboardList },
  { id: "online-tests", label: "Online Tests", icon: FileQuestion },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "fees", label: "Fee Status", icon: CreditCard },
  { id: "profile", label: "My Profile", icon: User },
];

const gradeColor = (g: string) => {
  if (g === "A+") return "text-emerald-400";
  if (g === "A") return "text-blue-400";
  if (g === "B+") return "text-gold-400";
  return "text-slate-400";
};

const trendColor = (t: string) => {
  if (t.startsWith("+")) return "text-emerald-400";
  if (t.startsWith("-")) return "text-red-400";
  return "text-slate-500";
};

function gradeFromScore(marks: number, total: number) {
  const pct = (marks / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  return "C";
}

export default function StudentDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const [sysSettings, setSysSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Dynamic Data States
  const [student, setStudent] = useState(defaultStudent);
  const [stats, setStats] = useState(defaultStats);
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [attendance, setAttendance] = useState(defaultAttendance);
  const [timetable, setTimetable] = useState(defaultTimetable);
  const [upcomingExams, setUpcomingExams] = useState(defaultUpcomingExams);
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [fees, setFees] = useState(defaultFees);

  // Payment states
  const [selectedFeeToPay, setSelectedFeeToPay] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const darkInputClass = "w-full rounded-lg bg-slate-900 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors";

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update local state to mark fee as paid
    setFees(prev => prev.map(f => {
      if (f.term === selectedFeeToPay.term) {
        return { ...f, status: "Paid", paidOn: new Date().toLocaleDateString() };
      }
      return f;
    }));
    
    setIsProcessingPayment(false);
    setSelectedFeeToPay(null);
    setPaymentMethod("card");
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/student/dashboard');
        if (!res.ok) {
          router.push("/login?redirect=/dashboard");
          return;
        }

        const data = await res.json();
        
        setIsAuthenticated(true);

        if (data.sysSettings) {
          setSysSettings(data.sysSettings);
        }
        setLoadingSettings(false);

        if (data.profile) {
          const profile = data.profile;
          setStudent(prev => ({
            ...prev,
            id: profile.id,
            student_id: profile.student_id,
            name: profile.student_name,
            rollNo: profile.id.split('-')[0].substring(0, 8).toUpperCase(), // fallback roll no
            class: `${profile.grade} – Section ${profile.assigned_section}`,
            grade: profile.grade,
            section: profile.assigned_section,
            photo: profile.student_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.student_name)}&background=3d6db5&color=fff&size=128&bold=true`,
            admissionNo: profile.student_id,
            dob: profile.dob,
            bloodGroup: profile.blood_group,
            parentPhone: profile.parent_phone,
            parentEmail: profile.parent_email,
            address: profile.address,
            status: "Active",
            feeStatus: profile.fee_status,
            feeDetails: profile.fee_details
          }));
        }

        if (data.attendanceData && data.attendanceData.length > 0) {
          const present = data.attendanceData.filter((a: any) => a.status === 'Present').length;
          const total = data.attendanceData.length;
          const percentage = Math.round((present / total) * 100);
          setAttendance(prev => ({ ...prev, percentage, present, total, absent: data.attendanceData.filter((a: any) => a.status === 'Absent').length }));
        }

        if (data.marksData && data.marksData.length > 0) {
          const formattedSubjects = data.marksData.map((m: any) => ({
            name: m.subject,
            teacher: "Assigned Teacher", // From schedule later
            marks: m.marks_obtained,
            total: m.max_marks,
            grade: m.grade || gradeFromScore(m.marks_obtained, m.max_marks),
            trend: "+0"
          }));
          setSubjects(formattedSubjects);
        }

        if (data.feeData && data.feeData.length > 0) {
          const formattedFees = data.feeData.map((f: any) => ({
            term: f.term,
            amount: `₹${f.amount_due}`,
            dueDate: new Date(f.due_date).toLocaleDateString(),
            status: f.status,
            paidOn: f.paid_on ? new Date(f.paid_on).toLocaleDateString() : "—"
          }));
          setFees(formattedFees);
        }

        if (data.notices && data.notices.length > 0) {
          const formatted = data.notices.map((n: any) => ({
            title: n.title,
            date: new Date(n.created_at).toLocaleDateString(),
            tag: n.tag || "Notice",
            icon: Bell,
            color: "blue"
          }));
          setAnnouncements(formatted);
        }

      } catch (err) {
        console.error("Custom session check failed", err);
        router.push("/login?redirect=/dashboard");
      }
    }
    
    fetchDashboardData();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  if (!isAuthenticated || loadingSettings) {
    return <div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white"><div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  if (sysSettings?.maintenance_mode) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold font-heading mb-2">System Under Maintenance</h1>
        <p className="text-slate-400 max-w-md text-center">The student portal is temporarily offline for scheduled maintenance. Please check back later.</p>
        <button onClick={handleSignOut} className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a1628] text-slate-100 font-sans">

      {/* ── Overlay for mobile sidebar ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-[#0d1e35] transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">Nova Academy</p>
            <p className="text-[10px] text-slate-400">Student Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Student mini card */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-full border border-blue-500/30 object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{student.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{student.class}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {activeSection === item.id && <ChevronRight className="h-3 w-3 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 active:scale-95 transition-all disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0a1628]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">{navItems.find(n => n.id === activeSection)?.label}</h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              ● Active Student
            </span>
            <img src={student.photo} alt="" className="h-8 w-8 rounded-full border border-blue-500/30" />
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >

              {/* ════════════════════════════════════
                  OVERVIEW
              ════════════════════════════════════ */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {/* Welcome banner */}
                  <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/10 border border-blue-500/15 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <img src={student.photo} alt={student.name} className="h-16 w-16 rounded-2xl border-2 border-blue-500/30 object-cover shadow-lg shadow-blue-500/20" />
                    <div>
                      <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Welcome back</p>
                      <h2 className="text-xl font-extrabold text-white mt-0.5">{student.name} 👋</h2>
                      <p className="text-sm text-slate-400 mt-1">{student.class} · Roll No: <span className="text-slate-200 font-mono">{student.rollNo}</span></p>
                    </div>
                    <div className="sm:ml-auto text-right hidden sm:block">
                      <p className="text-[10px] text-slate-400">Admission No.</p>
                      <p className="text-sm font-bold font-mono text-white">{student.admissionNo}</p>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={cn("rounded-2xl p-5 border border-white/5 bg-white/5 shadow-lg", s.glow)}
                      >
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", s.color)}>
                          <s.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-extrabold text-white">{s.value}</p>
                        <p className="text-xs font-bold text-slate-300 mt-0.5">{s.label}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{s.sub}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Two-column: quick results + upcoming exams */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Top subjects */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2"><BarChart2 className="h-4 w-4 text-blue-400" />Subject Performance</h3>
                        <button onClick={() => setActiveSection("results")} className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">View all <ChevronRight className="h-3 w-3" /></button>
                      </div>
                      <div className="space-y-3">
                        {subjects.slice(0, 4).map((s, i) => (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-300 font-medium">{s.name}</span>
                              <span className={cn("text-xs font-bold", gradeColor(s.grade))}>{s.marks}/100 · {s.grade}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.marks}%` }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming exams */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2"><ClipboardList className="h-4 w-4 text-purple-400" />Upcoming Exams</h3>
                        <button onClick={() => setActiveSection("exams")} className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">View all <ChevronRight className="h-3 w-3" /></button>
                      </div>
                      <div className="space-y-2.5">
                        {upcomingExams.map((e, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0",
                              e.color === "blue" ? "bg-blue-600/30" :
                              e.color === "purple" ? "bg-purple-600/30" :
                              e.color === "emerald" ? "bg-emerald-600/30" : "bg-amber-600/30"
                            )}>
                              {e.subject.slice(0,2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{e.subject}</p>
                              <p className="text-[10px] text-slate-400">{e.date} · {e.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Announcements preview */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2"><Bell className="h-4 w-4 text-gold-400" />Recent Announcements</h3>
                      <button onClick={() => setActiveSection("announcements")} className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">View all <ChevronRight className="h-3 w-3" /></button>
                    </div>
                    <div className="space-y-2">
                      {announcements.slice(0, 2).map((a, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3">
                          <a.icon className="h-4 w-4 text-gold-400 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{a.title}</p>
                            <p className="text-[10px] text-slate-500">{a.date}</p>
                          </div>
                          <span className="ml-auto text-[9px] font-bold rounded-full bg-blue-500/15 text-blue-400 px-2 py-0.5 shrink-0">{a.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════
                  ATTENDANCE
              ════════════════════════════════════ */}
              {activeSection === "attendance" && (
                <div className="space-y-6">
                  {/* Big circle stat */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Days Present", value: attendance.present, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/15" },
                      { label: "Days Absent", value: attendance.absent, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/15" },
                      { label: "Late Arrivals", value: attendance.late, icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/15" },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                        className={cn("rounded-2xl border p-5 flex items-center gap-4", item.bg)}>
                        <item.icon className={cn("h-8 w-8", item.color)} />
                        <div>
                          <p className="text-2xl font-extrabold text-white">{item.value}</p>
                          <p className="text-xs text-slate-400">{item.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Monthly bars */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-400" />Monthly Attendance Trend</h3>
                    <div className="flex items-end gap-4 h-32">
                      {attendance.monthly.map((m, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-semibold">{m.pct}%</span>
                          <div className="w-full rounded-t-lg overflow-hidden" style={{ height: "80px" }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${m.pct}%` }}
                              transition={{ duration: 0.6, delay: i * 0.1 }}
                              className={cn("w-full rounded-t-lg", m.pct >= 90 ? "bg-emerald-500" : m.pct >= 75 ? "bg-blue-500" : "bg-red-500")}
                              style={{ height: `${m.pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">{m.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall percentage ring */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative h-32 w-32 shrink-0">
                      <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ffffff10" strokeWidth="3.5" />
                        <motion.circle
                          cx="18" cy="18" r="15.9" fill="none"
                          stroke="#10b981" strokeWidth="3.5"
                          strokeDasharray={`${attendance.percentage} ${100 - attendance.percentage}`}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: `${attendance.percentage} ${100 - attendance.percentage}` }}
                          transition={{ duration: 1.2 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-extrabold text-white">{attendance.percentage}%</p>
                        <p className="text-[10px] text-slate-400">Overall</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-bold text-white text-base">Annual Attendance Summary</p>
                      <p className="text-slate-400">Academic Year 2025–26</p>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" /> Present: <strong className="text-white">{attendance.present}</strong> days
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-red-400 inline-block" /> Absent: <strong className="text-white">{attendance.absent}</strong> days
                      </div>
                      <p className={cn("text-xs font-semibold mt-2",
                        attendance.percentage >= 85 ? "text-emerald-400" : "text-amber-400")}>
                        {attendance.percentage >= 85 ? "✓ Eligible for examinations" : "⚠ Attendance below required 85%"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════
                  RESULTS
              ════════════════════════════════════ */}
              {activeSection === "results" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Term 1 · Academic Year 2025–26</p>
                    <button 
                      onClick={() => router.push('/dashboard/report-card')}
                      className="flex items-center gap-2 rounded-xl bg-blue-600/20 border border-blue-500/20 px-4 py-2 text-xs font-bold text-blue-400 hover:bg-blue-600/30 transition"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Report Card
                    </button>
                  </div>

                  {/* Table */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Subject</th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:table-cell">Teacher</th>
                          <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Marks</th>
                          <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Grade</th>
                          <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:table-cell">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((s, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-white text-xs">{s.name}</p>
                              <p className="text-[10px] text-slate-500 sm:hidden">{s.teacher}</p>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-400 hidden sm:table-cell">{s.teacher}</td>
                            <td className="px-4 py-3.5 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-extrabold text-white">{s.marks}<span className="text-slate-500 text-[10px]">/{s.total}</span></span>
                                <div className="h-1 w-16 rounded-full bg-white/10">
                                  <div className="h-1 rounded-full bg-blue-500" style={{ width: `${s.marks}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className={cn("text-sm font-extrabold", gradeColor(s.grade))}>{s.grade}</span>
                            </td>
                            <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                              <span className={cn("text-xs font-bold", trendColor(s.trend))}>
                                {s.trend === "0" ? "—" : s.trend.startsWith("+") ? `▲ ${s.trend}` : `▼ ${s.trend}`}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Skills Radar */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Subject Performance Profile</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjects}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                          <Radar name="Marks" dataKey="marks" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Average Score", value: `${Math.round(subjects.reduce((a, s) => a + s.marks, 0) / subjects.length)}%` },
                      { label: "Highest Score", value: `${Math.max(...subjects.map(s => s.marks))}%` },
                      { label: "Overall Grade", value: "A+" },
                    ].map((item, i) => (
                      <div key={i} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                        <p className="text-xl font-extrabold text-white">{item.value}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════
                  TIMETABLE
              ════════════════════════════════════ */}
              {activeSection === "timetable" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">Grade 9 – Section A · Weekly Schedule</p>
                  <div className="rounded-2xl border border-white/5 bg-white/5 overflow-x-auto">
                    <table className="w-full text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold w-32">Time</th>
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map(d => (
                            <th key={d} className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((row, i) => (
                          <tr key={i} className={cn("border-b border-white/5 hover:bg-white/5 transition", row.Mon === "Break" && "bg-white/2")}>
                            <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{row.time}</td>
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map(d => (
                              <td key={d} className="px-3 py-3 text-center">
                                {row[d as keyof typeof row] === "Break" ? (
                                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-500 font-medium">Break</span>
                                ) : (
                                  <span className="rounded-lg bg-blue-500/15 border border-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-300">
                                    {row[d as keyof typeof row]}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════
                  EXAMS
              ════════════════════════════════════ */}
              {activeSection === "exams" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">Upcoming examinations and assessments</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {upcomingExams.map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={cn("rounded-2xl border p-5 space-y-3",
                          e.color === "blue" ? "border-blue-500/20 bg-blue-500/5" :
                          e.color === "purple" ? "border-purple-500/20 bg-purple-500/5" :
                          e.color === "emerald" ? "border-emerald-500/20 bg-emerald-500/5" :
                          "border-amber-500/20 bg-amber-500/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white">{e.subject}</h4>
                          <span className={cn("text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0",
                            e.color === "blue" ? "bg-blue-500/20 text-blue-400" :
                            e.color === "purple" ? "bg-purple-500/20 text-purple-400" :
                            e.color === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
                            "bg-amber-500/20 text-amber-400"
                          )}>{e.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {e.date}
                        </div>
                        <div className="rounded-lg bg-white/5 px-3 py-2">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Syllabus</p>
                          <p className="text-xs text-slate-300">{e.syllabus}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════
                  ANNOUNCEMENTS
              ════════════════════════════════════ */}
              {activeSection === "announcements" && (
                <div className="space-y-3">
                  {announcements.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-2xl border border-white/5 bg-white/5 p-5 flex items-start gap-4 hover:bg-white/8 transition cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                        <a.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-blue-300 transition">{a.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{a.date}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold rounded-full bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1">{a.tag}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ════════════════════════════════════
                  FEES
              ════════════════════════════════════ */}
              {activeSection === "fees" && (() => {
                let details = student.feeDetails;
                if (typeof details === "string") {
                  try { details = JSON.parse(details); } catch(e) {}
                }

                // Fallback for students who don't have fee_details generated yet
                if (!details && student.grade && student.grade !== "—") {
                  details = generateInstallments(student.grade);
                }

                if (!details || !details.installments) {
                  return (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-10 flex flex-col items-center justify-center text-center">
                        <CreditCard className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-white mb-2">No Fee Records Found</h3>
                        <p className="text-sm text-slate-400 max-w-sm">There are no detailed fee records associated with this account for the current academic session.</p>
                        <p className="text-xs text-slate-500 mt-4">Current Overall Status: {student.feeStatus}</p>
                      </div>
                    </div>
                  );
                }

                const pendingInstallments = details.installments.filter((i: any) => i.status !== 'Paid');
                const nextDue = pendingInstallments.length > 0 ? pendingInstallments[0] : null;

                return (
                  <div className="space-y-5">
                    <div className={cn(
                      "rounded-2xl border p-4 flex items-center gap-3",
                      nextDue ? "border-amber-500/20 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5"
                    )}>
                      {nextDue ? <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" /> : <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />}
                      <p className={cn("text-sm font-medium", nextDue ? "text-amber-300" : "text-emerald-300")}>
                        {nextDue 
                          ? `Next payment of ₹${nextDue.amount.toLocaleString()} due by ${new Date(nextDue.dueDate).toLocaleDateString()}` 
                          : "All fees fully paid for this academic year."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[
                        { label: "Annual Total", value: `₹${details.totalFee.toLocaleString()}` },
                        { label: "Amount Paid", value: `₹${(details.totalPaid || 0).toLocaleString()}` },
                        { label: "Remaining", value: `₹${(details.totalFee - (details.totalPaid || 0)).toLocaleString()}` },
                        { label: "Next Due", value: nextDue ? new Date(nextDue.dueDate).toLocaleDateString() : "—" },
                      ].map((item, i) => (
                        <div key={i} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                          <p className="text-lg font-extrabold text-white">{item.value}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden mt-6">
                      <div className="px-5 py-4 border-b border-white/5">
                        <h4 className="text-sm font-semibold text-white">Installment Breakdown</h4>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5">
                            {["Installment", "Amount", "Due Date", "Status", "Paid On", "Action"].map(h => (
                              <th key={h} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {details.installments.map((inst: any, i: number) => (
                            <tr key={inst.id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="px-5 py-4 text-xs font-semibold text-white">Installment {i + 1}</td>
                              <td className="px-5 py-4 text-xs font-mono text-slate-300">₹{inst.amount.toLocaleString()}</td>
                              <td className="px-5 py-4 text-xs text-slate-400">{new Date(inst.dueDate).toLocaleDateString()}</td>
                              <td className="px-5 py-4">
                                <span className={cn("text-[10px] font-bold rounded-full px-2.5 py-1",
                                  inst.status === "Paid" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" :
                                  inst.status === "Overdue" ? "bg-red-500/15 text-red-400 border border-red-500/20" :
                                  "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                                )}>{inst.status}</span>
                              </td>
                              <td className="px-5 py-4 text-xs text-slate-400 font-mono">{inst.paidDate ? new Date(inst.paidDate).toLocaleDateString() : "—"}</td>
                              <td className="px-5 py-4">
                                {inst.status !== "Paid" && (
                                  <button 
                                    onClick={() => alert('Payment Gateway Integration Pending')}
                                    className="rounded-lg bg-blue-600/20 border border-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-600/30 transition"
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* ════════════════════════════════════
                  ONLINE TESTS
              ════════════════════════════════════ */}
              {activeSection === "online-tests" && (
                <StudentTestsView student={student} />
              )}

              {/* ════════════════════════════════════
                  PROFILE
              ════════════════════════════════════ */}
              {activeSection === "profile" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="relative shrink-0">
                      <img src={student.photo} alt={student.name} className="h-24 w-24 rounded-2xl border-2 border-blue-500/30 object-cover shadow-xl shadow-blue-500/20" />
                      <span className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 h-5 w-5 border-2 border-[#0d1e35] flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl font-extrabold text-white">{student.name}</h2>
                      <p className="text-sm text-blue-400 font-medium mt-0.5">{student.class}</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">{student.admissionNo}</p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400">Active</span>
                        <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400">CBSE</span>
                        <span className="rounded-full bg-purple-500/15 border border-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-400">2025–26</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { section: "Personal Info", items: [
                        { label: "Date of Birth", value: student.dob },
                        { label: "Blood Group", value: student.bloodGroup },
                        { label: "Roll No.", value: student.rollNo },
                      ]},
                      { section: "Contact Details", items: [
                        { label: "Parent Phone", value: student.parentPhone },
                        { label: "Parent Email", value: student.parentEmail },
                        { label: "Address", value: student.address },
                      ]},
                    ].map((group, gi) => (
                      <div key={gi} className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.section}</h3>
                        {group.items.map((item, ii) => (
                          <div key={ii} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</p>
                            <p className="text-xs font-semibold text-slate-200 mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Documents */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Uploaded Documents</h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {["Student Photo", "Marksheet", "Aadhar Card"].map((doc, i) => (
                        <button key={i} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 transition group">
                          <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition">{doc}</span>
                          <Download className="h-3.5 w-3.5 text-slate-500 ml-auto group-hover:text-blue-400 transition" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── PAYMENT MODAL ── */}
      <AnimatePresence>
        {selectedFeeToPay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1e35] shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  Complete Payment
                </h3>
                <button 
                  onClick={() => !isProcessingPayment && setSelectedFeeToPay(null)}
                  className="text-slate-400 hover:text-white transition"
                  disabled={isProcessingPayment}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedFeeToPay.term} Fee</p>
                    <p className="text-xs text-slate-400 mt-1">Due by {selectedFeeToPay.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-blue-400">{selectedFeeToPay.amount}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Select Payment Method</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                        paymentMethod === "card" 
                          ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Credit / Debit Card</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200",
                        paymentMethod === "upi" 
                          ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                          : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <QrCode className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">UPI / QR Code</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 rounded-xl border border-white/10 bg-slate-900/60 p-5">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cardholder Name</span>
                      <input type="text" placeholder="John Doe" className={darkInputClass} />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Card Number</span>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} className={darkInputClass} />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Expiry (MM/YY)</span>
                        <input type="text" placeholder="12/25" maxLength={5} className={darkInputClass} />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">CVV</span>
                        <input type="password" placeholder="XXX" maxLength={3} className={darkInputClass} />
                      </label>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="rounded-xl border border-white/10 bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center">
                    <div className="h-32 w-32 bg-white p-2 rounded-lg mb-4 flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-slate-900" />
                    </div>
                    <p className="text-sm text-slate-400">Scan this QR code with any UPI app</p>
                    <p className="text-xs text-slate-500 mt-1">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 p-5 flex justify-end gap-3">
                <button
                  onClick={() => !isProcessingPayment && setSelectedFeeToPay(null)}
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay {selectedFeeToPay.amount}
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
