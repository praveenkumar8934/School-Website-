import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreditCard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TuitionPage() {
  const fees = [
    { grade: "Kindergarten (K1 - K3)", annual: "$18,500", term: "$6,166" },
    { grade: "Primary (Grades 1 - 5)", annual: "$22,000", term: "$7,333" },
    { grade: "Middle School (Grades 6 - 8)", annual: "$25,500", term: "$8,500" },
    { grade: "High School (Grades 9 - 12)", annual: "$28,000", term: "$9,333" }
  ];

  const inclusions = [
    "Core academic curriculum and instruction",
    "Access to library, science labs, and technology centers",
    "Standard extracurricular activities and clubs",
    "Comprehensive health and wellness services",
    "Nutritious daily lunch program"
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Tuition & Fees</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            At Nova Academy, we are committed to providing world-class education. Find our transparent fee structure for the 2026-27 academic year below.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-900">Grade Level</th>
                  <th className="p-4 font-semibold text-slate-900">Annual Tuition</th>
                  <th className="p-4 font-semibold text-slate-900">Per Term (3 Terms)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((fee, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{fee.grade}</td>
                    <td className="p-4 font-bold text-blue-700">{fee.annual}</td>
                    <td className="p-4 text-slate-600">{fee.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <CreditCard className="w-8 h-8 text-blue-600 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-3">Payment Plans</h2>
            <p className="text-slate-700 mb-4">
              We offer flexible payment options to suit your family's needs. You can choose to pay annually (with a 2% discount), per term, or set up a 10-month monthly installment plan.
            </p>
            <Link href="/admissions" className="text-blue-700 font-bold hover:underline">
              Contact Finance Office →
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">What's Included?</h2>
            <ul className="space-y-3">
              {inclusions.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
