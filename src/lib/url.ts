// Resolve the public site origin for redirect/webhook URLs.
// Prefers NEXT_PUBLIC_SITE_URL, else derives from the incoming request headers.

export function siteOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "insightradar.info";
  return `${proto}://${host}`;
}
