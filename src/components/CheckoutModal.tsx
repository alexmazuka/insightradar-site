"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  plan: string | null;
  planName: string;
  priceLabel: string;
}

export default function CheckoutModal({
  open,
  onClose,
  plan,
  planName,
  priceLabel,
}: CheckoutModalProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plan) return;
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: fd.get("email"),
          telegram: fd.get("telegram"),
          name: fd.get("name"),
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.pageUrl) throw new Error(data.error || "failed");
      window.location.href = data.pageUrl; // redirect to Monobank hosted payment
    } catch {
      setError(t("error"));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-text">{t("title")}</h3>
            <p className="text-sm text-text-muted mt-1">
              {planName} — <span className="font-semibold">{priceLabel}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="shrink-0 text-text-muted hover:text-text transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-text-muted mb-4">{t("recurringNote")}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("email")} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="ivan@company.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                {t("telegram")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telegram"
                required
                placeholder="@username"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">{t("name")}</label>
              <input
                type="text"
                name="name"
                placeholder="Іван Петренко"
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-text-muted">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{t("secure")}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
