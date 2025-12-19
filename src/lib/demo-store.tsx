"use client";

import * as React from "react";
import { SEED_DEALS } from "@/lib/constants";
import type {
  DealRecord,
  DemoState,
  QuickFilterKey,
} from "@/types/crm";

const DEMO_STORAGE_KEY = "mini_crm_deals_v1";

const createInitialState = (): DemoState => ({
  deals: SEED_DEALS,
  quickFilter: "none",
  activeNav: "dashboard",
  updatedAt: new Date().toISOString(),
});

const loadInitialState = (): DemoState => {
  if (typeof window === "undefined") {
    return createInitialState();
  }
  try {
    const stored = window.sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // If it is an array (Deal[]), use it deals
      if (Array.isArray(parsed)) {
          return {
              ...createInitialState(),
              deals: parsed as DealRecord[], // Cast to DealRecord[] (which is Deal[])
          }
      }
      // If it is an object (DemoState)
      return {
        ...createInitialState(),
        ...(parsed as Partial<DemoState>),
      };
    }
  } catch (error) {
    console.warn("Failed to load demo state from sessionStorage", error);
  }
  return createInitialState();
};

type DemoContextValue = {
  state: DemoState;
  updateDeal: (dealId: string, updater: (deal: DealRecord) => DealRecord) => void;
  addDeal: (deal: DealRecord) => void;
  deleteDeal: (dealId: string) => void;
  setQuickFilter: (filter: QuickFilterKey) => void;
  setActiveNav: (nav: DemoState["activeNav"]) => void;
  resetDemo: () => void;
};

const DemoDataContext = React.createContext<DemoContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoState>(() => loadInitialState());

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // Sample code stores JUST the deals array in "mini_crm_deals_v1"
    // "sessionStorage.setItem("mini_crm_deals_v1", JSON.stringify(SEED_DEALS));"
    // So we should probably align with that if we want "reset demo" to work like sample code.
    // But here we might want to store the whole state?
    // Let's stick to storing just deals to be compatible with sample code logic if we copy paste sample code snippet later.
    // BUT sample code snippet runs in page.tsx and manages state itself.
    // Here we are centralizing.
    
    // Let's store the whole state for now, but handle the array case in loadInitialState (which I did).
    window.sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state.deals)); 
  }, [state]);

  const updateDeal = React.useCallback(
    (dealId: string, updater: (deal: DealRecord) => DealRecord) => {
      setState((previous) => ({
        ...previous,
        deals: previous.deals.map((deal) => {
          if (deal.id !== dealId) return deal;
          return updater(deal);
        }),
        updatedAt: new Date().toISOString(),
      }));
    },
    []
  );

  const addDeal = React.useCallback((deal: DealRecord) => {
    setState((previous) => ({
      ...previous,
      deals: [...previous.deals, deal],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const deleteDeal = React.useCallback((dealId: string) => {
    setState((previous) => ({
      ...previous,
      deals: previous.deals.filter((deal) => deal.id !== dealId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);


  const setQuickFilter = React.useCallback((filter: QuickFilterKey) => {
    setState((previous) => ({
      ...previous,
      quickFilter: filter,
    }));
  }, []);

  const setActiveNav = React.useCallback((nav: DemoState["activeNav"]) => {
    setState((previous) => ({
      ...previous,
      activeNav: nav,
    }));
  }, []);

  const resetDemo = React.useCallback(() => {
    const next = createInitialState();
    setState(next);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      state,
      updateDeal,
      addDeal,
      deleteDeal,
      setQuickFilter,
      setActiveNav,
      resetDemo,
    }),
    [
      state,
      updateDeal,
      addDeal,
      deleteDeal,
      setQuickFilter,
      setActiveNav,
      resetDemo,
    ]
  );

  return (
    <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>
  );
}

export const useDemoData = () => {
  const context = React.useContext(DemoDataContext);
  if (!context) {
    throw new Error("useDemoData must be used within DemoDataProvider");
  }
  return context;
};
