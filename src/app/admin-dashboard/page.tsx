"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import {
  Users, UserPlus, BookOpen, Settings, LogOut,
  Menu, X, ChevronRight, Home, Shield, DollarSign,
  TrendingUp, CheckCircle, XCircle, Search, FileText, Download,
  Mail, Phone, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

/* ═══════════════════════════════════════════════
   MOCK DATA FOR ADMIN
═══════════════════════════════════════════════ */
const adminProfile = {
  name: "System Administrator",
  id: "ADMIN-001",
  role: "Principal / Super Admin",
  photo: "https://ui-avatars.com/api/?name=System+Admin&background=1e293b&color=fff&bold=true",
};

const navItems = [
  { id: "overview",   label: "Overview",       icon: Home },
  { id: "admissions", label: "Admissions Hub", icon: UserPlus },
  { id: "students",   label: "Student Directory",icon: Users },
  { id: "teachers",   label: "Faculty & Staff",icon: BookOpen },
  { id: "notices",    label: "Notice Board",   icon: Bell },
  { id: "settings",   label: "System Settings",icon: Settings },
];

/* ═══════════════════════════════════════════════
   SUPABASE CLIENT
═══════════════════════════════════════════════ */
// Note: In a real app, use environment variables and secure server actions.
// Here we are using public keys for client-side fetching as a demonstration.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admissions state
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);

  // Student Directory Filters
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentClassFilter, setStudentClassFilter] = useState("All");
  const [studentSectionFilter, setStudentSectionFilter] = useState("All");
  const [studentFeeFilter, setStudentFeeFilter] = useState("All");

  // Faculty Requests state
  const [facultyRequests, setFacultyRequests] = useState<any[]>([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  // Notices state
  const [notices, setNotices] = useState<any[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", date: "", tag: "Notice" });
  const [publishingNotice, setPublishingNotice] = useState(false);

  // System Settings state
  const [sysSettings, setSysSettings] = useState<any>({
    admissions_open: true,
    maintenance_mode: false,
    teacher_portal_active: true,
    current_academic_year: "2026-2027"
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    // Check session securely via API
    fetch("/api/auth/session").then(res => {
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/login?redirect=/admin-dashboard");
      }
    }).catch(() => {
      router.push("/login?redirect=/admin-dashboard");
    });

    if (activeSection === "overview") {
      fetchAdmissions();
      fetchStudents();
      fetchFacultyRegistrations();
    }
    if (activeSection === "admissions") {
      fetchAdmissions();
    }
    if (activeSection === "teachers") {
      fetchFacultyRegistrations();
    }
    if (activeSection === "students") {
      fetchStudents();
    }
    if (activeSection === "notices") {
      fetchNotices();
    }
    if (activeSection === "settings") {
      fetchSettings();
    }
  }, [activeSection, router]);

  const fetchAdmissions = async () => {
    setLoadingAdmissions(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase keys missing. Cannot fetch live data.");
        setAdmissions([]);
        return;
      }
      const { data, error } = await supabase
        .from("admission_form")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setAdmissions(data || []);
    } catch (err) {
      console.error("Error fetching admissions:", err);
    } finally {
      setLoadingAdmissions(false);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) return;
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchNotices = async () => {
    setLoadingNotices(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) return;
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setNotices(data || []);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoadingNotices(false);
    }
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.date || !newNotice.tag) return;
    
    setPublishingNotice(true);
    try {
      const { error } = await supabase
        .from("notices")
        .insert([{
          title: newNotice.title,
          date: newNotice.date,
          tag: newNotice.tag
        }]);
        
      if (error) throw error;
      
      setNewNotice({ title: "", date: "", tag: "Notice" });
      fetchNotices();
      alert("Notice published successfully!");
    } catch (err: any) {
      console.error("Failed to publish notice:", err);
      alert("Failed to publish notice: " + err.message);
    } finally {
      setPublishingNotice(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const { data, error } = await supabase.from("system_settings").select("*").eq("id", 1).single();
      if (error) {
        if (error.code === 'PGRST116') {
          // No row found, ignore or create
        } else {
          throw error;
        }
      }
      if (data) setSysSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    setSavingSettings(true);
    try {
      const newSettings = { ...sysSettings, [key]: value };
      setSysSettings(newSettings);
      
      const { error } = await supabase
        .from("system_settings")
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq("id", 1);
        
      if (error) throw error;
    } catch (err: any) {
      console.error("Error updating setting:", err);
      alert("Failed to update setting: " + err.message);
      fetchSettings(); // revert to db state
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      let student_id = null;
      if (newStatus === "approved") {
        const admissionRecord = admissions.find(a => a.id === id);
        if (!admissionRecord) throw new Error("Admission record not found in state");
        
        const grade = admissionRecord.grade || admissionRecord.grade_applied || "Unknown";
        
        // Generate a class abbreviation (e.g., "Class 1" -> "C1", "Nursery" -> "NUR")
        let classAbbr = grade.toUpperCase().replace(/\s+/g, '');
        if (classAbbr.startsWith("CLASS")) {
          classAbbr = classAbbr.replace("CLASS", "C");
        } else {
          classAbbr = classAbbr.substring(0, 3);
        }

        // Fetch the count of students in this class to get the next serial number
        const { count, error: countError } = await supabase
          .from("students")
          .select('*', { count: 'exact', head: true })
          .eq('grade', grade);
          
        if (countError) throw countError;
          
        const serialNumber = (count || 0) + 1;
        const currentYear = new Date().getFullYear();
        
        student_id = `STU-${classAbbr}-${currentYear}-${String(serialNumber).padStart(4, '0')}`;
      }
      
      const updateData: any = { status: newStatus };
      if (student_id) updateData.student_id = student_id;

      const { error } = await supabase
        .from("admission_form")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
      
      // If approved, insert into students table
      if (newStatus === "approved" && student_id) {
        const admissionRecord = admissions.find(a => a.id === id);
        if (admissionRecord) {
          await supabase.from("students").insert({
            admission_id: admissionRecord.id,
            student_id: student_id,
            student_name: admissionRecord.student_name,
            dob: admissionRecord.dob,
            gender: admissionRecord.gender,
            blood_group: admissionRecord.blood_group,
            student_photo: admissionRecord.student_photo,
            grade: admissionRecord.grade || admissionRecord.grade_applied,
            parent_name: admissionRecord.father_name || admissionRecord.guardian_name,
            parent_phone: admissionRecord.parent_phone || admissionRecord.phone,
            parent_email: admissionRecord.parent_email || admissionRecord.email,
            address: admissionRecord.address,
            assigned_section: "Unassigned",
            fee_status: "Pending"
          });

          // Send approval email notification
          try {
            await fetch("/api/email/notify-approval", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "student",
                name: admissionRecord.student_name,
                email: admissionRecord.parent_email || admissionRecord.email,
                generatedId: student_id
              })
            });
          } catch (e) {
            console.error("Failed to send approval email:", e);
          }
        }
      }

      // Update local state
      setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, ...(student_id && { student_id }) } : a));
      if (selectedAdmission?.id === id) {
        setSelectedAdmission({ ...selectedAdmission, status: newStatus, ...(student_id && { student_id }) });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDeleteAdmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admission request? This cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from("admission_form")
        .delete()
        .eq("id", id);
      if (error) throw error;
      
      setAdmissions(prev => prev.filter(a => a.id !== id));
      if (selectedAdmission?.id === id) {
        setSelectedAdmission(null);
      }
    } catch (err) {
      console.error("Error deleting admission:", err);
      alert("Failed to delete admission request.");
    }
  };

  const handleUpdateStudentField = async (id: string, field: string, value: string) => {
    try {
      const { error } = await supabase
        .from("students")
        .update({ [field]: value })
        .eq("id", id);
      if (error) throw error;
      
      setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      alert(`Failed to update ${field}.`);
    }
  };

  const fetchFacultyRegistrations = async () => {
    setLoadingFaculty(true);
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        setFacultyRequests([]);
        return;
      }
      const { data, error } = await supabase
        .from("faculty_registrations")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setFacultyRequests(data || []);
    } catch (err) {
      console.error("Error fetching faculty requests:", err);
    } finally {
      setLoadingFaculty(false);
    }
  };

  const handleUpdateFacultyStatus = async (id: string, newStatus: string) => {
    try {
      let faculty_id = null;
      // Generate a Faculty ID if the request is being approved
      if (newStatus === "approved") {
        faculty_id = `FAC-2026-${Math.floor(Math.random() * 900) + 100}`;
      }

      const updateData: any = { status: newStatus };
      if (faculty_id) updateData.faculty_id = faculty_id;

      const { error } = await supabase
        .from("faculty_registrations")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
      
      setFacultyRequests(prev => prev.map(f => f.id === id ? { ...f, status: newStatus, ...(faculty_id && { faculty_id }) } : f));

      // Send approval email notification if approved
      if (newStatus === "approved" && faculty_id) {
        const facultyRecord = facultyRequests.find(f => f.id === id);
        if (facultyRecord) {
          try {
            await fetch("/api/email/notify-approval", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "faculty",
                name: facultyRecord.full_name,
                email: facultyRecord.email,
                generatedId: faculty_id
              })
            });
          } catch (e) {
            console.error("Failed to send approval email:", e);
          }
        }
      }
    } catch (err) {
      console.error("Error updating faculty status:", err);
      alert("Failed to update status.");
    }
  };

  const handleAssignClass = async (id: string, assignedClass: string, assignedSection: string, assignedSubject: string, roleType: string) => {
    try {
      const { error } = await supabase
        .from("faculty_registrations")
        .update({ 
          assigned_class: assignedClass, 
          assigned_section: assignedSection,
          assigned_subject: assignedSubject,
          role_type: roleType
        })
        .eq("id", id);
      if (error) throw error;
      
      setFacultyRequests(prev => prev.map(f => f.id === id ? { 
        ...f, 
        assigned_class: assignedClass, 
        assigned_section: assignedSection,
        assigned_subject: assignedSubject,
        role_type: roleType
      } : f));
      alert("Class details assigned successfully!");
    } catch (err) {
      console.error("Error assigning class:", err);
      alert("Failed to assign class.");
    }
  };

  const handleSignOut = async () => {
    if (!confirm("Are you sure you want to sign out?")) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  const chartData = useMemo(() => {
    // Admissions over time (mocking dates if none exist, or using created_at)
    const trends = admissions.reduce((acc: any, curr: any) => {
      const date = new Date(curr.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const lineData = Object.keys(trends).map(k => ({ date: k, count: trends[k] })).slice(-7); // Last 7 days/entries

    // Faculty distribution
    const depts = facultyRequests.filter(f => f.status === 'approved').reduce((acc: any, curr: any) => {
      const d = curr.department || "Other";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    const pieData = Object.keys(depts).map((k, i) => ({
      name: k,
      value: depts[k],
      color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'][i % 5]
    }));

    return { lineData, pieData };
  }, [admissions, facultyRequests]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#060d18] flex items-center justify-center text-white"><div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#060d18] text-slate-100 font-sans">
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-[#0a1628] transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">Nova Admin</p>
            <p className="text-[10px] text-slate-400">Master Control</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profile */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <img src={adminProfile.photo} alt="Admin" className="h-10 w-10 rounded-full border border-blue-500/30 object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{adminProfile.name}</p>
              <p className="text-[10px] text-blue-400 font-mono mt-0.5">{adminProfile.id}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); setSelectedAdmission(null); }}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {activeSection === item.id && <ChevronRight className="h-3 w-3 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Sign out */}
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

      {/* ── MAIN ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/5 bg-[#060d18]/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">
                {navItems.find(n => n.id === activeSection)?.label}
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick action: Global Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-full px-3 py-1.5">
              <Search className="h-3 w-3 text-slate-400" />
              <input type="text" placeholder="Global Search..." className="bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none w-32" />
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              
              {/* ════════════════
                  OVERVIEW
              ════════════════ */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                      { label: "Total Students", value: students.length.toString(), icon: Users, color: "from-blue-500 to-indigo-600" },
                      { label: "Teaching Staff", value: facultyRequests.filter(f => f.status === 'approved').length.toString(), icon: BookOpen, color: "from-purple-500 to-pink-600" },
                      { label: "New Applications", value: admissions.length.toString(), icon: FileText, color: "from-emerald-500 to-teal-600" },
                      { label: "Pending Fees", value: "₹0", icon: DollarSign, color: "from-amber-500 to-orange-600" },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-2xl p-5 border border-white/5 bg-white/5 shadow-lg relative overflow-hidden group">
                        <div className={cn("absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl opacity-10 rounded-bl-full transition-transform group-hover:scale-110", stat.color)} />
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", stat.color)}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Advanced Analytics Charts */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Admissions Trend */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <h3 className="text-sm font-bold text-white mb-4">Admissions Trend (Last 7 Days)</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData.lineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Faculty Distribution */}
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <h3 className="text-sm font-bold text-white mb-4">Faculty by Department</h3>
                      <div className="h-64 w-full flex items-center justify-center">
                        {chartData.pieData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData.pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {chartData.pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="text-xs text-slate-500 italic">No faculty data available.</p>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 justify-center">
                        {chartData.pieData.map((d, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-xs text-slate-300">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════
                  ADMISSIONS (Live Supabase Data)
              ════════════════ */}
              {activeSection === "admissions" && (
                <div className="space-y-4">
                  
                  {selectedAdmission ? (
                    // ADMISSION DETAIL VIEW
                    <div className="space-y-4">
                      <button 
                        onClick={() => setSelectedAdmission(null)}
                        className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                      >
                        ← Back to Applications
                      </button>

                      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                          <div>
                            <h2 className="text-xl font-bold text-white">{selectedAdmission.student_name}</h2>
                            <p className="text-sm text-slate-400 mt-1">Applied for: <span className="text-blue-400 font-bold">{selectedAdmission.grade || selectedAdmission.grade_applied}</span></p>
                            <p className="text-xs text-slate-500 mt-1 font-mono">App ID: {selectedAdmission.id}</p>
                            {selectedAdmission.student_id && (
                              <p className="text-sm text-emerald-400 mt-1 font-mono font-bold">Student ID: {selectedAdmission.student_id}</p>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Update Status:</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleUpdateStatus(selectedAdmission.id, 'approved')}
                                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition", selectedAdmission.status === 'approved' ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20")}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(selectedAdmission.id, 'rejected')}
                                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition", selectedAdmission.status === 'rejected' ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400 hover:bg-red-500/20")}
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(selectedAdmission.id, 'pending')}
                                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition", selectedAdmission.status === 'pending' ? "bg-amber-500 text-white" : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20")}
                              >
                                Pending
                              </button>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button 
                                onClick={() => handleDeleteAdmission(selectedAdmission.id)}
                                className="px-4 py-2 rounded-lg text-xs font-bold transition bg-red-900/30 text-red-500 hover:bg-red-600 hover:text-white"
                              >
                                Delete Request
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Details</h3>
                            <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">DOB</span>
                                <span className="text-xs text-slate-200 font-medium">{selectedAdmission.dob}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">Gender</span>
                                <span className="text-xs text-slate-200 font-medium">{selectedAdmission.gender}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">Blood Group</span>
                                <span className="text-xs text-slate-200 font-medium">{selectedAdmission.blood_group || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-500">Previous School</span>
                                <span className="text-xs text-slate-200 font-medium">{selectedAdmission.previous_school || "None"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guardian Details</h3>
                            <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">Father's Name</span>
                                <span className="text-xs text-slate-200 font-medium">{selectedAdmission.father_name || selectedAdmission.guardian_name}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">Mother's Name</span>
                                <span className="text-xs text-slate-200 font-medium">{selectedAdmission.mother_name || "N/A"}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">Phone</span>
                                <span className="text-xs text-slate-200 font-medium flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedAdmission.parent_phone || selectedAdmission.phone}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-xs text-slate-500">Email</span>
                                <span className="text-xs text-slate-200 font-medium flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedAdmission.parent_email || selectedAdmission.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(selectedAdmission.aadhar_image || selectedAdmission.student_photo || selectedAdmission.marksheet) && (
                          <div className="mt-8">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Documents Attached</h3>
                            <div className="flex flex-wrap gap-4">
                              {selectedAdmission.student_photo && (
                                <a 
                                  href={selectedAdmission.student_photo} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 hover:bg-emerald-500/20 transition"
                                >
                                  <FileText className="h-5 w-5 text-emerald-400" />
                                  <div>
                                    <p className="text-sm font-bold text-emerald-300">Student Photo</p>
                                    <p className="text-[10px] text-emerald-400/60">Click to view image</p>
                                  </div>
                                </a>
                              )}
                              
                              {selectedAdmission.marksheet && (
                                <a 
                                  href={selectedAdmission.marksheet} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 hover:bg-amber-500/20 transition"
                                >
                                  <FileText className="h-5 w-5 text-amber-400" />
                                  <div>
                                    <p className="text-sm font-bold text-amber-300">Previous Marksheet</p>
                                    <p className="text-[10px] text-amber-400/60">Click to view document</p>
                                  </div>
                                </a>
                              )}

                              {selectedAdmission.aadhar_image && (
                                <a 
                                  href={selectedAdmission.aadhar_image} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3 hover:bg-blue-500/20 transition"
                                >
                                  <FileText className="h-5 w-5 text-blue-400" />
                                  <div>
                                    <p className="text-sm font-bold text-blue-300">Aadhar Card Upload</p>
                                    <p className="text-[10px] text-blue-400/60">Click to view image</p>
                                  </div>
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // ADMISSIONS LIST VIEW
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">Live Applications from Database</p>
                        <button onClick={fetchAdmissions} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Refresh
                        </button>
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                        {loadingAdmissions ? (
                          <div className="p-10 text-center text-slate-400 text-sm">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                            Fetching from Supabase...
                          </div>
                        ) : admissions.length === 0 ? (
                          <div className="p-10 text-center text-slate-400 text-sm">No applications found in the database.</div>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/5 bg-white/2">
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Applicant</th>
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:table-cell">Grade</th>
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden md:table-cell">Date</th>
                                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Status</th>
                                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {admissions.map((ad: any) => (
                                <tr key={ad.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                  <td className="px-4 py-3">
                                    <p className="text-sm font-bold text-white">{ad.student_name}</p>
                                    <p className="text-[10px] text-slate-400">{ad.parent_phone || ad.phone}</p>
                                    {ad.student_id && <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{ad.student_id}</p>}
                                  </td>
                                  <td className="px-4 py-3 hidden sm:table-cell text-slate-300 text-xs">
                                    {ad.grade || ad.grade_applied}
                                  </td>
                                  <td className="px-4 py-3 hidden md:table-cell text-slate-400 text-xs">
                                    {new Date(ad.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={cn(
                                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                      ad.status === 'approved' ? "bg-emerald-500/20 text-emerald-400" :
                                      ad.status === 'rejected' ? "bg-red-500/20 text-red-400" :
                                      "bg-amber-500/20 text-amber-400"
                                    )}>
                                      {ad.status || 'pending'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <button 
                                      onClick={() => setSelectedAdmission(ad)}
                                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition"
                                    >
                                      Review
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ════════════════
                  STUDENTS DIRECTORY (Live Data)
              ════════════════ */}
              {activeSection === "students" && (() => {
                const filteredStudents = students.filter(s => {
                  const classVal = s.grade || "N/A";
                  const classMatch = studentClassFilter === "All" || classVal === studentClassFilter;
                  const sectionMatch = studentSectionFilter === "All" || (s.assigned_section || "Unassigned") === studentSectionFilter;
                  const feeMatch = studentFeeFilter === "All" || (s.fee_status || "Pending") === studentFeeFilter;
                  return classMatch && sectionMatch && feeMatch;
                });

                // Get unique classes for dropdown
                const uniqueClasses = Array.from(new Set(students.map(s => s.grade || "N/A"))).sort();

                return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-400">Master Student Directory</p>
                    <div className="flex gap-2">
                      <button onClick={fetchStudents} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 px-3">
                        <TrendingUp className="h-3 w-3" /> Refresh
                      </button>
                      <button onClick={() => setActiveSection("admissions")} className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition flex items-center gap-1">
                        <UserPlus className="h-3 w-3" /> Admit New Student
                      </button>
                    </div>
                  </div>
                  
                  {/* Filters Bar */}
                  <div className="flex flex-wrap gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Class:</span>
                      <select 
                        value={studentClassFilter}
                        onChange={(e) => setStudentClassFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white text-xs rounded-md px-2 py-1 outline-none"
                      >
                        <option value="All">All Classes</option>
                        {uniqueClasses.map((cls: any) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Section:</span>
                      <select 
                        value={studentSectionFilter}
                        onChange={(e) => setStudentSectionFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white text-xs rounded-md px-2 py-1 outline-none"
                      >
                        <option value="All">All Sections</option>
                        <option value="Unassigned">Unassigned</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fee:</span>
                      <select 
                        value={studentFeeFilter}
                        onChange={(e) => setStudentFeeFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white text-xs rounded-md px-2 py-1 outline-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/2">
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">ID / Name</th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Class</th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Section</th>
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Fee Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500 text-xs">
                              No students found matching these filters. Approve more applications first!
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((s: any) => (
                            <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                              <td className="px-4 py-3">
                                <p className="font-bold text-white text-xs">{s.student_name}</p>
                                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{s.student_id}</p>
                              </td>
                              <td className="px-4 py-3 text-slate-300 text-xs">
                                {s.grade || s.grade_applied}
                              </td>
                              <td className="px-4 py-3">
                                <select 
                                  value={s.assigned_section || "Unassigned"}
                                  onChange={(e) => handleUpdateStudentField(s.id, "assigned_section", e.target.value)}
                                  className={cn(
                                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase outline-none cursor-pointer appearance-none",
                                    (s.assigned_section && s.assigned_section !== "Unassigned") ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"
                                  )}
                                >
                                  <option value="Unassigned">Unassigned</option>
                                  <option value="A">Sec A</option>
                                  <option value="B">Sec B</option>
                                  <option value="C">Sec C</option>
                                  <option value="D">Sec D</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <select 
                                  value={s.fee_status || "Pending"}
                                  onChange={(e) => handleUpdateStudentField(s.id, "fee_status", e.target.value)}
                                  className={cn(
                                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase outline-none cursor-pointer appearance-none",
                                    s.fee_status === 'Paid' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  )}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Paid">Paid</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                );
              })()}

              {/* ════════════════
                  TEACHERS DIRECTORY (Live DB Data)
              ════════════════ */}
              {activeSection === "teachers" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-400">Faculty Registration Requests</p>
                    <button onClick={fetchFacultyRegistrations} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Refresh
                    </button>
                  </div>
                  
                  <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                    {loadingFaculty ? (
                      <div className="p-10 text-center text-slate-400 text-sm">
                        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                        Fetching from Supabase...
                      </div>
                    ) : facultyRequests.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 text-sm">No registration requests found.</div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/2">
                            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Applicant</th>
                            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:table-cell">Details</th>
                            <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Status</th>
                            <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facultyRequests.map((req: any) => (
                            <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="px-4 py-3">
                                <p className="text-sm font-bold text-white">{req.full_name}</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3 inline" /> {req.email}</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1"><Phone className="h-3 w-3 inline" /> {req.phone}</p>
                              </td>
                              <td className="px-4 py-3 hidden sm:table-cell text-slate-300">
                                <p className="text-xs font-bold text-blue-400">{req.department}</p>
                                <p className="text-[10px] text-slate-400">{req.qualification} • {req.experience_years} Yrs Exp</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={cn(
                                  "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                                  req.status === 'approved' ? "bg-emerald-500/20 text-emerald-400" :
                                  req.status === 'rejected' ? "bg-red-500/20 text-red-400" :
                                  "bg-amber-500/20 text-amber-400"
                                )}>
                                  {req.status || 'pending'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex flex-col gap-2">
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => handleUpdateFacultyStatus(req.id, 'approved')}
                                      className={cn("px-3 py-1 rounded-lg text-xs font-bold transition", req.status === 'approved' ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20")}
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateFacultyStatus(req.id, 'rejected')}
                                      className={cn("px-3 py-1 rounded-lg text-xs font-bold transition", req.status === 'rejected' ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400 hover:bg-red-500/20")}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                  
                                  {req.status === 'approved' && (
                                    <div className="flex flex-col gap-2 mt-2 border-t border-white/5 pt-2">
                                      <div className="flex items-center justify-end gap-1">
                                        <select 
                                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                                          defaultValue={req.role_type || ""}
                                          id={`role-${req.id}`}
                                        >
                                          <option value="" className="text-black">Role Type</option>
                                          <option value="Class Teacher" className="text-black">Class Teacher</option>
                                          <option value="Teacher" className="text-black">Subject Teacher</option>
                                        </select>
                                        <select 
                                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                                          defaultValue={req.assigned_subject || ""}
                                          id={`subject-${req.id}`}
                                        >
                                          <option value="" className="text-black">Subject</option>
                                          {["Mathematics", "Science", "English", "History", "Computer", "Physical Education"].map(sub => (
                                            <option key={sub} value={sub} className="text-black">{sub}</option>
                                          ))}
                                        </select>
                                      </div>
                                      <div className="flex items-center justify-end gap-1">
                                        <select 
                                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                                          defaultValue={req.assigned_class || ""}
                                          id={`class-${req.id}`}
                                        >
                                          <option value="" className="text-black">Class</option>
                                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                                            <option key={g} value={`Class ${g}`} className="text-black">Class {g}</option>
                                          ))}
                                        </select>
                                        <select 
                                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] text-white focus:outline-none"
                                          defaultValue={req.assigned_section || ""}
                                          id={`section-${req.id}`}
                                        >
                                          <option value="" className="text-black">Sec</option>
                                          {["A","B","C","D"].map(s => (
                                            <option key={s} value={s} className="text-black">Sec {s}</option>
                                          ))}
                                        </select>
                                        <button 
                                          onClick={() => {
                                            const role = (document.getElementById(`role-${req.id}`) as HTMLSelectElement).value;
                                            const subject = (document.getElementById(`subject-${req.id}`) as HTMLSelectElement).value;
                                            const grade = (document.getElementById(`class-${req.id}`) as HTMLSelectElement).value;
                                            const section = (document.getElementById(`section-${req.id}`) as HTMLSelectElement).value;
                                            if (!role || !subject || !grade || !section) { alert("Select Role, Subject, Class and Section!"); return; }
                                            handleAssignClass(req.id, grade, section, subject, role);
                                          }}
                                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold"
                                        >
                                          Assign
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════════
                  NOTICE BOARD
              ════════════════ */}
              {activeSection === "notices" && (
                <div className="space-y-6">
                  <p className="text-sm text-slate-400">Publish notices, events, and updates globally across all dashboards</p>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Create New Announcement</h3>
                    <form onSubmit={handlePublishNotice} className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" required placeholder="Notice Title"
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                      />
                      <input 
                        type="text" required placeholder="Date (e.g. 24 May 2026)"
                        className="sm:w-[160px] bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        value={newNotice.date} onChange={e => setNewNotice({...newNotice, date: e.target.value})}
                      />
                      <select 
                        className="sm:w-[130px] bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        value={newNotice.tag} onChange={e => setNewNotice({...newNotice, tag: e.target.value})}
                      >
                        <option value="Notice" className="text-black">Notice</option>
                        <option value="Event" className="text-black">Event</option>
                        <option value="Academic" className="text-black">Academic</option>
                        <option value="Admin" className="text-black">Admin</option>
                      </select>
                      <button 
                        type="submit" disabled={publishingNotice}
                        className="bg-blue-600 hover:bg-blue-500 transition px-6 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap"
                      >
                        {publishingNotice ? "Publishing..." : "Publish"}
                      </button>
                    </form>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-400" /> Recent Announcements
                    </h3>
                    {loadingNotices ? (
                      <p className="text-slate-400 text-sm">Loading notices...</p>
                    ) : notices.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">No notices published yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {notices.map((n, i) => (
                          <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="rounded-xl border border-white/5 bg-black/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[10px] font-bold border",
                                  n.tag === "Event" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                  n.tag === "Academic" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                  n.tag === "Admin" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                  "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                  {n.tag}
                                </span>
                                <p className="text-xs text-slate-500 font-mono">{n.date}</p>
                              </div>
                              <p className="text-sm font-bold text-white">{n.title}</p>
                            </div>
                            <button 
                              onClick={async () => {
                                if(!confirm("Delete this notice?")) return;
                                await supabase.from("notices").delete().eq("id", n.id);
                                fetchNotices();
                              }}
                              className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition self-start sm:self-auto"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ════════════════
                  SETTINGS
              ════════════════ */}
              {activeSection === "settings" && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">System Configuration</p>
                  
                  {loadingSettings ? (
                    <p className="text-slate-400 text-sm">Loading settings...</p>
                  ) : (
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <div className="space-y-6">
                        {/* Admissions Open */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
                          <div>
                            <p className="text-sm font-bold text-white">Admissions Open</p>
                            <p className="text-xs text-slate-400 mt-0.5">Allow public to submit new admission forms</p>
                          </div>
                          <button 
                            disabled={savingSettings}
                            onClick={() => updateSetting("admissions_open", !sysSettings.admissions_open)}
                            className={cn("h-6 w-12 rounded-full relative transition-colors duration-200", sysSettings.admissions_open ? "bg-blue-500" : "bg-slate-700")}
                          >
                            <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200", sysSettings.admissions_open ? "left-7" : "left-1")} />
                          </button>
                        </div>
                        
                        {/* Teacher Portal Active */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
                          <div>
                            <p className="text-sm font-bold text-white">Teacher Portal Active</p>
                            <p className="text-xs text-slate-400 mt-0.5">Allow teachers to access their dashboard</p>
                          </div>
                          <button 
                            disabled={savingSettings}
                            onClick={() => updateSetting("teacher_portal_active", !sysSettings.teacher_portal_active)}
                            className={cn("h-6 w-12 rounded-full relative transition-colors duration-200", sysSettings.teacher_portal_active ? "bg-emerald-500" : "bg-slate-700")}
                          >
                            <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200", sysSettings.teacher_portal_active ? "left-7" : "left-1")} />
                          </button>
                        </div>

                        {/* Maintenance Mode */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-4">
                          <div>
                            <p className="text-sm font-bold text-white">Maintenance Mode</p>
                            <p className="text-xs text-slate-400 mt-0.5">Take the student/teacher portals offline completely</p>
                          </div>
                          <button 
                            disabled={savingSettings}
                            onClick={() => updateSetting("maintenance_mode", !sysSettings.maintenance_mode)}
                            className={cn("h-6 w-12 rounded-full relative transition-colors duration-200", sysSettings.maintenance_mode ? "bg-red-500" : "bg-slate-700")}
                          >
                            <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200", sysSettings.maintenance_mode ? "left-7" : "left-1")} />
                          </button>
                        </div>

                        {/* Current Academic Year */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
                          <div>
                            <p className="text-sm font-bold text-white">Current Academic Year</p>
                            <p className="text-xs text-slate-400 mt-0.5">Label for current active school year</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text"
                              value={sysSettings.current_academic_year}
                              onChange={(e) => setSysSettings({...sysSettings, current_academic_year: e.target.value})}
                              className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 w-[120px]"
                            />
                            <button 
                              onClick={() => updateSetting("current_academic_year", sysSettings.current_academic_year)}
                              disabled={savingSettings}
                              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-sm font-bold transition"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
