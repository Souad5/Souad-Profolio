import { useSections } from "../hooks/usePortfolio.js";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import Hero from "../components/public/sections/Hero.jsx";
import About from "../components/public/sections/About.jsx";
import Skills from "../components/public/sections/Skills.jsx";
import Experience from "../components/public/sections/Experience.jsx";
import Education from "../components/public/sections/Education.jsx";
import Projects from "../components/public/sections/Projects.jsx";
import Services from "../components/public/sections/Services.jsx";
import Testimonials from "../components/public/sections/Testimonials.jsx";
import Certifications from "../components/public/sections/Certifications.jsx";
import Achievements from "../components/public/sections/Achievements.jsx";
import Contact from "../components/public/sections/Contact.jsx";

export default function Home() {
  const { data: sections, isLoading } = useSections();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-brand-600" aria-label="Loading"></span>
      </div>
    );
  }

  const enabled = (key) => {
    const sec = sections?.find((s) => s.key === key);
    return sec ? sec.enabled : true;
  };

  return (
    <main>
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      {enabled("about") && (
        <ErrorBoundary><About /></ErrorBoundary>
      )}
      {enabled("skills") && (
        <ErrorBoundary><Skills /></ErrorBoundary>
      )}
      {enabled("experience") && (
        <ErrorBoundary><Experience /></ErrorBoundary>
      )}
      {enabled("education") && (
        <ErrorBoundary><Education /></ErrorBoundary>
      )}
      {enabled("projects") && (
        <ErrorBoundary><Projects /></ErrorBoundary>
      )}
      {enabled("services") && (
        <ErrorBoundary><Services /></ErrorBoundary>
      )}
      {enabled("testimonials") && (
        <ErrorBoundary><Testimonials /></ErrorBoundary>
      )}
      {enabled("certifications") && (
        <ErrorBoundary><Certifications /></ErrorBoundary>
      )}
      {enabled("achievements") && (
        <ErrorBoundary><Achievements /></ErrorBoundary>
      )}
      {enabled("contact") && (
        <ErrorBoundary><Contact /></ErrorBoundary>
      )}
    </main>
  );
}