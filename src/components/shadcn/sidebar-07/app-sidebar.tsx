"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  AlertCircle,
  Clock,
} from "lucide-react";

import { useDemoData } from "@/lib/demo-store";
import { toDealViewModel } from "@/lib/view-models";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar-07/sidebar";
import { Button } from "@/components/yohaku/ui/button"; // Use yohaku button
import { cn } from "@/lib/utils";
import type { DemoState, QuickFilterKey } from "@/types/crm";
import { quickFilterDefinitions } from "@/lib/quick-filters";

const navItems = [
  { key: "dashboard", label: "ダッシュボード", href: "/", icon: LayoutDashboard },
  { key: "deals", label: "案件一覧", href: "/deals", icon: Briefcase },
  { key: "invoices", label: "請求一覧", href: "/invoices", icon: FileText },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setActiveNav, setQuickFilter, resetDemo } = useDemoData();

  // Calculate quick filter counts
  const deals = React.useMemo(
    () => state.deals.map((deal) => toDealViewModel(deal)),
    [state.deals]
  );

  const quickFilters = React.useMemo(() => {
    return [
      {
        key: 'overdue' as QuickFilterKey,
        label: '未入金（遅延）',
        icon: AlertCircle,
        badgeColor: 'bg-red-100 text-red-700',
        count: deals.filter(d => quickFilterDefinitions.find(q => q.key === 'overdue')?.predicate(d)).length
      },
      {
        key: 'due_soon' as QuickFilterKey,
        label: '入金期限まもなく',
        icon: Clock,
        badgeColor: 'bg-red-100 text-red-700',
        count: deals.filter(d => quickFilterDefinitions.find(q => q.key === 'due_soon')?.predicate(d)).length
      },
      {
        key: 'unbilled_this_month' as QuickFilterKey,
        label: '今月：未請求',
        icon: FileText,
        badgeColor: 'bg-red-100 text-red-700',
        count: deals.filter(d => quickFilterDefinitions.find(q => q.key === 'unbilled_this_month')?.predicate(d)).length
      }
    ];
  }, [deals]);


  // Active Nav Logic
  React.useEffect(() => {
    const match = navItems.find((item) => {
      if (item.href === "/") return pathname === "/";
      return pathname.startsWith(item.href);
    });
    if (match) {
      setActiveNav(match.key as DemoState["activeNav"]);
      // If we are navigating away from deals, maybe reset filter? 
      // Sample code doesn't explicitly reset, but let's keep it simple.
    }
  }, [pathname, setActiveNav]);

  const handleNavClick = (key: string, filter: QuickFilterKey = 'none') => {
    if (key === 'deals') {
      setQuickFilter(filter);
      router.push('/deals');
    } else if (key === 'dashboard') {
        router.push('/');
    } else if (key === 'invoices') {
        router.push('/invoices');
    }
  };

  const NavItem = ({ 
    icon: Icon, 
    label, 
    isActive, 
    onClick, 
    badgeCount = 0, 
    badgeColor 
  }: { 
    icon: any, 
    label: string, 
    isActive: boolean, 
    onClick: () => void, 
    badgeCount?: number, 
    badgeColor?: string 
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between gap-3 px-3 py-2 text-sm font-medium rounded transition-colors group",
        isActive 
          ? "bg-sky-50 text-sky-900" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("h-4 w-4", isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-500")} />
        {label}
      </div>
      {badgeCount > 0 && (
          <span className={cn("px-2 py-0.5 rounded-full text-xs", badgeColor || 'bg-slate-100 text-slate-600')}>
              {badgeCount}
          </span>
      )}
    </button>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white" {...props}>
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
           {/* Theme: Sky */}
           <div className="h-8 w-8 bg-sky-500 rounded flex items-center justify-center text-white shrink-0">
               <Briefcase className="h-5 w-5" />
           </div>
           <span className="truncate">Mini CRM</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">Main</div>
        <div className="space-y-1">
            {navItems.map(item => (
                <NavItem 
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    isActive={state.activeNav === item.key && state.quickFilter === 'none'}
                    onClick={() => handleNavClick(item.key)}
                />
            ))}
        </div>

        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-6">Quick Filters</div>
        <div className="space-y-1">
            {quickFilters.map(filter => (
                <NavItem 
                    key={filter.key}
                    icon={filter.icon}
                    label={filter.label}
                    isActive={state.activeNav === 'deals' && state.quickFilter === filter.key}
                    onClick={() => handleNavClick('deals', filter.key)}
                    badgeCount={filter.count}
                    badgeColor={filter.badgeColor}
                />
            ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-200">
        <Button variant="outline" size="sm" className="w-full text-xs justify-center" onClick={() => {
            resetDemo();
            router.push('/');
        }}>
            デモをリセット
        </Button>
        <div className="mt-4 flex items-center gap-3 px-1">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-xs">
                US
            </div>
            <div className="text-sm">
                <div className="font-medium">User Name</div>
                <div className="text-xs text-slate-500">admin</div>
            </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
