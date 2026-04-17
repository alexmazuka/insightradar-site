"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

// Formspree form IDs — replace with real IDs after signup at https://formspree.io
// Until then, the form falls back to a mailto: action.
const FORMSPREE_TRIAL_ID = process.env.NEXT_PUBLIC_FORMSPREE_TRIAL_ID || "";

interface TrialModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TrialModal({ open, onClose }: TrialModalProps) {
  const t = useTranslations("pricing.trialModal");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

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
    setSubmitting(true);
    setStatus("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (FORMSPREE_TRIAL_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_TRIAL_ID}`, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("submit failed");
      } else {
        // Fallback: open mailto with form data pre-filled
        const subject = encodeURIComponent("InsightRadar Trial Request");
        const body = encodeURIComponent(
          Array.from(formData.entries())
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        );
        window.location.href = `mailto:signal@insightradar.info?subject=${subject}&body=${body}`;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold text-text">{t("title")}</h3>
            <p className="text-sm text-text-muted mt-1">{t("subtitle")}</p>
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
          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">{t("success")}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 text-primary hover:text-primary-light font-semibold text-sm"
              >
                {t("close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="source" value="insightradar.info/trial" />
              <input type="hidden" name="_subject" value="InsightRadar Trial Request" />

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t("namePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("company")}
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder={t("companyPlaceholder")}
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
                  placeholder={t("telegramPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  {t("useCase")}
                </label>
                <textarea
                  name="useCase"
                  rows={3}
                  placeholder={t("useCasePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {t("error")}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
