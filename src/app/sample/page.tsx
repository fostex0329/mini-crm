"use client";

import { AppSidebar } from "@/components/shadcn/sidebar-07/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcn/sidebar-07/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SamplePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/40">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-6" />
          <div className="flex flex-1 items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Sample
              </p>
              <h1 className="text-xl font-semibold">Sidebar Demo</h1>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Search projects..." className="w-60" />
              <Button variant="outline">Invite</Button>
              <Button>New Project</Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 px-6 py-8">
          <section className="rounded-3xl border bg-background p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Getting Started</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              このページでは shadcn/ui の sidebar-07 ブロックをそのまま表示しています。
              AppSidebar コンポーネントや SidebarProvider の使い方を確認できます。
            </p>
          </section>
          <section className="rounded-3xl border bg-background p-6 shadow-sm">
            <h3 className="text-base font-semibold">Actions</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline">Deploy</Button>
              <Button variant="outline">Run Tests</Button>
              <Button>View Reports</Button>
            </div>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
