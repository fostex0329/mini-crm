import type { DealRecord, DealViewModel, InvoiceSummary } from "@/types/crm";
import { evaluateAlerts } from "@/lib/alerts";

const computeInvoiceSummary = (deal: DealRecord): InvoiceSummary => {
  if (!deal.invoice) {
    return { status: "none" };
  }
  const amountInvoice = deal.invoice.amountInvoice;
  const amountPaid = deal.invoice.amountPaid ?? 0;
  return {
    status: deal.invoice.status,
    invoiceDate: deal.invoice.invoiceDate,
    invoiceDueDate: deal.invoice.invoiceDueDate,
    amountInvoice,
    amountOutstanding:
      amountInvoice != null ? Math.max(amountInvoice - amountPaid, 0) : undefined,
    paidDate: deal.invoice.paidDate,
  };
};

export const toDealViewModel = (deal: DealRecord): DealViewModel => ({
  ...deal,
  invoiceSummary: computeInvoiceSummary(deal),
  alerts: evaluateAlerts(deal),
});
