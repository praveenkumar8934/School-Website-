"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is the student-to-teacher ratio?",
    answer: "Our average student-to-teacher ratio is 12:1. This allows for personalized attention and ensures that every student's individual learning needs are met."
  },
  {
    question: "Do you offer extracurricular activities?",
    answer: "Yes, we offer over 40 different clubs and activities, ranging from robotics and debate to varsity sports and theater arts. Extracurriculars are a core part of the Nova Academy experience."
  },
  {
    question: "Is there a uniform policy?",
    answer: "Yes, Nova Academy has a mandatory uniform policy for all students in grades K-12. Uniforms foster a sense of community and keep the focus on academics."
  },
  {
    question: "How does the admission process work?",
    answer: "The admission process includes an online application, submission of previous academic records, teacher recommendations, and a student interview or assessment depending on the grade level."
  },
  {
    question: "What support services are available for students?",
    answer: "We provide comprehensive support services including academic counseling, college placement advising, learning support specialists, and dedicated school psychologists."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about admissions, academics, and student life at Nova Academy.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between p-6 w-full text-left bg-white hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown 
                  className={cn("w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ml-4", openIndex === i && "rotate-180")} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
