import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/shadcn/sidebar-07/app-sidebar";
import { SidebarInset } from "@/components/shadcn/sidebar-07/sidebar";
import { AppProviders } from "@/components/providers";

export const metadata: Metadata = {
  title: "Mini CRM",
  description: "A mini CRM for small teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppProviders>
          <AppSidebar />
          <SidebarInset className="flex-1 bg-slate-50">{children}</SidebarInset>
        </AppProviders>
      </body>
    </html>
  );
}
