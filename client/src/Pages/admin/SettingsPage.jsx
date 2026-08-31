import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi, fetchSections } from "../../api/endpoints.js";
import { LoadingState, ErrorState } from "../../components/admin/States.jsx";
import { Field, TextInput, TextArea } from "../../components/admin/FormFields.jsx";
import ImageInput from "../../components/admin/ImageInput.jsx";
import { useToast } from "../../lib/toast.jsx";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

const TABS = [
  { id: "general", label: "General" },
  { id: "hero", label: "Hero" },
  { id: "seo", label: "SEO" },
  { id: "social", label: "Social Links" },
  { id: "sections", label: "Sections" },
];

export default function SettingsPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const [tab, setTab] = useState("general");
  const [form, setForm] = useState(null);
  const [socials, setSocials] = useState([]);
  const [sections, setSections] = useState([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: adminApi.siteSettings.get,
    select: (res) => res?.data,
  });

  useEffect(() => {
    if (data) {
      setForm({ ...data });
      setSocials(data.socialLinks ?? []);
    }
  }, [data]);

  useEffect(() => {
    fetchSections().then((res) => setSections(res?.data ?? [])).catch(() => {});
  }, []);

  const saveMut = useMutation({ mutationFn: (payload) => adminApi.siteSettings.update(payload) });

  const upd = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  async function save() {
    try {
      const EXCLUDED = new Set(["id", "createdAt", "updatedAt", "socialLinks"]);
      const payload = {};
      for (const [k, v] of Object.entries(form || {})) {
        if (!EXCLUDED.has(k) && v !== undefined && v !== null) payload[k] = v;
      }
      await saveMut.mutateAsync(payload);
      toast.success("Settings saved");
      await qc.invalidateQueries({ queryKey: ["settings"] });
      await qc.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  }

  async function addSocial() {
    try {
      const created = (await adminApi.siteSettings.addSocial({ label: "New Link", url: "https://", icon: "FaExternalLinkAlt", order: socials.length, enabled: true })).data;
      setSocials((prev) => [...prev, created]);
      toast.success("Link added");
      await qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err.message || "Failed to add");
    }
  }

  async function updateSocial(social, patch) {
    const next = socials.map((s) => (s.id === social.id ? { ...s, ...patch } : s));
    setSocials(next);
    try {
      await adminApi.siteSettings.updateSocial(social.id, patch);
      await qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (err) {
      toast.error(err.message || "Failed to update");
      setSocials(socials);
    }
  }

  async function removeSocial(social) {
    setSocials((prev) => prev.filter((s) => s.id !== social.id));
    try {
      await adminApi.siteSettings.deleteSocial(social.id);
      await qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Link removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove");
      setSocials((prev) => [...prev, social]);
    }
  }

  async function toggleSection(section) {
    const next = sections.map((s) => (s.id === section.id ? { ...s, enabled: !s.enabled } : s));
    setSections(next);
    try {
      await adminApi.sections.update(section.id, { enabled: !section.enabled });
      await qc.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Section updated");
    } catch (err) {
      toast.error(err.message || "Failed to update");
      setSections(sections);
    }
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState retry={refetch} />;
  if (!form) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-sm opacity-70">Changes reflect on the public site instantly</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-primary" onClick={refetch}>Reload</button>
          <button className="btn btn-primary" onClick={save} disabled={saveMut.isPending}>
            <FaSave /> {saveMut.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div role="tablist" className="tabs tabs-boxed flex-wrap">
        {TABS.map((t) => (
          <button key={t.id} role="tab" className={`tab ${tab === t.id ? "tab-active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name"><TextInput value={form.name} onChange={(e) => upd("name", e.target.value)} /></Field>
              <Field label="Professional Title"><TextInput value={form.title} onChange={(e) => upd("title", e.target.value)} /></Field>
              <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} /></Field>
              <Field label="Phone"><TextInput value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></Field>
              <Field label="Location"><TextInput value={form.location} onChange={(e) => upd("location", e.target.value)} /></Field>
              <Field label="Availability"><TextInput value={form.availability} onChange={(e) => upd("availability", e.target.value)} /></Field>
              <Field label="Resume URL"><TextInput value={form.resumeUrl} onChange={(e) => upd("resumeUrl", e.target.value)} placeholder="https://…" /></Field>
            </div>
            <Field label="Short Bio"><TextArea rows={3} value={form.shortBio} onChange={(e) => upd("shortBio", e.target.value)} /></Field>
            <ImageInput label="Profile Image" value={form.profileImage} onChange={(v) => upd("profileImage", v)} />
          </div>
        </div>
      )}

      {tab === "hero" && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title">Hero Section</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Greeting"><TextInput value={form.heroGreeting} onChange={(e) => upd("heroGreeting", e.target.value)} /></Field>
              <Field label="Highlight (accent name)"><TextInput value={form.heroHighlight} onChange={(e) => upd("heroHighlight", e.target.value)} /></Field>
              <Field label="Heading (full name)"><TextInput value={form.heroHeading} onChange={(e) => upd("heroHeading", e.target.value)} /></Field>
              <Field label="Subtitle"><TextInput value={form.heroSubtitle} onChange={(e) => upd("heroSubtitle", e.target.value)} /></Field>
              <Field label="Primary CTA"><TextInput value={form.heroPrimaryCta} onChange={(e) => upd("heroPrimaryCta", e.target.value)} /></Field>
              <Field label="Secondary CTA"><TextInput value={form.heroSecondaryCta} onChange={(e) => upd("heroSecondaryCta", e.target.value)} /></Field>
            </div>
            <Field label="Description"><TextArea rows={3} value={form.heroDescription} onChange={(e) => upd("heroDescription", e.target.value)} /></Field>
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span>Enable Hero Section</span>
              <input type="checkbox" className="toggle toggle-primary" checked={!!form.heroEnabled} onChange={(e) => upd("heroEnabled", e.target.checked)} />
            </label>
          </div>
        </div>
      )}

      {tab === "seo" && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title">SEO Settings</h2>
            <p className="text-xs opacity-70">This is a client-rendered SPA; the SEO values below are applied as meta tags at runtime. For full static SEO, server-side rendering would be required.</p>
            <Field label="Title"><TextInput value={form.seoTitle} onChange={(e) => upd("seoTitle", e.target.value)} /></Field>
            <Field label="Description"><TextArea rows={2} value={form.seoDescription} onChange={(e) => upd("seoDescription", e.target.value)} /></Field>
            <Field label="Keywords"><TextInput value={form.seoKeywords} onChange={(e) => upd("seoKeywords", e.target.value)} /></Field>
            <Field label="Author"><TextInput value={form.seoAuthor} onChange={(e) => upd("seoAuthor", e.target.value)} /></Field>
            <Field label="Canonical URL"><TextInput value={form.seoCanonicalUrl} onChange={(e) => upd("seoCanonicalUrl", e.target.value)} placeholder="https://…" /></Field>
            <ImageInput label="Open Graph Image" value={form.seoOgImage} onChange={(v) => upd("seoOgImage", v)} />
          </div>
        </div>
      )}

      {tab === "social" && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Social Links</h2>
              <button className="btn btn-primary btn-sm" onClick={addSocial}><FaPlus /> Add</button>
            </div>
            {socials.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row gap-2 items-end border border-base-300 rounded-lg p-3">
                <div className="grid sm:grid-cols-2 gap-2 flex-1">
                  <Field label="Label"><TextInput value={s.label} onChange={(e) => updateSocial(s, { label: e.target.value })} /></Field>
                  <Field label="URL"><TextInput value={s.url} onChange={(e) => updateSocial(s, { url: e.target.value })} /></Field>
                  <Field label="Icon"><TextInput value={s.icon} onChange={(e) => updateSocial(s, { icon: e.target.value })} hint="react-icons name" /></Field>
                  <Field label="Order"><TextInput type="number" value={s.order} onChange={(e) => updateSocial(s, { order: Number(e.target.value) })} /></Field>
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <label className="label cursor-pointer"><input type="checkbox" className="toggle toggle-sm toggle-primary" checked={!!s.enabled} onChange={(e) => updateSocial(s, { enabled: e.target.checked })} /></label>
                  <button className="btn btn-ghost btn-sm text-error" onClick={() => removeSocial(s)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "sections" && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-3">
            <h2 className="card-title">Section Visibility</h2>
            <p className="text-xs opacity-70">Toggle which sections render on the public portfolio</p>
            {sections.map((s) => (
              <div key={s.id} className="flex items-center justify-between border border-base-300 rounded-lg p-3">
                <div>
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs opacity-60 ml-2">order: {s.order}</span>
                </div>
                <input type="checkbox" className="toggle toggle-primary" checked={!!s.enabled} onChange={() => toggleSection(s)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
