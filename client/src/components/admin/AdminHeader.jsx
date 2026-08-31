import { Link, useLocation, useNavigate } from "react-router";
import { ExternalLink, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePreferences, THEME_OPTIONS } from "../../hooks/usePreferences.js";
import Icon from "../ui/Icon.jsx";
import { titleFromPath } from "./AdminNav.js";
import NotificationsBell from "./NotificationsBell.jsx";
import { initials } from "../../lib/utils.js";
import { Button } from "../ui/button.jsx";
import { Separator } from "../ui/separator.jsx";
import { Avatar, AvatarFallback } from "../ui/avatar.jsx";
import {
  SidebarTrigger,
} from "../ui/sidebar.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

const THEME_ICONS = { light: "FaSun", dark: "FaMoon", system: "FaLaptop" };
const THEME_LABELS = { light: "Light", dark: "Dark", system: "System" };

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const { prefs, update } = usePreferences();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left: sidebar toggle + page title */}
      <SidebarTrigger className="lg:-ml-1" />
      <Separator orientation="vertical" className="hidden h-5 sm:block" />
      <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {titleFromPath(location.pathname)}
      </h1>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {/* Open the live site in a new tab */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="text-muted-foreground hover:text-foreground"
          aria-label="Open live site"
        >
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink />
          </a>
        </Button>

        {/* Notifications */}
        <NotificationsBell />

        <Separator orientation="vertical" className="hidden h-5 sm:block" />

        {/* Admin user menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 px-1.5"
              aria-label="Account menu"
            >
              <Avatar className="size-7">
                <AvatarFallback className="bg-brand-600 text-xs font-semibold text-white dark:bg-brand-400 dark:text-ink">
                  {initials(user?.name || user?.email || "A")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-36 truncate text-sm font-medium sm:block">
                {user?.name || user?.email || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="px-2 py-1.5">
              <span className="block truncate text-sm font-medium text-foreground">
                {user?.name || "Admin"}
              </span>
              {user?.email && (
                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/">Back to portfolio</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <a href="/" target="_blank" rel="noopener noreferrer">
                View live site
                <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="px-2 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Admin theme
              </span>
            </DropdownMenuLabel>
            {THEME_OPTIONS.map((t) => (
              <DropdownMenuItem
                key={t}
                variant="default"
                className="cursor-pointer"
                onSelect={() => update({ theme: t })}
              >
                <Icon name={THEME_ICONS[t]} className="h-4 w-4" />
                {THEME_LABELS[t]}
                {prefs.theme === t && (
                  <span className="ml-auto text-xs text-brand-600 dark:text-brand-400">✓</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onSelect={handleLogout}
            >
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
