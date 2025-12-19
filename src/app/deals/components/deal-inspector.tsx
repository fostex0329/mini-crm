"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { 
  AlertCircle, 
  Clock, 
  FileText, 
  Link as LinkIcon,
  MessageSquare,
  X 
} from "lucide-react";

import { Button } from "@/components/yohaku/ui/button";
import { Badge } from "@/components/yohaku/ui/badge";
import { Input } from "@/components/yohaku/ui/input";

import { useDemoData } from "@/lib/demo-store";
import { calculateAlerts, formatDate } from "@/lib/utils";
import { Deal } from "@/lib/constants";

export const DealInspector = ({ 
  deal, 
  isOpen, 
  onClose 
}: { 
  deal: Deal | null;
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const { updateDeal } = useDemoData();
  
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  /* Animation Logic */
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && deal) {
      setShouldRender(true);
      // Short delay to ensure DOM is present before applying transition class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Duration matches CSS transition
      return () => clearTimeout(timer);
    }
  }, [isOpen, deal]);

  if (!mounted) return null;
  if (!shouldRender && !isOpen) return null;
  if (!deal) return null;

  const alerts = calculateAlerts(deal);
  const topAlert = alerts.length > 0 ? alerts[0] : null;

  const handleUpdate = (field: keyof Deal, value: any) => {
    updateDeal(deal.id, (prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedUpdate = (parent: 'next_action' | 'invoice_summary', field: string, value: any) => {
    updateDeal(deal.id, (prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  return ReactDOM.createPortal(
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lg border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
           <div className="flex items-center gap-2">
             <h2 className="text-base font-semibold text-slate-900">案件詳細</h2>
             {topAlert && (
                 <Badge variant="danger" className="animate-pulse">{topAlert.label}</Badge>
             )}
           </div>
           <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Title Block */}
            <div className="space-y-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                    {deal.company_name}
                    <Badge variant="outline">{deal.status}</Badge>
                </div>
                <Input 
                    value={deal.title} 
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className="text-xl font-bold text-slate-900 tracking-tight border-none px-0 shadow-none focus-visible:ring-0 h-auto"
                />
            </div>

            {/* Recommendation (Dynamic) */}
            {topAlert && (
                <div className="bg-red-50 border border-red-100 rounded p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                         <p className="text-sm text-red-800 font-medium mb-2 leading-relaxed">
                             {topAlert.type === 'overdue' && `👉 まだ未入金のようです。入金予定を確認して、必要ならご連絡しておきましょう`}
                             {topAlert.type === 'due_soon' && `👉 入金期限が近いです。念のため、入金予定の確認をお願いします`}
                             {topAlert.type === 'unbilled_this_month' && `👉 今月分が未請求のようです。請求書の作成→発行まで進めておきましょう`}
                             {topAlert.type === 'action_overdue' && `👉 対応期限が過ぎています。次の一手（内容/担当/期限）を更新しておきましょう`}
                         </p>
                         <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-white border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => {
                                // Simple logic: Pre-fill a suggestion based on alert type if empty, and focus the input
                                let suggestion = "";
                                if (topAlert.type === 'overdue') suggestion = "入金状況の確認連絡";
                                if (topAlert.type === 'due_soon') suggestion = "入金予定の再確認";
                                if (topAlert.type === 'unbilled_this_month') suggestion = "請求書作成";
                                if (topAlert.type === 'action_overdue') suggestion = "進捗確認";

                                if (suggestion && !deal.next_action?.text) {
                                    handleNestedUpdate('next_action', 'text', suggestion);
                                }
                                
                                // Focus the Next Action input
                                const nextActionInput = document.getElementById('next-action-text');
                                if (nextActionInput) {
                                    nextActionInput.focus();
                                    nextActionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            }}
                         >
                            次アクションにセット
                         </Button>
                    </div>
                </div>
            )}

            {/* Basic Info Form */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">基本情報</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">担当者</label>
                        <Input 
                            value={deal.owner_name} 
                            onChange={(e) => handleUpdate('owner_name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">ステータス</label>
                        <select 
                            className="flex h-9 w-full rounded border border-slate-200 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" 
                            value={deal.status}
                            onChange={(e) => handleUpdate('status', e.target.value)}
                        >
                            <option>見込み</option>
                            <option>提案中</option>
                            <option>契約</option>
                            <option>請求準備</option>
                            <option>請求済み</option>
                            <option>入金済み</option>
                            <option>完了</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Next Action */}
            <div className="space-y-4">
                 <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                     <Clock className="h-3.5 w-3.5" /> 次アクション
                 </h3>
                 <div className="p-4 bg-slate-50 rounded space-y-3 border border-slate-100">
                     <div className="space-y-1.5">
                         <label className="text-xs font-medium text-slate-500">内容</label>
                         <Input 
                            id="next-action-text"
                            value={deal.next_action?.text || ''} 
                            onChange={(e) => handleNestedUpdate('next_action', 'text', e.target.value)}
                         />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">担当</label>
                             <Input 
                                value={deal.owner_name} // Assuming owner name is shared or separate? Sample code used owner_name but next_action has owner_id
                                disabled // Keep disabled for now or simplify
                             />
                         </div>
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">期限</label>
                             <Input 
                                type="date" 
                                value={deal.next_action?.due_date || ''} 
                                onChange={(e) => handleNestedUpdate('next_action', 'due_date', e.target.value)}
                             />
                         </div>
                     </div>
                 </div>
            </div>

            {/* Billing Info */}
            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" /> 請求・入金
                    </h3>
                 </div>
                 
                 <div className="p-4 border border-slate-200 rounded space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">請求予定月</label>
                             <Input 
                                type="month" 
                                value={deal.invoice_planned_month} 
                                onChange={(e) => handleUpdate('invoice_planned_month', e.target.value)}
                             />
                         </div>
                         <div className="space-y-1.5">
                             <label className="text-xs font-medium text-slate-500">契約金額</label>
                             <Input 
                                type="number"
                                value={deal.amount_contract} 
                                onChange={(e) => handleUpdate('amount_contract', Number(e.target.value))}
                             />
                         </div>
                     </div>

                     <div className="border-t border-slate-100 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">請求ステータス</span>
                            <Badge variant={deal.invoice_summary.status === 'issued' ? 'warning' : deal.invoice_summary.status === 'paid' ? 'success' : 'secondary'}>
                                {deal.invoice_summary.status === 'issued' ? '請求済み' : deal.invoice_summary.status === 'paid' ? '入金済み' : '未請求'}
                            </Badge>
                        </div>

                        {deal.invoice_summary.status !== 'issued' && deal.invoice_summary.status !== 'paid' && (
                             <Button 
                                className="w-full bg-slate-800"
                                onClick={() => {
                                    handleUpdate('status', '請求済み');
                                    handleNestedUpdate('invoice_summary', 'status', 'issued');
                                    handleNestedUpdate('invoice_summary', 'invoice_date', new Date().toISOString().split('T')[0]);
                                    handleNestedUpdate('invoice_summary', 'invoice_due_date', new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]); // +30 days
                                }}
                             >
                                請求済みにする
                             </Button>
                        )}
                        
                        {deal.invoice_summary.status === 'issued' && (
                             <div className="space-y-3">
                                 <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded text-sm">
                                     <div>
                                         <div className="text-xs text-slate-500">請求日</div>
                                         <Input 
                                            type="date"
                                            value={deal.invoice_summary.invoice_date}
                                            onChange={(e) => handleNestedUpdate('invoice_summary', 'invoice_date', e.target.value)}
                                            className="h-8 text-xs mt-1"
                                         />
                                     </div>
                                     <div>
                                         <div className="text-xs text-slate-500">入金期日</div>
                                         <Input 
                                            type="date"
                                            value={deal.invoice_summary.invoice_due_date}
                                            onChange={(e) => handleNestedUpdate('invoice_summary', 'invoice_due_date', e.target.value)}
                                            className={`h-8 text-xs mt-1 ${topAlert?.type === 'overdue' ? 'text-red-600 font-bold' : ''}`}
                                         />
                                     </div>
                                 </div>
                                 <Button 
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => {
                                        handleUpdate('status', '入金済み');
                                        handleNestedUpdate('invoice_summary', 'status', 'paid');
                                    }}
                                 >
                                    入金済みにする
                                 </Button>
                             </div>
                        )}
                     </div>
                 </div>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
                 <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                     <LinkIcon className="h-3.5 w-3.5" /> リンク
                 </h3>
                 <div className="space-y-2">
                     {deal.links && deal.links.length > 0 ? (
                         deal.links.map((link, i) => (
                             <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group">
                                 <LinkIcon className="h-3 w-3 text-slate-400" />
                                 <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 hover:underline flex-1 truncate">
                                     {link.title}
                                 </a>
                             </div>
                         ))
                     ) : (
                         <div className="text-sm text-slate-400 italic pl-2">リンクはありません</div>
                     )}
                     <Button variant="outline" size="sm" className="w-full text-slate-500 hover:text-slate-700 border-dashed">
                         + リンクを追加
                     </Button>
                 </div>
            </div>

            {/* Activity Timeline Section (Mock) */}
            <div className="space-y-4">
                 <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                     <MessageSquare className="h-3.5 w-3.5" /> 活動履歴
                 </h3>
                 <div className="relative border-l border-slate-200 ml-2 pl-4 space-y-6">
                     {/* Derived from last_activity for now, plus some mocks */}
                     <div className="relative">
                         <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                         <div className="text-xs text-slate-500 mb-0.5">{formatDate(deal.updated_at)}</div>
                         <div className="text-sm text-slate-900">
                             {deal.last_activity_summary}
                         </div>
                     </div>
                     
                     {/* Fake history for MVP visuals */}
                     <div className="relative">
                         <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-200 ring-4 ring-white" />
                         <div className="text-xs text-slate-400 mb-0.5">2025/11/01</div>
                         <div className="text-sm text-slate-500">
                             案件作成
                         </div>
                     </div>
                 </div>
            </div>

            {/* Footer Space */}
            <div className="h-12" />
        </div>
      </div>
    </>,
    document.body
  );
};
