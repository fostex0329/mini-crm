import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* --- Utilities (Date & Logic) --- */

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

export const formatMonth = (monthString: string | null | undefined) => {
    if (!monthString) return '';
    return monthString.replace('-', '/');
}

export const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  // User asked for YYYY/MM/DD HH:MM likely, or just ensure / separator.
  // Existing was M/D HH:MM. Let's make it standardized to YYYY/MM/DD HH:MM for clarity if space permits, or keep short but ensure /
  // Current: 2/19 14:00. This uses /.
  // Let's keep it but maybe user wants YYYY? The prompt said "year and month separator".
  // If no year is shown, this comment is moot. But "Updated At" usually implies year might be needed if old?
  // Let's stick to slashes.
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};

// 営業日計算（土日除外）
export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0:Sun, 6:Sat
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// 実効期日（土日の場合は翌月曜）
export const getEffectiveDueDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (date.getDay() === 6) return addDays(date, 2); // Sat -> Mon
  if (date.getDay() === 0) return addDays(date, 1); // Sun -> Mon
  return date;
};

import { Deal, Alert } from './constants';

// アラート判定ロジック
export const calculateAlerts = (deal: Deal, today = new Date('2025-12-17')) => {
  const alerts: Alert[] = [];
  
  // 1. 未入金（遅延）
  if (deal.invoice_summary.status === 'issued' && deal.invoice_summary.invoice_due_date) {
    const effectiveDate = getEffectiveDueDate(deal.invoice_summary.invoice_due_date);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (effectiveDate) {
        const effectiveDateObj = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
        
        // 遅延
        if (todayDate > effectiveDateObj) {
            const diffTime = Math.abs(todayDate.getTime() - effectiveDateObj.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            alerts.push({ 
              type: 'overdue', 
              priority: 1, 
              label: '未入金（遅延）', 
              diffDays,
              message: `実効期日を${diffDays}日超過しています（期日: ${formatDate(deal.invoice_summary.invoice_due_date)} / 実効: ${formatDate(effectiveDate.toISOString())}）`
            });
        }
        
        // 2. 入金期限まもなく（簡易実装：5日以内）
        if (todayDate <= effectiveDateObj) {
            const diffTime = Math.abs(effectiveDateObj.getTime() - todayDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 5) {
                alerts.push({ 
                  type: 'due_soon', 
                  priority: 2, 
                  label: '入金期限まもなく', 
                  diffDays,
                  message: `実効期日まであと${diffDays}営業日です（期日: ${formatDate(deal.invoice_summary.invoice_due_date)} / 実効: ${formatDate(effectiveDate.toISOString())}）`
                });
            }
        }
    }
  }

  // 3. 今月：未請求
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  if (deal.invoice_planned_month === currentMonthStr && deal.invoice_summary.status !== 'issued' && deal.invoice_summary.status !== 'paid') {
     alerts.push({ 
       type: 'unbilled_this_month', 
       priority: 3, 
       label: '今月：未請求',
       message: `請求予定月が当月（${deal.invoice_planned_month}）で、まだ未請求です`
     });
  }

  // 4. 対応期限切れ
  if (deal.next_action && deal.next_action.due_date) {
      const nextActionDate = new Date(deal.next_action.due_date);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (todayDate > nextActionDate) {
          const diffTime = Math.abs(todayDate.getTime() - nextActionDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          alerts.push({ 
            type: 'action_overdue', 
            priority: 4, 
            label: '対応期限切れ', 
            diffDays,
            message: `次アクション期限を${diffDays}日超過しています（期限: ${formatDate(deal.next_action.due_date)}）`
          });
      }
  }

  alerts.sort((a, b) => a.priority - b.priority);
  return alerts;
};

