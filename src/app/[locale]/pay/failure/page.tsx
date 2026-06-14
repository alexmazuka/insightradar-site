import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PayFailurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pay" });

  return (
    <section className="py-24">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">{t("failureTitle")}</h1>
        <p className="text-text-muted mb-8">{t("failureText")}</p>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center px-6 py-3 font-semibold bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
        >
          {t("backPricing")}
        </Link>
      </div>
    </section>
  );
}
