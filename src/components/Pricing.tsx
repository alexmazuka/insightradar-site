import { useTranslations } from "next-intl";

const tiers = ["free", "light", "pro", "thinktanks", "premium"] as const;

const storeLinks: Record<string, string> = {
  free: "https://t.me/insightradar_bot",
  light: "https://next-mosaic.com/",
  pro: "https://next-mosaic.com/",
  thinktanks: "https://next-mosaic.com/",
  premium: "https://next-mosaic.com/",
};

const tierPeriod: Record<string, string> = {
  free: "",
  light: "weekly",
  pro: "monthly",
  thinktanks: "monthly",
  premium: "monthly",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {tiers.map((tier) => {
            const isPro = tier === "pro";
            const isPremium = tier === "premium";
            const isHighlight = isPro || isPremium;
            const features = t.raw(`${tier}.features`) as string[];

            return (
              <div
                key={tier}
                className={`rounded-2xl p-6 flex flex-col ${
                  isPro
                    ? "bg-primary text-white ring-2 ring-primary shadow-xl lg:scale-105"
                    : isPremium
                    ? "bg-gradient-to-br from-primary-dark to-primary text-white ring-2 ring-primary-dark shadow-xl"
                    : "bg-white border border-border"
                }`}
              >
                {isPro && (
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                    {t("popular")}
                  </span>
                )}
                {isPremium && (
                  <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                    {t("best")}
                  </span>
                )}
                {tier === "free" && (
                  <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                    {t("trialNote")}
                  </span>
                )}

                <h3 className={`text-lg font-bold mb-1 ${isHighlight ? "text-white" : "text-text"}`}>
                  {t(`${tier}.name`)}
                </h3>
                <p className={`text-xs mb-4 ${isHighlight ? "text-white/70" : "text-text-muted"}`}>
                  {t(`${tier}.description`)}
                </p>

                <div className="mb-5">
                  {tier === "free" ? (
                    <span className="text-3xl font-bold text-text">
                      0 <span className="text-sm font-normal text-text-muted">{t("currency")}</span>
                    </span>
                  ) : (
                    <>
                      <span className={`text-3xl font-bold ${isHighlight ? "text-white" : "text-text"}`}>
                        {t(`${tier}.price`)}
                      </span>
                      <span className={`text-xs ${isHighlight ? "text-white/70" : "text-text-muted"}`}>
                        {" "}{t("currency")}/{tierPeriod[tier] === "weekly" ? t("weekly") : t("monthly")}
                      </span>
                    </>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2 text-xs">
                      <svg
                        className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlight ? "text-accent-light" : "text-green-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={isHighlight ? "text-white/90" : "text-text-muted"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={storeLinks[tier]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 rounded-lg font-semibold transition-colors text-center block text-sm ${
                    isHighlight
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
