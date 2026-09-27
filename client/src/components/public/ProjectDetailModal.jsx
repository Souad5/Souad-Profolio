import { FaExternalLinkAlt, FaGithub, FaTimes } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";
import { AppButton } from "../ui/app-button.jsx";
import { TechChips } from "../ui/tech-chips.jsx";
import Icon from "../ui/Icon.jsx";

// Project details, as a shadcn Dialog (Radix): focus trap + focus return,
// Esc / outside-click to close, scroll lock, and the shadcn fade + zoom
// open/close animation. Loaded lazily from Projects.jsx on first open and
// kept mounted afterwards, so the close animation can play.
export default function ProjectDetailModal({ project, open, onClose }) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-slate-950/70 duration-200 supports-backdrop-filter:backdrop-blur-sm"
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden rounded-3xl bg-surface p-0 text-base text-ink shadow-2xl ring-slate-900/10 duration-200 sm:max-w-3xl dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
      >
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Close project details"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </DialogClose>

        {/* Scrollable body; the footer actions stay pinned below it. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={`${project.title} screenshot`}
              width={1600}
              height={900}
              decoding="async"
              className="aspect-video w-full object-cover object-top"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Icon name="FaImage" className="text-5xl text-ink-muted" />
            </div>
          )}

          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6 gap-0 text-left">
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {project.category || "Project"}
              </p>
              <DialogTitle className="font-display text-3xl font-bold leading-tight md:text-4xl">
                {project.title}
              </DialogTitle>
              <DialogDescription className="mt-4 text-base leading-relaxed text-ink-muted dark:text-slate-300">
                {project.description || project.shortDescription}
              </DialogDescription>
            </DialogHeader>

            {project.technologies?.length > 0 && (
              <div>
                <h4 className="mb-3 font-semibold">Technologies</h4>
                <TechChips items={project.technologies} variant="brand" />
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
          </div>
        </div>

        {(project.liveUrl || project.githubUrl) && (
          <DialogFooter className="m-0 rounded-none border-slate-200 bg-slate-50/80 px-6 py-4 sm:justify-start md:px-8 dark:border-slate-800 dark:bg-slate-950/40">
            {project.liveUrl && (
              <AppButton asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <FaExternalLinkAlt aria-hidden="true" /> Live Demo
                </a>
              </AppButton>
            )}
            {project.githubUrl && (
              <AppButton asChild variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <FaGithub aria-hidden="true" /> Source Code
                </a>
              </AppButton>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
