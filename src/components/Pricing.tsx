import { useTranslations } from "next-intl";
import TrialCTA from "./TrialCTA";

const tiers = ["daily", "pro", "custom"] as const;

export default function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">{t("title")}</h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier) => {
            const isPro = tier === "pro";
            const features = t.raw(`${tier}.features`) as string[];

            return (
              <div
                key={tier}
                className={`rounded-2xl p-7 flex flex-col ${
                  isPro
                    ? "bg-primary text-white ring-2 ring-primary shadow-xl lg:scale-105"
                    : "bg-white border border-border"
                }`}
              >
                {isPro && (
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                    {t("popular")}
                  </span>
                )}

                <h3 className={`text-lg font-bold mb-1 ${isPro ? "text-white" : "text-text"}`}>
                  {t(`${tier}.name`)}
                </h3>
                <p className={`text-xs mb-4 ${isPro ? "text-white/70" : "text-text-muted"}`}>
                  {t(`${tier}.description`)}
                </p>

                <div className="mb-5">
                  <span className={`text-3xl font-bold ${isPro ? "text-white" : "text-text"}`}>
                    {t(`${tier}.price`)}
                  </span>
                  <span className={`text-xs ${isPro ? "text-white/70" : "text-text-muted"}`}>
                    {" "}{t("perMonth")}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 shrink-0 mt-0.5 ${isPro ? "text-accent-light" : "text-green-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={isPro ? "text-white/90" : "text-text-muted"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <TrialCTA
                  className={`w-full py-2.5 rounded-lg font-semibold transition-colors text-center block text-sm ${
                    isPro
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary-light"
                  }`}
                >
                  {t(`${tier}.cta`)}
                </TrialCTA>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-text-muted mt-8 max-w-2xl mx-auto">{t("note")}</p>
      </div>
    </section>
  );
}
