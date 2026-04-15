import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMiAwaC0ydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm text-white/90 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t("badge")}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {t("title")}{" "}
            <span className="text-accent-light">{t("titleHighlight")}</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold bg-accent hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              {t("cta")}
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
            >
              {t("secondaryCta")}
            </a>
          </div>

          <p className="text-sm text-white/50 mt-6">{t("trustedBy")}</p>
        </div>
      </div>
    </section>
  );
}
