import { AppInput } from "../ui/app-input.jsx";
import { AppTextarea } from "../ui/app-textarea.jsx";
import { Label } from "../ui/label.jsx";
import { RadioGroup, RadioGroupItem } from "../ui/radio.jsx";
import { cn } from "../../lib/utils.js";

export function Field({ label, children, hint, required, className }) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextInput({ ...props }) {
  return <AppInput {...props} />;
}

export function TextArea({ ...props }) {
  return <AppTextarea {...props} />;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="cursor-pointer">{label}</Label>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}

export function RadioField({ label, value, onChange, options, className }) {
  const normalized = !value ? options?.[0]?.value ?? "" : String(value);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label>{label}</Label>}
      <RadioGroup
        value={normalized}
        onValueChange={(v) => onChange(v === "true" ? true : v === "false" ? false : v)}
        className="grid gap-2"
      >
        {(options ?? []).map((opt) => {
          const active = normalized === String(opt.value);
          return (
            <label
              key={String(opt.value)}
              htmlFor={`${label}-${opt.value}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all select-none",
                active
                  ? "border-primary/60 bg-primary/10 shadow-sm"
                  : "border-border hover:border-primary/40 hover:bg-muted/60"
              )}
            >
              <RadioGroupItem id={`${label}-${opt.value}`} value={String(opt.value)} />
              <span className="text-sm font-medium leading-tight">
                {opt.label}
                {opt.description && (
                  <span className="block text-xs font-normal text-muted-foreground">{opt.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export function StatusToggle({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      className="toggle toggle-success toggle-sm"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label="toggle status"
    />
  );
}
