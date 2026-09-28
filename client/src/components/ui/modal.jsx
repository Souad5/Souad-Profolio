import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Modal({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay */}
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>

            {/* Panel */}
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                role="dialog"
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-2xl outline-none",
                  className,
                )}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {showCloseButton && (
                  <DialogPrimitive.Close asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-3 top-3 z-10"
                      aria-label="Close"
                    >
                      <XIcon />
                    </Button>
                  </DialogPrimitive.Close>
                )}

                {(title || description) && (
                  <div className="sr-only">
                    {title && (
                      <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description>
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                )}

                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

export default Modal
export { Modal }
