export interface CooperativeOption {
  id: string;
  name: string;
}

export interface CooperativeMetrics {
  id: string;
  name: string;
  overallScore: number;
  categories: {
    liquidity: number;
    repayment: number;
    reserves: number;
    growth: number;
    governance: number;
  };
}

export interface ComparisonResult {
  cooperativeA: CooperativeMetrics;
  cooperativeB: CooperativeMetrics;
  winnerId: string;
}