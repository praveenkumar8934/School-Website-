import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GraduationCap, Users } from "lucide-react";

export default function AlumniPage() {
  const alumniEvents = [
    {
      title: "Annual Alumni Gala 2026",
      date: "December 15, 2026",
      description: "Join us for an evening of networking, dinner, and celebrating the achievements of our alumni community."
    },
    {
      title: "Career Mentorship Program Kickoff",
      date: "January 10, 2027",
      description: "Connect with current students and help guide the next generation of leaders in your industry."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-12 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Alumni Network</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl sm:mx-0 mx-auto">
            Stay connected with the Nova Academy family. Network, give back, and celebrate the lifelong bond of our alumni.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <Users className="w-10 h-10 mb-4 text-blue-200" />
              <h2 className="text-2xl font-bold mb-2">Update Your Info</h2>
              <p className="text-blue-100 mb-6">Have you recently moved or changed jobs? Let us know so we can keep you updated on events in your area.</p>
              <a 
                href="mailto:alumni@nova.edu?subject=Alumni Profile Update"
                className="inline-block bg-white text-blue-700 font-bold py-2.5 px-6 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Update Profile
              </a>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Users className="w-48 h-48" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-gold-500 to-amber-600 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <GraduationCap className="w-10 h-10 mb-4 text-amber-200" />
              <h2 className="text-2xl font-bold mb-2">Give Back</h2>
              <p className="text-amber-100 mb-6">Support the next generation of Nova Academy students by contributing to our scholarship and development funds.</p>
              <a 
                href="mailto:finance@nova.edu?subject=Alumni Donation Inquiry"
                className="inline-block bg-white text-amber-700 font-bold py-2.5 px-6 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Make a Donation
              </a>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <GraduationCap className="w-48 h-48" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Alumni Events</h2>
          <div className="space-y-4">
            {alumniEvents.map((event, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm font-bold text-blue-600 mb-1">{event.date}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-slate-600">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
