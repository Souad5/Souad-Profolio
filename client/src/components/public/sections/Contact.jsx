import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FaDownload,
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import {
  MapPin,
  CalendarDays,
  Check,
} from "lucide-react";
import { useSiteSettings } from "../../../hooks/usePortfolio.js";
import { submitContact } from "../../../api/endpoints.js";
import { Section } from "./Section.jsx";
import { FloatingField } from "../../ui/floating-field.jsx";
import { CopyCard } from "../../ui/copy-card.jsx";
import { ChoiceChips } from "../../ui/choice-chips.jsx";
import { ShineButton } from "../../ui/shine-button.jsx";
import { AvailabilityBadge } from "../../ui/availability-badge.jsx";
import { GlassCard } from "../../ui/glass-card.jsx";
import Icon from "../../ui/Icon.jsx";

const TOPICS = ["Hiring / Full-Time", "Freelance Project", "General Inquiry"];

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'
  const [error, setError] = useState("");
  const [activeTopic, setActiveTopic] = useState(null);
  const subjectRef = useRef(null);

  const upd = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
      setForm({ name: "", email: "", subject: "", message: "" });
      setActiveTopic(null);
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
      setTimeout(() => setStatus(null), 4000);
    }
  }

  const resumeUrl = settings?.resumeUrl;

  return (
    <Section
      name="contact"
      className="relative overflow-hidden bg-surface-muted/60 dark:bg-slate-900/40"
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-400/10" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-300/10" />

      <div className="mb-12">
        {/* Recruiter badge */}
        <AvailabilityBadge trailing={settings?.availability || "Immediate Availability"}>
          Open for Full-Time Roles &amp; Contracting
        </AvailabilityBadge>

        {/* Hero copy */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          Let&apos;s Build Something{" "}
          <span className="bg-linear-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-teal-300">
            Exceptional
          </span>{" "}
          Together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-xl leading-relaxed text-ink-muted dark:text-slate-400"
        >
          I&apos;m currently available for new opportunities and exciting
          projects. Drop a message or pick a fast-track option below — I usually
          reply within 24 hours.
        </motion.p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* ----------------------- LEFT: 5 cols ----------------------- */}
        <div className="lg:col-span-5">
          {/* Fast-track actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
          >
            {resumeUrl && (
              <ShineButton
                asChild
                variant="primary"
                block
                shine={false}
                className="flex-1"
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  Download Resume
                </a>
              </ShineButton>
            )}
            <ShineButton
              asChild
              variant="outline"
              block
              shine={false}
              className="flex-1"
            >
              <a
                href="https://calendly.com/souadalkabir/15min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarDays className="h-4 w-4" />
                Schedule 15-Min Call
              </a>
            </ShineButton>
          </motion.div>

          {/* Copy cards */}
          <div className="mt-6 space-y-3">
            {settings?.email && (
              <CopyCard
                icon={<FaEnvelope className="h-4 w-4" />}
                label="Email"
                value={settings.email}
                href={`mailto:${settings.email}`}
                delay={0.05}
              />
            )}
            {settings?.phone && (
              <CopyCard
                icon={<FaPhoneAlt className="h-4 w-4" />}
                label="Phone"
                value={settings.phone}
                href={`tel:${settings.phone}`}
                mono
                delay={0.12}
              />
            )}
            {settings?.location && (
              <CopyCard
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={settings.location}
                delay={0.19}
              />
            )}
          </div>

          {/* Social row */}
          {settings?.socialLinks?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-7"
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-ink-muted dark:text-slate-500">
                Find me online
              </p>
              <div className="flex items-center gap-3">
                {settings.socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-ink-muted shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/60 hover:text-brand-600 hover:shadow-lg hover:shadow-brand-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
                  >
                    <Icon name={s.icon} className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ----------------------- RIGHT: 7 cols ----------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <GlassCard glow className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="relative space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-bold tracking-tight">
                  Send a Message
                </h3>
                <span className="hidden rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300 sm:inline-flex">
                  Replies within 24h
                </span>
              </div>

              {/* Quick choice chips */}
              <ChoiceChips
                options={TOPICS}
                value={activeTopic}
                onChange={pickTopic}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FloatingField label="Your Name" required value={form.name} onChange={upd("name")} autoComplete="name" />
                <FloatingField label="Email Address" type="email" required value={form.email} onChange={upd("email")} autoComplete="email" />
              </div>

              <FloatingField
                ref={subjectRef}
                label="Subject / Project Type"
                value={form.subject}
                onChange={upd("subject")}
              />

              <FloatingField
                as="textarea"
                label="Message"
                required
                value={form.message}
                onChange={upd("message")}
                placeholder="Tell me about your project, timeline, and goals..."
              />

              {status === "sent" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300"
                >
                  <Check className="h-4 w-4" /> Thanks! Your message was sent
                  successfully.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300"
                >
                  {error || "Something went wrong. Please try again."}
                </motion.div>
              )}

              {/* Submit button */}
              <ShineButton
                type="submit"
                block
                loading={status === "sending"}
                className="sm:w-full"
                rightIcon={FaArrowRight}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </ShineButton>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  );
}
