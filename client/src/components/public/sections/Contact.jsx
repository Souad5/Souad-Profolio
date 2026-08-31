import { motion } from "framer-motion";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useSiteSettings } from "../../../hooks/usePortfolio.js";
import { submitContact } from "../../../api/endpoints.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function Contact() {
  const { data: settings } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'
  const [error, setError] = useState("");

  const upd = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

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
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <Section name="contact" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Contact" title="Get in Touch" subtitle="Have a project in mind or just want to say hi? Drop a message." />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Contact info */}
        <div className="space-y-4">
          {settings && (
            <>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-brand-500 dark:border-slate-800">
                  <FaEnvelope className="text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-xs text-ink-muted">Email</p>
                    <p className="font-medium">{settings.email}</p>
                  </div>
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-brand-500 dark:border-slate-800">
                  <FaPhoneAlt className="text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-xs text-ink-muted">Phone</p>
                    <p className="font-medium">{settings.phone}</p>
                  </div>
                </a>
              )}
              {settings.location && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <Icon name="FaMapMarkerAlt" className="text-brand-600 dark:text-brand-400" />
                  <div>
                    <p className="text-xs text-ink-muted">Location</p>
                    <p className="font-medium">{settings.location}</p>
                  </div>
                </div>
              )}
            </>
          )}
          {settings?.socialLinks?.length > 0 && (
            <div className="flex gap-2 pt-2">
              {settings.socialLinks.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="rounded-lg border border-slate-200 p-2.5 text-ink-muted transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:text-slate-400">
                  <Icon name={s.icon} className="text-lg" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Name</span>
              <input required value={form.name} onChange={upd("name")} className="w-full rounded-lg border border-slate-300 bg-surface px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input required type="email" value={form.email} onChange={upd("email")} className="w-full rounded-lg border border-slate-300 bg-surface px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Subject</span>
            <input value={form.subject} onChange={upd("subject")} className="w-full rounded-lg border border-slate-300 bg-surface px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Message</span>
            <textarea required rows="5" value={form.message} onChange={upd("message")} className="w-full resize-none rounded-lg border border-slate-300 bg-surface px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900" />
          </label>

          {status === "sent" && (
            <div className="rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
              Thanks! Your message was sent.
            </div>
          )}
          {status === "error" && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
        </motion.form>
      </div>
    </Section>
  );
}
