"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  Users, 
  Award, 
  Clock, 
  FileCheck, 
  Sparkles, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  Mail, 
  Phone, 
  Check,
  Lock,
  CreditCard,
  QrCode,
  Download
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { admissionsSchema, AdmissionsFormValues } from "@/lib/zod-schemas";
import { btn } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Admissions Process Steps Timeline
const timelineSteps = [
  {
    icon: FileText,
    title: "1. Online Registration",
    desc: "Complete the secure multi-step admission profile with all demographic and prior academic credentials."
  },
  {
    icon: Search,
    title: "2. Document Evaluation",
    desc: "Our admissions department reviews transcripts, marksheets, and student identity certificates."
  },
  {
    icon: Users,
    title: "3. Campus Interaction",
    desc: "A brief, friendly interaction and counseling session with the student and parents on campus."
  },
  {
    icon: Award,
    title: "4. Enrollment & Onboarding",
    desc: "Receive the formal admission offer letter, submit tuition fees, and complete orientation onboarding."
  }
];

// Required Documents List
const requiredDocs = [
  { name: "Student Passport Photo", size: "JPEG/PNG, Max 2MB", note: "Recent color portrait" },
  { name: "Student Aadhar Card Copy", size: "PDF/JPEG, Max 2MB", note: "Identity verification" },
  { name: "Birth Certificate", size: "PDF/JPEG, Max 2MB", note: "Required for age evaluation" },
  { name: "Transfer Certificate (TC)", size: "PDF/JPEG, Max 5MB", note: "For Classes 1 to 12 transfers only" }
];

// Admissions FAQs
const faqs = [
  {
    q: "What is the minimum age criteria for Kindergarten admissions?",
    a: "For Kindergarten (LKG), the student must be at least 4 years of age as of March 31st of the academic term year. For UKG, the minimum age requirement is 5 years."
  },
  {
    q: "What academic board and curriculum does Nova Academy follow?",
    a: "Nova Academy follows the national CBSE (Central Board of Secondary Education) curriculum integrated with modern STEM/Coding modules, blended digital platforms, and deep creative arts focus."
  },
  {
    q: "Are merit-based scholarships or fee concessions available?",
    a: "Yes! We offer competitive merit-based scholarships for students excelling in academics, sports, or technology innovations. Financial assistance programs are also available for families meeting our baseline criteria."
  },
  {
    q: "When does the next school academic session begin?",
    a: "The regular academic term officially begins in the first week of April. Registration inquiries are evaluated on a rolling basis, and mid-term entries are permitted depending on seat availability."
  }
];

// Reusable custom dark-themed input styling to prevent contrast conflicts
const darkInputClass = 
  "mt-2 min-h-[48px] w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-base leading-normal text-white outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-white/20 focus:border-blue-500 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 sm:text-sm";

export default function AdmissionsPage() {


  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<AdmissionsFormValues | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [admissionsOpen, setAdmissionsOpen] = useState<boolean | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from("system_settings").select("admissions_open").eq("id", 1).single();
        if (error) throw error;
        setAdmissionsOpen(data ? data.admissions_open : true);
      } catch (err) {
        console.error("Failed to load settings", err);
        setAdmissionsOpen(true); // default open on failure
      }
    }
    fetchSettings();
  }, []);
  
  // File upload state for previews
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aadharImageName, setAadharImageName] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [aadharFile, setAadharFile] = useState<File | null>(null);

  const fileInputPhotoRef = useRef<HTMLInputElement>(null);
  const fileInputAadharRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    reset
  } = useForm<AdmissionsFormValues>({
    resolver: zodResolver(admissionsSchema),
    mode: "onChange",
    defaultValues: {
      studentName: "",
      dob: "",
      gender: "",
      religion: "",
      studentPhoto: "",
      fatherName: "",
      motherName: "",
      parentPhone: "",
      altPhone: "",
      parentEmail: "",
      emergencyContact: "",
      prevSchool: "",
      prevClass: "",
      grade: "",
      aadharNumber: "",
      aadharImage: "",
      address: "",
      city: "",
      state: "",
      pinCode: ""
    }
  });

  const downloadReceipt = () => {
    if (!submittedData) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const html = `
      <html>
        <head>
          <title>Payment Receipt - Nova Academy</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #111; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .subtitle { color: #666; margin-top: 5px; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 12px 0; }
            .label { font-weight: 600; color: #444; }
            .value { color: #111; }
            .total { font-size: 20px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; text-align: right; }
            .footer { margin-top: 60px; text-align: center; color: #888; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">NOVA ACADEMY</div>
            <div class="subtitle">Admissions Registration Payment Receipt</div>
          </div>
          
          <div class="row">
            <span class="label">Date:</span>
            <span class="value">${new Date().toLocaleDateString()}</span>
          </div>
          <div class="row">
            <span class="label">Transaction ID:</span>
            <span class="value">${(submittedData as any).paymentId || 'N/A'}</span>
          </div>
          <div class="row">
            <span class="label">Student Name:</span>
            <span class="value">${submittedData.studentName}</span>
          </div>
          <div class="row">
            <span class="label">Class Applied For:</span>
            <span class="value">${submittedData.grade}</span>
          </div>
          <div class="row">
            <span class="label">Parent Name:</span>
            <span class="value">${submittedData.fatherName || submittedData.motherName}</span>
          </div>
          <div class="row">
            <span class="label">Payment Status:</span>
            <span class="value" style="color: green; font-weight: bold;">SUCCESS</span>
          </div>
          
          <div class="total">
            Total Amount Paid: ₹1,000.00
          </div>
          
          <div class="footer">
            This is a computer generated receipt and does not require a physical signature.<br>
            Please keep this for your records.
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Steps-to-fields mapping for sequential step validations
  const stepsFields: (keyof AdmissionsFormValues)[][] = [
    ["studentName", "dob", "gender", "religion", "studentPhoto"],
    ["fatherName", "motherName", "parentPhone", "altPhone", "parentEmail", "emergencyContact", "password", "confirmPassword"],
    ["prevSchool", "prevClass", "grade"],
    ["aadharNumber", "aadharImage", "address", "city", "state", "pinCode"],
    []
  ];

  const handleNext = async () => {
    const fieldsToValidate = stepsFields[currentStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      // Smooth scroll back to top of the form panel
      const formEl = document.getElementById("admission-form-container");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    const formEl = document.getElementById("admission-form-container");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Custom File Uploader triggers — handles file selection only
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size must be less than 2MB");
      return;
    }

    setPhotoFile(file);

    // Show local preview immediately for better UX
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);

    setValue("studentPhoto", file.name, { shouldValidate: true });
  };

  const handleAadharUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Aadhar image size must be less than 2MB");
      return;
    }

    setAadharFile(file);
    setAadharImageName(file.name);
    setValue("aadharImage", file.name, { shouldValidate: true });
  };

  const onSubmit = async (data: AdmissionsFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      let finalPhotoUrl = data.studentPhoto;
      let finalAadharUrl = data.aadharImage;

      // Upload Photo
      if (photoFile) {
        setUploadingPhoto(true);
        const ext = photoFile.name.split(".").pop();
        const fileName = `photos/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("admissions")
          .upload(fileName, photoFile, { cacheControl: "3600", upsert: false });
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from("admissions").getPublicUrl(fileName);
        finalPhotoUrl = urlData.publicUrl;
        setUploadingPhoto(false);
      }

      // Upload Aadhar
      if (aadharFile) {
        setUploadingAadhar(true);
        const ext = aadharFile.name.split(".").pop();
        const fileName = `aadhar/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("admissions")
          .upload(fileName, aadharFile, { cacheControl: "3600", upsert: false });
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from("admissions").getPublicUrl(fileName);
        finalAadharUrl = urlData.publicUrl;
        setUploadingAadhar(false);
      }

      const payload = {
        ...data,
        studentPhoto: finalPhotoUrl,
        aadharImage: finalAadharUrl,
      };

      const response = await fetch("/api/admissions-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.message || "Could not register admission. Please try again.");
        setIsSubmitting(false);
        return;
      }

      console.log("Admission form values successfully submitted to database:", data);
      
      setSubmittedData(data);
      setShowSuccess(true);
      reset();
      setPhotoPreview(null);
      setAadharImageName(null);
      setPhotoFile(null);
      setAadharFile(null);
      setCurrentStep(0);
      setPaymentMethod("card");
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError("Submission error. Please check your network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step Header titles
  const stepTitles = [
    "Student Identity",
    "Parent Contacts",
    "Prior Academics",
    "Residential Details",
    "Application Fee"
  ];

  return (
    <>
      <Navbar />
      
      <main id="main-content" className="bg-navy-950 text-slate-100 min-h-screen pt-24 pb-20 relative overflow-hidden" tabIndex={-1}>
        
        {/* Floating background blur design elements */}
        <div className="absolute top-1/4 -left-48 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" aria-hidden />
        <div className="absolute top-2/3 -right-48 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" aria-hidden />
        <div className="mesh-gradient absolute inset-0 opacity-15 pointer-events-none" aria-hidden />

        {/* 1. HERO BANNER */}
        <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-400 backdrop-blur-md shadow-inner"
          >
            <Sparkles className="h-4 w-4" />
            Admissions Open for Session 2026-27
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Empower Your Child&apos;s <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-200 to-gold-300 bg-clip-text text-transparent">Future at Nova Academy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            Our secure, digitized registration portal allows parents to apply online in four straightforward steps. Review guidelines and prepare files to begin.
          </motion.p>
        </div>

        {/* 2. ADMISSION PROCESS TIMELINE & PREPARATION */}
        <div className="mx-auto max-w-6xl px-4 mt-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            
            {/* Timeline Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white sm:text-xl">Admissions Procedure</h3>
              </div>

              <div className="relative border-l border-white/5 pl-6 ml-4 space-y-8">
                {timelineSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative"
                  >
                    <span className="absolute -left-10 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-gold-400 shadow-md">
                      <step.icon className="h-4 w-4" />
                    </span>
                    <h4 className="font-heading text-base font-bold text-white leading-tight">{step.title}</h4>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Checklist Section - Updated to glass-dark for contrast */}
            <div className="glass-dark border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <FileCheck className="h-5 w-5 text-blue-400" />
                <h3 className="font-heading text-base font-bold text-white">Documents Checklist</h3>
              </div>

              <p className="text-xs text-slate-400">Please prepare soft copies of the following before filling the form:</p>

              <ul className="space-y-4">
                {requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex flex-col gap-1 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-xs font-bold text-slate-200">{doc.name}</span>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{doc.size}</span>
                      <span className="text-gold-400/80">{doc.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* 3. MULTI-STEP FORM SECTION - Updated to glass-dark for contrast */}
        <div id="admission-form-container" className="mx-auto max-w-4xl px-4 mt-24 sm:px-6">
          {admissionsOpen === null ? (
            <div className="glass-dark rounded-3xl p-10 border border-white/10 text-center shadow-2xl">
              <p className="text-white text-lg">Loading admissions status...</p>
            </div>
          ) : admissionsOpen === false ? (
            <div className="glass-dark rounded-3xl p-10 border border-white/10 text-center space-y-4 shadow-2xl">
              <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">Admissions are Closed</h2>
              <p className="text-slate-400 max-w-lg mx-auto">We are not accepting new applications at this time. Please check back later or contact the school administration for more details.</p>
            </div>
          ) : (
            <div className="glass-dark rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative">
              {/* Header progress info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">Step {currentStep + 1} of 5</span>
                <h2 className="font-heading mt-1 text-xl font-bold text-white sm:text-2xl">{stepTitles[currentStep]}</h2>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-all duration-300",
                      stepIdx <= currentStep ? "bg-blue-500" : "bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Form Fields Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {/* STEP 1: STUDENT IDENTITY */}
                  {currentStep === 0 && (
                    <div className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Student Full Name *</span>
                            {errors.studentName && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.studentName.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="Jane Doe"
                            {...register("studentName")}
                            className={cn(darkInputClass, errors.studentName && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Date of Birth *</span>
                            {errors.dob && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.dob.message as string}</span>
                            )}
                          </span>
                          <input
                            type="date"
                            {...register("dob")}
                            className={cn(darkInputClass, errors.dob && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-3">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Gender *</span>
                            {errors.gender && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.gender.message as string}</span>
                            )}
                          </span>
                          <select
                            {...register("gender")}
                            className={cn(darkInputClass, errors.gender && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          >
                            <option value="" className="text-slate-900 bg-white">Select gender</option>
                            <option value="Male" className="text-slate-900 bg-white">Male</option>
                            <option value="Female" className="text-slate-900 bg-white">Female</option>
                            <option value="Other" className="text-slate-900 bg-white">Other</option>
                          </select>
                        </label>
 
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Religion *</span>
                            {errors.religion && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.religion.message as string}</span>
                            )}
                          </span>
                          <select
                            {...register("religion")}
                            className={cn(darkInputClass, errors.religion && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          >
                            <option value="" className="text-slate-900 bg-white">Select religion</option>
                            <option value="Hinduism" className="text-slate-900 bg-white">Hinduism</option>
                            <option value="Islam" className="text-slate-900 bg-white">Islam</option>
                            <option value="Christianity" className="text-slate-900 bg-white">Christianity</option>
                            <option value="Sikhism" className="text-slate-900 bg-white">Sikhism</option>
                            <option value="Buddhism" className="text-slate-900 bg-white">Buddhism</option>
                            <option value="Jainism" className="text-slate-900 bg-white">Jainism</option>
                            <option value="Other" className="text-slate-900 bg-white">Other</option>
                          </select>
                        </label>
                      </div>

                      {/* Photo upload dropzone */}
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                          <span>Upload Student Photo *</span>
                          {errors.studentPhoto && (
                            <span className="text-[10px] text-red-400 font-medium normal-case">{errors.studentPhoto.message as string}</span>
                          )}
                        </span>
                        
                        <div 
                          onClick={() => !uploadingPhoto && fileInputPhotoRef.current?.click()}
                          className={cn(
                            "mt-2 border border-dashed rounded-xl p-6 text-center transition",
                            uploadingPhoto ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-white/5",
                            photoPreview && !uploadingPhoto ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10 bg-slate-900/60"
                          )}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputPhotoRef}
                            onChange={handlePhotoUpload}
                            className="hidden"
                            disabled={uploadingPhoto}
                          />
                          {uploadingPhoto ? (
                            <div className="flex flex-col items-center gap-2">
                              <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              <p className="text-xs font-semibold text-blue-400 animate-pulse">Uploading photo to cloud…</p>
                            </div>
                          ) : photoPreview ? (
                            <div className="flex items-center justify-center gap-4">
                              <img src={photoPreview} alt="Preview" className="h-14 w-14 rounded-full object-cover border border-emerald-500/30" />
                              <div className="text-left">
                                <p className="text-xs font-bold text-emerald-400">Photo uploaded successfully!</p>
                                <p className="text-[10px] text-slate-400">Click here to replace the file</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 text-blue-400 mx-auto" />
                              <p className="text-xs font-bold text-slate-300">Click to upload passport photo</p>
                              <p className="text-[10px] text-slate-400">Supports JPG, PNG formats up to 2MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PARENT & CONTACTS */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Father&apos;s Full Name *</span>
                            {errors.fatherName && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.fatherName.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="John Doe"
                            {...register("fatherName")}
                            className={cn(darkInputClass, errors.fatherName && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Mother&apos;s Full Name *</span>
                            {errors.motherName && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.motherName.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="Mary Doe"
                            {...register("motherName")}
                            className={cn(darkInputClass, errors.motherName && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Parent Mobile Number *</span>
                            {errors.parentPhone && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.parentPhone.message as string}</span>
                            )}
                          </span>
                          <input
                            type="tel"
                            placeholder="e.g. 5125550199"
                            {...register("parentPhone")}
                            className={cn(darkInputClass, errors.parentPhone && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Alternate Mobile Number</span>
                            {errors.altPhone && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.altPhone.message as string}</span>
                            )}
                          </span>
                          <input
                            type="tel"
                            placeholder="e.g. 5125550144"
                            {...register("altPhone")}
                            className={cn(darkInputClass, errors.altPhone && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Parent Email Address *</span>
                            {errors.parentEmail && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.parentEmail.message as string}</span>
                            )}
                          </span>
                          <input
                            type="email"
                            placeholder="parent@email.com"
                            {...register("parentEmail")}
                            className={cn(darkInputClass, errors.parentEmail && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Emergency Contact *</span>
                            {errors.emergencyContact && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.emergencyContact.message as string}</span>
                            )}
                          </span>
                          <input
                            type="tel"
                            placeholder="e.g. 5125550188"
                            {...register("emergencyContact")}
                            className={cn(darkInputClass, errors.emergencyContact && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Account Password *</span>
                            {errors.password && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.password.message as string}</span>
                            )}
                          </span>
                          <input
                            type="password"
                            placeholder="Create a strong password"
                            {...register("password")}
                            className={cn(darkInputClass, errors.password && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Confirm Password *</span>
                            {errors.confirmPassword && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.confirmPassword.message as string}</span>
                            )}
                          </span>
                          <input
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword")}
                            className={cn(darkInputClass, errors.confirmPassword && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ACADEMIC PROFILE */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Previous School Name *</span>
                            {errors.prevSchool && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.prevSchool.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="Nova Elementary School"
                            {...register("prevSchool")}
                            className={cn(darkInputClass, errors.prevSchool && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Previous Class Completed *</span>
                            {errors.prevClass && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.prevClass.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. Class 4, UKG"
                            {...register("prevClass")}
                            className={cn(darkInputClass, errors.prevClass && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Class Applying For *</span>
                            {errors.grade && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.grade.message as string}</span>
                            )}
                          </span>
                          <select
                            {...register("grade")}
                            className={cn(darkInputClass, errors.grade && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          >
                            <option value="" className="text-slate-900 bg-white">Select class</option>
                            <option value="Kindergarten" className="text-slate-900 bg-white">Kindergarten</option>
                            <option value="Class 1" className="text-slate-900 bg-white">Class 1</option>
                            <option value="Class 2" className="text-slate-900 bg-white">Class 2</option>
                            <option value="Class 3" className="text-slate-900 bg-white">Class 3</option>
                            <option value="Class 4" className="text-slate-900 bg-white">Class 4</option>
                            <option value="Class 5" className="text-slate-900 bg-white">Class 5</option>
                            <option value="Class 6" className="text-slate-900 bg-white">Class 6</option>
                            <option value="Class 7" className="text-slate-900 bg-white">Class 7</option>
                            <option value="Class 8" className="text-slate-900 bg-white">Class 8</option>
                            <option value="Class 9" className="text-slate-900 bg-white">Class 9</option>
                            <option value="Class 10" className="text-slate-900 bg-white">Class 10</option>
                            <option value="Class 11" className="text-slate-900 bg-white">Class 11</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: RESIDENTIAL & NOTES */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Student Aadhar Card Number *</span>
                            {errors.aadharNumber && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.aadharNumber.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. 123456789012"
                            {...register("aadharNumber")}
                            className={cn(darkInputClass, errors.aadharNumber && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>Pin Code *</span>
                            {errors.pinCode && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.pinCode.message as string}</span>
                            )}
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. 787001"
                            {...register("pinCode")}
                            className={cn(darkInputClass, errors.pinCode && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          />
                        </label>
                      </div>

                      {/* Aadhar Card Image Upload Dropzone */}
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                          <span>Upload Aadhar Card Image *</span>
                          {errors.aadharImage && (
                            <span className="text-[10px] text-red-400 font-medium normal-case">{errors.aadharImage.message as string}</span>
                          )}
                        </span>

                        <div
                          onClick={() => !uploadingAadhar && fileInputAadharRef.current?.click()}
                          className={cn(
                            "mt-2 border border-dashed rounded-xl p-6 text-center transition",
                            uploadingAadhar ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-white/5",
                            aadharImageName && !uploadingAadhar ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/10 bg-slate-900/60"
                          )}
                        >
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={fileInputAadharRef}
                            onChange={handleAadharUpload}
                            className="hidden"
                            disabled={uploadingAadhar}
                          />
                          {uploadingAadhar ? (
                            <div className="flex flex-col items-center gap-2">
                              <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              <p className="text-xs font-semibold text-blue-400 animate-pulse">Uploading Aadhar image to cloud…</p>
                            </div>
                          ) : aadharImageName ? (
                            <div className="flex items-center justify-center gap-3">
                              <CheckCircle className="h-6 w-6 text-emerald-400" />
                              <div className="text-left">
                                <p className="text-xs font-bold text-emerald-400">Aadhar image uploaded successfully!</p>
                                <p className="text-[10px] text-slate-300 font-mono">{aadharImageName}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 text-blue-400 mx-auto" />
                              <p className="text-xs font-bold text-slate-300">Click to upload Aadhar card copy</p>
                              <p className="text-[10px] text-slate-400">Supports JPG, PNG, PDF formats up to 2MB</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                          <span>Full Residential Address *</span>
                          {errors.address && (
                            <span className="text-[10px] text-red-400 font-medium normal-case">{errors.address.message as string}</span>
                          )}
                        </span>
                        <input
                          type="text"
                          placeholder="Apt 101, Oaklane St"
                          {...register("address")}
                          className={cn(darkInputClass, errors.address && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                        />
                      </label>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>City *</span>
                            {errors.city && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.city.message as string}</span>
                            )}
                          </span>
                          <select
                            {...register("city")}
                            className={cn(darkInputClass, errors.city && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          >
                            <option value="" className="text-slate-900 bg-white">Select city</option>
                            <option value="Agra" className="text-slate-900 bg-white">Agra</option>
                            <option value="Ahmedabad" className="text-slate-900 bg-white">Ahmedabad</option>
                            <option value="Amritsar" className="text-slate-900 bg-white">Amritsar</option>
                            <option value="Bangalore" className="text-slate-900 bg-white">Bangalore</option>
                            <option value="Bhopal" className="text-slate-900 bg-white">Bhopal</option>
                            <option value="Bhubaneswar" className="text-slate-900 bg-white">Bhubaneswar</option>
                            <option value="Chandigarh" className="text-slate-900 bg-white">Chandigarh</option>
                            <option value="Chennai" className="text-slate-900 bg-white">Chennai</option>
                            <option value="Coimbatore" className="text-slate-900 bg-white">Coimbatore</option>
                            <option value="Dehradun" className="text-slate-900 bg-white">Dehradun</option>
                            <option value="Delhi" className="text-slate-900 bg-white">Delhi</option>
                            <option value="Faridabad" className="text-slate-900 bg-white">Faridabad</option>
                            <option value="Ghaziabad" className="text-slate-900 bg-white">Ghaziabad</option>
                            <option value="Guwahati" className="text-slate-900 bg-white">Guwahati</option>
                            <option value="Hyderabad" className="text-slate-900 bg-white">Hyderabad</option>
                            <option value="Indore" className="text-slate-900 bg-white">Indore</option>
                            <option value="Jaipur" className="text-slate-900 bg-white">Jaipur</option>
                            <option value="Kanpur" className="text-slate-900 bg-white">Kanpur</option>
                            <option value="Kochi" className="text-slate-900 bg-white">Kochi</option>
                            <option value="Kolkata" className="text-slate-900 bg-white">Kolkata</option>
                            <option value="Kushinagar" className="text-slate-900 bg-white">Kushinagar</option>
                            <option value="Lucknow" className="text-slate-900 bg-white">Lucknow</option>
                            <option value="Ludhiana" className="text-slate-900 bg-white">Ludhiana</option>
                            <option value="Mumbai" className="text-slate-900 bg-white">Mumbai</option>
                            <option value="Nagpur" className="text-slate-900 bg-white">Nagpur</option>
                            <option value="Nashik" className="text-slate-900 bg-white">Nashik</option>
                            <option value="Patna" className="text-slate-900 bg-white">Patna</option>
                            <option value="Pune" className="text-slate-900 bg-white">Pune</option>
                            <option value="Raipur" className="text-slate-900 bg-white">Raipur</option>
                            <option value="Rajkot" className="text-slate-900 bg-white">Rajkot</option>
                            <option value="Ranchi" className="text-slate-900 bg-white">Ranchi</option>
                            <option value="Surat" className="text-slate-900 bg-white">Surat</option>
                            <option value="Thiruvananthapuram" className="text-slate-900 bg-white">Thiruvananthapuram</option>
                            <option value="Varanasi" className="text-slate-900 bg-white">Varanasi</option>
                            <option value="Visakhapatnam" className="text-slate-900 bg-white">Visakhapatnam</option>
                            <option value="Other" className="text-slate-900 bg-white">Other</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
                            <span>State *</span>
                            {errors.state && (
                              <span className="text-[10px] text-red-400 font-medium normal-case">{errors.state.message as string}</span>
                            )}
                          </span>
                          <select
                            {...register("state")}
                            className={cn(darkInputClass, errors.state && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20")}
                          >
                            <option value="" className="text-slate-900 bg-white">Select state</option>
                            <option value="Andaman and Nicobar Islands" className="text-slate-900 bg-white">Andaman and Nicobar Islands</option>
                            <option value="Andhra Pradesh" className="text-slate-900 bg-white">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh" className="text-slate-900 bg-white">Arunachal Pradesh</option>
                            <option value="Assam" className="text-slate-900 bg-white">Assam</option>
                            <option value="Bihar" className="text-slate-900 bg-white">Bihar</option>
                            <option value="Chandigarh" className="text-slate-900 bg-white">Chandigarh</option>
                            <option value="Chhattisgarh" className="text-slate-900 bg-white">Chhattisgarh</option>
                            <option value="Dadra and Nagar Haveli and Daman and Diu" className="text-slate-900 bg-white">Dadra and Nagar Haveli</option>
                            <option value="Delhi" className="text-slate-900 bg-white">Delhi</option>
                            <option value="Goa" className="text-slate-900 bg-white">Goa</option>
                            <option value="Gujarat" className="text-slate-900 bg-white">Gujarat</option>
                            <option value="Haryana" className="text-slate-900 bg-white">Haryana</option>
                            <option value="Himachal Pradesh" className="text-slate-900 bg-white">Himachal Pradesh</option>
                            <option value="Jammu and Kashmir" className="text-slate-900 bg-white">Jammu and Kashmir</option>
                            <option value="Jharkhand" className="text-slate-900 bg-white">Jharkhand</option>
                            <option value="Karnataka" className="text-slate-900 bg-white">Karnataka</option>
                            <option value="Kerala" className="text-slate-900 bg-white">Kerala</option>
                            <option value="Ladakh" className="text-slate-900 bg-white">Ladakh</option>
                            <option value="Madhya Pradesh" className="text-slate-900 bg-white">Madhya Pradesh</option>
                            <option value="Maharashtra" className="text-slate-900 bg-white">Maharashtra</option>
                            <option value="Manipur" className="text-slate-900 bg-white">Manipur</option>
                            <option value="Meghalaya" className="text-slate-900 bg-white">Meghalaya</option>
                            <option value="Mizoram" className="text-slate-900 bg-white">Mizoram</option>
                            <option value="Nagaland" className="text-slate-900 bg-white">Nagaland</option>
                            <option value="Odisha" className="text-slate-900 bg-white">Odisha</option>
                            <option value="Puducherry" className="text-slate-900 bg-white">Puducherry</option>
                            <option value="Punjab" className="text-slate-900 bg-white">Punjab</option>
                            <option value="Rajasthan" className="text-slate-900 bg-white">Rajasthan</option>
                            <option value="Sikkim" className="text-slate-900 bg-white">Sikkim</option>
                            <option value="Tamil Nadu" className="text-slate-900 bg-white">Tamil Nadu</option>
                            <option value="Telangana" className="text-slate-900 bg-white">Telangana</option>
                            <option value="Tripura" className="text-slate-900 bg-white">Tripura</option>
                            <option value="Uttar Pradesh" className="text-slate-900 bg-white">Uttar Pradesh</option>
                            <option value="Uttarakhand" className="text-slate-900 bg-white">Uttarakhand</option>
                            <option value="West Bengal" className="text-slate-900 bg-white">West Bengal</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                          <CreditCard className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Application Fee</h3>
                        <p className="text-slate-400 max-w-sm mb-6">A non-refundable application fee of ₹1,000 is required to process the registration.</p>
                        
                        <div className="w-full max-w-sm border-t border-white/10 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-400">Application Form</span>
                            <span className="text-white font-medium">₹1,000.00</span>
                          </div>
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-slate-400">Convenience Fee</span>
                            <span className="text-white font-medium">₹0.00</span>
                          </div>
                          <div className="flex items-center justify-between text-lg font-bold border-t border-white/10 pt-4">
                            <span className="text-white">Total Amount</span>
                            <span className="text-blue-400">₹1,000.00</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Select Payment Method</h4>
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
                          <div className="h-40 w-40 bg-white p-2 rounded-lg mb-4 flex items-center justify-center">
                            <QrCode className="h-32 w-32 text-slate-900" />
                          </div>
                          <p className="text-sm text-slate-400">Scan this QR code with any UPI app</p>
                          <p className="text-xs text-slate-500 mt-1">Google Pay, PhonePe, Paytm, BHIM</p>
                        </div>
                      )}
                      
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Submit Error Message */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3"
                >
                  <div className="rounded-full bg-red-500/20 p-1 mt-0.5">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-400">Submission Failed</h4>
                    <p className="text-sm text-slate-300 mt-1">{submitError}</p>
                  </div>
                </motion.div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
                {currentStep > 0 ? (
                  <motion.button
                    type="button"
                    onClick={handlePrev}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </motion.button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition shadow-blue-500/20"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    disabled={isSubmitting || isProcessingPayment}
                    onClick={async (e) => {
                      e.preventDefault();
                      setIsProcessingPayment(true);
                      
                      // Mock payment processing delay
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      
                      // Inject mock payment ID and status into the form
                      setValue("paymentStatus", "completed");
                      setValue("paymentId", "mock_pay_" + Math.random().toString(36).substring(2, 9));
                      
                      setIsProcessingPayment(false);
                      // Trigger final submission
                      handleSubmit(onSubmit)();
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      btn.accent,
                      "px-8 py-3 text-base shadow-lg shadow-blue-500/25 flex items-center gap-2"
                    )}
                  >
                    {(isSubmitting || isProcessingPayment) ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isProcessingPayment ? "Processing Payment..." : "Registering Student..."}
                      </>
                    ) : (
                      <>
                        Pay ₹1,000 & Submit
                        <Check className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            {/* Success Overlay Celebration */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 rounded-3xl bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/30"
                  >
                    <CheckCircle className="h-12 w-12" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-heading mt-6 text-2xl font-bold text-white sm:text-3xl"
                  >
                    Application Registered!
                  </motion.h3>

                  <motion.div
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 max-w-md text-sm sm:text-base text-slate-300 leading-relaxed"
                  >
                    <p className="text-slate-300 mb-2">Payment completed successfully.</p>
                    <p className="text-slate-400 text-sm">You will receive an email confirmation shortly.</p>
                    <div className="flex gap-4 mt-8 justify-center">
                      <button
                        onClick={downloadReceipt}
                        className="rounded-xl border border-white/10 bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </button>
                      <button
                        onClick={() => setShowSuccess(false)}
                        className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
          )}
        </div>

        {/* 4. ADMISSIONS FAQ ACCORDION - Updated to glass-dark for contrast */}
        <div className="mx-auto max-w-3xl px-4 mt-28 sm:px-6">
          <div className="text-center space-y-3">
            <HelpCircle className="h-8 w-8 text-blue-400 mx-auto" />
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Find answers to general questions about registration, age, and academic sessions.</p>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="glass-dark border border-white/5 rounded-2xl overflow-hidden shadow-md">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left transition hover:bg-white/5"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-sm font-bold text-white sm:text-base leading-snug">{faq.q}</span>
                    <span className={cn("text-slate-400 transition-transform duration-300 ml-4", isOpen && "rotate-180")}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 text-xs sm:text-sm text-slate-300 border-t border-white/5 bg-slate-900/50 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. CONTACT SUPPORT SECTION - Updated to glass-dark for contrast */}
        <div className="mx-auto max-w-6xl px-4 mt-28 mb-16 sm:px-6 lg:px-8 border-t border-white/5 pt-16">
          <div className="glass-dark border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-950/20 via-slate-950/50 to-indigo-950/20">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">Need assistance with your application?</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">Our counseling and admissions department is here to support you at every stage. We respond within one business day.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
              <a 
                href="mailto:admissions@novaacademy.edu"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                <Mail className="h-4 w-4" />
                Email Admissions
              </a>
              <a 
                href="tel:+15125550142"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition"
              >
                <Phone className="h-4 w-4" />
                Call +1 (512) 555-0142
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
