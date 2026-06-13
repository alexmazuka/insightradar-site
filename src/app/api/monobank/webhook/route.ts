import { NextResponse } from "next/server";
import type { InvoiceStatus } from "@/lib/monobank";
import { verifyWebhook } from "@/lib/monobank";
import { getPlan } from "@/lib/plans";
import { activateSubscription, getSubscription } from "@/lib/store";
import { notifyAdmin } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const raw = await req.text();
  const valid = await verifyWebhook(raw, req.headers.get("x-sign"));
  if (!valid) {
    return NextResponse.json({ error: "bad_signature" }, { status: 403 });
  }

  let data: InvoiceStatus;
  try {
    data = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const subId = data.reference;
  if (!subId) return NextResponse.json({ ok: true });

  const sub = await getSubscription(subId);
  if (!sub) return NextResponse.json({ ok: true });

  if (data.status === "success" && sub.status === "pending") {
    const cardToken = data.walletData?.cardToken;
    if (!cardToken) {
      await notifyAdmin(
        `⚠️ InsightRadar: оплата ${subId} успішна, але карта не токенізована — рекурент не працюватиме. Email: ${sub.email}`
      );
      return NextResponse.json({ ok: true });
    }
    const plan = getPlan(sub.plan);
    const now = Date.now();
    const nextChargeAt = now + plan.periodDays * 24 * 60 * 60 * 1000;
    await activateSubscription(subId, {
      cardToken,
      lastChargeAt: now,
      nextChargeAt,
      invoiceId: data.invoiceId,
    });
    await notifyAdmin(
      `✅ Нова підписка InsightRadar\nПлан: <b>${sub.plan}</b>\nEmail: ${sub.email}\nTelegram: ${sub.telegram || "—"}\nНаступне списання: ${new Date(nextChargeAt).toISOString().slice(0, 10)}`
    );
  } else if (data.status === "failure" || data.status === "expired") {
    await notifyAdmin(
      `❌ InsightRadar: оплата не пройшла (${data.status}) для ${sub.email}, план ${sub.plan}`
    );
  }

  return NextResponse.json({ ok: true });
}
