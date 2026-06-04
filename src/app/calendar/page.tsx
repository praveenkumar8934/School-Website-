import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

export default function CalendarPage() {
  const events = [
    {
      date: "Sep 5, 2026",
      title: "Fall Semester Begins",
      time: "8:00 AM",
      location: "Main Campus",
      type: "Academic"
    },
    {
      date: "Sep 15, 2026",
      title: "Parent-Teacher Conferences",
      time: "4:00 PM - 7:00 PM",
      location: "Virtual & In-Person",
      type: "Meeting"
    },
    {
      date: "Oct 10, 2026",
      title: "Science Fair 2026",
      time: "10:00 AM - 3:00 PM",
      location: "Grand Auditorium",
      type: "Event"
    },
    {
      date: "Nov 25-27, 2026",
      title: "Thanksgiving Break",
      time: "All Day",
      location: "N/A",
      type: "Holiday"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Academic Calendar</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Stay updated with all the important dates, events, and holidays for the upcoming academic year.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {events.map((event, i) => (
              <div key={i} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:bg-slate-50 transition-colors">
                <div className="sm:w-48 shrink-0">
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-wider">{event.type}</div>
                  <div className="mt-1 font-bold text-slate-900 text-lg">{event.date}</div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                  <div className="mt-3 flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
