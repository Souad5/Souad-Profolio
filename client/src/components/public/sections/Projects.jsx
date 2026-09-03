import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useProjects } from "../../../hooks/usePortfolio.js";
import { Section } from "./Section.jsx";
import { AppButton } from "../../ui/app-button.jsx";
import Icon from "../../ui/Icon.jsx";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* Project Detail Modal                                                       */
/* -------------------------------------------------------------------------- */

function ProjectDetailModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-surface shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
        >
          <FaTimes />
        </button>

        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Icon name="FaImage" className="text-5xl text-ink-muted" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Project
            </p>
            <h3 className="font-display text-3xl font-bold md:text-4xl">
              {project.title}
            </h3>
          </div>

          <p className="leading-relaxed text-ink-muted dark:text-slate-300">
            {project.description}
          </p>

          {Array.isArray(project.technologies) &&
            project.technologies.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 font-semibold">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((technology, index) => (
                    <span
                      key={`${technology}-${index}`}
                      className="rounded-full bg-brand-600/10 px-3 py-1.5 text-xs font-medium text-brand-600 dark:bg-brand-400/10 dark:text-brand-400"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {project.challenges && (
            <div className="mt-7">
              <h4 className="font-semibold">Challenges</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-300">
                {project.challenges}
              </p>
            </div>
          )}

          {project.improvements && (
            <div className="mt-6">
              <h4 className="font-semibold">Improvements</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-300">
                {project.improvements}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <AppButton asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              </AppButton>
            )}

            {project.githubUrl && (
              <AppButton asChild variant="outline">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub /> Source Code
                </a>
              </AppButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Project Card                                                               */
/* -------------------------------------------------------------------------- */

function ProjectCard({ project, index, total, onOpen }) {
  return (
    <article
      className="project-card absolute inset-0 overflow-hidden rounded-[28px] border border-slate-200 bg-surface shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      style={{
        zIndex: total - index,
        transformOrigin: "center bottom",
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="group block h-full w-full text-left"
        aria-label={`View ${project.title} details`}
      >
        <div className="relative h-full overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="project-image absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Icon
                name="FaImage"
                className="text-6xl text-ink-muted dark:text-slate-500"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute left-5 right-5 top-5 flex items-start justify-between md:left-7 md:right-7 md:top-7">
            <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            <span className="rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              View project
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <div className="flex items-end justify-between gap-5">
              <div className="max-w-2xl">
                <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  {project.title}
                </h3>

                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                  {project.shortDescription || project.description}
                </p>

                {Array.isArray(project.technologies) &&
                  project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 5).map((technology, i) => (
                        <span
                          key={`${technology}-${i}`}
                          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}
              </div>

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-14 md:w-14">
                <FaArrowRight />
              </span>
            </div>
          </div>
        </div>
      </button>

      <div className="absolute right-5 top-18 z-20 flex gap-2 md:right-7">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <FaGithub />
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} live website`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          >
            <FaExternalLinkAlt />
          </a>
        )}
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Projects Main Component                                                     */
/* -------------------------------------------------------------------------- */

export default function Projects() {
  const { data: projects = [] } = useProjects();
  const [selected, setSelected] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const count = projects.length;

  useEffect(() => {
    if (!count || !containerRef.current || !cardsContainerRef.current) return;

    const cards = gsap.utils.toArray(
      cardsContainerRef.current.querySelectorAll(".project-card"),
    );

    if (!cards.length) return;

    const DECK_SIZE = Math.min(4, cards.length);
    const deckOffset = (depth) => 28 * depth;
    const deckScale = (depth) => 1 - depth * 0.045;
    const deckOpacity = (depth) => Math.max(0.2, 1 - depth * 0.25);

    const ctx = gsap.context(() => {
      // Set initial setup
      gsap.set(cards, { y: 0, scale: 1, opacity: 1, rotation: 0 });

      cards.forEach((card, index) => {
        if (index < DECK_SIZE) {
          gsap.set(card, {
            y: deckOffset(index),
            scale: deckScale(index),
            opacity: deckOpacity(index),
          });
        } else {
          gsap.set(card, { y: 160, scale: 0.85, opacity: 0 });
        }
      });

      const totalDistance = Math.max(count * 600, 2000);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalDistance}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              count - 1,
              Math.floor(self.progress * count),
            );
            setActiveIndex(index);
          },
        },
      });

      scrollTriggerRef.current = timeline.scrollTrigger;

      // Animate card stack logic
      for (let i = 0; i < cards.length - 1; i++) {
        const current = cards[i];
        const next = cards[i + 1];
        const start = i;

        timeline.to(
          current,
          { y: -100, scale: 0.9, opacity: 0, ease: "power1.inOut" },
          start,
        );

        timeline.to(
          next,
          { y: 0, scale: 1, opacity: 1, ease: "power1.inOut" },
          start,
        );

        for (let j = i + 2; j < cards.length; j++) {
          const depth = j - (i + 1);
          const outOfDeck = depth >= DECK_SIZE;

          timeline.to(
            cards[j],
            {
              y: outOfDeck ? 160 : deckOffset(depth),
              scale: outOfDeck ? 0.85 : deckScale(depth),
              opacity: outOfDeck ? 0 : deckOpacity(depth),
              ease: "power1.inOut",
            },
            start,
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [count]);

  const handleProgressClick = (index) => {
    if (!scrollTriggerRef.current) return;
    const st = scrollTriggerRef.current;
    const targetScroll =
      st.start + (st.end - st.start) * (index / (count - 1 || 1));
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  if (!count) return null;

  return (
    <>
      <Section
        ref={containerRef}
        name="projects"
        className="relative flex min-h-screen items-center bg-surface-muted/60 py-0! dark:bg-slate-900/40"
      >
        <div className="w-full">
          <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Sidebar */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="eyebrow">Selected work</p>
                <h2 className="section-title">
                  Work{" "}
                  <span className="text-brand-600 dark:text-brand-400">
                    ({count})
                  </span>
                </h2>

                <p className="mt-4 max-w-md leading-relaxed text-ink-muted dark:text-slate-400">
                  A selection of things I&apos;ve built. Scroll to explore each
                  project.
                </p>

                <div className="mt-8 flex items-center gap-2">
                  <span className="font-display text-2xl font-semibold text-brand-600 dark:text-brand-400">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-muted dark:text-slate-600">/</span>
                  <span className="text-sm text-ink-muted dark:text-slate-500">
                    {String(count).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-5 flex max-w-xs gap-1.5">
                  {projects.map((project, index) => (
                    <button
                      key={project.id || index}
                      type="button"
                      onClick={() => handleProgressClick(index)}
                      aria-label={`Go to project ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? "w-10 bg-brand-600 dark:bg-brand-400"
                          : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <a
                  href="#projects"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400 dark:hover:text-brand-400"
                >
                  View all work
                  <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </div>

            {/* Deck Stack Viewport */}
            <div className="lg:col-span-8">
              <div
                ref={cardsContainerRef}
                className="relative h-137.5 w-full max-w-2xl mx-auto lg:h-150"
              >
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id || index}
                    project={project}
                    index={index}
                    total={count}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {selected && (
        <ProjectDetailModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
