import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Accessibility Statement</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed mb-4">
            Nova Academy is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conformance Status</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nova Academy's website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Feedback</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            We welcome your feedback on the accessibility of Nova Academy's website. Please let us know if you encounter accessibility barriers:
          </p>
          <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
            <li>E-mail: <a href="mailto:accessibility@nova.edu" className="text-blue-600 hover:underline">accessibility@nova.edu</a></li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Education Lane, Learning City, ED 90210</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Technical Specifications</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Accessibility of Nova Academy's website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
          </p>
          <ul className="list-disc pl-6 text-slate-700 leading-relaxed mb-4 space-y-2">
            <li>HTML</li>
            <li>WAI-ARIA</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mb-4">
            These technologies are relied upon for conformance with the accessibility standards used.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
