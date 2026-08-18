import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import CourseOutline from "../components/CourseOutline";
import Timeline from "../components/Timeline";
import InstructorCard from "../components/InstructorCard";
import ImageGallery from "../components/ImageGallery";
import RegistrationForm from "../components/RegistrationForm";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";

export default function Home() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const scrollToSection = searchParams.get("scroll");
    if (scrollToSection) {
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [searchParams]);

  const handleScrollToRegister = () => {
    const registerElement = document.getElementById("register-section");
    if (registerElement) {
      registerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToAbout = () => {
    const aboutElement = document.getElementById("about-section");
    if (aboutElement) {
      aboutElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onRegisterClick={handleScrollToRegister} onLearnMoreClick={handleScrollToAbout} />

      {/* About Section */}
      <About />

      {/* Why Join (Features) Section */}
      <Features />

      {/* Course Outline Section */}
      <CourseOutline />

      {/* Timeline Section */}
      <Timeline />

      {/* Instructors Section */}
      <InstructorCard />

      {/* Campus Image Gallery Section */}
      <ImageGallery />

      {/* Registration Multi-Section Form */}
      <RegistrationForm />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
