import { motion } from "framer-motion";
import { useState } from "react";
import { useProjects } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import { AppButton } from "../../ui/app-button.jsx";
import Icon from "../../ui/Icon.jsx";
import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

function ProjectDetailModal({ project, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-display text-2xl font-bold">{project.title}</h3>
          <AppButton onClick={onClose} variant="ghost" size="icon-sm" aria-label="Close">
            <FaTimes />
          </AppButton>
        </div>
        {project.thumbnail && (
          <img src={project.thumbnail} alt={project.title} className="mb-4 aspect-video w-full rounded-xl object-cover" />
        )}
        <p className="leading-relaxed text-ink-muted dark:text-slate-300">{project.description}</p>

        {(Array.isArray(project.technologies) && project.technologies.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((t, i) => (
              <span key={i} className="rounded-md bg-brand-600/10 px-2 py-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                {t}
              </span>
            ))}
          </div>
        )}

        {project.challenges && (
          <div className="mt-5">
            <h4 className="font-semibold">Challenges</h4>
            <p className="mt-1 text-sm text-ink-muted dark:text-slate-300">{project.challenges}</p>
          </div>
        )}
        {project.improvements && (
          <div className="mt-4">
            <h4 className="font-semibold">Improvements</h4>
            <p className="mt-1 text-sm text-ink-muted dark:text-slate-300">{project.improvements}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {project.liveUrl && (
            <AppButton asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt /> Live
              </a>
            </AppButton>
          )}
          {project.githubUrl && (
            <AppButton asChild variant="outline">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <FaGithub /> Code
              </a>
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { data: projects = [] } = useProjects();
  const [selected, setSelected] = useState(null);

  if (!projects.length) return null;

  return (
    <Section name="projects" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Work" title="Projects" subtitle="A selection of things I've built." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <AppButton
              variant="ghost"
              className="h-auto w-full justify-start p-0 text-left font-normal hover:bg-transparent"
              onClick={() => setSelected(p)}
              aria-label={`View ${p.title} details`}
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-muted"><Icon name="FaImage" className="text-3xl" /></div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted dark:text-slate-400">{p.shortDescription || p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(p.technologies) ? p.technologies.slice(0, 4) : []).map((t, idx) => (
                    <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-ink-muted dark:bg-slate-800 dark:text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </AppButton>
          </motion.article>
        ))}
      </div>

      {selected && <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />}
    </Section>
  );
}
