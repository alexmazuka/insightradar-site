import { useTranslations } from "next-intl";
import TrialCTA from "./TrialCTA";

export default function SampleDigest() {
  const t = useTranslations("sample");

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto mb-4">
            {t("subtitle")}
          </p>
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">
            {t("planBadge")}
          </span>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <TrialCTA className="inline-flex items-center gap-2 bg-accent hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t("tryCta")}
            </TrialCTA>
            <p className="text-xs text-text-muted mt-2">{t("tryNote")}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold">{t("digestTitle")}</h3>
                  <p className="text-white/70 text-sm mt-1">{t("digestDate")}</p>
                </div>
                <span className="bg-white/20 text-sm font-medium px-4 py-1.5 rounded-full">
                  {t("digestStats")}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-text">{t("signalTitle")}</h4>
                <div className="space-y-2">
                  {(t.raw("signals") as string[]).map((signal, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-muted bg-surface rounded-lg p-3"
                    >
                      <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
                        signal.startsWith("[НЕГАТИВ]") || signal.startsWith("[NEGATIVE]")
                          ? "bg-red-100 text-red-700"
                          : signal.startsWith("[ПОЗИТИВ]") || signal.startsWith("[POSITIVE]")
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {signal.startsWith("[НЕГАТИВ]") || signal.startsWith("[NEGATIVE]")
                          ? "!"
                          : signal.startsWith("[ПОЗИТИВ]") || signal.startsWith("[POSITIVE]")
                          ? "+"
                          : "~"}
                      </span>
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-text-muted">{t("fullVersion")}</p>
                <a
                  href="/sample-digest-2026-04-16.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t("download")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
