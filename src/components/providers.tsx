"use client";

import * as React from "react";
import { DemoDataProvider } from "@/lib/demo-store";
import { SidebarProvider } from "@/components/shadcn/sidebar-07/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DemoDataProvider>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>{children}</SidebarProvider>
      </TooltipProvider>
    </DemoDataProvider>
  );
}
