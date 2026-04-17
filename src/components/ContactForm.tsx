"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

// Formspree form ID for contact form (separate from trial form).
// Set via NEXT_PUBLIC_FORMSPREE_CONTACT_ID env var after signup at https://formspree.io
const FORMSPREE_CONTACT_ID = process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID || "";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (FORMSPREE_CONTACT_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_CONTACT_ID}`, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("submit failed");
      } else {
        const subject = encodeURIComponent("InsightRadar Contact Request");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-text mb-4">{t("title")}</h1>
        <p className="text-lg text-text-muted">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div>
          {status === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="source" value="insightradar.info/contact" />
              <input type="hidden" name="_subject" value="InsightRadar Contact Request" />
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t("name")}</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t("email")}</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">{t("message")}</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                />
              </div>
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  Помилка відправки. Напишіть нам на signal@insightradar.info
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-light disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {t("send")}
              </button>
            </form>
          )}
        </div>

        <div className="bg-surface rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-text mb-6">{t("info.title")}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <a href="mailto:signal@insightradar.info" className="text-text hover:text-primary transition-colors">
                {t("info.email")}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A9.004 9.004 0 0121 12a9.004 9.004 0 01-.157 1.582M4.157 7.582A9.004 9.004 0 003 12c0 .549.05 1.087.147 1.61" />
              </svg>
              <span className="text-text">{t("info.website")}</span>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-text-muted">{t("info.responseTime")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
