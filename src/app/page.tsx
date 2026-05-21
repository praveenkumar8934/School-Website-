import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Courses } from "@/components/Courses";
import { Faculty } from "@/components/Faculty";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Courses />
        <Faculty />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
