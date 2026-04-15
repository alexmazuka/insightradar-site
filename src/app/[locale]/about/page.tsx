import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const values = [
    { key: "accuracy", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
    { key: "speed", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
    { key: "focus", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-text mb-4">{t("title")}</h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-surface rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-text mb-4">{t("mission.title")}</h2>
          <p className="text-text-muted leading-relaxed">{t("mission.description")}</p>
        </div>
        <div className="bg-surface rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-text mb-4">{t("story.title")}</h2>
          <p className="text-text-muted leading-relaxed">{t("story.description")}</p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-text text-center mb-12">{t("values.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map(({ key, icon }) => (
            <div key={key} className="text-center p-8 rounded-xl border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{t(`values.${key}`)}</h3>
              <p className="text-sm text-text-muted">{t(`values.${key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
