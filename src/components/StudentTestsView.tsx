"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileQuestion, PlayCircle, Clock, CheckCircle, X, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function StudentTestsView({ student }: { student: any }) {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTest, setActiveTest] = useState<any | null>(null);
  
  // Test Taking State
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResult, setTestResult] = useState<any | null>(null);

  useEffect(() => {
    if (student?.id) {
      fetchTests();
    }
  }, [student?.id]);

  useEffect(() => {
    if (activeTest && !testResult) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest(true); // Auto-submit when time's up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeTest, testResult]);

  const fetchTests = async () => {
    try {
      // Find tests assigned to this student's class and section
      const { data, error } = await supabase
        .from("online_tests")
        .select(`
          *,
          test_submissions ( id, score, status, student_id )
        `)
        .eq("is_published", true)
        .eq("grade", student.grade)
        .eq("section", student.section)
        .order("created_at", { ascending: false });
        
      if (data) {
        setTests(data);
      }
    } catch (err) {
      console.error("Error fetching tests", err);
    } finally {
      setLoading(false);
    }
  };

  const startTest = async (test: any) => {
    try {
      setLoading(true);
      // Fetch questions
      const { data: qData, error } = await supabase
        .from("test_questions")
        .select("id, question_text, options, marks")
        .eq("test_id", test.id);
        
      if (error) {
        if (error.message.includes("does not exist")) {
           alert("Test system is still initializing (DB tables pending). Cannot start test right now.");
           setLoading(false);
           return;
        }
        throw error;
      }
      
      setQuestions(qData || []);
      setAnswers({});
      setTimeLeft(test.duration_minutes * 60);
      setActiveTest(test);
    } catch (err: any) {
      alert("Failed to start test: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitTest = async (autoSubmit = false) => {
    if (!autoSubmit && Object.keys(answers).length < questions.length) {
      if (!confirm("You have unanswered questions. Are you sure you want to submit?")) return;
    }
    
    setSubmitting(true);
    try {
      // In a real app, we'd send answers to backend and have backend compute score.
      // For now, we simulate backend by fetching answers to grade, or since this is a demo,
      // we can fetch the correct_options and grade here (less secure but works for MVP).
      const { data: correctData } = await supabase
        .from("test_questions")
        .select("id, correct_option_index, marks")
        .eq("test_id", activeTest.id);
        
      let score = 0;
      let totalMarks = 0;
      
      correctData?.forEach(q => {
        totalMarks += q.marks || 1;
        if (answers[q.id] === q.correct_option_index) {
          score += q.marks || 1;
        }
      });
      
      // Submit
      const { data: subData } = await supabase
        .from("test_submissions")
        .insert({
          test_id: activeTest.id,
          student_id: student.student_id,
          score,
          status: "completed",
          completed_at: new Date().toISOString()
        })
        .select()
        .single();
        
      // We could insert test_answers too, skipping for brevity
      
      setTestResult({ score, totalMarks });
      fetchTests(); // Refresh test list
    } catch (err: any) {
      alert("Error submitting test: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading && !activeTest) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>;
  }

  // --- TAKING A TEST VIEW ---
  if (activeTest) {
    if (testResult) {
      return (
        <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-8 text-center max-w-lg mx-auto mt-12">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Test Completed!</h2>
          <p className="text-slate-400 mb-6">You have successfully submitted your answers for {activeTest.title}.</p>
          
          <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Your Score</p>
            <div className="text-5xl font-extrabold text-blue-400">{testResult.score} <span className="text-2xl text-slate-500">/ {testResult.totalMarks}</span></div>
          </div>
          
          <button
            onClick={() => { setActiveTest(null); setTestResult(null); }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-[#0a1628] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-white/10 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white line-clamp-1">{activeTest.title}</h2>
            <p className="text-xs text-slate-400">{activeTest.subject}</p>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full font-bold font-mono text-sm",
            timeLeft < 60 ? "bg-red-500/20 text-red-400" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-medium text-white"><span className="text-blue-400 mr-2">Q{qIndex + 1}.</span> {q.question_text}</h3>
                  <span className="shrink-0 text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">{q.marks} Mark{q.marks > 1 ? 's' : ''}</span>
                </div>
                
                <div className="space-y-3">
                  {q.options.map((opt: string, oIndex: number) => {
                    const isSelected = answers[q.id] === oIndex;
                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectAnswer(q.id, oIndex)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border transition-all duration-200",
                          isSelected 
                            ? "bg-blue-600/20 border-blue-500 text-white" 
                            : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition",
                            isSelected ? "border-blue-400" : "border-slate-600"
                          )}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />}
                          </div>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="h-20 border-t border-white/10 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
          <div className="text-sm font-medium text-slate-400">
            Answered: <span className="text-white">{Object.keys(answers).length} / {questions.length}</span>
          </div>
          <button
            onClick={() => handleSubmitTest(false)}
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2 transition"
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
    );
  }

  // --- TEST LIST VIEW ---
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">My Online Tests</h2>
        <p className="text-slate-400 text-sm">Take assigned tests and quizzes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">You're all caught up!</h3>
            <p className="text-slate-400 mt-1">No pending online tests assigned to your class.</p>
          </div>
        ) : (
          tests.map(test => {
            const submission = test.test_submissions?.find((s: any) => s.student_id === student.student_id);
            const isCompleted = submission?.status === "completed";
            
            return (
              <div key={test.id} className="rounded-2xl border border-white/5 bg-white/5 p-5 hover:bg-white/10 transition group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className={cn(
                    "px-2 py-1 text-[10px] font-bold rounded border uppercase",
                    isCompleted ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  )}>
                    {isCompleted ? "Completed" : "Pending"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" /> {test.duration_minutes}m
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white line-clamp-1">{test.title}</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4 flex-1">{test.subject}</p>
                
                {isCompleted ? (
                  <div className="mt-auto border-t border-white/5 pt-4 flex justify-between items-center">
                    <span className="text-sm text-slate-400">Score</span>
                    <span className="text-lg font-bold text-emerald-400">{submission.score}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => startTest(test)}
                    className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Test
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
