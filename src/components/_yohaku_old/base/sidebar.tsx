import * as React from "react";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarGroup as ShadcnSidebarGroup,
  SidebarGroupAction as ShadcnSidebarGroupAction,
  SidebarGroupContent as ShadcnSidebarGroupContent,
  SidebarGroupLabel as ShadcnSidebarGroupLabel,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarInput as ShadcnSidebarInput,
  SidebarInset as ShadcnSidebarInset,
  SidebarMenu as ShadcnSidebarMenu,
  SidebarMenuAction as ShadcnSidebarMenuAction,
  SidebarMenuBadge as ShadcnSidebarMenuBadge,
  SidebarMenuButton as ShadcnSidebarMenuButton,
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuSkeleton as ShadcnSidebarMenuSkeleton,
  SidebarMenuSub as ShadcnSidebarMenuSub,
  SidebarMenuSubButton as ShadcnSidebarMenuSubButton,
  SidebarMenuSubItem as ShadcnSidebarMenuSubItem,
  SidebarProvider as ShadcnSidebarProvider,
  SidebarRail as ShadcnSidebarRail,
  SidebarSeparator as ShadcnSidebarSeparator,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { yohakuButtonBaseClasses } from "./button";

export { useSidebar };

export const YohakuSidebarProvider = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarProvider>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarProvider>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarProvider
    ref={ref}
    className={cn(
      "bg-[color:var(--sidebar-background)] text-[color:var(--sidebar-foreground)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarProvider.displayName = "YohakuSidebarProvider";

export const YohakuSidebar = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebar>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebar>
>(({ className, ...props }, ref) => (
  <ShadcnSidebar
    ref={ref}
    className={cn(
      "border-r border-[color:var(--sidebar-border)] bg-[color:var(--sidebar-background)]/90 backdrop-blur",
      className
    )}
    {...props}
  />
));
YohakuSidebar.displayName = "YohakuSidebar";

export const YohakuSidebarContent = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarContent>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarContent ref={ref} className={cn("gap-4 px-2", className)} {...props} />
));
YohakuSidebarContent.displayName = "YohakuSidebarContent";

export const YohakuSidebarHeader = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarHeader>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarHeader>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarHeader
    ref={ref}
    className={cn(
      "px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--sidebar-foreground)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarHeader.displayName = "YohakuSidebarHeader";

export const YohakuSidebarFooter = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarFooter>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarFooter>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarFooter
    ref={ref}
    className={cn(
      "border-t border-[color:var(--sidebar-border)]",
      className
    )}
    style={{ backgroundColor: "var(--sidebar-background)" }}
    {...props}
  />
));
YohakuSidebarFooter.displayName = "YohakuSidebarFooter";

export const YohakuSidebarInset = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarInset>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarInset>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarInset
    ref={ref}
    className={cn("bg-[color:var(--sidebar-background)]", className)}
    {...props}
  />
));
YohakuSidebarInset.displayName = "YohakuSidebarInset";

export const YohakuSidebarGroup = ShadcnSidebarGroup;
export const YohakuSidebarGroupContent = ShadcnSidebarGroupContent;
export const YohakuSidebarGroupAction = ShadcnSidebarGroupAction;

export const YohakuSidebarGroupLabel = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarGroupLabel>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarGroupLabel>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarGroupLabel
    ref={ref}
    className={cn(
      "text-xs text-[color:var(--sidebar-foreground)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarGroupLabel.displayName = "YohakuSidebarGroupLabel";

export const YohakuSidebarMenu = ShadcnSidebarMenu;
export const YohakuSidebarMenuItem = ShadcnSidebarMenuItem;
export const YohakuSidebarMenuSkeleton = ShadcnSidebarMenuSkeleton;
export const YohakuSidebarMenuSub = ShadcnSidebarMenuSub;
export const YohakuSidebarMenuSubItem = ShadcnSidebarMenuSubItem;

export const YohakuSidebarMenuButton = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarMenuButton>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarMenuButton>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarMenuButton
    ref={ref}
    className={cn(
      yohakuButtonBaseClasses,
      "px-3 py-2 text-sm text-[color:var(--sidebar-foreground)] font-normal",
      "hover:bg-[color:hsl(var(--primary)/0.8)] hover:text-[color:hsl(var(--primary-foreground))] hover:font-semibold",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:hsl(var(--ring))]",
      "data-[active=true]:bg-[color:hsl(var(--primary))] data-[active=true]:text-[color:hsl(var(--primary-foreground))] data-[active=true]:font-semibold",
      className
    )}
    {...props}
  />
));
YohakuSidebarMenuButton.displayName = "YohakuSidebarMenuButton";

export const YohakuSidebarMenuAction = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarMenuAction>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarMenuAction>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarMenuAction
    ref={ref}
    className={cn("text-xs text-[color:var(--sidebar-foreground)]", className)}
    {...props}
  />
));
YohakuSidebarMenuAction.displayName = "YohakuSidebarMenuAction";

export const YohakuSidebarMenuBadge = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarMenuBadge>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarMenuBadge>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarMenuBadge
    ref={ref}
    className={cn(
      "bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarMenuBadge.displayName = "YohakuSidebarMenuBadge";

export const YohakuSidebarMenuSubButton = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarMenuSubButton>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarMenuSubButton>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarMenuSubButton
    ref={ref}
    className={cn(
      "px-2.5 py-1 text-xs text-[color:var(--sidebar-foreground)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarMenuSubButton.displayName = "YohakuSidebarMenuSubButton";

export const YohakuSidebarInput = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarInput>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarInput>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarInput
    ref={ref}
    className={cn(
      "rounded-2xl border-[color:var(--sidebar-border)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarInput.displayName = "YohakuSidebarInput";

export const YohakuSidebarSeparator = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarSeparator>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarSeparator>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarSeparator
    ref={ref}
    className={cn("bg-[color:var(--sidebar-border)]", className)}
    {...props}
  />
));
YohakuSidebarSeparator.displayName = "YohakuSidebarSeparator";

export const YohakuSidebarTrigger = React.forwardRef<
  React.ElementRef<typeof ShadcnSidebarTrigger>,
  React.ComponentPropsWithoutRef<typeof ShadcnSidebarTrigger>
>(({ className, ...props }, ref) => (
  <ShadcnSidebarTrigger
    ref={ref}
    className={cn(
      "rounded-full border border-[color:var(--sidebar-border)] text-[color:var(--sidebar-foreground)]",
      className
    )}
    {...props}
  />
));
YohakuSidebarTrigger.displayName = "YohakuSidebarTrigger";

export const YohakuSidebarRail = ShadcnSidebarRail;
