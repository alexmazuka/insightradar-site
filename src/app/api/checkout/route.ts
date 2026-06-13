import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/monobank";
import { getPlan, isPlanId } from "@/lib/plans";
import { saveSubscription } from "@/lib/store";
import { siteOrigin } from "@/lib/url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    plan?: string;
    email?: string;
    telegram?: string;
    name?: string;
    locale?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isPlanId(body.plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }
  const email = (body.email || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const plan = getPlan(body.plan);
  const subId = randomUUID();
  const origin = siteOrigin(req);
  const locale = body.locale === "en" ? "en" : "uk";

  try {
    const invoice = await createInvoice({
      amount: plan.amount,
      ccy: plan.ccy,
      reference: subId, // maps the Monobank webhook back to this subscription
      destination: plan.destination,
      walletId: subId, // ties the saved card token to this subscription
      saveCard: true, // tokenize the card for recurring charges
      redirectUrl: `${origin}/${locale}/pay/success?sub=${subId}`,
      webHookUrl: `${origin}/api/monobank/webhook`,
    });

    await saveSubscription({
      subId,
      plan: plan.id,
      email,
      telegram: body.telegram?.trim() || undefined,
      name: body.name?.trim() || undefined,
      status: "pending",
      walletId: subId,
      invoiceId: invoice.invoiceId,
      createdAt: Date.now(),
      failCount: 0,
    });

    return NextResponse.json({ pageUrl: invoice.pageUrl, subId });
  } catch (e) {
    console.error("[checkout] failed", e);
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }
}
