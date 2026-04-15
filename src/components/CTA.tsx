import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function CTA() {
  const t = useTranslations("cta");

  return (
    <section className="py-20 bg-gradient-to-r from-primary-dark to-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t("title")}
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          {t("description")}
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-accent hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
