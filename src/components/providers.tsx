"use client";

import * as React from "react";

import { DemoDataProvider } from "@/lib/demo-store";
import { SidebarProvider } from "@/components/shadcn/sidebar-07/sidebar";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DemoDataProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </DemoDataProvider>
  );
}
