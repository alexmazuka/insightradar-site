import { useTranslations } from "next-intl";

const tiers = ["free", "pro", "premium"] as const;

const storeLinks: Record<string, string> = {
  free: "https://t.me/insightradar_bot",
  pro: "https://next-mosaic.com/",
  premium: "https://next-mosaic.com/",
};

export default function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">{t("title")}</h2>
          <p className="text-lg text-text-muted">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const isPro = tier === "pro";
            const features = t.raw(`${tier}.features`) as string[];

            return (
              <div
                key={tier}
                className={`rounded-2xl p-8 flex flex-col ${
                  isPro
                    ? "bg-primary text-white ring-2 ring-primary shadow-xl scale-105"
                    : "bg-white border border-border"
                }`}
              >
                {isPro && (
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4 self-start">
                    {t("popular")}
                  </span>
                )}

                <h3 className={`text-xl font-bold mb-2 ${isPro ? "text-white" : "text-text"}`}>
                  {t(`${tier}.name`)}
                </h3>
                <p className={`text-sm mb-6 ${isPro ? "text-white/70" : "text-text-muted"}`}>
                  {t(`${tier}.description`)}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${isPro ? "text-white" : "text-text"}`}>
                    {t(`${tier}.price`)}
                  </span>
                  <span className={`text-sm ${isPro ? "text-white/70" : "text-text-muted"}`}>
                    {" "}{t("currency")}/{t("monthly")}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-5 h-5 shrink-0 mt-0.5 ${isPro ? "text-accent-light" : "text-green-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={isPro ? "text-white/90" : "text-text-muted"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={storeLinks[tier]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-lg font-semibold transition-colors text-center block ${
                    isPro
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-white hover:bg-primary-light"
                  }`}
                >
                  {tier === "free" ? t("ctaFree") : t("cta")}
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-text-muted mt-8">
          {t("storeNote")}
        </p>
      </div>
    </section>
  );
}
