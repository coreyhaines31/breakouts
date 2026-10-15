# Breakouts

A tiny app for letting a room pick breakout sessions by QR code, with a live headcount so you can assign rooms by turnout.

- **`/slide`** — full-screen slide for the projector: QR code, session list, running response count.
- **`/`** — where the QR code goes. People select a session and confirm. One vote per device; picking again moves the vote instead of adding one.
- **`/results`** — live counts (refreshes every 2s), ranked biggest to smallest, with a two-tap reset for clearing test votes.

Built with Next.js, Tailwind CSS, and Neon Postgres.

## Run it

```bash
npm install
echo 'DATABASE_URL=postgres://…' > .env.local   # any Postgres; Neon free tier works
npm run dev
```

The `votes` table is created automatically on first request.

## Make it yours

Edit the sessions in [`src/lib/sessions.ts`](src/lib/sessions.ts). The `id` is what gets stored, so change ids before collecting votes, not during.

## Deploy

Deploy to Vercel and connect a Neon database (Vercel Marketplace sets `DATABASE_URL` for you). If your team has Deployment Protection on, turn it off for this project, or phones will hit a Vercel login page instead of the vote page.

The QR code points at whatever URL the slide is opened on, so open `/slide` from your public domain.

## Notes

- `/results` and its reset button aren't linked from the vote page, but they aren't password-protected either. Fine for a one-night event; add auth if you need it.
- Votes are tied to a cookie, so someone switching browsers or using a private window could vote twice.

## License

MIT
