import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed mb-4">
            Welcome to Nova Academy. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            By accessing this site, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Use of Services</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            You agree to use our website and portals only for lawful educational and administrative purposes. Unauthorized use, including attempting to breach our security systems or accessing private data, is strictly prohibited.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Students, parents, and faculty are responsible for maintaining the confidentiality of their login credentials. Any activity occurring under your account is your responsibility.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            All content on this website, including text, graphics, logos, and course materials, is the property of Nova Academy and protected by applicable copyright and trademark laws.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nova Academy will not be liable for any damages arising from the use or inability to use our website or services, including direct, indirect, incidental, or consequential damages.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
