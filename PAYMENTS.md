# Приём платежей — Monobank Acquiring (рекуррентные подписки)

Сайт принимает оплату подписок напрямую через **Monobank Acquiring** с токенизацией карты
и автоматическими регулярными списаниями. Раньше оплата шла через внешний магазин
next-mosaic.com — теперь весь флоу на самом сайте.

> ⚠️ Для приёма платежей нужен **серверный рантайм**. Статический GitHub Pages так не умеет.
> Сборка по умолчанию теперь серверная (Vercel). Старый статический экспорт остался под
> флагом `STATIC_EXPORT=true` (без оплаты).

## Как это работает

1. Кнопка «Придбати» на странице тарифов открывает `CheckoutModal` (email + Telegram).
2. `POST /api/checkout` создаёт инвойс Monobank с `saveCardData` (токенизация карты) и
   возвращает `pageUrl` — клиента редиректит на платёжную страницу банка.
3. После оплаты Monobank шлёт вебхук на `POST /api/monobank/webhook`. Подпись проверяется
   (`X-Sign`, ECDSA-SHA256, ключ из `/api/merchant/pubkey`). При статусе `success`
   сохраняется `cardToken`, подписка активируется, планируется следующее списание.
4. Cron `GET /api/cron/charge` (ежедневно 06:00 UTC, см. `vercel.json`) списывает с
   сохранённых карт подписки, у которых наступил срок (`/api/merchant/wallet/payment`).
   При неудаче — до 3 ретраев раз в сутки, затем `canceled`.

## Файлы

- `src/lib/plans.ts` — тарифы (суммы в копейках, период списания)
- `src/lib/monobank.ts` — клиент Monobank (createInvoice / chargeWallet / verifyWebhook)
- `src/lib/store.ts` — хранилище подписок (Upstash Redis / Vercel KV)
- `src/lib/notify.ts` — уведомления в Telegram (опционально)
- `src/app/api/checkout/route.ts`, `.../monobank/webhook/route.ts`, `.../cron/charge/route.ts`
- `src/components/CheckoutModal.tsx`, `src/app/[locale]/pay/{success,failure}/page.tsx`

## Деплой на Vercel (чек-лист)

1. `vercel login` и `vercel link` (привязать репозиторий к проекту).
2. **Storage → Upstash Redis** (Vercel Marketplace) — Vercel сам добавит
   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (или `KV_REST_API_*`).
3. Переменные окружения (Project → Settings → Environment Variables):
   - `MONOBANK_TOKEN` — eCommerce-токен из https://web.monobank.ua/ → Acquiring
   - `CRON_SECRET` — любой случайный секрет (Vercel сам шлёт его в cron как Bearer)
   - `NEXT_PUBLIC_SITE_URL=https://insightradar.info` (опц.)
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID` (опц., для пингов)
4. Домен `insightradar.info` перенести/добавить в проект Vercel (DNS).
5. Деплой: `vercel --prod`. Cron включится автоматически из `vercel.json`.
6. В кабинете Monobank проверить, что вебхук доходит (тестовая оплата на 1 грн).

## Локальный запуск

```bash
cp .env.example .env.local   # заполнить MONOBANK_TOKEN и Upstash-переменные
npm run dev
```

## Безопасность

- `MONOBANK_TOKEN` — **только** в переменных окружения, никогда в репозитории/браузере.
- Вебхук обязательно проверяет подпись — без валидного `X-Sign` запрос отклоняется (403).
- Если токен где-то засветился — перевыпустить в кабинете Monobank.
