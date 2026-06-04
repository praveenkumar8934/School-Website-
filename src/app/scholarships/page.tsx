import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Award, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ScholarshipsPage() {
  const scholarships = [
    {
      title: "Academic Excellence Scholarship",
      icon: GraduationCap,
      coverage: "Up to 100% Tuition",
      eligibility: "High school applicants with outstanding academic records and a GPA of 3.9+."
    },
    {
      title: "Arts & Innovation Grant",
      icon: Award,
      coverage: "Up to 50% Tuition",
      eligibility: "Students showing exceptional talent in visual arts, music, or design. Portfolio required."
    },
    {
      title: "Need-Based Financial Aid",
      icon: BookOpen,
      coverage: "Variable",
      eligibility: "Available for families demonstrating significant financial need. Requires detailed financial disclosure."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Scholarships & Aid</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            We believe that a world-class education should be accessible to all talented students, regardless of their financial background.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {scholarships.map((scholarship, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <scholarship.icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{scholarship.title}</h2>
              <div className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mb-4">
                {scholarship.coverage}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {scholarship.eligibility}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-navy-900 rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Apply for Aid?</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              The financial aid and scholarship application process opens concurrently with the general admissions cycle. Make sure to submit all required documentation before the deadlines.
            </p>
            <Link 
              href="/admissions" 
              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold py-3 px-8 rounded-full transition-colors"
            >
              Start Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 opacity-5 w-64 h-64 -mr-16 -mt-16 pointer-events-none">
            <Award className="w-full h-full" />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
