import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Floating-label form field (input or textarea).
 *
 * The visible label rests inside the field while empty and floats up to the top
 * when focused or filled. Pass an optional `icon` component (e.g. lucide icon)
 * to render a leading icon. Supports `as="textarea"`.
 *
 * All standard input/textarea props (value, onChange, required, ...) and refs
 * pass through to the underlying control.
 */
const FloatingField = React.forwardRef(function FloatingField(
  { label, icon: IconCmp, as = "input", className, ...props },
  ref,
) {
  const id = React.useId()

  const shared = cn(
    "peer w-full rounded-xl border border-slate-200 bg-white/60 px-4 pb-2.5 pt-6 text-[15px] text-ink outline-none transition-all duration-200 placeholder-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100 dark:focus:border-brand-400",
    className,
  )

  return (
    <div className="relative">
      {IconCmp && (
        <IconCmp
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-brand-500 dark:text-slate-500"
        />
      )}
      {as === "textarea" ? (
        <textarea
          id={id}
          ref={ref}
          rows={5}
          placeholder={label}
          className={cn(shared, "resize-none")}
          {...props}
        />
      ) : (
        <input id={id} ref={ref} placeholder={label} className={shared} {...props} />
      )}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 top-2 text-xs font-medium text-slate-400 transition-all duration-200",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-slate-400",
          "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:text-brand-500",
          "dark:text-slate-500 dark:peer-focus:text-brand-400",
        )}
      >
        {label}
      </label>
    </div>
  )
})

FloatingField.displayName = "FloatingField"

export { FloatingField }
