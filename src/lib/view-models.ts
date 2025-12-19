import type { DealRecord, DealViewModel } from "@/types/crm";
import { calculateAlerts } from "@/lib/utils";

export const toDealViewModel = (deal: DealRecord): DealViewModel => ({
  ...deal,
  alerts: calculateAlerts(deal),
});
