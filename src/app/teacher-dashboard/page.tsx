"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, BarChart2, Bell, ClipboardList, LogOut,
  Menu, X, ChevronRight, Home, User, Clock, CheckCircle,
  XCircle, AlertCircle, Search, Eye, TrendingUp, Award,
  Calendar, FileText, ChevronDown, ChevronUp, Pencil, Save, Lock, FileQuestion, Plus, Trash2, Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import OnlineTestsView from "@/components/OnlineTestsView";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getPrefix = (gender?: string) => {
  if (gender === "Male") return "Mr.";
  if (gender === "Female") return "Ms.";
  return "Mr./Ms.";
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

/* ═══════════════════════════════════════════════
   MOCK TEACHER — dynamic based on session
═══════════════════════════════════════════════ */
const defaultTeacherMock = {
  name: "Ms. Priya Sharma",
  id: "FAC-2024-011",
  subject: "Mathematics",
  assignedClass: "Class 5",
  assignedSection: "A",
  photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=5b8fd4&color=fff&size=128&bold=true",
  email: "priya.sharma@novaacademy.in",
  phone: "+91 94567 23410",
  experience: "8 Years",
  qualification: "M.Sc. Mathematics",
};

// allStudents is removed, we will fetch classStudents from the database dynamically

const subjects = ["Math", "Science", "English", "Hindi", "Social"];

const navItems = [
  { id: "overview",    label: "Overview",       icon: Home },
  { id: "students",    label: "My Students",    icon: Users },
  { id: "attendance",  label: "Attendance",     icon: CheckCircle },
  { id: "marks",       label: "Marks & Results",icon: BarChart2 },
  { id: "schedule",    label: "Class Schedule", icon: Clock },
  { id: "online-tests",label: "Online Tests",   icon: FileQuestion },
  { id: "notices",     label: "Notices",        icon: Bell },
  { id: "profile",     label: "My Profile",     icon: User },
];

const defaultScheduleMock = [
  { time: "08:00 – 08:45", subject: "Mathematics",    room: "Room 5A" },
  { time: "08:45 – 09:30", subject: "English",        room: "Room 5A" },
  { time: "09:30 – 10:15", subject: "Science",        room: "Lab 1" },
  { time: "10:15 – 10:30", subject: "Break",          room: "—" },
  { time: "10:30 – 11:15", subject: "Hindi",          room: "Room 5A" },
  { time: "11:15 – 12:00", subject: "Social Studies", room: "Room 5A" },
  { time: "12:00 – 12:45", subject: "Mathematics",    room: "Room 5A" },
];



function gradeFromMark(m: number | null | undefined) {
  if (m === null || m === undefined) return { g: "N/A", cls: "text-slate-500" };
  if (m >= 90) return { g: "A+", cls: "text-emerald-400" };
  if (m >= 80) return { g: "A",  cls: "text-blue-400" };
  if (m >= 70) return { g: "B+", cls: "text-amber-400" };
  if (m >= 60) return { g: "B",  cls: "text-orange-400" };
  return           { g: "C",  cls: "text-red-400" };
}

function avgMark(marks: Record<string, number | null>) {
  const vals = Object.values(marks).filter(v => v !== null && v !== undefined) as number[];
  if (vals.length === 0) return null;
  return Math.round(vals.reduce((a,b) => a + b, 0) / vals.length);
}

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function TeacherDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dynamic States
  const [teacher, setTeacher] = useState(defaultTeacherMock);
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  const [sysSettings, setSysSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from("system_settings").select("*").eq("id", 1).single();
        if (data) setSysSettings(data);
      } catch (err) {
        console.error("Failed to load system settings", err);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    // Check session securely via API
    fetch("/api/auth/session")
      .then(async (res) => {
        if (!res.ok) {
          router.push("/login?redirect=/teacher-dashboard");
          return;
        }
        const data = await res.json();
        const session = data.user;
        setIsAuthenticated(true);
        fetchTeacherData(session.facultyId || session.id, session);
      })
      .catch(() => router.push("/login?redirect=/teacher-dashboard"));

    async function fetchTeacherData(userId: string, session: any) {
      try {
        // Fetch Faculty Profile
        const { data: profile } = await supabase.from("faculty_registrations").select("*").eq("faculty_id", userId).single();
        if (profile) {
          const formattedTeacher = {
            name: `${getPrefix(profile.gender || session.gender)} ${profile.full_name}`,
            id: profile.faculty_id,
            subject: profile.department,
            assignedClass: profile.assigned_class ? `Class ${profile.assigned_class}` : "Unassigned",
            assignedSection: profile.assigned_section || "",
            photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=5b8fd4&color=fff&size=128&bold=true`,
            email: profile.email,
            phone: profile.phone,
            experience: `${profile.experience_years} Years`,
            qualification: profile.qualification,
          };
          setTeacher(formattedTeacher);
          setIsClassTeacher(profile.role_type === "Class Teacher");

          // Fetch Class Students
          if (profile.assigned_class && profile.assigned_section) {
            const gradeFilter = profile.assigned_class.toString().replace("Class ", "");
            const { data: students } = await supabase.from("students")
              .select("*")
              .filter("grade", "ilike", `%${gradeFilter}%`)
              .eq("assigned_section", profile.assigned_section);
              
            if (students) {
              const formattedStudents = students.map((s: any) => ({
                id: s.id,
                student_id: s.student_id,
                rollNo: s.id.split('-')[0].substring(0, 8).toUpperCase(),
                name: s.student_name,
                gender: s.gender,
                photo: s.student_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.student_name)}&background=slate&color=fff`,
                attendance: 100, // UI fallback
                marks: { Math: 95, Science: 90 } // UI fallback
              }));
              setClassStudents(formattedStudents);
            }
          }
        }

        // Fetch Timetable (if implemented)
        const { data: timetableData } = await supabase.from("timetable").select("*").eq("teacher_id", userId).order("start_time");
        if (timetableData && timetableData.length > 0) {
          setClassSchedule(timetableData.map((t: any) => ({
            time: `${t.start_time.substring(0,5)} – ${t.end_time.substring(0,5)}`,
            subject: t.subject,
            room: t.room || "Room",
            grade: t.grade,
            section: t.section
          })));
        }

        // Fetch Notices
        const { data: noticeData } = await supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(5);
        if (noticeData && noticeData.length > 0) {
          setNotices(noticeData);
        }

      } catch (e) {
        console.error("Error fetching teacher data", e);
      }
    }
  }, [router]);

  // Fetch students for the teacher's assigned class/section
  const fetchStudents = useCallback(async () => {
    if (!teacher.assignedClass || teacher.assignedClass === "Unassigned" || !teacher.assignedSection) return;
    
    setLoadingStudents(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("grade", teacher.assignedClass)
        .eq("assigned_section", teacher.assignedSection);
        
      if (error) throw error;
      
      const studentIds = (data || []).map(s => s.id);
      
      // Fetch attendance stats
      const { data: attendanceData } = await supabase
        .from("attendance_records")
        .select("student_id, status")
        .in("student_id", studentIds);
        
      const attendanceMap: Record<string, { present: number, absent: number, late: number, total: number, pct: number }> = {};
      
      studentIds.forEach(id => {
        const records = (attendanceData || []).filter(r => r.student_id === id);
        const present = records.filter(r => r.status === "Present").length;
        const absent = records.filter(r => r.status === "Absent").length;
        const late = records.filter(r => r.status === "Late").length;
        const total = records.length;
        const pct = total > 0 ? Math.round((present / total) * 100) : 0;
        attendanceMap[id] = { present, absent, late, total, pct };
      });
      
      const formattedStudents = (data || []).map(s => ({
        id: s.id,
        student_id: s.student_id,
        name: s.student_name,
        rollNo: s.student_id, 
        photo: s.student_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.student_name)}&background=3d6db5&color=fff&bold=true`,
        grade: s.grade,
        section: s.assigned_section,
        dob: s.dob,
        gender: s.gender,
        bloodGroup: s.blood_group,
        parentPhone: s.parent_phone,
        parentEmail: s.parent_email,
        address: s.address,
        feeStatus: s.fee_status,
        admissionNo: s.student_id,
        attendance: attendanceMap[s.id] || { present: 0, absent: 0, late: 0, total: 0, pct: 0 },
        marks: { Math: null, Science: null, English: null, Hindi: null, Social: null },
      }));
      
      setClassStudents(formattedStudents);
    } catch (err) {
      console.error("Error fetching class students:", err);
    } finally {
      setLoadingStudents(false);
    }
  }, [teacher.assignedClass, teacher.assignedSection]);

  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [marksData, setMarksData] = useState<Record<string, any>>({});
  const [editingMarks, setEditingMarks] = useState<string | null>(null);
  const [examType, setExamType] = useState<string>("Term 1");
  const [marksSaved, setMarksSaved] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSuccess, setAttendanceSuccess] = useState(false);

  // Schedule states
  const [classSchedule, setClassSchedule] = useState<any[]>(defaultScheduleMock);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Notices state
  const [notices, setNotices] = useState<any[]>([]);
  const [loadingNotices, setLoadingNotices] = useState(false);

  const fetchSchedule = useCallback(async () => {
    if (!teacher.assignedClass || teacher.assignedClass === "Unassigned" || !teacher.assignedSection) return;
    try {
      const { data, error } = await supabase
        .from("class_schedules")
        .select("*")
        .eq("grade", teacher.assignedClass)
        .eq("section", teacher.assignedSection)
        .order("period_index", { ascending: true });
        
      if (error) throw error;
      if (data && data.length > 0) {
        setClassSchedule(data.map(r => ({ time: r.time_slot, subject: r.subject, room: r.room })));
      } else {
        setClassSchedule(defaultScheduleMock);
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  }, [teacher.assignedClass, teacher.assignedSection]);

  const fetchNotices = useCallback(async () => {
    setLoadingNotices(true);
    try {
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
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
      fetchSchedule();
    }
  }, [fetchStudents, fetchSchedule, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeSection === "notices") {
      fetchNotices();
    }
  }, [activeSection, isAuthenticated, fetchNotices]);

  // Synchronize dynamic student data to their respective edit states
  useEffect(() => {
    if (classStudents.length > 0) {
      setAttendanceData(prev => {
        const next = { ...prev };
        let changed = false;
        classStudents.forEach(s => {
          if (!next[s.id]) {
            next[s.id] = "Present";
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      setMarksData(prev => {
        const next = { ...prev };
        let changed = false;
        classStudents.forEach(s => {
          if (!next[s.id]) {
            next[s.id] = { ...s.marks };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [classStudents]);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const filteredStudents = classStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleSaveAttendance = async () => {
    if (!teacher.assignedClass || teacher.assignedClass === "Unassigned") return;
    
    setSavingAttendance(true);
    try {
      const records = classStudents.map(s => ({
        student_id: s.id,
        date: new Date().toISOString().split("T")[0],
        status: attendanceData[s.id] || "Present"
      }));
      
      const { error } = await supabase
        .from("attendance_records")
        .upsert(records, { onConflict: 'student_id,date' });
        
      if (error) throw error;
      
      setAttendanceSuccess(true);
      // Re-fetch to update percentages instantly
      await fetchStudents();
      
      setTimeout(() => setAttendanceSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance: " + err.message);
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleSaveSchedule = async () => {
    if (!teacher.assignedClass || teacher.assignedClass === "Unassigned") return;
    
    setSavingSchedule(true);
    try {
      const records = classSchedule.map((row, i) => ({
        grade: teacher.assignedClass,
        section: teacher.assignedSection,
        period_index: i,
        time_slot: row.time,
        subject: row.subject,
        room: row.room
      }));
      
      const { error } = await supabase
        .from("class_schedules")
        .upsert(records, { onConflict: 'grade,section,period_index' });
        
      if (error) throw error;
      
      setIsEditingSchedule(false);
    } catch (err: any) {
      console.error("Failed to save schedule:", err);
      alert("Failed to save schedule: " + err.message);
    } finally {
      setSavingSchedule(false);
    }
  };

  const saveMarks = async (studentId: string) => {
    try {
      const studentMarks = marksData[studentId];
      if (!studentMarks) {
        setEditingMarks(null);
        return;
      }

      const records = subjects.map(sub => ({
        student_id: studentId,
        subject: sub,
        term: examType,
        marks_obtained: studentMarks[sub] || 0,
        max_marks: 100,
        grade: gradeFromMark(studentMarks[sub]).g,
      }));

      const { error } = await supabase
        .from('marks')
        .upsert(records, { onConflict: 'student_id,subject,term' });

      if (error) throw error;

      setEditingMarks(null);
      setMarksSaved(true);
      setTimeout(() => setMarksSaved(false), 2500);
    } catch (err: any) {
      console.error("Failed to save marks:", err);
      alert("Failed to save marks: " + err.message);
    }
  };

  const classPerformanceData = useMemo(() => {
    if (!classStudents || classStudents.length === 0) return [];
    // Group by average range
    const ranges = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    classStudents.forEach(s => {
      const m = avgMark(s.marks);
      if (m === null) return;
      if (m >= 90) ranges["90-100"]++;
      else if (m >= 80) ranges["80-89"]++;
      else if (m >= 70) ranges["70-79"]++;
      else if (m >= 60) ranges["60-69"]++;
      else ranges["<60"]++;
    });
    return Object.keys(ranges).map(k => ({ range: k, students: ranges[k as keyof typeof ranges] }));
  }, [classStudents]);

  const avgAttendance = classStudents.length > 0 ? Math.round(classStudents.reduce((a, s) => a + s.attendance.pct, 0) / classStudents.length) : 0;
  const validAvgs = classStudents.map(s => avgMark(s.marks)).filter(v => v !== null) as number[];
  const avgScore = validAvgs.length > 0 ? Math.round(validAvgs.reduce((a, b) => a + b, 0) / validAvgs.length) : 0;
  const feePaid = classStudents.filter((s) => s.feeStatus === "Paid").length;
  const lowAttendance = classStudents.filter((s) => s.attendance.pct < 75).length;

  if (!isAuthenticated || loadingSettings) {
    return <div className="min-h-screen bg-[#0a1628] flex items-center justify-center text-white"><div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" /></div>;
  }

  if (sysSettings?.maintenance_mode) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold font-heading mb-2">System Under Maintenance</h1>
        <p className="text-slate-400 max-w-md text-center">The portal is temporarily offline for scheduled maintenance. Please check back later.</p>
      </div>
    );
  }

  if (sysSettings?.teacher_portal_active === false) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-white p-6">
        <Lock className="w-16 h-16 text-slate-500 mb-6" />
        <h1 className="text-3xl font-bold font-heading mb-2">Access Restricted</h1>
        <p className="text-slate-400 max-w-md text-center">The teacher portal has been temporarily locked by the administration.</p>
        <button onClick={() => {
          sessionStorage.removeItem("nova_session");
          router.push("/login");
        }} className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition">Sign Out</button>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen bg-[#0a1628] text-slate-100 font-sans">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-white/5 bg-[#0d1e35] transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">Nova Academy</p>
            <p className="text-[10px] text-slate-400">Teacher Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Teacher card */}
        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <img src={teacher.photo} alt={teacher.name} className="h-10 w-10 rounded-full border border-purple-500/30 object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{teacher.name}</p>
              <p className="text-[10px] text-purple-300 truncate">{teacher.assignedClass} – Sec {teacher.assignedSection}</p>
            </div>
          </div>
          {/* Class badge */}
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-purple-500/10 border border-purple-500/15 px-3 py-1.5">
            <Users className="h-3 w-3 text-purple-400 shrink-0" />
            <span className="text-[10px] font-bold text-purple-300">
              Class Teacher · {teacher.assignedClass} {teacher.assignedSection} · {classStudents.length} Students
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); setSelectedStudent(null); }}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/20"
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
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0a1628]/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white sm:text-base">
                {selectedStudent ? selectedStudent.name : navItems.find(n => n.id === activeSection)?.label}
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block rounded-full bg-purple-500/15 px-3 py-1 text-[10px] font-bold text-purple-400 border border-purple-500/20">
              🏫 {teacher.assignedClass} – {teacher.assignedSection}
            </span>
            <img src={teacher.photo} alt="" className="h-8 w-8 rounded-full border border-purple-500/30" />
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">

          {/* ── Save mark toast ── */}
          <AnimatePresence>
            {marksSaved && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30"
              >
                <CheckCircle className="h-4 w-4" /> Marks saved successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection + (selectedStudent?.id ?? "")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >

              {/* ════════════════
                  STUDENT DETAIL VIEW (shared overlay section)
              ════════════════ */}
              {selectedStudent && (
                <div className="space-y-5">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
                  >
                    ← Back to {activeSection === "students" ? "My Students" : "Attendance"}
                  </button>

                  {/* Profile card */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <img src={selectedStudent.photo} alt={selectedStudent.name}
                      className="h-20 w-20 rounded-2xl border-2 border-purple-500/30 object-cover shadow-xl" />
                    <div className="text-center sm:text-left space-y-1">
                      <h2 className="text-lg font-extrabold text-white">{selectedStudent.name}</h2>
                      <p className="text-sm text-purple-400 font-medium">{selectedStudent.grade} – Section {selectedStudent.section}</p>
                      <p className="text-xs text-slate-400 font-mono">{selectedStudent.admissionNo}</p>
                      <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                          selectedStudent.feeStatus === "Paid"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/15 text-red-400 border-red-500/20"
                        )}>{selectedStudent.feeStatus}</span>
                        <span className="rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                          {selectedStudent.gender}
                        </span>
                        <span className="rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/20 px-2.5 py-0.5 text-[10px] font-bold">
                          {selectedStudent.bloodGroup}
                        </span>
                      </div>
                    </div>
                    <div className="sm:ml-auto grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                        <p className={cn("text-lg font-extrabold", selectedStudent.attendance.pct >= 85 ? "text-emerald-400" : "text-red-400")}>
                          {selectedStudent.attendance.pct}%
                        </p>
                        <p className="text-[10px] text-slate-400">Attendance</p>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                        <p className="text-lg font-extrabold text-white">{avgMark(selectedStudent.marks) !== null ? `${avgMark(selectedStudent.marks)}%` : "N/A"}</p>
                        <p className="text-[10px] text-slate-400">Avg Marks</p>
                      </div>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personal Info</h3>
                      {[
                        { label: "Date of Birth", value: selectedStudent.dob },
                        { label: "Roll No.", value: selectedStudent.rollNo },
                        { label: "Address", value: selectedStudent.address },
                      ].map((r, i) => (
                        <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                          <p className="text-[10px] text-slate-500 uppercase">{r.label}</p>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">{r.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parent Contact</h3>
                      {[
                        { label: "Phone", value: selectedStudent.parentPhone },
                        { label: "Email", value: selectedStudent.parentEmail },
                        { label: "Fee Status", value: selectedStudent.feeStatus },
                      ].map((r, i) => (
                        <div key={i} className="border-b border-white/5 pb-2 last:border-0">
                          <p className="text-[10px] text-slate-500 uppercase">{r.label}</p>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">{r.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject marks */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Subject-wise Marks (Term 1)</h3>
                    <div className="space-y-3">
                      {subjects.map((sub) => {
                        const m = selectedStudent.marks[sub as keyof typeof selectedStudent.marks];
                        const { g, cls } = gradeFromMark(m);
                        return (
                          <div key={sub}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-300 font-medium">{sub}</span>
                              <span className={cn("text-xs font-bold", cls)}>{m}/100 · {g}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m}%` }}
                                transition={{ duration: 0.6 }}
                                className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Attendance detail */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Present", value: selectedStudent.attendance.present, color: "text-emerald-400", bg: "bg-emerald-500/5 border-emerald-500/15" },
                      { label: "Absent", value: selectedStudent.attendance.absent, color: "text-red-400", bg: "bg-red-500/5 border-red-500/15" },
                      { label: "Late", value: selectedStudent.attendance.late, color: "text-amber-400", bg: "bg-amber-500/5 border-amber-500/15" },
                    ].map((item, i) => (
                      <div key={i} className={cn("rounded-2xl border p-4 text-center", item.bg)}>
                        <p className={cn("text-xl font-extrabold", item.color)}>{item.value}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════════
                  OVERVIEW
              ════════════════ */}
              {activeSection === "overview" && !selectedStudent && (
                <div className="space-y-6">
                  {/* Welcome */}
                  <div className="rounded-2xl bg-gradient-to-r from-purple-600/20 via-indigo-600/15 to-blue-600/10 border border-purple-500/15 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <img src={teacher.photo} alt={teacher.name} className="h-16 w-16 rounded-2xl border-2 border-purple-500/30 object-cover shadow-lg" />
                    <div>
                      <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">{getGreeting()}</p>
                      <h2 className="text-xl font-extrabold text-white mt-0.5">{teacher.name} ✨</h2>
                      <div className="text-xs text-purple-300 font-medium">
                        {isClassTeacher ? (
                          <>Class Teacher • <span className="text-slate-200">{teacher.assignedClass} • Section {teacher.assignedSection}</span></>
                        ) : (
                          <>Subject Teacher • <span className="text-slate-400">No Assigned Class</span></>
                        )}
                      </div>
                    </div>
                    <div className="sm:ml-auto rounded-xl bg-white/5 border border-white/5 px-4 py-3 hidden sm:block text-right">
                      <p className="text-[10px] text-slate-400">Faculty ID</p>
                      <p className="text-sm font-bold font-mono text-white">{teacher.id}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                      { label: "Total Students", value: classStudents.length, sub: `${teacher.assignedClass} – ${teacher.assignedSection}`, color: "from-blue-500 to-indigo-600", icon: Users },
                      { label: "Avg Attendance", value: `${avgAttendance}%`, sub: "This term", color: "from-emerald-500 to-teal-600", icon: CheckCircle },
                      { label: "Class Avg Score", value: `${avgScore}%`, sub: "All subjects", color: "from-purple-500 to-pink-600", icon: BarChart2 },
                      { label: "Fee Pending", value: classStudents.length - feePaid, sub: "Students", color: "from-amber-500 to-orange-600", icon: AlertCircle },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="rounded-2xl p-5 border border-white/5 bg-white/5 shadow-lg">
                        <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3", s.color)}>
                          <s.icon className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-2xl font-extrabold text-white">{s.value}</p>
                        <p className="text-xs font-bold text-slate-300 mt-0.5">{s.label}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{s.sub}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Alerts */}
                  {lowAttendance > 0 && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                      <p className="text-sm text-amber-300 font-medium">
                        <strong>{lowAttendance} student{lowAttendance > 1 ? "s" : ""}</strong> in your class have attendance below 75% — consider notifying parents.
                      </p>
                    </div>
                  )}

                  {/* Top & Bottom students */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="h-4 w-4 text-gold-400" /> Top Performers
                      </h3>
                      <div className="space-y-3 mt-4">
                        {[...classStudents]
                          .filter(s => avgMark(s.marks) !== null)
                          .sort((a, b) => (avgMark(b.marks) || 0) - (avgMark(a.marks) || 0))
                          .slice(0, 3)
                          .map((s, i) => (
                          <button key={s.id} onClick={() => setSelectedStudent(s)}
                            className="w-full flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition text-left">
                            <span className={cn("h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shrink-0",
                              i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : "bg-amber-700"
                            )}>#{i + 1}</span>
                            <img src={s.photo} alt={s.name} className="h-7 w-7 rounded-full border border-white/10" />
                            <span className="text-xs font-semibold text-slate-200 flex-1 truncate">{s.name}</span>
                            <span className="text-xs font-bold text-emerald-400">{avgMark(s.marks)}%</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-400" /> Needs Attention
                      </h3>
                      <div className="space-y-2">
                        {[...classStudents].sort((a, b) => a.attendance.pct - b.attendance.pct).slice(0, 3).map((s, i) => (
                          <button key={s.id} onClick={() => setSelectedStudent(s)}
                            className="w-full flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition text-left">
                            <img src={s.photo} alt={s.name} className="h-7 w-7 rounded-full border border-white/10 shrink-0" />
                            <span className="text-xs font-semibold text-slate-200 flex-1 truncate">{s.name}</span>
                            <span className={cn("text-xs font-bold", s.attendance.pct < 75 ? "text-red-400" : "text-amber-400")}>
                              {s.attendance.pct}% att.
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Class Performance Chart */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5 mt-6">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-purple-400" /> Class Performance Distribution
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                          <RechartsTooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                          />
                          <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════════
                  MY STUDENTS
              ════════════════ */}
              {activeSection === "students" && !selectedStudent && (
                <div className="space-y-4">
                  {/* Search + count */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search by name or roll no…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/60 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                    <span className="shrink-0 text-xs text-slate-400 font-semibold">{filteredStudents.length} students</span>
                  </div>

                  {/* Access notice */}
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-2.5 flex items-center gap-2 text-xs text-purple-300">
                    <span className="font-bold text-purple-400">🔒 Access Restricted</span> — You can only view students of <strong>{teacher.assignedClass} – Section {teacher.assignedSection}</strong>
                  </div>

                  {/* Student cards */}
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredStudents.map((s, i) => (
                      <motion.button
                        key={s.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedStudent(s)}
                        className="rounded-2xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 hover:border-purple-500/20 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img src={s.photo} alt={s.name} className="h-10 w-10 rounded-xl border border-white/10 object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{s.rollNo}</p>
                          </div>
                          <Eye className="h-4 w-4 text-slate-600 group-hover:text-purple-400 transition ml-auto shrink-0" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-white/5 px-2 py-1.5">
                            <p className={cn("text-sm font-extrabold", s.attendance.pct >= 85 ? "text-emerald-400" : "text-red-400")}>{s.attendance.pct}%</p>
                            <p className="text-[9px] text-slate-500">Att.</p>
                          </div>
                          <div className="rounded-lg bg-white/5 px-2 py-1.5">
                            <p className="text-sm font-extrabold text-white">{avgMark(s.marks) ?? "-"}</p>
                            <p className="text-[9px] text-slate-500">Avg</p>
                          </div>
                          <div className="rounded-lg bg-white/5 px-2 py-1.5">
                            <p className={cn("text-sm font-extrabold", gradeFromMark(avgMark(s.marks)).cls)}>{gradeFromMark(avgMark(s.marks)).g}</p>
                            <p className="text-[9px] text-slate-500">Grade</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════════
                  ATTENDANCE
              ════════════════ */}
              {activeSection === "attendance" && !selectedStudent && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">Mark today's attendance for {isClassTeacher ? `${teacher.assignedClass} • Section {teacher.assignedSection}` : "students"}</p>
                  
                  {!isClassTeacher && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex gap-3 items-center">
                      <div className="p-2 bg-red-500/20 rounded-lg"><AlertCircle className="h-5 w-5 text-red-400" /></div>
                      <div>
                        <p className="text-sm font-bold text-red-400">Access Restricted</p>
                        <p className="text-xs text-slate-400">You are not a Class Teacher. Only designated Class Teachers can modify attendance records. You have view-only access.</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Student</th>
                          <th className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Status</th>
                          <th className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:table-cell">Overall</th>
                          <th className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold hidden sm:table-cell">View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classStudents.map((s, i) => (
                          <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                            className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <img src={s.photo} alt={s.name} className="h-7 w-7 rounded-full border border-white/10 shrink-0" />
                                <div>
                                  <p className="text-xs font-semibold text-white">{s.name}</p>
                                  <p className="text-[9px] text-slate-500">{s.rollNo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex gap-2 justify-center">
                                {["Present", "Absent", "Late"].map((status) => (
                                  <button
                                    key={status}
                                    disabled={!isClassTeacher}
                                    onClick={() => setAttendanceData(prev => ({ ...prev, [s.id]: status }))}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                      !isClassTeacher && "opacity-50 cursor-not-allowed",
                                      attendanceData[s.id] === status
                                        ? status === "Present" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                        : status === "Absent" ? "bg-red-500/20 text-red-400 border border-red-500/20"
                                        : "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                                        : "bg-white/5 text-slate-500 border border-transparent hover:bg-white/10"
                                    )}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center hidden sm:table-cell">
                              <span className={cn("text-xs font-bold", s.attendance.pct >= 85 ? "text-emerald-400" : s.attendance.pct >= 75 ? "text-amber-400" : "text-red-400")}>
                                {s.attendance.pct}%
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center hidden sm:table-cell">
                              <button onClick={() => setSelectedStudent(s)}
                                className="rounded-lg bg-purple-500/10 border border-purple-500/15 p-1.5 text-purple-400 hover:bg-purple-500/20 transition">
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {isClassTeacher && (
                    <button 
                      onClick={handleSaveAttendance}
                      disabled={savingAttendance}
                      className={cn(
                        "w-full rounded-xl transition-all py-4 text-sm font-extrabold text-white shadow-lg",
                        attendanceSuccess 
                          ? "bg-emerald-500 shadow-emerald-500/20" 
                          : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                      )}
                    >
                      {savingAttendance ? "Saving..." : attendanceSuccess ? "Attendance Saved! ✅" : "Save Today's Attendance"}
                    </button>
                  )}
                </div>
              )}

              {/* ════════════════
                  MARKS & RESULTS
              ════════════════ */}
              {activeSection === "marks" && !selectedStudent && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="text-sm text-slate-400">Enter or review marks for {teacher.assignedClass} – Section {teacher.assignedSection}</p>
                    <select 
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                    >
                      <option value="Term 1">Term 1</option>
                      <option value="Midterm">Midterm</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Finals">Finals</option>
                    </select>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 overflow-x-auto">
                    <table className="w-full text-xs min-w-[640px]">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Student</th>
                          {subjects.map(sub => (
                            <th key={sub} className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">{sub}</th>
                          ))}
                          <th className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Avg</th>
                          <th className="text-center px-3 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classStudents.map((s, i) => (
                          <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                            className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <img src={s.photo} alt={s.name} className="h-6 w-6 rounded-full border border-white/10 shrink-0" />
                                <span className="font-semibold text-white truncate">{s.name}</span>
                              </div>
                            </td>
                            {subjects.map(sub => {
                              const sMarks = marksData[s.id] || s.marks;
                              const val = sMarks[sub as keyof typeof s.marks];
                              const isEditing = editingMarks === s.id;
                              return (
                                <td key={sub} className="px-3 py-3 text-center">
                                  {isEditing ? (
                                    <input
                                      type="number" min="0" max="100"
                                      value={(marksData[s.id] || s.marks)[sub as keyof typeof s.marks] ?? ""}
                                      onChange={(e) => setMarksData(prev => ({
                                        ...prev,
                                        [s.id]: { ...prev[s.id], [sub]: e.target.value === "" ? null : Math.min(100, Math.max(0, Number(e.target.value))) }
                                      }))}
                                      className="w-14 rounded-lg border border-purple-500/40 bg-slate-900/60 px-2 py-1 text-center text-white text-xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                                    />
                                  ) : (
                                    <span className={cn("font-bold", gradeFromMark(val).cls)}>{val !== null ? val : "-"}</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="px-3 py-3 text-center">
                              <span className="text-xs font-extrabold text-white">{avgMark(marksData[s.id] || s.marks) ?? "-"}</span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              {editingMarks === s.id ? (
                                <button onClick={() => saveMarks(s.id)}
                                  className="flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1.5 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25 transition mx-auto">
                                  <Save className="h-3 w-3" /> Save
                                </button>
                              ) : (
                                <button onClick={() => setEditingMarks(s.id)}
                                  className="flex items-center gap-1 rounded-lg bg-purple-500/10 border border-purple-500/15 px-2.5 py-1.5 text-purple-400 text-[10px] font-bold hover:bg-purple-500/20 transition mx-auto">
                                  <Pencil className="h-3 w-3" /> Edit
                                </button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ════════════════
                  SCHEDULE
              ════════════════ */}
              {activeSection === "schedule" && !selectedStudent && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{teacher.assignedClass} – Section {teacher.assignedSection} · Today's Schedule</p>
                    {isClassTeacher && (
                      <button 
                        onClick={() => {
                          if (isEditingSchedule) handleSaveSchedule();
                          else setIsEditingSchedule(true);
                        }}
                        disabled={savingSchedule}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                          isEditingSchedule 
                            ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-white/5 hover:bg-white/10 text-white"
                        )}
                      >
                        {savingSchedule ? "Saving..." : isEditingSchedule ? (
                          <><Save className="h-4 w-4" /> Save Schedule</>
                        ) : (
                          <><Pencil className="h-4 w-4" /> Edit Schedule</>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {classSchedule.map((row, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className={cn("rounded-2xl border p-4 flex items-center gap-4 transition-all",
                          row.subject === "Break" ? "border-white/5 bg-white/2" : "border-white/5 bg-white/5 hover:bg-white/10"
                        )}>
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 text-purple-400" />
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                          {isEditingSchedule ? (
                            <>
                              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                <input
                                  type="text"
                                  value={row.subject}
                                  onChange={(e) => {
                                    const newSchedule = [...classSchedule];
                                    newSchedule[i].subject = e.target.value;
                                    setClassSchedule(newSchedule);
                                  }}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                  placeholder="Subject"
                                />
                                <input
                                  type="text"
                                  value={row.time}
                                  onChange={(e) => {
                                    const newSchedule = [...classSchedule];
                                    newSchedule[i].time = e.target.value;
                                    setClassSchedule(newSchedule);
                                  }}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-[10px] text-slate-400 font-mono focus:outline-none focus:border-purple-500"
                                  placeholder="Time Slot"
                                />
                              </div>
                              <input
                                type="text"
                                value={row.room}
                                onChange={(e) => {
                                  const newSchedule = [...classSchedule];
                                  newSchedule[i].room = e.target.value;
                                  setClassSchedule(newSchedule);
                                }}
                                className="w-full sm:w-[120px] bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 text-center focus:outline-none focus:border-purple-500"
                                placeholder="Room"
                              />
                            </>
                          ) : (
                            <>
                              <div>
                                <p className={cn("text-sm font-bold", row.subject === "Break" ? "text-slate-500" : "text-white")}>{row.subject}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{row.time}</p>
                              </div>
                              {row.subject !== "Break" && (
                                <span className="text-[10px] font-semibold text-slate-400 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5 self-start sm:self-auto">{row.room}</span>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ════════════════
                  NOTICES
              ════════════════ */}
              {activeSection === "notices" && !selectedStudent && (
                <div className="space-y-3">
                  {loadingNotices ? (
                    <p className="text-slate-400 text-sm">Loading notices...</p>
                  ) : notices.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">No notices available.</p>
                  ) : (
                    notices.map((n, i) => (
                      <motion.div key={n.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="rounded-2xl border border-white/5 bg-white/5 p-5 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0">
                          <Bell className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{n.date}</p>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold rounded-full border px-2.5 py-1 shrink-0",
                          n.tag === "Event" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                          n.tag === "Academic" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                          n.tag === "Admin" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        )}>{n.tag}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {/* ════════════════
                  ONLINE TESTS
              ════════════════ */}
              {activeSection === "online-tests" && (
                <OnlineTestsView teacher={teacher} />
              )}

              {/* ════════════════
                  PROFILE
              ════════════════ */}
              {activeSection === "profile" && !selectedStudent && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src={teacher.photo} alt={teacher.name} className="h-24 w-24 rounded-2xl border-2 border-purple-500/30 object-cover shadow-xl" />
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl font-extrabold text-white">{teacher.name}</h2>
                      <p className="text-sm text-purple-400 font-medium">{teacher.subject} · Class Teacher</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">{teacher.id}</p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                        <span className="rounded-full bg-purple-500/15 border border-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-400">
                          {teacher.assignedClass} – {teacher.assignedSection}
                        </span>
                        <span className="rounded-full bg-blue-500/15 border border-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400">{teacher.qualification}</span>
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400">{teacher.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { section: "Contact Details", items: [
                        { label: "Email", value: teacher.email },
                        { label: "Phone", value: teacher.phone },
                        { label: "Faculty ID", value: teacher.id },
                      ]},
                      { section: "Academic Info", items: [
                        { label: "Subject Taught", value: teacher.subject },
                        { label: "Assigned Class", value: `${teacher.assignedClass} – Section ${teacher.assignedSection}` },
                        { label: "Experience", value: teacher.experience },
                      ]},
                    ].map((group, gi) => (
                      <div key={gi} className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{group.section}</h3>
                        {group.items.map((item, ii) => (
                          <div key={ii} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                            <p className="text-[10px] text-slate-500 uppercase">{item.label}</p>
                            <p className="text-xs font-semibold text-slate-200 mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
