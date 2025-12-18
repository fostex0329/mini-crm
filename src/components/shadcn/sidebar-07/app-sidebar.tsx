"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Home,
  ListChecks,
  RefreshCcw,
  Receipt,
} from "lucide-react";

import { useDemoData } from "@/lib/demo-store";
import { toDealViewModel } from "@/lib/view-models";
import { DEMO_TODAY } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/shadcn/sidebar-07/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DemoState, QuickFilterKey } from "@/types/crm";
import { quickFilterDefinitions } from "@/lib/quick-filters";

const navItems = [
  { key: "dashboard", label: "ダッシュボード", href: "/", icon: Home },
  { key: "deals", label: "案件一覧", href: "/deals", icon: ListChecks },
  { key: "invoices", label: "請求", href: "/invoices", icon: Receipt },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, setActiveNav, setQuickFilter, resetDemo } = useDemoData();
  const deals = React.useMemo(
    () => state.deals.map((deal) => toDealViewModel(deal)),
    [state.deals]
  );

  const quickFilters = React.useMemo(
    () =>
      quickFilterDefinitions.map((definition) => ({
        ...definition,
        count: definition.key === "none"
          ? deals.length
          : deals.filter((deal) => definition.predicate(deal)).length,
      })),
    [deals]
  );

  React.useEffect(() => {
    const match = navItems.find((item) => {
      if (item.href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(item.href);
    });
    if (match) {
      setActiveNav(match.key as DemoState["activeNav"]);
    }
  }, [pathname, setActiveNav]);

  const handleNavClick = (key: DemoState["activeNav"]) => {
    setActiveNav(key);
  };

  const handleQuickFilterClick = (key: QuickFilterKey) => {
    setQuickFilter(key);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-orange-500" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Mini CRM
            </p>
            <p className="text-sm font-semibold text-slate-900">案件〜請求</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ナビゲーション</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                state.activeNav === item.key ||
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item.key as typeof state.activeNav)}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Filters</SidebarGroupLabel>
          <SidebarMenu>
            {quickFilters.map((filter) => (
              <SidebarMenuItem key={filter.key}>
                <SidebarMenuButton
                  className={cn(
                    filter.key === state.quickFilter && "bg-slate-900 text-white"
                  )}
                  onClick={() => handleQuickFilterClick(filter.key)}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">{filter.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {filter.description}
                    </span>
                  </div>
                  <span className="ml-auto text-xs font-semibold">
                    {filter.count}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={resetDemo}
        >
          デモをリセット
          <RefreshCcw className="size-3.5" />
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
