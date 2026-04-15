import { routing } from "@/i18n/routing";
import ContactForm from "@/components/ContactForm";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function ContactPage() {
  return <ContactForm />;
}
