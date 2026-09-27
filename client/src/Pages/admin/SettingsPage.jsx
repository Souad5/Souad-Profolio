import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi, fetchSections } from "../../api/endpoints.js";
import { LoadingState, ErrorState } from "../../components/admin/States.jsx";
import { Field, TextInput, TextArea } from "../../components/admin/FormFields.jsx";
import ImageInput from "../../components/admin/ImageInput.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import { useToast } from "../../lib/toast.jsx";
import { AppButton } from "../../components/ui/app-button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";
import { cn } from "../../lib/utils.js";
import { Switch } from "../../components/ui/switch.jsx";

function TagEditor({ value = [], onChange }) {
  const [draft, setDraft] = useState("");
  const tags = Array.isArray(value) ? value : [];

  function add() {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft("");
  }

  function remove(tag) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="text-muted-foreground transition hover:text-error"
              aria-label={`Remove ${tag}`}
            >
              <FaTrash className="h-3 w-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-xs text-muted-foreground">No tags yet — add some below.</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder="Add a tag…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <AppButton type="button" variant="outline" size="sm" onClick={add}>
          <FaPlus /> Add
        </AppButton>
      </div>
      <p className="text-xs text-muted-foreground">
        Shown as the scrolling strip above the navbar. Press Enter to add.
      </p>
    </div>
  );
}

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

  // Unsaved edits in the settings form. Refetches (e.g. after saving a social
  // link) must not overwrite them, so the form only re-syncs when clean.
  const dirtyRef = useRef(false);
  useEffect(() => {
    if (data) {
      if (!dirtyRef.current) setForm({ ...data });
      setSocials(data.socialLinks ?? []);
    }
  }, [data]);

  useEffect(() => {
    fetchSections().then((res) => setSections(res?.data ?? [])).catch(() => {});
  }, []);

  const saveMut = useMutation({ mutationFn: (payload) => adminApi.siteSettings.update(payload) });

  const upd = (key, val) => {
    dirtyRef.current = true;
    setForm((prev) => ({ ...prev, [key]: val }));
  };
  const [removingSocial, setRemovingSocial] = useState(null);

  // Admin form + the public site's settings/SEO caches (socials, hero, meta tags).
  const refreshSettingsCaches = () =>
    Promise.all(
      [["settings"], ["site-settings"], ["seo"]].map((queryKey) => qc.invalidateQueries({ queryKey }))
    );

  async function save() {
    try {
      const EXCLUDED = new Set(["id", "createdAt", "updatedAt", "socialLinks"]);
      const payload = {};
      for (const [k, v] of Object.entries(form || {})) {
        if (!EXCLUDED.has(k) && v !== undefined && v !== null) payload[k] = v;
      }
      await saveMut.mutateAsync(payload);
      dirtyRef.current = false;
      toast.success("Settings saved");
      await refreshSettingsCaches();
    } catch (err) {
      toast.error(err.message || "Failed to save");
    }
  }

  async function addSocial() {
    try {
      const created = (await adminApi.siteSettings.addSocial({ label: "New Link", url: "https://example.com", icon: "FaExternalLinkAlt", order: socials.length, enabled: false })).data;
      setSocials((prev) => [...prev, created]);
      toast.success("Link added");
      await refreshSettingsCaches();
    } catch (err) {
      toast.error(err.message || "Failed to add");
    }
  }

  // Typing only updates local state; the change is saved when the field loses
  // focus (or a toggle flips). Saving per keystroke used to send half-typed
  // URLs, which the server rejects — and the revert then fought the typing.
  function editSocial(id, patch) {
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function persistSocial(id, patch) {
    const saved = data?.socialLinks?.find((s) => s.id === id);
    if (saved && Object.entries(patch).every(([k, v]) => saved[k] === v)) return; // unchanged
    try {
      await adminApi.siteSettings.updateSocial(id, patch);
      toast.success("Link saved");
      await refreshSettingsCaches();
    } catch (err) {
      toast.error(err.message || "Failed to update");
      if (saved) editSocial(id, saved); // restore the last saved values
    }
  }

  async function removeSocial() {
    const social = removingSocial;
    if (!social) return;
    try {
      await adminApi.siteSettings.deleteSocial(social.id);
      setSocials((prev) => prev.filter((s) => s.id !== social.id));
      setRemovingSocial(null);
      toast.success("Link removed");
      await refreshSettingsCaches();
    } catch (err) {
      toast.error(err.message || "Failed to remove");
    }
  }

  async function toggleSection(section) {
    const next = sections.map((s) => (s.id === section.id ? { ...s, enabled: !s.enabled } : s));
    setSections(next);
    try {
      await adminApi.sections.update(section.id, { enabled: !section.enabled });
      await qc.invalidateQueries({ queryKey: ["sections"] });
      await qc.invalidateQueries({ queryKey: ["navigation"] });
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Site Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Changes reflect on the public site instantly
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AppButton variant="outline" onClick={refetch}>
            Reload
          </AppButton>
          <AppButton onClick={save} disabled={saveMut.isPending}>
            <FaSave /> {saveMut.isPending ? "Saving…" : "Save Changes"}
          </AppButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
        {TABS.map((t) => (
          <AppButton
            key={t.id}
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 justify-center",
              tab === t.id
                ? "bg-card text-foreground shadow-sm"
                : "text-ink-muted hover:text-ink",
            )}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </AppButton>
        ))}
      </div>

      {tab === "general" && (
        <Card className="ring-border">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><TextInput value={form.name} onChange={(e) => upd("name", e.target.value)} /></Field>
            <Field label="Professional Title"><TextInput value={form.title} onChange={(e) => upd("title", e.target.value)} /></Field>
            <Field label="Email"><TextInput type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} /></Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></Field>
            <Field label="Location"><TextInput value={form.location} onChange={(e) => upd("location", e.target.value)} /></Field>
            <Field label="Availability"><TextInput value={form.availability} onChange={(e) => upd("availability", e.target.value)} /></Field>
            <Field label="Resume URL"><TextInput value={form.resumeUrl} onChange={(e) => upd("resumeUrl", e.target.value)} placeholder="https://…" /></Field>
            <Field label="Short Bio" className="md:col-span-2"><TextArea rows={3} value={form.shortBio} onChange={(e) => upd("shortBio", e.target.value)} /></Field>
            <div className="md:col-span-2">
              <ImageInput label="Profile Image" value={form.profileImage} onChange={(v) => upd("profileImage", v)} />
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "hero" && (
        <Card className="ring-border">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Greeting"><TextInput value={form.heroGreeting} onChange={(e) => upd("heroGreeting", e.target.value)} /></Field>
            <Field label="Highlight (accent name)"><TextInput value={form.heroHighlight} onChange={(e) => upd("heroHighlight", e.target.value)} /></Field>
            <Field label="Heading (full name)"><TextInput value={form.heroHeading} onChange={(e) => upd("heroHeading", e.target.value)} /></Field>
            <Field label="Subtitle"><TextInput value={form.heroSubtitle} onChange={(e) => upd("heroSubtitle", e.target.value)} /></Field>
            <Field label="Primary CTA"><TextInput value={form.heroPrimaryCta} onChange={(e) => upd("heroPrimaryCta", e.target.value)} /></Field>
            <Field label="Secondary CTA"><TextInput value={form.heroSecondaryCta} onChange={(e) => upd("heroSecondaryCta", e.target.value)} /></Field>
            <Field label="Description" className="md:col-span-2"><TextArea rows={3} value={form.heroDescription} onChange={(e) => upd("heroDescription", e.target.value)} /></Field>
            <Field label="Marquee Tags" className="md:col-span-2"><TagEditor value={form.heroTags} onChange={(v) => upd("heroTags", v)} /></Field>
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <span id="hero-enabled-label" className="text-sm font-medium">Enable Hero Section</span>
              <Switch aria-labelledby="hero-enabled-label" checked={!!form.heroEnabled} onCheckedChange={(v) => upd("heroEnabled", !!v)} />
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "seo" && (
        <Card className="ring-border">
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              This is a client-rendered SPA; the SEO values below are applied as meta tags at runtime. For full static SEO, server-side rendering would be required.
            </p>
            <Field label="Title"><TextInput value={form.seoTitle} onChange={(e) => upd("seoTitle", e.target.value)} /></Field>
            <Field label="Description"><TextArea rows={2} value={form.seoDescription} onChange={(e) => upd("seoDescription", e.target.value)} /></Field>
            <Field label="Keywords"><TextInput value={form.seoKeywords} onChange={(e) => upd("seoKeywords", e.target.value)} /></Field>
            <Field label="Author"><TextInput value={form.seoAuthor} onChange={(e) => upd("seoAuthor", e.target.value)} /></Field>
            <Field label="Canonical URL"><TextInput value={form.seoCanonicalUrl} onChange={(e) => upd("seoCanonicalUrl", e.target.value)} placeholder="https://…" /></Field>
            <ImageInput label="Open Graph Image" value={form.seoOgImage} onChange={(v) => upd("seoOgImage", v)} />
          </CardContent>
        </Card>
      )}

      {tab === "social" && (
        <Card className="ring-border">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Social Links</CardTitle>
            <AppButton size="sm" onClick={addSocial}><FaPlus /> Add</AppButton>
          </CardHeader>
          <CardContent className="space-y-3">
            {socials.map((s) => (
              <div key={s.id} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-end">
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <Field label="Label"><TextInput value={s.label} onChange={(e) => editSocial(s.id, { label: e.target.value })} onBlur={(e) => persistSocial(s.id, { label: e.target.value.trim() })} /></Field>
                  <Field label="URL"><TextInput type="url" inputMode="url" placeholder="https://" value={s.url} onChange={(e) => editSocial(s.id, { url: e.target.value })} onBlur={(e) => persistSocial(s.id, { url: e.target.value.trim() })} /></Field>
                  <Field label="Icon" hint="react-icons name"><TextInput value={s.icon} onChange={(e) => editSocial(s.id, { icon: e.target.value })} onBlur={(e) => persistSocial(s.id, { icon: e.target.value.trim() })} /></Field>
                  <Field label="Order"><TextInput type="number" min={0} value={s.order} onChange={(e) => editSocial(s.id, { order: e.target.value })} onBlur={(e) => persistSocial(s.id, { order: Number(e.target.value) || 0 })} /></Field>
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    aria-label={`Show ${s.label || "link"} on the site`}
                    checked={!!s.enabled}
                    onCheckedChange={(v) => {
                      editSocial(s.id, { enabled: !!v });
                      persistSocial(s.id, { enabled: !!v });
                    }}
                  />
                  <AppButton variant="ghost" size="sm" className="text-error hover:text-error dark:hover:text-red-400" onClick={() => setRemovingSocial(s)} aria-label={`Remove ${s.label || "link"}`}><FaTrash /></AppButton>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {tab === "sections" && (
        <Card className="ring-border">
          <CardHeader>
            <CardTitle>Section Visibility</CardTitle>
            <CardDescription>
              Toggle which sections render on the public portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">order: {s.order}</span>
                </div>
                <Switch aria-label={`Show the ${s.label} section`} checked={!!s.enabled} onCheckedChange={() => toggleSection(s)} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={!!removingSocial}
        message={`Remove the "${removingSocial?.label || "social"}" link? It will disappear from the portfolio.`}
        onConfirm={removeSocial}
        onCancel={() => setRemovingSocial(null)}
      />
    </div>
  );
}
