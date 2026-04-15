import { useTranslations } from "next-intl";

const stepKeys = ["collect", "analyze", "deliver"] as const;

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-text text-center mb-16">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepKeys.map((key, i) => (
            <div key={key} className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {t(`steps.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
