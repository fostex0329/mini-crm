"use client";

import * as React from "react";

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (value: boolean) => void;
} | null>(null);

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(true);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const DefaultWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
);
DefaultWrapper.displayName = "DefaultWrapper";

export const Sidebar = DefaultWrapper;
export const SidebarContent = DefaultWrapper;
export const SidebarFooter = DefaultWrapper;
export const SidebarGroup = DefaultWrapper;
export const SidebarGroupAction = DefaultWrapper;
export const SidebarGroupContent = DefaultWrapper;
export const SidebarGroupLabel = DefaultWrapper;
export const SidebarHeader = DefaultWrapper;
export const SidebarInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={className} {...props} />
  )
);
SidebarInput.displayName = "SidebarInput";
export const SidebarInset = DefaultWrapper;
export const SidebarMenu = DefaultWrapper;
export const SidebarMenuAction = DefaultWrapper;
export const SidebarMenuBadge = DefaultWrapper;
export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={className} {...props} />
));
SidebarMenuButton.displayName = "SidebarMenuButton";
export const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";
export const SidebarMenuSkeleton = DefaultWrapper;
export const SidebarMenuSub = DefaultWrapper;
export const SidebarMenuSubButton = SidebarMenuButton;
export const SidebarMenuSubItem = SidebarMenuItem;
export const SidebarSeparator = DefaultWrapper;
export const SidebarTrigger = SidebarMenuButton;
export const SidebarRail = DefaultWrapper;
