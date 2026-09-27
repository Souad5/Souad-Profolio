import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useProjects, useSiteSettings } from "../../../hooks/usePortfolio.js";
import { useIsMobile } from "../../../hooks/use-mobile.js";
import Icon from "../../ui/Icon.jsx";
import { TechChips } from "../../ui/tech-chips.jsx";
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// The details dialog (and the Radix dialog code behind it) is only needed
// once someone opens a project, so it ships as its own chunk.
const ProjectDetailModal = lazy(() => import("../ProjectDetailModal.jsx"));

/* -------------------------------------------------------------------------- */
/* Project Card                                                               */
/* -------------------------------------------------------------------------- */

function ProjectCard({ project, index, total, onOpen }) {
  return (
    <article
      className="project-card absolute inset-0 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 shadow-2xl dark:border-slate-700"
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
          {/* Screenshots are wide (~2.2:1) desktop captures: show them in a 2:1
              band across the top (anchored to the page's top) instead of
              cropping a tall middle slice, and keep the text on the dark
              panel below so it never sits on busy image content. */}
          <div className="absolute inset-x-0 top-0 aspect-2/1 overflow-hidden">
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={`${project.title} screenshot`}
                width={1600}
                height={800}
                loading="lazy"
                decoding="async"
                className="project-image h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <Icon name="FaImage" className="text-6xl text-slate-500" />
              </div>
            )}
            {/* Fade the screenshot into the panel */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-slate-950 to-transparent" />
          </div>

          {/* Soft brand glow behind the text panel */}
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl" />

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
                <h3 className="text-balance font-display text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                  {project.title}
                </h3>

                <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                  {project.shortDescription || project.description}
                </p>

                <TechChips items={project.technologies} variant="glass" max={5} className="mt-4" />
              </div>

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-14 md:w-14">
                <FaArrowRight aria-hidden="true" />
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
            <FaGithub aria-hidden="true" />
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
            <FaExternalLinkAlt aria-hidden="true" />
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
  const { data: settings } = useSiteSettings();
  // "More on GitHub" points at the GitHub profile from the social links.
  const githubProfile = settings?.socialLinks?.find(
    (l) => l?.icon === "FaGithub" || /github/i.test(l?.label || l?.url || ""),
  )?.url;
  const [selected, setSelected] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  // Return keyboard focus to whatever opened the dialog once it closes (the
  // dialog unmounts after its exit animation, so Radix can't do it reliably).
  const openerRef = useRef(null);
  const openProject = useCallback((project) => {
    openerRef.current = document.activeElement;
    setModalProject(project);
    setSelected(project);
  }, []);
  const closeProject = useCallback(() => {
    setSelected(null);
    setTimeout(() => openerRef.current?.focus?.({ preventScroll: true }), 350);
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);

  // The deck/pin experience only makes sense with a wide viewport. On
  // phones/tablets we render an ordinary stacked card list instead, so the
  // GSAP scroll-pin never traps content that is taller than the viewport.
  const isDesktop = !useIsMobile();

  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const timelineRef = useRef(null);

  const count = projects.length;

  useEffect(() => {
    if (!isDesktop) return;
    if (
      !count ||
      !containerRef.current ||
      !pinRef.current ||
      !cardsContainerRef.current
    )
      return;
    if (!pinRef.current.offsetHeight) return;

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

      // Each card-to-card move takes MOVE of a 1-unit step; the remainder is a
      // short rest so every card settles before the next one arrives. The
      // timeline is exactly (count - 1) units long.
      const MOVE = 0.7;
      const totalDistance = Math.max((cards.length - 1) * 450, 1200);

      const timeline = gsap.timeline({
        // Derive the active card from the (scrubbed) timeline time so the
        // counter changes exactly when a card visually takes the front —
        // halfway through its move — rather than from raw scroll progress.
        onUpdate() {
          const t = this.time();
          const index = t < MOVE / 2 ? 0 : Math.floor(t - MOVE / 2) + 1;
          setActiveIndex(Math.min(cards.length - 1, index));
        },
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${totalDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      scrollTriggerRef.current = timeline.scrollTrigger;
      timelineRef.current = { duration: cards.length - 1, move: MOVE };

      // Animate card stack logic
      for (let i = 0; i < cards.length - 1; i++) {
        const current = cards[i];
        const next = cards[i + 1];
        const start = i;

        timeline.to(
          current,
          { y: -100, scale: 0.9, opacity: 0, ease: "power1.inOut", duration: MOVE },
          start,
        );

        timeline.to(
          next,
          { y: 0, scale: 1, opacity: 1, ease: "power1.inOut", duration: MOVE },
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
              duration: MOVE,
            },
            start,
          );
        }
      }
      // Pad to a whole unit so the last card also gets its rest.
      timeline.to({}, { duration: 1 - MOVE }, cards.length - 2 + MOVE);
    }, containerRef);

    // Re-measure whenever the page height changes. Sections above load
    // their data independently (and images/fonts arrive late), so a one-off
    // refresh could leave the pin's start position stale — which is what
    // makes the pinned deck overlap neighbouring sections. The height guard
    // stops the pin-spacer's own resize from triggering another refresh.
    let lastHeight = 0;
    let debounce = 0;
    const refresh = () => {
      ScrollTrigger.refresh();
      lastHeight = document.documentElement.scrollHeight;
    };
    const scheduleRefresh = () => {
      if (Math.abs(document.documentElement.scrollHeight - lastHeight) < 2) return;
      clearTimeout(debounce);
      debounce = setTimeout(refresh, 150);
    };
    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(document.body);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(scheduleRefresh);

    return () => {
      clearTimeout(debounce);
      resizeObserver.disconnect();
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [count, isDesktop]);

  const handleProgressClick = (index) => {
    const st = scrollTriggerRef.current;
    const tl = timelineRef.current;
    if (!st || !tl) return;
    // Card N is fully in front at the end of its move.
    const time = index === 0 ? 0 : index - 1 + tl.move;
    const progress = tl.duration ? time / tl.duration : 0;
    window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: "smooth" });
  };

  if (!count) return null;

  return (
    <>
      <section
        ref={containerRef}
        id="projects"
        name="projects"
        className="relative z-20 bg-surface-muted/60 px-0 py-16 sm:py-20 lg:py-0 dark:bg-slate-900/40"
      >
        {/* Mobile/tablet layout — stacked cards, no GSAP pin */}
        <div className="mx-auto w-full max-w-6xl px-5 lg:hidden sm:px-8">
          <div className="mb-10">
            <p className="eyebrow">Selected work</p>
            <h2 className="section-title">
              Work{" "}
              <span className="text-brand-600 dark:text-brand-400">
                ({count})
              </span>
            </h2>
            <p className="mt-3 max-w-md leading-relaxed text-ink-muted dark:text-slate-400">
              A selection of things I&apos;ve built.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {projects.map((project, index) => (
              <div key={project.id || index} className="relative h-104 w-full">
                <ProjectCard
                  project={project}
                  index={index}
                  total={count}
                  onOpen={openProject}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop layout — pinned GSAP deck */}
        <div
          ref={pinRef}
          className="relative z-20 hidden items-center bg-surface-muted/60 px-5 pt-16 sm:px-8 lg:flex lg:min-h-screen dark:bg-slate-900/40"
        >
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
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
                  <span aria-hidden="true" className="text-ink-muted dark:text-slate-500">/</span>
                  <span className="text-sm text-ink-muted dark:text-slate-400">
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

                {githubProfile && (
                  <a
                    href={githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-8 inline-flex items-center gap-3 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400 dark:hover:text-brand-400"
                  >
                    <FaGithub />
                    More on GitHub
                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                  </a>
                )}
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
                    onOpen={openProject}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stays mounted after the first open so the dialog can animate out. */}
      {modalProject && (
        <Suspense fallback={null}>
          <ProjectDetailModal
            project={modalProject}
            open={!!selected}
            onClose={closeProject}
          />
        </Suspense>
      )}
    </>
  );
}
