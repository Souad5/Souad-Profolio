import { cn } from "@/lib/utils"

const SIZES = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
}

// `ping` is the expanding halo, `dot` the solid centre.
const TONES = {
  emerald: { ping: "bg-emerald-400", dot: "bg-emerald-500" },
  // Soft variant for dark/photo surfaces where emerald-500 reads too dark.
  "emerald-soft": { ping: "bg-emerald-400", dot: "bg-emerald-400" },
  brand: { ping: "bg-brand-400", dot: "bg-brand-400" },
}

/**
 * Pulsing status dot ("Available for opportunities"). Decorative: pair it
 * with visible text. The halo is hidden for reduced-motion users.
 *
 * @param {object} props
 * @param {"sm"|"md"} [props.size="sm"]
 * @param {"emerald"|"emerald-soft"|"brand"} [props.tone="emerald"]
 * @param {string} [props.className]
 */
function PulseDot({ size = "sm", tone = "emerald", className }) {
  const s = SIZES[size] ?? SIZES.sm
  const t = TONES[tone] ?? TONES.emerald
  return (
    <span aria-hidden="true" className={cn("relative flex shrink-0", s, className)}>
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden",
          t.ping,
        )}
      />
      <span className={cn("relative inline-flex rounded-full", s, t.dot)} />
    </span>
  )
}

export { PulseDot }
