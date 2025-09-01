import Hero from "@/components/sections/Hero";
import Navbar from "../components/sections/Navbar";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import Awards from "@/components/sections/Awards";
import Certificates from "@/components/sections/Certificates";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Awards />
      <Certificates />
      <CTA />
      <Footer />
    </main>
  );
}
