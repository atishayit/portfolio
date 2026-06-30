import { Background } from "@/components/Background";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Recognition } from "@/components/Recognition";
import { ProjectsPreview } from "@/components/ProjectsPreview";
import { Publications } from "@/components/Publications";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <span id="top" className="absolute top-0" aria-hidden="true" />
      <Background />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Recognition />
        <ProjectsPreview />
        <Publications />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
