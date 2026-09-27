import { useEffect, useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { AppInput } from "../ui/app-input.jsx";
import { cn } from "../../lib/utils.js";

// Mirrors the server's rule for image fields: http(s) URL or a site-relative
// /path (e.g. files in client/public). Protocol-relative "//host" is rejected.
const SAFE_MEDIA = /^(https?:\/\/|\/(?!\/))/i;
const LOAD_TIMEOUT_MS = 10000;

/**
 * Image URL field with a live preview. The preview reports loading, loaded,
 * broken (404 / not an image) and timed-out states so a bad URL is caught
 * before saving. There is no file upload here: images are referenced by URL.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.value]
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.placeholder="/image.png"]
 * @param {string} [props.error] Validation message from the parent form.
 */
export default function ImageInput({ label, value, onChange, placeholder = "/image.png", error }) {
  const url = (value ?? "").trim();
  const formatError = url && !SAFE_MEDIA.test(url) ? "Use an https:// URL or a /path" : "";
  const [status, setStatus] = useState("idle"); // idle | loading | ok | broken | timeout

  useEffect(() => {
    if (!url || formatError) {
      setStatus("idle");
      return undefined;
    }
    setStatus("loading");
    let done = false;
    const img = new Image();
    img.onload = () => {
      done = true;
      setStatus("ok");
    };
    img.onerror = () => {
      done = true;
      setStatus("broken");
    };
    img.src = url;
    const timer = setTimeout(() => !done && setStatus("timeout"), LOAD_TIMEOUT_MS);
    return () => {
      clearTimeout(timer);
      img.onload = img.onerror = null;
    };
  }, [url, formatError]);

  const message =
    error ||
    formatError ||
    (status === "broken" && "Image couldn't be loaded — check the URL") ||
    (status === "timeout" && "Image is taking too long to load") ||
    "";

  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label} (image URL)</span>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted text-xs text-muted-foreground",
            message ? "border-destructive/60" : "border-border"
          )}
          aria-live="polite"
        >
          {status === "ok" && <img src={url} alt="" className="h-full w-full object-cover" />}
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-label="Loading preview" />}
          {(status === "broken" || status === "timeout") && (
            <ImageOff className="h-4 w-4 text-destructive" aria-label="Preview failed" />
          )}
          {status === "idle" && <span>{url ? "—" : "none"}</span>}
        </div>
        <AppInput
          type="text"
          inputMode="url"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!(error || formatError)}
        />
      </div>
      {message ? (
        <p role="alert" className="text-xs font-medium text-destructive">{message}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Paste an image link (https://…) or a path like /photo.jpg</p>
      )}
    </div>
  );
}
