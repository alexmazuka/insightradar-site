import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "InsightRadar — Стратегічна аналітика західних медіа",
    template: "%s | InsightRadar",
  },
  description:
    "Автоматичний збір та AI-аналіз ключових сигналів з провідних західних ЗМІ українською мовою. Щоденні дайджести для тих, хто приймає рішення.",
  metadataBase: new URL("https://insightradar.info"),
  openGraph: {
    type: "website",
    siteName: "InsightRadar",
    locale: "uk_UA",
    alternateLocale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
