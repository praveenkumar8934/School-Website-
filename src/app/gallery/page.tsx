"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Fallback static images if DB is empty or fails
const fallbackImages = [
  { title: "Innovation Lab", hue: "220", span: "col-span-1 md:col-span-2 row-span-2", image_url: "" },
  { title: "Graduation Day", hue: "280", span: "col-span-1 row-span-1", image_url: "" },
  { title: "Sports Complex", hue: "150", span: "col-span-1 row-span-1", image_url: "" },
  { title: "Art Studio", hue: "330", span: "col-span-1 row-span-2", image_url: "" },
  { title: "Library Hub", hue: "40", span: "col-span-1 md:col-span-2 row-span-1", image_url: "" },
  { title: "Science Fair", hue: "180", span: "col-span-1 row-span-1", image_url: "" },
  { title: "Theater Performance", hue: "0", span: "col-span-1 md:col-span-2 row-span-2", image_url: "" },
  { title: "Cafeteria", hue: "25", span: "col-span-1 row-span-1", image_url: "" },
  { title: "Computer Lab", hue: "200", span: "col-span-1 row-span-1", image_url: "" },
  { title: "Music Room", hue: "300", span: "col-span-1 md:col-span-2 row-span-1", image_url: "" },
];

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<any[]>(fallbackImages);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data, error } = await supabase.from("gallery_images").select("*").eq("is_published", true).order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setGalleryImages(data);
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4"
          >
            Campus Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Take a visual tour of our state-of-the-art facilities, vibrant student life, and memorable events at Nova Academy.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4"
          >
            {galleryImages.map((img, idx) => (
              <motion.div
                key={img.id || idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 }
                }}
                onClick={() => setSelectedImage(img)}
                className={cn("relative overflow-hidden rounded-2xl group cursor-pointer", img.span)}
              >
                {img.hue !== 'none' ? (
                  <div
                    className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(160deg, hsl(${img.hue} 50% 45%) 0%, hsl(${img.hue} 60% 30%) 100%)`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-900 transition-transform duration-500 group-hover:scale-110" />
                )}
                
                {img.image_url && (
                  <img 
                    src={img.image_url} 
                    alt={img.title} 
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity",
                      img.hue !== 'none' ? "mix-blend-overlay opacity-80 group-hover:opacity-100" : "",
                      img.filter_style !== 'none' && img.filter_style
                    )} 
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                
                {img.category && (
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-10">
                    {img.category}
                  </div>
                )}
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <h3 className="text-white font-bold text-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="text-slate-300 text-sm mt-2 line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {img.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-[110]"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row bg-slate-900 shadow-2xl border border-white/10"
            >
              <div className="flex-1 relative min-h-[40vh] md:min-h-[70vh] flex items-center justify-center bg-black/50 p-4">
                {selectedImage.image_url ? (
                  <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.title}
                    className={cn("max-w-full max-h-full object-contain rounded-lg shadow-2xl", selectedImage.filter_style !== 'none' && selectedImage.filter_style)}
                  />
                ) : (
                  <div className="w-full h-full rounded-lg" style={selectedImage.hue !== 'none' ? { background: `linear-gradient(160deg, hsl(${selectedImage.hue} 50% 45%) 0%, hsl(${selectedImage.hue} 60% 30%) 100%)` } : { backgroundColor: '#0f172a' }} />
                )}
              </div>
              <div className="w-full md:w-96 bg-slate-900 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/5">
                {selectedImage.category && (
                  <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                    {selectedImage.category}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selectedImage.title}</h2>
                {selectedImage.description ? (
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {selectedImage.description}
                  </p>
                ) : (
                  <p className="text-slate-500 text-sm italic">
                    No description available for this image.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
