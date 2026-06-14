import { NextResponse } from "next/server";
import { chargeWallet } from "@/lib/monobank";
import { getPlan } from "@/lib/plans";
import { getDueSubscriptions, recordCharge } from "@/lib/store";
import { notifyAdmin } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Recurring-charge worker. Triggered by Vercel Cron (see vercel.json).
// Vercel attaches `Authorization: Bearer ${CRON_SECRET}`; we also accept ?secret= for manual runs.
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // not configured → allow (set CRON_SECRET in production)
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const due = await getDueSubscriptions(now);
  const results: { subId: string; ok: boolean; status?: string }[] = [];

  for (const sub of due) {
    if (!sub.cardToken) continue;
    const plan = getPlan(sub.plan);
    const reference = `${sub.subId}:${now}`;
    try {
      const r = await chargeWallet({
        cardToken: sub.cardToken,
        amount: plan.amount,
        ccy: plan.ccy,
        reference,
        destination: plan.destination,
      });
      const ok = r.status === "success" || r.status === "hold" || r.status === "processing";
      await recordCharge(sub.subId, {
        ok,
        chargedAt: now,
        nextChargeAt: ok ? now + plan.periodDays * 24 * 60 * 60 * 1000 : undefined,
      });
      results.push({ subId: sub.subId, ok, status: r.status });
      if (!ok) {
        await notifyAdmin(
          `⚠️ Рекурентне списання не пройшло: ${sub.email} (${sub.plan}), статус ${r.status}`
        );
      }
    } catch (e) {
      console.error("[cron] charge failed", sub.subId, e);
      await recordCharge(sub.subId, { ok: false, chargedAt: now });
      results.push({ subId: sub.subId, ok: false, status: "error" });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
