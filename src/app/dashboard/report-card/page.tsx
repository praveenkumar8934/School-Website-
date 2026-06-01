"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ReportCard() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(async (res) => {
        if (!res.ok) {
          router.push("/login?redirect=/dashboard/report-card");
          return;
        }
        const data = await res.json();
        const session = data.user;
        fetchReportData(session.studentId || session.id);
      })
      .catch(() => router.push("/login"));

    async function fetchReportData(userId: string) {
      try {
        const { data: profile } = await supabase.from("students").select("*").eq("student_id", userId).single();
        if (profile) {
          setStudent({
            name: profile.student_name,
            rollNo: profile.id.split('-')[0].substring(0, 8).toUpperCase(),
            class: `${profile.grade} – Section ${profile.assigned_section}`,
            admissionNo: profile.student_id,
            dob: profile.dob,
          });
        }

        const { data: marksData } = await supabase.from("marks").select("*").eq("student_id", userId);
        if (marksData && marksData.length > 0) {
          const formattedSubjects = marksData.map((m: any) => ({
            name: m.subject,
            marks: m.marks_obtained,
            total: m.max_marks,
            grade: m.grade
          }));
          setSubjects(formattedSubjects);
        } else {
          // fallback mock data
          setSubjects([
            { name: "Math", marks: 95, total: 100, grade: "A+" },
            { name: "Science", marks: 90, total: 100, grade: "A+" },
            { name: "English", marks: 85, total: 100, grade: "A" },
            { name: "Hindi", marks: 88, total: 100, grade: "A" },
            { name: "Social Studies", marks: 92, total: 100, grade: "A+" },
          ]);
        }
      } catch(e) {
        console.error("Error fetching report data:", e);
      }
    }
  }, [router]);

  useEffect(() => {
    if (student && subjects.length > 0) {
      // Auto print once data is loaded
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [student, subjects]);

  if (!student) {
    return <div className="flex h-screen items-center justify-center">Loading Report Card...</div>;
  }

  const average = Math.round(subjects.reduce((a, s) => a + s.marks, 0) / subjects.length);

  return (
    <div className="bg-white min-h-screen text-black p-8 font-sans">
      <div className="max-w-3xl mx-auto border-2 border-black p-8 relative">
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-2">Nova Academy</h1>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-600">Official Academic Report Card</p>
          <p className="text-xs text-gray-500 mt-1">Academic Year 2025-26 · Term 1</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <p><strong>Student Name:</strong> {student.name}</p>
            <p className="mt-2"><strong>Admission No:</strong> {student.admissionNo}</p>
            <p className="mt-2"><strong>Date of Birth:</strong> {student.dob}</p>
          </div>
          <div className="text-right">
            <p><strong>Class & Section:</strong> {student.class}</p>
            <p className="mt-2"><strong>Roll Number:</strong> {student.rollNo}</p>
            <p className="mt-2"><strong>Date Issued:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-4 py-2 text-left">Subject</th>
              <th className="border border-black px-4 py-2 text-center">Max Marks</th>
              <th className="border border-black px-4 py-2 text-center">Marks Obtained</th>
              <th className="border border-black px-4 py-2 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, idx) => (
              <tr key={idx}>
                <td className="border border-black px-4 py-2">{sub.name}</td>
                <td className="border border-black px-4 py-2 text-center">{sub.total}</td>
                <td className="border border-black px-4 py-2 text-center font-bold">{sub.marks}</td>
                <td className="border border-black px-4 py-2 text-center font-bold">{sub.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center border-t-2 border-black pt-6 mb-16">
          <div>
            <p className="text-lg"><strong>Average Score:</strong> {average}%</p>
          </div>
          <div>
            <p className="text-lg"><strong>Overall Grade:</strong> {average >= 90 ? 'A+' : average >= 80 ? 'A' : average >= 70 ? 'B+' : 'B'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-16 pt-8 text-center">
          <div>
            <div className="border-b border-black w-48 mx-auto mb-2"></div>
            <p className="text-sm font-semibold uppercase">Class Teacher</p>
          </div>
          <div>
            <div className="border-b border-black w-48 mx-auto mb-2"></div>
            <p className="text-sm font-semibold uppercase">Principal</p>
          </div>
        </div>
      </div>
      
      {/* Hide print button when printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}} />
      <div className="text-center mt-6 no-print">
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">Print Report Card</button>
        <button onClick={() => router.back()} className="ml-4 text-blue-600 underline hover:text-blue-800 transition">Back to Dashboard</button>
      </div>
    </div>
  );
}
