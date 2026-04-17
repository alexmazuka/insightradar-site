import { useTranslations } from "next-intl";

export default function USPBanner() {
  const t = useTranslations("usp");

  return (
    <div className="bg-primary-dark text-white py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium tracking-wide">
          <span className="hidden md:inline">
            {t("line1")} {t("line2")} {t("line3")}
          </span>
          <span className="md:hidden">
            {t("line2")}
          </span>
        </p>
      </div>
    </div>
  );
}
