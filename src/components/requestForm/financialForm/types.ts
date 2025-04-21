
export interface BalanceSheetItem {
  before: number;
  current: number;
}

export interface BalanceSheetSection {
  [key: string]: BalanceSheetItem;
}

export interface BalanceSheet {
  currentAssets?: BalanceSheetSection;
  nonCurrentAssets?: BalanceSheetSection;
  otherAssets?: BalanceSheetSection;
  shortTermLiabilities?: BalanceSheetSection;
  longTermLiabilities?: BalanceSheetSection;
}

export interface AssetLiabilityItem {
  id: string;
  description: string;
  value: number;
}

export interface FinancialFormData {
  balanceSheet?: BalanceSheet;
  assets?: AssetLiabilityItem[];
  liabilities?: AssetLiabilityItem[];
  creditAmount?: number;
}
