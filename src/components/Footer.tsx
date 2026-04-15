import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">InsightRadar</span>
            </div>
            <p className="text-white/70 text-sm max-w-md">{t("description")}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("product")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/pricing" className="hover:text-white transition-colors">{nav("pricing")}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{nav("blog")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("company")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white transition-colors">{nav("about")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{nav("contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-sm text-white/50 text-center">
          &copy; {new Date().getFullYear()} InsightRadar. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
