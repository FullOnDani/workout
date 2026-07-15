# Bulk & Cut Tracker

Daily check-in tracker for Daniel (bulk) and Ire (cut) — workouts, meals, and bodyweight.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `vercel` from inside this folder with the Vercel CLI).
2. In the Vercel dashboard, import the repo as a new project. Framework preset: **Other** (no build step needed).
3. Add storage: in your Vercel project, go to **Storage → Create Database → KV** (Vercel KV, powered by Redis). Create it and connect it to this project — Vercel will automatically add the required environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.) to your project.
4. Redeploy (or trigger a new deployment) so the environment variables are picked up.
5. Visit your deployed URL — the app is fully working, and both Daniel's and Ire's check-ins will now persist in Vercel KV.

## Local development

```
npm install
vercel dev
```

(Requires the Vercel CLI: `npm i -g vercel`. You'll need a KV database linked via `vercel link` + `vercel env pull` for local storage to work.)

## Structure

- `public/index.html` — the frontend (tabs, forms, chart, history)
- `api/checkins.js` — serverless API route, reads/writes check-ins to Vercel KV
- Data model: each check-in is stored under `checkin:{person}:{date}`, with a `checkins:{person}` set tracking which dates exist
