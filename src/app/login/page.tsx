"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  Building,
  KeyRound,
  RotateCcw,
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  XCircle,
  Clock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { btn, input } from "@/lib/styles";
import { cn } from "@/lib/utils";

// Custom dark form styling
const darkInputClass = 
  "mt-2 min-h-[48px] w-full rounded-xl border border-white/10 bg-slate-900/60 px-10 py-3.5 text-base leading-normal text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/20 focus:border-blue-500 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 sm:text-sm";

export default function LoginPage() {
  const router = useRouter();
  const [portal, setPortal] = useState<"student" | "faculty">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  
  // Custom Dynamic Captcha Challenge
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  
  // Interactive UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Registration states
  const [isRegistering, setIsRegistering] = useState(false);
  const [regData, setRegData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    qualification: "",
    experience_years: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  const [regSuccess, setRegSuccess] = useState(false);

  // Auth Error overlay state
  const [authError, setAuthError] = useState<{
    show: boolean;
    title: string;
    message: string;
    icon: 'pending' | 'rejected' | 'not_found' | 'error';
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setRedirectPath(params.get("redirect") || "");
    }
  }, []);

  
  // Field specific validation errors
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    captcha?: string;
  }>({});

  // Generate new math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({
      num1,
      num2,
      answer: num1 + num2
    });
    setSecurityAnswer("");
  };

  useEffect(() => {
    generateCaptcha();
  }, [portal]);

  // Form Submission Validation & Mock Auth flow
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    // 1. Validation checks
    if (!username) {
      newErrors.username = portal === "student" 
        ? "Admission Number / Email is required" 
        : "Faculty ID / Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (parseInt(securityAnswer) !== captcha.answer) {
      newErrors.captcha = "Incorrect calculation answer";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Trigger error shake feedback or refresh captcha
      generateCaptcha();
      return;
    }

    // Clear previous validation errors
    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: username.trim(),
          password,
          portalType: portal
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError({
          show: true,
          title: "Authentication Failed",
          message: data.error || "Invalid credentials",
          icon: "error"
        });
        generateCaptcha();
        setIsSubmitting(false);
        return;
      }

      if (data.user.status === "pending") {
        setAuthError({
          show: true,
          title: "Application Pending",
          message: "Your registration is currently under review by the administration.",
          icon: "pending"
        });
        setIsSubmitting(false);
        return;
      } else if (data.user.status === "rejected") {
        setAuthError({
          show: true,
          title: "Application Declined",
          message: "Your registration request has been declined by the administration.",
          icon: "rejected"
        });
        setIsSubmitting(false);
        return;
      }

      // Session is now stored in an HTTP-only cookie by the server
      setShowSuccess(true);

      // Determine destination based on portal
      let destination = redirectPath || "/dashboard";
      
      if (data.user.role === "admin") {
        destination = "/admin-dashboard";
      } else if (portal === "faculty") {
        if (!redirectPath) {
          destination = "/teacher-dashboard";
        }
      } else {
         if (!redirectPath) {
            destination = "/dashboard";
         }
      }
      setTimeout(() => {
        router.push(destination);
      }, 1500);
    } catch (err) {
      console.error("Authentication failed:", err);
      alert("Authentication error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/faculty-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setIsRegistering(false);
        setRegData({ full_name: "", email: "", phone: "", department: "", qualification: "", experience_years: "", gender: "", password: "", confirmPassword: "" });
      }, 4000);
      
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-navy-950 text-slate-100 min-h-screen pt-28 pb-20 relative overflow-hidden flex flex-col justify-between" tabIndex={-1}>
        
        {/* Ambient floating blurred light fields */}
        <div className="absolute top-1/4 -left-48 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" aria-hidden />
        <div className="absolute top-2/3 -right-48 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" aria-hidden />
        <div className="mesh-gradient absolute inset-0 opacity-15 pointer-events-none" aria-hidden />

        <div className="relative mx-auto w-full max-w-md px-4 py-8 flex-1 flex flex-col justify-center">
          
          {/* Brand Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-blue-600 border border-white/10 text-white shadow-elevated-lg mb-4"
            >
              <GraduationCap className="h-7 w-7" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            >
              Nova Portal Access
            </motion.h1>
            
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-xs sm:text-sm text-slate-400 mt-2"
            >
              Log in to your specialized learning or administrative center.
            </motion.p>
          </div>

          {/* Premium Glassmorphic Login Container */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="glass-dark border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            
            {/* Dual Portal Tabs Switching Control */}
            <div className="grid grid-cols-2 p-1 bg-slate-900/60 rounded-xl border border-white/5 mb-8 relative z-10">
              <button
                type="button"
                onClick={() => {
                  setPortal("student");
                  setIsRegistering(false);
                  setErrors({});
                }}
                className={cn(
                  "relative flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300",
                  portal === "student" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <User className="h-3.5 w-3.5" />
                Student & Parent
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setPortal("faculty");
                  setErrors({});
                }}
                className={cn(
                  "relative flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300",
                  portal === "faculty" ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Building className="h-3.5 w-3.5" />
                Faculty & Staff
              </button>
            </div>

            {/* Portal description banner */}
            <AnimatePresence mode="wait">
              {!isRegistering && (
                <motion.p
                  key={portal}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="text-[11px] font-semibold text-gold-300 tracking-wider uppercase mb-6 flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3" />
                  {portal === "student" ? "Access Grades, Attendance, and Courses" : "Access Teacher Dashboard and Administration"}
                </motion.p>
              )}
            </AnimatePresence>

            {portal === "faculty" && isRegistering ? (
              // REGISTRATION FORM
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-6 text-center">Faculty Registration Request</h2>
                
                <div className="space-y-3">
                  <input
                    type="text" required
                    placeholder="Full Name"
                    value={regData.full_name}
                    onChange={(e) => setRegData({ ...regData, full_name: e.target.value })}
                    className={darkInputClass}
                  />
                  <input
                    type="email" required
                    placeholder="Email Address"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className={darkInputClass}
                  />
                  <input
                    type="tel" required
                    placeholder="Phone Number"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className={darkInputClass}
                  />
                  <input
                    type="text" required
                    placeholder="Department (e.g. Science)"
                    value={regData.department}
                    onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                    className={darkInputClass}
                  />
                  <input
                    type="text" required
                    placeholder="Highest Qualification"
                    value={regData.qualification}
                    onChange={(e) => setRegData({ ...regData, qualification: e.target.value })}
                    className={darkInputClass}
                  />
                  <input
                    type="number" required min="0"
                    placeholder="Years of Experience"
                    value={regData.experience_years}
                    onChange={(e) => setRegData({ ...regData, experience_years: e.target.value })}
                    className={darkInputClass}
                  />
                  <select
                    required
                    disabled={isSubmitting}
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    className={cn(darkInputClass, !regData.gender && "text-slate-500")}
                  >
                    <option value="" disabled>Gender</option>
                    <option value="Male" className="text-black">Male</option>
                    <option value="Female" className="text-black">Female</option>
                  </select>
                  <input
                    type="password" required minLength={6}
                    placeholder="Password (min 6 characters)"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className={darkInputClass}
                  />
                  <input
                    type="password" required minLength={6}
                    placeholder="Confirm Password"
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    className={darkInputClass}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(btn.accent, "w-full mt-6")}
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </motion.button>
                
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="w-full text-xs text-slate-400 hover:text-white mt-4 transition"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              // LOGIN FORM
              <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              {/* Username field */}
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                  <span>{portal === "student" ? "Admission Number / Email" : "Faculty ID / Email"}</span>
                  {errors.username && (
                    <span className="text-[10px] text-red-400 font-medium normal-case flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      {errors.username}
                    </span>
                  )}
                </span>
                
                <div className="relative mt-2">
                  <User className={cn(
                    "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "username" ? "text-blue-400" : "text-slate-500"
                  )} />
                  <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder={portal === "student" ? "e.g. STU-2026-90" : "e.g. FAC-9902"}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors(prev => ({ ...prev, username: undefined }));
                    }}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      darkInputClass, 
                      errors.username && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                  <span>Security Password</span>
                  {errors.password && (
                    <span className="text-[10px] text-red-400 font-medium normal-case flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      {errors.password}
                    </span>
                  )}
                </span>
                
                <div className="relative mt-2">
                  <Lock className={cn(
                    "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "password" ? "text-blue-400" : "text-slate-500"
                  )} />
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={cn(
                      darkInputClass, 
                      errors.password && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  
                  {/* Eye Toggle Control */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Security Captcha Challenge - High Premium aesthetic touch */}
              <div className="relative">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                  <span>Verify You Are Human</span>
                  {errors.captcha && (
                    <span className="text-[10px] text-red-400 font-medium normal-case flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      {errors.captcha}
                    </span>
                  )}
                </span>
                
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="col-span-2 flex items-center justify-between bg-slate-900/60 border border-white/10 rounded-xl px-3.5 py-3 text-sm font-semibold select-none">
                    <span className="text-slate-300">Calculate:</span>
                    <span className="text-blue-400 font-mono tracking-wider">{captcha.num1} + {captcha.num2} = ?</span>
                    <button 
                      type="button" 
                      onClick={generateCaptcha} 
                      className="text-slate-500 hover:text-slate-200 transition p-1 hover:bg-white/5 rounded"
                      title="Generate new calculation"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <KeyRound className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      focusedField === "captcha" ? "text-blue-400" : "text-slate-500"
                    )} />
                    <input
                      type="text"
                      maxLength={3}
                      disabled={isSubmitting}
                      placeholder="Answer"
                      value={securityAnswer}
                      onChange={(e) => {
                        setSecurityAnswer(e.target.value);
                        if (errors.captcha) setErrors(prev => ({ ...prev, captcha: undefined }));
                      }}
                      onFocus={() => setFocusedField("captcha")}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        darkInputClass,
                        "pl-9 text-center font-mono",
                        errors.captcha && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Extra form helpers */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    disabled={isSubmitting}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span className="text-slate-300 hover:text-slate-100 transition">Keep me logged in</span>
                </label>
                
                <a 
                  href="#contact" 
                  className="text-gold-400 hover:text-gold-300 font-semibold link-underline transition"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit portal verification */}
              <motion.button
                type="submit"
                whileHover={isSubmitting ? {} : { y: -2, scale: 1.01 }}
                whileTap={isSubmitting ? {} : { scale: 0.98 }}
                disabled={isSubmitting}
                className={cn(
                  btn.accent,
                  "mt-8 w-full text-base disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                  </>
                )}
              </motion.button>

              {/* Toggle to Registration for Faculty */}
              {portal === "faculty" && (
                <div className="mt-6 text-center border-t border-white/10 pt-4">
                  <p className="text-xs text-slate-400">
                    Not registered yet?{" "}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(true)}
                      className="text-blue-400 font-bold hover:text-blue-300 transition"
                    >
                      Apply for Faculty Account
                    </button>
                  </p>
                </div>
              )}

            </form>
            )}

            {/* Success Overlay Screen Takeover Celebration */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/30"
                  >
                    <CheckCircle className="h-10 w-10" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-heading mt-5 text-xl font-bold text-white sm:text-2xl"
                  >
                    Authentication Successful!
                  </motion.h3>

                  <motion.p
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 max-w-xs text-xs sm:text-sm text-slate-300 leading-relaxed"
                  >
                    Redirecting you to your dashboard…
                  </motion.p>

                  <motion.button
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      let dest = redirectPath || "/dashboard";
                      if (!redirectPath && portal === "faculty") {
                        dest = username.toUpperCase().startsWith("ADMIN") ? "/admin-dashboard" : "/teacher-dashboard";
                      }
                      router.push(dest);
                    }}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-sm font-bold text-white transition shadow-lg shadow-blue-500/20"
                  >
                    Go to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Success Overlay */}
            <AnimatePresence>
              {regSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/30"
                  >
                    <CheckCircle className="h-10 w-10" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-heading mt-5 text-xl font-bold text-white"
                  >
                    Request Submitted
                  </motion.h3>

                  <motion.p
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 text-sm text-slate-300"
                  >
                    Your faculty registration request has been sent to the administration for review.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Error Overlay Screen */}
            <AnimatePresence>
              {authError?.show && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className={cn(
                      "h-16 w-16 rounded-full flex items-center justify-center border mb-5 shadow-xl",
                      authError.icon === 'pending' ? "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10" : 
                      "bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10"
                    )}
                  >
                    {authError.icon === 'pending' ? <Clock className="h-8 w-8" /> : 
                     authError.icon === 'not_found' ? <UserPlus className="h-8 w-8" /> : 
                     <XCircle className="h-8 w-8" />}
                  </motion.div>
                  
                  <motion.h3
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-heading text-xl font-bold text-white sm:text-2xl"
                  >
                    {authError.title}
                  </motion.h3>

                  <motion.p
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 max-w-xs text-xs sm:text-sm text-slate-300 leading-relaxed"
                  >
                    {authError.message}
                  </motion.p>

                  <motion.button
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => {
                      setAuthError(null);
                      if (authError.icon === 'not_found') {
                        setIsRegistering(true);
                      }
                    }}
                    className={cn(
                      "mt-8 flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white transition shadow-lg",
                      authError.icon === 'pending' ? "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20" : 
                      authError.icon === 'not_found' ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" :
                      "bg-red-600 hover:bg-red-500 shadow-red-500/20"
                    )}
                  >
                    {authError.icon === 'not_found' ? "Register Now" : "Go Back"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

      </main>

      <Footer />
    </>
  );
}
