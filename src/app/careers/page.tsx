import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Briefcase, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Mathematics Teacher",
      department: "High School",
      type: "Full-time",
      location: "Main Campus"
    },
    {
      title: "School Counselor",
      department: "Student Services",
      type: "Full-time",
      location: "Main Campus"
    },
    {
      title: "Physical Education Instructor",
      department: "Athletics",
      type: "Part-time",
      location: "Sports Complex"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Join Our Team</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            We are always looking for passionate educators and professionals to join us in our mission to shape future leaders.
          </p>
        </div>

        <div className="space-y-6">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-blue-300 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">{job.department}</span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">{job.type}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> {job.location}
                </p>
              </div>
              <a 
                href={`mailto:hr@nova.edu?subject=Application for ${job.title}`}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
