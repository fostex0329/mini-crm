"use client";

import * as React from "react";

import { createInitialState, demoSeed } from "@/data/demo-seed";
import type {
  DealRecord,
  DemoState,
  QuickFilterKey,
} from "@/types/crm";
import { DEMO_STORAGE_KEY, DEMO_TODAY } from "@/lib/constants";

const loadInitialState = (): DemoState => {
  if (typeof window === "undefined") {
    return createInitialState();
  }
  try {
    const stored = window.sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DemoState;
      return {
        ...demoSeed,
        ...parsed,
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
  duplicateDeal: (dealId: string) => void;
  setQuickFilter: (filter: QuickFilterKey) => void;
  setActiveNav: (nav: DemoState["activeNav"]) => void;
  resetDemo: () => void;
};

const DemoDataContext = React.createContext<DemoContextValue | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DemoState>(() => loadInitialState());

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateDeal = React.useCallback(
    (dealId: string, updater: (deal: DealRecord) => DealRecord) => {
      setState((previous) => ({
        ...previous,
        deals: previous.deals.map((deal) => {
          if (deal.id !== dealId) return deal;
          const next = updater(deal);
          return {
            ...next,
            updatedAt: DEMO_TODAY,
          };
        }),
        updatedAt: DEMO_TODAY,
      }));
    },
    []
  );

  const addDeal = React.useCallback((deal: DealRecord) => {
    setState((previous) => ({
      ...previous,
      deals: [...previous.deals, { ...deal, updatedAt: DEMO_TODAY }],
      updatedAt: DEMO_TODAY,
    }));
  }, []);

  const deleteDeal = React.useCallback((dealId: string) => {
    setState((previous) => ({
      ...previous,
      deals: previous.deals.filter((deal) => deal.id !== dealId),
      updatedAt: DEMO_TODAY,
    }));
  }, []);

  const duplicateDeal = React.useCallback(
    (dealId: string) => {
      setState((previous) => {
        const target = previous.deals.find((deal) => deal.id === dealId);
        if (!target) return previous;
        const clone: DealRecord = {
          ...JSON.parse(JSON.stringify(target)),
          id: `${dealId}-COPY-${Date.now()}`,
          title: `${target.title}（複製）`,
          activities: [
            ...target.activities,
            {
              id: `act_${dealId}_${Date.now()}`,
              type: "note",
              body: "案件を複製しました。",
              createdAt: new Date().toISOString(),
              createdBy: target.owner,
            },
          ],
        };
        clone.updatedAt = DEMO_TODAY;
        const nextState = {
          ...previous,
          deals: [...previous.deals, clone],
          updatedAt: DEMO_TODAY,
        };
        return nextState;
      });
    },
    []
  );

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
      duplicateDeal,
      setQuickFilter,
      setActiveNav,
      resetDemo,
    }),
    [
      state,
      updateDeal,
      addDeal,
      deleteDeal,
      duplicateDeal,
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
