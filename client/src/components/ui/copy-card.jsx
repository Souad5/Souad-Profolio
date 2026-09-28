import * as React from "react"
import { motion } from "framer-motion"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import Icon from "./Icon.jsx"

/**
 * Reusable click-to-copy card.
 *
 * Renders a glass card showing a label + value. Clicking copies `value` to the
 * clipboard and reveals a transient "Copied!" badge. Optionally provide `href`
 * to expose a small external/open action that appears on hover.
 */
const CopyCard = React.forwardRef(function CopyCard(
  {
    icon,
    label,
    value,
    href,
    mono = false,
    delay = 0,
    className,
    onCopied,
  },
  ref,
) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef(null)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const handleCopy = async () => {
    if (copied) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    onCopied?.(value, label)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={cn("group relative", className)}
    >
      <button
        type="button"
        onClick={handleCopy}
        title={`Copy ${value}`}
        className="relative flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/60 hover:shadow-lg hover:shadow-brand-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-brand-400/40"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-600 transition-transform duration-300 group-hover:scale-110 dark:text-brand-400">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted dark:text-slate-500">
            {label}
          </p>
          <p
            className={cn(
              "mt-0.5 truncate text-sm font-semibold text-ink dark:text-slate-200",
              mono && "font-mono",
            )}
          >
            {value}
          </p>
        </div>

        <span
          className={cn(
            "absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200",
            copied
              ? "translate-x-0 scale-100 bg-emerald-500 text-white opacity-100"
              : "pointer-events-none translate-x-2 scale-90 bg-slate-200 text-slate-700 opacity-0 dark:bg-slate-700 dark:text-slate-200",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </span>
      </button>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={`Open ${label}`}
          className="absolute bottom-2 right-3 flex h-6 w-6 items-center justify-center text-sm text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-brand-500"
        >
          <Icon name="FaExternalLinkAlt" className="!h-3 !w-3" />
        </a>
      ) : null}
    </motion.div>
  )
})

CopyCard.displayName = "CopyCard"

export { CopyCard }
