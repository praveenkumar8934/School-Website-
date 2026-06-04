import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const revalidate = 60;

export default async function FacultyPage() {
  const { data: faculty, error } = await supabase
    .from("faculty_registrations")
    .select("*")
    .eq("status", "approved")
    .order("full_name", { ascending: true });

  if (error) {
    if (Object.keys(error).length > 0 || error.message) {
      console.error("Error fetching faculty:", error.message || error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Our Faculty Directory</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            Meet the exceptional educators and professionals dedicated to guiding our students toward excellence.
          </p>
        </div>

        {(!faculty || faculty.length === 0) ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">No faculty members found.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {faculty.map((member: any, index: number) => {
              // Generate a stable color hue based on index or name
              const hue = (index * 45) % 360;
              return (
                <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group">
                  <div 
                    className="h-32 relative overflow-hidden"
                    style={{ backgroundImage: `linear-gradient(135deg, hsl(${hue} 70% 60%), hsl(${hue} 60% 40%))` }}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.full_name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400">
                            {member.full_name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-14 pb-6 px-6">
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{member.full_name}</h3>
                    <p className="text-sm font-medium text-blue-600 mt-1">{member.role_type || "Teacher"} • {member.department}</p>
                    
                    <div className="mt-5 space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Qualification</span>
                        <span className="font-medium text-slate-700">{member.qualification}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Experience</span>
                        <span className="font-medium text-slate-700">{member.experience_years} Years</span>
                      </div>
                      {member.assigned_subject && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Subject</span>
                          <span className="font-medium text-slate-700">{member.assigned_subject}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
