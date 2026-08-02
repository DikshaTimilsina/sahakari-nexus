import type { CooperativeOption, CooperativeMetrics, ComparisonResult } from "@/types/comparison";

export const cooperativeOptions: CooperativeOption[] = [
  { id: "coop-1", name: "Pokhara Valley Cooperative" },
  { id: "coop-2", name: "Gandaki Farmers Union" },
  { id: "coop-3", name: "Lakeside Savings Group" },
  { id: "coop-4", name: "Himalaya Credit Cooperative" },
];

const metricsById: Record<string, CooperativeMetrics> = {
  "coop-1": {
    id: "coop-1",
    name: "Pokhara Valley Cooperative",
    overallScore: 78,
    categories: {
      liquidity: 82,
      repayment: 74,
      reserves: 70,
      growth: 85,
      governance: 79,
    },
  },
  "coop-2": {
    id: "coop-2",
    name: "Gandaki Farmers Union",
    overallScore: 65,
    categories: {
      liquidity: 60,
      repayment: 58,
      reserves: 68,
      growth: 72,
      governance: 66,
    },
  },
  "coop-3": {
    id: "coop-3",
    name: "Lakeside Savings Group",
    overallScore: 71,
    categories: {
      liquidity: 75,
      repayment: 69,
      reserves: 64,
      growth: 70,
      governance: 77,
    },
  },
  "coop-4": {
    id: "coop-4",
    name: "Himalaya Credit Cooperative",
    overallScore: 83,
    categories: {
      liquidity: 88,
      repayment: 80,
      reserves: 81,
      growth: 84,
      governance: 82,
    },
  },
};

export function getComparison(idA: string, idB: string): ComparisonResult {
  const cooperativeA = metricsById[idA];
  const cooperativeB = metricsById[idB];
  const winnerId =
    cooperativeA.overallScore >= cooperativeB.overallScore
      ? cooperativeA.id
      : cooperativeB.id;

  return { cooperativeA, cooperativeB, winnerId };
}