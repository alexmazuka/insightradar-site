import { Redis } from "@upstash/redis";
import type { PlanId } from "./plans";

// Subscription persistence on Upstash Redis (provisioned via Vercel Marketplace → KV/Redis).
// Supports both the Upstash-native and Vercel-KV env var names.

let _redis: Redis | null = null;

function redis(): Redis {
  if (_redis) return _redis;
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const tokenVal =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !tokenVal) {
    throw new Error(
      "Redis is not configured (set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)"
    );
  }
  _redis = new Redis({ url, token: tokenVal });
  return _redis;
}

export type SubscriptionStatus = "pending" | "active" | "past_due" | "canceled";

export interface Subscription {
  subId: string;
  plan: PlanId;
  email: string;
  telegram?: string;
  name?: string;
  status: SubscriptionStatus;
  walletId: string;
  cardToken?: string;
  invoiceId?: string;
  createdAt: number;
  lastChargeAt?: number;
  nextChargeAt?: number;
  failCount: number;
}

const KEY = (subId: string) => `sub:${subId}`;
const DUE_SET = "subs:due";

export async function saveSubscription(sub: Subscription): Promise<void> {
  await redis().set(KEY(sub.subId), sub);
}

export async function getSubscription(subId: string): Promise<Subscription | null> {
  return (await redis().get<Subscription>(KEY(subId))) ?? null;
}

/** Activate after a successful first payment, store the card token, schedule next charge. */
export async function activateSubscription(
  subId: string,
  patch: { cardToken: string; nextChargeAt: number; lastChargeAt: number; invoiceId?: string }
): Promise<void> {
  const sub = await getSubscription(subId);
  if (!sub) return;
  const updated: Subscription = {
    ...sub,
    status: "active",
    cardToken: patch.cardToken,
    invoiceId: patch.invoiceId ?? sub.invoiceId,
    lastChargeAt: patch.lastChargeAt,
    nextChargeAt: patch.nextChargeAt,
    failCount: 0,
  };
  await saveSubscription(updated);
  await redis().zadd(DUE_SET, { score: patch.nextChargeAt, member: subId });
}

/** After a recurring charge: reschedule (success) or bump failure counter (failure). */
export async function recordCharge(
  subId: string,
  result: { ok: boolean; nextChargeAt?: number; chargedAt: number }
): Promise<void> {
  const sub = await getSubscription(subId);
  if (!sub) return;
  if (result.ok && result.nextChargeAt) {
    await saveSubscription({
      ...sub,
      status: "active",
      lastChargeAt: result.chargedAt,
      nextChargeAt: result.nextChargeAt,
      failCount: 0,
    });
    await redis().zadd(DUE_SET, { score: result.nextChargeAt, member: subId });
  } else {
    const failCount = sub.failCount + 1;
    // Retry after 1 day, give up after 3 attempts.
    const retryAt = result.chargedAt + 24 * 60 * 60 * 1000;
    const status: SubscriptionStatus = failCount >= 3 ? "canceled" : "past_due";
    await saveSubscription({ ...sub, status, failCount, nextChargeAt: retryAt });
    if (status === "canceled") {
      await redis().zrem(DUE_SET, subId);
    } else {
      await redis().zadd(DUE_SET, { score: retryAt, member: subId });
    }
  }
}

export async function cancelSubscription(subId: string): Promise<void> {
  const sub = await getSubscription(subId);
  if (!sub) return;
  await saveSubscription({ ...sub, status: "canceled" });
  await redis().zrem(DUE_SET, subId);
}

/** Subscriptions whose nextChargeAt has passed — to be charged by the cron job. */
export async function getDueSubscriptions(now: number, limit = 100): Promise<Subscription[]> {
  const ids = await redis().zrange<string[]>(DUE_SET, 0, now, {
    byScore: true,
    offset: 0,
    count: limit,
  });
  if (!ids.length) return [];
  const subs = await Promise.all(ids.map((id) => getSubscription(id)));
  return subs.filter((s): s is Subscription => s !== null && s.status !== "canceled");
}
