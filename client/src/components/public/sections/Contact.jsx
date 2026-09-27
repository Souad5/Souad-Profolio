import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowRight, FaDownload } from "react-icons/fa";
import { AlertCircle, CalendarDays, Check, Copy, MapPin, Phone } from "lucide-react";
import { useSiteSettings } from "../../../hooks/usePortfolio.js";
import { submitContact } from "../../../api/endpoints.js";
import { Section } from "./Section.jsx";
import { FloatingField } from "../../ui/floating-field.jsx";
import { ChoiceChips } from "../../ui/choice-chips.jsx";
import { AppButton } from "../../ui/app-button.jsx";
import Icon from "../../ui/Icon.jsx";
import { PulseDot } from "../../ui/pulse-dot.jsx";

const TOPICS = ["Hiring / Full-Time", "Freelance Project", "General Inquiry"];
const CALENDLY_URL = "https://calendly.com/souadalkabir/portfolio";
const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px 10% 0px" };
const EMPTY = { name: "", email: "", subject: "", message: "" };

/* ------------------------------------------------------------------ */
/* Big copy-able email                                                 */
/* ------------------------------------------------------------------ */

function EmailLine({ email }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // Clipboard blocked — the mailto link still works.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="relative break-all font-display text-2xl leading-tight text-white transition-colors hover:text-brand-300 sm:text-3xl"
      >
        {email}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand-400 transition-transform duration-500 group-hover:scale-x-100" />
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : "Copy email address"}
        className="relative flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 text-xs text-white/80 transition hover:border-brand-400/60 hover:text-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-brand-300" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'
  const [error, setError] = useState("");
  const [activeTopic, setActiveTopic] = useState(null);
  const subjectRef = useRef(null);
  const sentTimer = useRef(null);
  useEffect(() => () => clearTimeout(sentTimer.current), []);

  // Editing the form clears a previous error so it doesn't linger.
  const upd = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (status === "error") setStatus(null);
  };

  const pickTopic = (topic) => {
    setActiveTopic(topic);
    setForm((prev) => ({ ...prev, subject: topic || "" }));
    subjectRef.current?.focus();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      // Source of truth: store in the backend/database (visible in admin inbox)
      await submitContact(form);

      // Best-effort EmailJS delivery (preserves existing behavior)
      try {
        // Loaded on demand: the SDK is only needed once someone actually sends.
        const { default: emailjs } = await import("@emailjs/browser");
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          { ...form },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch {
        // Backend storage succeeded even if email delivery fails
      }

      setStatus("sent");
      setForm(EMPTY);
      setActiveTopic(null);
      clearTimeout(sentTimer.current);
      sentTimer.current = setTimeout(() => setStatus(null), 6000);
    } catch (err) {
      // Errors stay visible until the visitor edits the form or retries.
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  const resumeUrl = settings?.resumeUrl;

  return (
    <Section name="contact" className="relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-white shadow-2xl shadow-slate-900/20 sm:p-10 lg:rounded-[2.5rem] lg:p-14 dark:bg-slate-900 dark:ring-1 dark:ring-white/10"
      >
        {/* Ambient glows + grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 right-10 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
        />

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ----------------------- LEFT ----------------------- */}
          <div className="flex flex-col lg:col-span-6">
            {settings?.availability && (
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3.5 py-1.5 text-xs text-brand-300">
                <PulseDot size="md" tone="brand" />
                {settings.availability}
              </p>
            )}

            <h2 className="mt-6 text-balance font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Let&apos;s build something{" "}
              <span className="bg-linear-to-r from-brand-300 via-brand-400 to-teal-300 bg-clip-text text-transparent">
                exceptional
              </span>{" "}
              together.
            </h2>

            <p className="mt-5 max-w-md text-pretty leading-relaxed text-white/65">
              Open to full-time roles and freelance projects. Drop a message, book a quick call, or
              grab my résumé — I usually reply within 24 hours.
            </p>

            {settings?.email && (
              <div className="mt-10">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">Email me</p>
                <EmailLine email={settings.email} />
              </div>
            )}

            {(settings?.phone || settings?.location) && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 tabular-nums transition hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-brand-300" />
                    {settings.phone}
                  </a>
                )}
                {settings?.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-300" />
                    {settings.location}
                  </span>
                )}
              </div>
            )}

            {/* Quick actions */}
            <div className="mt-10 flex flex-wrap gap-3">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-3 text-sm text-slate-950 transition hover:bg-brand-300"
                >
                  <FaDownload className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                  {settings?.heroPrimaryCta || "Download Resume"}
                </a>
              )}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm text-white transition hover:border-white/50 hover:bg-white/5"
              >
                <CalendarDays className="h-4 w-4" />
                Book a 15-min call
              </a>
            </div>

            {settings?.socialLinks?.length > 0 && (
              <div className="mt-auto flex items-center gap-2.5 pt-10">
                {settings.socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:-translate-y-0.5 hover:border-brand-400/60 hover:bg-brand-400/10 hover:text-white"
                  >
                    <Icon name={s.icon} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ----------------------- RIGHT: form ----------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="lg:col-span-6"
          >
            <form
              onSubmit={handleSubmit}
              className="relative space-y-5 rounded-3xl bg-surface p-6 text-ink shadow-2xl shadow-black/30 sm:p-8 dark:bg-slate-950 dark:text-slate-100 dark:ring-1 dark:ring-white/10"
            >
              <div>
                <h3 className="font-display text-2xl">Send a message</h3>
                <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">What&apos;s this about?</p>
              </div>

              <ChoiceChips options={TOPICS} value={activeTopic} onChange={pickTopic} />

              <div className="grid gap-4 sm:grid-cols-2">
                <FloatingField label="Your name" required value={form.name} onChange={upd("name")} autoComplete="name" />
                <FloatingField label="Email address" type="email" required value={form.email} onChange={upd("email")} autoComplete="email" />
              </div>

              <FloatingField ref={subjectRef} label="Subject" value={form.subject} onChange={upd("subject")} />

              <FloatingField as="textarea" label="Your message" required value={form.message} onChange={upd("message")} />

              <div aria-live="polite">
                <AnimatePresence initial={false}>
                  {status === "sent" && (
                    <motion.p
                      key="sent"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
                    >
                      <Check className="h-4 w-4 shrink-0" /> Thanks! Your message was sent — I&apos;ll get back to you soon.
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p
                      key="error"
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error || "Something went wrong. Please try again."}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Shared AppButton, sized/tinted to keep the form's original CTA look. */}
              <AppButton
                type="submit"
                shine
                loading={status === "sending"}
                rightIcon={FaArrowRight}
                className="h-12 w-full rounded-full text-sm font-semibold shadow-lg shadow-brand-600/25 transition-all duration-300 hover:shadow-brand-600/35 dark:bg-brand-500 dark:text-slate-900 dark:shadow-none dark:hover:bg-brand-400"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </AppButton>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
