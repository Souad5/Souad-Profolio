import { cn } from "@/lib/utils"

const VARIANTS = {
  // Neutral outline chip on light/dark surfaces (Experience, lists).
  outline:
    "border border-slate-200 bg-slate-50 px-2.5 py-1 text-ink-muted dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  // Tinted brand chip (project detail modal).
  brand:
    "bg-brand-600/10 px-3 py-1.5 font-medium text-brand-600 dark:bg-brand-400/10 dark:text-brand-400",
  // Frosted chip for always-dark surfaces (project deck cards).
  glass: "border border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur-sm",
}

/**
 * List of technology tags. Renders nothing for an empty list.
 *
 * @param {object} props
 * @param {string[]} [props.items=[]] Tag labels (falsy entries are skipped).
 * @param {"outline"|"brand"|"glass"} [props.variant="outline"]
 * @param {number} [props.max] Show at most this many, then a "+N" chip.
 * @param {string} [props.label="Technologies"] Accessible name of the list.
 * @param {string} [props.className] Classes for the list element.
 * @param {string} [props.chipClassName] Extra classes for each chip.
 */
function TechChips({
  items = [],
  variant = "outline",
  max,
  label = "Technologies",
  className,
  chipClassName,
}) {
  const list = (Array.isArray(items) ? items : []).filter(Boolean)
  if (!list.length) return null
  const shown = max ? list.slice(0, max) : list
  const extra = list.length - shown.length
  const chip = cn("rounded-full text-xs", VARIANTS[variant] ?? VARIANTS.outline, chipClassName)

  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {shown.map((t, i) => (
        <li key={`${t}-${i}`} className={chip}>
          {t}
        </li>
      ))}
      {extra > 0 && (
        <li className={chip} aria-label={`${extra} more`}>
          +{extra}
        </li>
      )}
    </ul>
  )
}

export { TechChips }
