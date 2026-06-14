import { createVerify } from "crypto";

// Monobank Acquiring (eCommerce) API client.
// Docs: https://api.monobank.ua/docs/acquiring.html
// The X-Token MUST stay server-side. Never expose MONOBANK_TOKEN to the browser.

const API_BASE = process.env.MONOBANK_API_BASE || "https://api.monobank.ua";

function token(): string {
  const t = process.env.MONOBANK_TOKEN;
  if (!t) throw new Error("MONOBANK_TOKEN is not configured");
  return t;
}

async function monoFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const { json, ...rest } = init;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "X-Token": token(),
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Monobank ${path} failed (${res.status}): ${text}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export interface CreateInvoiceParams {
  amount: number; // kopecks
  ccy: number; // 980 = UAH
  reference: string; // our internal order id
  destination: string; // payment description
  /** Customer wallet id — tie a saved card token to this customer for recurring charges. */
  walletId: string;
  redirectUrl: string;
  webHookUrl: string;
  /** Save the card for future merchant-initiated recurring payments. */
  saveCard?: boolean;
  validitySeconds?: number;
}

export interface CreateInvoiceResult {
  invoiceId: string;
  pageUrl: string;
}

/** Create a hosted-payment invoice. With saveCard, the paid card is tokenized for recurring use. */
export function createInvoice(p: CreateInvoiceParams): Promise<CreateInvoiceResult> {
  return monoFetch<CreateInvoiceResult>("/api/merchant/invoice/create", {
    method: "POST",
    json: {
      amount: p.amount,
      ccy: p.ccy,
      merchantPaymInfo: {
        reference: p.reference,
        destination: p.destination,
      },
      redirectUrl: p.redirectUrl,
      webHookUrl: p.webHookUrl,
      validity: p.validitySeconds ?? 3600,
      paymentType: "debit",
      ...(p.saveCard
        ? { saveCardData: { saveCard: true, walletId: p.walletId } }
        : {}),
    },
  });
}

export interface WalletPaymentParams {
  cardToken: string;
  amount: number;
  ccy: number;
  reference: string;
  destination: string;
}

export interface WalletPaymentResult {
  invoiceId: string;
  status: string;
  failureReason?: string;
  amount?: number;
  ccy?: number;
}

/** Charge a previously tokenized card (merchant-initiated recurring payment). */
export function chargeWallet(p: WalletPaymentParams): Promise<WalletPaymentResult> {
  return monoFetch<WalletPaymentResult>("/api/merchant/wallet/payment", {
    method: "POST",
    json: {
      cardToken: p.cardToken,
      amount: p.amount,
      ccy: p.ccy,
      merchantPaymInfo: {
        reference: p.reference,
        destination: p.destination,
      },
      initiationKind: "merchant",
    },
  });
}

export interface InvoiceStatus {
  invoiceId: string;
  status: "created" | "processing" | "hold" | "success" | "failure" | "reversed" | "expired";
  amount: number;
  ccy: number;
  reference?: string;
  failureReason?: string;
  walletData?: {
    cardToken: string;
    walletId: string;
    status: string;
  };
}

export function getInvoiceStatus(invoiceId: string): Promise<InvoiceStatus> {
  return monoFetch<InvoiceStatus>(
    `/api/merchant/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`,
    { method: "GET" }
  );
}

// --- Webhook signature verification -------------------------------------

let cachedPubKeyPem: string | null = null;

async function getPublicKeyPem(): Promise<string> {
  if (cachedPubKeyPem) return cachedPubKeyPem;
  const { key } = await monoFetch<{ key: string }>("/api/merchant/pubkey", {
    method: "GET",
  });
  // `key` is base64 of the PEM public key.
  cachedPubKeyPem = Buffer.from(key, "base64").toString("utf-8");
  return cachedPubKeyPem;
}

/**
 * Verify the X-Sign header against the raw request body.
 * Monobank signs the body with ECDSA-SHA256; X-Sign is the base64 signature.
 */
export async function verifyWebhook(rawBody: string, xSign: string | null): Promise<boolean> {
  if (!xSign) return false;
  try {
    const pem = await getPublicKeyPem();
    const verifier = createVerify("SHA256");
    verifier.update(rawBody);
    verifier.end();
    return verifier.verify(pem, Buffer.from(xSign, "base64"));
  } catch {
    return false;
  }
}
