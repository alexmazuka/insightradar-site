import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";
import uk from "../../messages/uk.json";
import en from "../../messages/en.json";

const allMessages: Record<string, typeof uk> = { uk, en };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: allMessages[locale],
  };
});
