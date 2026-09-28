import { NavLink, useLocation } from "react-router";
import { useAdminStats } from "../../hooks/useAdmin.js";
import { useSiteSettings } from "../../hooks/usePortfolio.js";
import { NAV_GROUPS } from "./AdminNav.js";
import Icon from "../ui/Icon.jsx";
import { cn } from "../../lib/utils.js";
import { Avatar, AvatarFallback } from "../ui/avatar.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar.jsx";

function UnreadBadge() {
  const { data } = useAdminStats();
  const unread = data?.stats?.unreadMessages ?? 0;
  if (!unread) return null;
  return (
    <SidebarMenuBadge className="bg-brand-600 text-white dark:bg-brand-400 dark:text-ink">
      {unread > 99 ? "99+" : unread}
    </SidebarMenuBadge>
  );
}

function BrandHeader() {
  const { data: settings } = useSiteSettings();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const name = settings?.name || settings?.title || "Portfolio";
  const initial = name?.trim()?.[0]?.toUpperCase() || "P";

  return (
    <SidebarHeader className="border-b border-sidebar-border p-0">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            asChild
            tooltip={collapsed ? name : undefined}
            className="gap-3 hover:bg-transparent data-[active=true]:bg-transparent"
          >
            <div className="cursor-default">
              <Avatar
                size={collapsed ? "sm" : "lg"}
                className="rounded-full ml-2"
              >
                <AvatarFallback className="rounded-lg bg-brand-600 text-sm font-bold text-white dark:bg-brand-400 dark:text-ink">
                  {initial}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    {name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin panel
                  </span>
                </div>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function isItemActive(item, pathname) {
  return item.end ? pathname === item.to : pathname.startsWith(item.to);
}

function NavContent() {
  const { pathname } = useLocation();
  return (
    <SidebarContent className="pt-2">
      {NAV_GROUPS.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = isItemActive(item, pathname);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <NavLink to={item.to} end={item.end}>
                        <Icon
                          name={item.icon}
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active
                              ? "text-sidebar-accent-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                        <span>{item.label}</span>
                        {item.to === "/admin/messages" && <UnreadBadge />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

function SidebarFooterContent() {
  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="View live site">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Icon
                name="FaExternalLinkAlt"
                className="h-4 w-4 shrink-0 text-muted-foreground"
              />
              <span>View live site</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export default function AdminSidebar() {
  return (
    <>
      <Sidebar collapsible="icon">
        <BrandHeader />
        <NavContent />
        <SidebarFooterContent />
        <SidebarRail />
      </Sidebar>
    </>
  );
}
