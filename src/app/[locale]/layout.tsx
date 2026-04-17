import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import USPBanner from "@/components/USPBanner";
import uk from "../../../messages/uk.json";
import en from "../../../messages/en.json";

const allMessages: Record<string, typeof uk> = { uk, en };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = allMessages[locale];

  return (
    <html lang={locale} className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <USPBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
