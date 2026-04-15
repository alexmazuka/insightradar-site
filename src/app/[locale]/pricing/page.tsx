import { getTranslations, setRequestLocale } from "next-intl/server";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return { title: t("title") };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <div className="pt-8">
        <Pricing />
      </div>
      <CTA />
    </>
  );
}
