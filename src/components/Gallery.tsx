"use client";

import {
  Reveal,
  staggerContainer,
  staggerItem,
} from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SectionShell } from "@/components/ui/SectionShell";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const fallbackImages = [
  { title: "Innovation Lab", span: "col-span-2 row-span-2", hue: "220", image_url: "" },
  { title: "Graduation Day", span: "col-span-1 row-span-1", hue: "280", image_url: "" },
  { title: "Sports Complex", span: "col-span-1 row-span-1", hue: "150", image_url: "" },
  { title: "Art Studio", span: "col-span-1 row-span-1", hue: "330", image_url: "" },
  { title: "Library Hub", span: "col-span-2 row-span-1", hue: "40", image_url: "" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function Gallery() {
  const [images, setImages] = useState<any[]>(fallbackImages);
  
  useEffect(() => {
    async function fetchLatest() {
      try {
        const { data, error } = await supabase.from("gallery_images").select("*").eq("is_published", true).order("created_at", { ascending: false }).limit(5);
        if (error) throw error;
        if (data && data.length > 0) {
          // If less than 5 images, fill the rest with fallbacks
          const merged = [...data];
          if (merged.length < 5) {
            merged.push(...fallbackImages.slice(merged.length));
          }
          setImages(merged.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching homepage gallery:", error);
      }
    }
    fetchLatest();
  }, []);

  return (
    <SectionShell
      id="gallery"
      tone="light"
      transitionFrom="muted"
      aria-labelledby="gallery-heading"
    >
      <Reveal className="text-center">
        <SectionHeader
          id="gallery-heading"
          label="Campus Life"
          title="A campus built for discovery"
          description="Explore our state-of-the-art facilities where students learn, create, compete, and grow every day."
          align="center"
        />
      </Reveal>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-14 grid auto-rows-[minmax(150px,1fr)] grid-cols-2 gap-4 sm:auto-rows-[170px] sm:gap-5 lg:grid-cols-4 lg:mt-16"
        role="list"
        aria-label="Campus photo gallery"
      >
        {images.map((img, idx) => (
          <motion.div
            key={img.id || idx}
            variants={staggerItem}
            role="listitem"
            className={cn("min-h-[150px]", img.span)}
          >
            <Link href="/gallery" className="block h-full w-full">
              <motion.figure
                whileHover={{ scale: 1.02 }}
                className="card-interactive group relative h-full w-full overflow-hidden rounded-2xl shadow-elevated ring-1 ring-border transition-shadow duration-300 hover:shadow-elevated-lg"
              >
                {img.hue !== 'none' ? (
                  <div
                    className="img-zoom absolute inset-0 scale-100"
                    style={{
                      background: `linear-gradient(160deg, hsl(${img.hue} 50% 45%) 0%, hsl(${img.hue} 60% 30%) 100%)`,
                    }}
                    role="presentation"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-900" />
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
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0 sm:p-5">
                  <p className="font-semibold text-white">{img.title}</p>
                  <p className="mt-1 text-xs text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Explore full gallery →
                  </p>
                </figcaption>
              </motion.figure>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </SectionShell>
  );
}
