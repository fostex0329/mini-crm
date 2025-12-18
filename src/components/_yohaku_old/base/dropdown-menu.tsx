import * as React from "react";
import type { ComponentPropsWithoutRef, ElementRef, HTMLAttributes } from "react";

import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuCheckboxItem as ShadcnDropdownMenuCheckboxItem,
  DropdownMenuContent as ShadcnDropdownMenuContent,
  DropdownMenuGroup as ShadcnDropdownMenuGroup,
  DropdownMenuItem as ShadcnDropdownMenuItem,
  DropdownMenuLabel as ShadcnDropdownMenuLabel,
  DropdownMenuPortal as ShadcnDropdownMenuPortal,
  DropdownMenuRadioGroup as ShadcnDropdownMenuRadioGroup,
  DropdownMenuRadioItem as ShadcnDropdownMenuRadioItem,
  DropdownMenuSeparator as ShadcnDropdownMenuSeparator,
  DropdownMenuShortcut as ShadcnDropdownMenuShortcut,
  DropdownMenuSub as ShadcnDropdownMenuSub,
  DropdownMenuSubContent as ShadcnDropdownMenuSubContent,
  DropdownMenuSubTrigger as ShadcnDropdownMenuSubTrigger,
  DropdownMenuTrigger as ShadcnDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownShortcutVisibilityContext = React.createContext(true);

export const YohakuDropdownMenu = ShadcnDropdownMenu;
export const YohakuDropdownMenuTrigger = ShadcnDropdownMenuTrigger;
export const YohakuDropdownMenuGroup = ShadcnDropdownMenuGroup;
export const YohakuDropdownMenuPortal = ShadcnDropdownMenuPortal;
export const YohakuDropdownMenuRadioGroup = ShadcnDropdownMenuRadioGroup;
export const YohakuDropdownMenuSub = ShadcnDropdownMenuSub;

export type YohakuDropdownMenuContentProps = ComponentPropsWithoutRef<typeof ShadcnDropdownMenuContent> & {
  showShortcuts?: boolean;
};

export const YohakuDropdownMenuContent = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuContent>,
  YohakuDropdownMenuContentProps
>(({ className, showShortcuts = true, ...props }, ref) => (
  <DropdownShortcutVisibilityContext.Provider value={showShortcuts}>
    <ShadcnDropdownMenuContent
      ref={ref}
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-1 text-slate-700 shadow-2xl shadow-slate-200/80",
        className
      )}
      {...props}
    />
  </DropdownShortcutVisibilityContext.Provider>
));
YohakuDropdownMenuContent.displayName = "YohakuDropdownMenuContent";

export const YohakuDropdownMenuItem = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuItem>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuItem>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuItem
    ref={ref}
    className={cn(
      "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 focus:bg-slate-100 focus:text-slate-900",
      className
    )}
    {...props}
  />
));
YohakuDropdownMenuItem.displayName = "YohakuDropdownMenuItem";

export const YohakuDropdownMenuCheckboxItem = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuCheckboxItem>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuCheckboxItem>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuCheckboxItem
    ref={ref}
    className={cn(
      "rounded-xl py-2 pl-9 pr-3 text-sm font-medium text-slate-600 focus:bg-slate-100 focus:text-slate-900",
      className
    )}
    {...props}
  />
));
YohakuDropdownMenuCheckboxItem.displayName = "YohakuDropdownMenuCheckboxItem";

export const YohakuDropdownMenuRadioItem = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuRadioItem>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuRadioItem>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuRadioItem
    ref={ref}
    className={cn("rounded-xl py-2 pl-9 pr-3 text-sm focus:bg-slate-100", className)}
    {...props}
  />
));
YohakuDropdownMenuRadioItem.displayName = "YohakuDropdownMenuRadioItem";

export const YohakuDropdownMenuLabel = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuLabel>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuLabel>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuLabel ref={ref} className={cn("px-3 py-2 text-xs uppercase text-slate-400", className)} {...props} />
));
YohakuDropdownMenuLabel.displayName = "YohakuDropdownMenuLabel";

export const YohakuDropdownMenuSeparator = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuSeparator>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuSeparator ref={ref} className={cn("my-2 h-px bg-slate-100", className)} {...props} />
));
YohakuDropdownMenuSeparator.displayName = "YohakuDropdownMenuSeparator";

export const YohakuDropdownMenuSubTrigger = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuSubTrigger>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuSubTrigger>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuSubTrigger
    ref={ref}
    className={cn(
      "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 focus:bg-slate-100 focus:text-slate-900",
      className
    )}
    {...props}
  />
));
YohakuDropdownMenuSubTrigger.displayName = "YohakuDropdownMenuSubTrigger";

export const YohakuDropdownMenuSubContent = React.forwardRef<
  ElementRef<typeof ShadcnDropdownMenuSubContent>,
  ComponentPropsWithoutRef<typeof ShadcnDropdownMenuSubContent>
>(({ className, ...props }, ref) => (
  <ShadcnDropdownMenuSubContent
    ref={ref}
    className={cn("rounded-2xl border border-slate-100 bg-white p-1 shadow-2xl", className)}
    {...props}
  />
));
YohakuDropdownMenuSubContent.displayName = "YohakuDropdownMenuSubContent";

export type YohakuDropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  hidden?: boolean;
};

export const YohakuDropdownMenuShortcut = ({
  className,
  hidden,
  ...props
}: YohakuDropdownMenuShortcutProps) => {
  const visible = React.useContext(DropdownShortcutVisibilityContext);
  if (hidden || !visible || !props.children) {
    return null;
  }
  return (
    <ShadcnDropdownMenuShortcut
      className={cn("text-[11px] uppercase tracking-widest text-slate-400", className)}
      {...props}
    />
  );
};
