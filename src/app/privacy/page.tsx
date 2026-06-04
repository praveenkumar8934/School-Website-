import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">
            At Nova Academy, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            We collect information that you provide directly to us, such as when you fill out an admissions application, subscribe to our newsletter, or contact us for support. This may include your name, email address, phone number, and academic history.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The information we collect is used to:
          </p>
          <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
            <li>Process admissions and enrollment applications.</li>
            <li>Communicate with you regarding school events, updates, and academic progress.</li>
            <li>Improve our website and services.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            If you have any questions regarding this privacy policy, you may contact us at <a href="mailto:privacy@nova.edu" className="text-blue-600 hover:underline">privacy@nova.edu</a>.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
