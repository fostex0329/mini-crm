import * as React from "react";

import {
  Sheet as ShadcnSheet,
  SheetClose as ShadcnSheetClose,
  SheetContent as ShadcnSheetContent,
  SheetDescription as ShadcnSheetDescription,
  SheetFooter as ShadcnSheetFooter,
  SheetHeader as ShadcnSheetHeader,
  SheetOverlay as ShadcnSheetOverlay,
  SheetPortal as ShadcnSheetPortal,
  SheetTitle as ShadcnSheetTitle,
  SheetTrigger as ShadcnSheetTrigger,
} from "@/components/ui/sheet";
import { YohakuLabel } from "@/components/_yohaku_old/base/label";
import { cn } from "@/lib/utils";

export const YohakuSheet = ShadcnSheet;
export const YohakuSheetPortal = ShadcnSheetPortal;
export const YohakuSheetTrigger = ShadcnSheetTrigger;
export const YohakuSheetClose = ShadcnSheetClose;

export const YohakuSheetOverlay = React.forwardRef<
  React.ElementRef<typeof ShadcnSheetOverlay>,
  React.ComponentPropsWithoutRef<typeof ShadcnSheetOverlay>
>(({ className, ...props }, ref) => (
  <ShadcnSheetOverlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm", className)}
    {...props}
  />
));
YohakuSheetOverlay.displayName = "YohakuSheetOverlay";

export const YohakuSheetContent = React.forwardRef<
  React.ElementRef<typeof ShadcnSheetContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnSheetContent>
>(({ className, children, ...props }, ref) => (
  <ShadcnSheetContent
    ref={ref}
    className={cn(
      "border-l border-slate-100 bg-white p-0 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:max-w-xl",
      className
    )}
    {...props}
  >
    <div className="flex h-full flex-col overflow-hidden">{children}</div>
  </ShadcnSheetContent>
));
YohakuSheetContent.displayName = "YohakuSheetContent";

export const YohakuSheetBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto px-6 py-6 sm:px-8", className)} {...props} />
);
YohakuSheetBody.displayName = "YohakuSheetBody";

export const YohakuSheetForm = ({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form className={cn("space-y-6", className)} {...props} />
);
YohakuSheetForm.displayName = "YohakuSheetForm";

export const YohakuSheetSection = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-4", className)} {...props} />
);
YohakuSheetSection.displayName = "YohakuSheetSection";

export const YohakuSheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <ShadcnSheetHeader className={cn("space-y-1 border-b border-slate-100 px-6 py-6 text-left sm:px-8", className)} {...props} />
);
YohakuSheetHeader.displayName = "YohakuSheetHeader";

export const YohakuSheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <ShadcnSheetFooter className={cn("flex flex-col-reverse gap-3 border-t border-slate-100 py-6 sm:flex-row sm:justify-end", className)} {...props} />
);
YohakuSheetFooter.displayName = "YohakuSheetFooter";

export const YohakuSheetTitle = React.forwardRef<
  React.ElementRef<typeof ShadcnSheetTitle>,
  React.ComponentPropsWithoutRef<typeof ShadcnSheetTitle>
>(({ className, ...props }, ref) => (
  <ShadcnSheetTitle ref={ref} className={cn("text-xl font-semibold leading-tight", className)} {...props} />
));
YohakuSheetTitle.displayName = "YohakuSheetTitle";

export const YohakuSheetDescription = React.forwardRef<
  React.ElementRef<typeof ShadcnSheetDescription>,
  React.ComponentPropsWithoutRef<typeof ShadcnSheetDescription>
>(({ className, ...props }, ref) => (
  <ShadcnSheetDescription
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
YohakuSheetDescription.displayName = "YohakuSheetDescription";
