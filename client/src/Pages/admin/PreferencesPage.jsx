import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import {
  usePreferences,
  THEME_OPTIONS,
  FONT_SCALE_OPTIONS,
} from "../../hooks/usePreferences.js";
import Icon from "../../components/ui/Icon.jsx";

const THEME_ICONS = { light: "FaSun", dark: "FaMoon", system: "FaLaptop" };
const THEME_LABELS = { light: "Light", dark: "Dark", system: "System" };

function SettingRow({ title, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function RadioGroup({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <label key={opt.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <span
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.icon && <Icon name={opt.icon} className="h-4 w-4" />}
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle toggle-primary"
        aria-label={label}
      />
    </label>
  );
}

export default function PreferencesPage() {
  const { prefs, update } = usePreferences();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Preferences
        </h1>
        <p className="text-sm text-muted-foreground">
          Admin interface display settings. These only affect the CMS admin
          area, never the public site.
        </p>
      </div>

      <Card className="ring-border/70 shadow-sm">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Choose how the admin panel looks and behaves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow title="Theme" description="Light, dark, or follow your system preference.">
            <RadioGroup
              name="admin-theme"
              value={prefs.theme}
              onChange={(v) => update({ theme: v })}
              options={THEME_OPTIONS.map((t) => ({
                value: t,
                label: THEME_LABELS[t],
                icon: THEME_ICONS[t],
              }))}
            />
          </SettingRow>

          <SettingRow
            title="Text size"
            description="Scale the admin text size (root font-size)."
          >
            <RadioGroup
              name="admin-font-scale"
              value={prefs.fontScale}
              onChange={(v) => update({ fontScale: v })}
              options={FONT_SCALE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </SettingRow>

          <SettingRow
            title="Sidebar default state"
            description="Remember whether the sidebar starts collapsed or expanded."
          >
            <RadioGroup
              name="admin-sidebar"
              value={prefs.sidebarCollapsed ? "collapsed" : "expanded"}
              onChange={(v) => update({ sidebarCollapsed: v === "collapsed" })}
              options={[
                { value: "expanded", label: "Expanded" },
                { value: "collapsed", label: "Collapsed" },
              ]}
            />
          </SettingRow>

          <SettingRow
            title="Table density"
            description="Compact tables show more rows on list pages."
          >
            <RadioGroup
              name="admin-table-density"
              value={prefs.tableDensity}
              onChange={(v) => update({ tableDensity: v })}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
            />
          </SettingRow>

          <SettingRow
            title="Reduce motion"
            description="Minimize animations and transitions in the admin UI."
          >
            <Toggle
              checked={!!prefs.reduceMotion}
              onChange={(v) => update({ reduceMotion: v })}
              label="Reduce motion"
            />
          </SettingRow>
        </CardContent>
      </Card>
    </div>
  );
}
