import { AppInput } from "../ui/app-input.jsx";

export default function ImageInput({
  label,
  value,
  onChange,
  placeholder = "/image.png",
}) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">
        {label} (image URL)
      </span>
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-xs text-muted-foreground">
          {value ? (
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span>none</span>
          )}
        </div>
        <AppInput
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
