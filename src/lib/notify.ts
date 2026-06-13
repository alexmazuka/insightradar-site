// Lightweight notifications. Optional — if no channel is configured, falls back to logging.
// Configure a Telegram bot (TELEGRAM_BOT_TOKEN + TELEGRAM_ADMIN_CHAT_ID) to get pings
// when a subscription activates, renews, or fails.

export async function notifyAdmin(text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!botToken || !chatId) {
    console.log("[notify]", text);
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      cache: "no-store",
    });
  } catch (e) {
    console.error("[notify] failed", e);
  }
}
