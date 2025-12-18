const dataset = [
  { id: 'DEAL-001', dealName: 'コーポレートサイトリニューアル', clientName: '株式会社エコー', amount: 1200000, status: '契約', owner: '佐藤 恵', updatedAt: '2025-12-15' },
  { id: 'DEAL-002', dealName: '採用LP制作', clientName: 'ネクストステップ株式会社', amount: 450000, status: '請求準備', owner: '佐藤 恵', updatedAt: '2025-12-14' },
  { id: 'DEAL-003', dealName: 'ECサイト保守運用', clientName: 'グローバルマート', amount: 80000, status: '請求済み', owner: '田中 太郎', updatedAt: '2025-12-10' },
  { id: 'DEAL-004', dealName: 'ロゴデザイン', clientName: 'デザインスタジオ・リヒト', amount: 250000, status: '提案中', owner: '佐藤 恵', updatedAt: '2025-12-05' },
  { id: 'DEAL-005', dealName: 'システム開発コンサルティング', clientName: '株式会社テックリード', amount: 2500000, status: '入金済み', owner: '鈴木 一郎', updatedAt: '2025-11-28' }
];

const layout = {
  drag: { minWidth: 28 },
  select: { minWidth: 28 },
  header: { minWidth: 180, flex: true, label: 'タスク', headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  status: { minWidth: 120, label: 'ステータス', headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  type: { minWidth: 120, label: 'カテゴリ', headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  target: { minWidth: 72, label: '目標', headerPadding: 48, headerIconWidth: 32, cellPadding: 24, charWidth: 12 },
  limit: { minWidth: 72, label: '締切', headerPadding: 48, headerIconWidth: 32, cellPadding: 24, charWidth: 12 },
  priority: { minWidth: 120, label: '優先度', headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  reviewer: { minWidth: 120, label: '担当者', headerPadding: 48, headerIconWidth: 32, cellPadding: 40, charWidth: 14 },
  actions: { minWidth: 64 }
};

const columns = [
  { id: 'dealName', header: '案件名' },
  { id: 'clientName', header: 'クライアント' },
  { id: 'amount', header: '金額' },
  { id: 'status', header: 'ステータス' },
  { id: 'owner', header: '担当者' },
  { id: 'updatedAt', header: '最終更新日' }
];

const charWidthDefault = 12;

const result = {};

function estimateTextWidth(text, charWidth) {
  return [...text].length * charWidth;
}

function computeMaxCellLength(columnId) {
  let maxLen = 0;
  for (const row of dataset) {
    const value = row[columnId];
    if (value == null) continue;
    const str = String(value);
    maxLen = Math.max(maxLen, [...str].length);
  }
  return maxLen;
}

for (const column of columns) {
  const columnLayout = layout[column.id];
  if (columnLayout) {
    const charWidth = columnLayout.charWidth ?? 14;
    const headerText = columnLayout.label ?? column.header ?? column.id;
    const headerWidth =
      estimateTextWidth(headerText, charWidth) +
      (columnLayout.headerPadding ?? 32) +
      (columnLayout.headerIconWidth ?? 0);
    const maxCellLen = computeMaxCellLength(column.id);
    const cellWidth = maxCellLen * charWidth + (columnLayout.cellPadding ?? 32);
    result[column.id] = {
      headerWidth,
      cellWidth,
      finalWidth: Math.max(columnLayout.minWidth ?? 0, headerWidth, cellWidth),
    };
  } else {
    const headerStr = column.header ?? column.id;
    const fallback = headerStr.length * charWidthDefault + 32;
    result[column.id] = {
      fallback,
    };
  }
}

console.log(result);
