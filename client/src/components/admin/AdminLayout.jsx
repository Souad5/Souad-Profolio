import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminHeader from "./AdminHeader.jsx";
import { SidebarInset, SidebarProvider } from "../ui/sidebar.jsx";
import { TooltipProvider } from "../ui/tooltip.jsx";
import { usePreferences } from "../../hooks/usePreferences.js";
import { cn } from "../../lib/utils.js";

export default function AdminLayout() {
  const { prefs, resolvedTheme, update } = usePreferences();
  const rootRef = useRef(null);

  // Apply scoped admin theme + font size to the admin subtree only. The
  // attributes drive the shadcn/daisyUI tokens (see index.css) so the
  // public site's <html> theme is never modified by admin preferences.
  useEffect(() => {
    // Clean up any placeholder attributes the FOUC-prevention script may have
    // set on <html> for the initial admin paint.
    const html = document.documentElement;
    html.removeAttribute("data-admin-theme");
    html.removeAttribute("data-admin-font-scale");

    const el = rootRef.current;
    if (!el) return;
    el.setAttribute("data-admin-theme", resolvedTheme);
    el.setAttribute("data-admin-font-scale", prefs.fontScale);
    el.classList.toggle("dark", resolvedTheme === "dark");
    el.classList.toggle("reduce-motion", !!prefs.reduceMotion);
  }, [resolvedTheme, prefs.fontScale, prefs.reduceMotion]);

  return (
    <div
      ref={rootRef}
      data-admin-theme={resolvedTheme}
      data-admin-font-scale={prefs.fontScale}
      className={cn("min-h-svh", resolvedTheme === "dark" && "dark")}
    >
      <TooltipProvider>
        <SidebarProvider
          open={!prefs.sidebarCollapsed}
          onOpenChange={(open) => update({ sidebarCollapsed: open === false })}
        >
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-7xl space-y-6">
                <Outlet />
              </div>
            </main>
            <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
              Portfolio CMS · Changes on the public site update instantly
            </footer>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
