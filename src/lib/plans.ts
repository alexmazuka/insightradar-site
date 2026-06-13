// Single source of truth for subscription plans.
// Prices are in UAH kopecks (1 UAH = 100). periodDays drives the recurring charge.
// Keep amounts in sync with messages/*.json (pricing.*.price).

export type PlanId =
  | "light"
  | "pro"
  | "thinktanks"
  | "premium"
  | "pro_annual"
  | "thinktanks_annual"
  | "premium_annual";

export interface Plan {
  id: PlanId;
  /** Amount charged each period, in kopecks. */
  amount: number;
  ccy: number; // 980 = UAH (ISO 4217)
  /** Days between recurring charges. */
  periodDays: number;
  /** Human label used in the Monobank payment description. */
  destination: string;
}

export const PLANS: Record<PlanId, Plan> = {
  light: {
    id: "light",
    amount: 400_00,
    ccy: 980,
    periodDays: 7,
    destination: "InsightRadar Light — тижневий огляд західної преси",
  },
  pro: {
    id: "pro",
    amount: 1_200_00,
    ccy: 980,
    periodDays: 30,
    destination: "InsightRadar Західна преса — щоденний дайджест",
  },
  thinktanks: {
    id: "thinktanks",
    amount: 1_800_00,
    ccy: 980,
    periodDays: 30,
    destination: "InsightRadar Think Tanks — моніторинг аналітичних центрів",
  },
  premium: {
    id: "premium",
    amount: 2_800_00,
    ccy: 980,
    periodDays: 30,
    destination: "InsightRadar Premium — Західна преса + Think Tanks",
  },
  pro_annual: {
    id: "pro_annual",
    amount: 10_200_00,
    ccy: 980,
    periodDays: 365,
    destination: "InsightRadar Західна преса — річна підписка",
  },
  thinktanks_annual: {
    id: "thinktanks_annual",
    amount: 15_120_00,
    ccy: 980,
    periodDays: 365,
    destination: "InsightRadar Think Tanks — річна підписка",
  },
  premium_annual: {
    id: "premium_annual",
    amount: 23_520_00,
    ccy: 980,
    periodDays: 365,
    destination: "InsightRadar Premium — річна підписка",
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLANS;
}

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}
