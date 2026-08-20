# Deploy Guide — todddelivers.ai

Goal: get the site live on Vercel with a working AI ChatBox, then attach your domain.
Rule we follow: **prove the chat works on the free test URL before the real domain and the resume line go out.** No broken link ever reaches a recruiter.

Two files make up the site:
- `index.html` — the site (you already have it)
- `api/chat.js` — the serverless function that powers the chat (holds your API key safely)

---

## Part 1 — Get your Anthropic API key + set a spend cap (5 min)

1. Go to **console.anthropic.com** and sign in (this is the developer console — separate from your Claude chat subscription).
2. Add a payment method under **Billing**. Usage is pay-as-you-go.
3. **Set a monthly spend limit** (Billing → Limits). Start at **$10/month** — you won't come close, but it's a hard safety cap.
4. Go to **API Keys → Create Key**. Copy it (starts with `sk-ant-...`) and keep it somewhere safe. You'll paste it into Vercel, never into the website file.

**Cost reality:** the bot runs on Claude Haiku 4.5 ($1 per million input tokens / $5 per million output). A typical chat message costs a *fraction of a cent*. Hundreds of recruiter chats a month = a couple of dollars. The $10 cap is just insurance.

---

## Part 2 — Put the two files in a GitHub repo (10 min)

1. Create a free account at **github.com** if you don't have one.
2. Click **New repository** → name it `todddelivers` → Public or Private (either works) → **Create**.
3. Click **Add file → Upload files**. Upload:
   - `index.html` at the top level
   - a folder `api` containing `chat.js` (GitHub creates the folder if you type `api/chat.js` as the name, or drag the `api` folder in)
4. **Commit** the files.

Your repo should look like:
```
todddelivers/
├── index.html
└── api/
    └── chat.js
```

---

## Part 3 — Deploy to Vercel (5 min)

1. Go to **vercel.com** → **Sign up with GitHub** (easiest — links your repos).
2. **Add New → Project → Import** your `todddelivers` repo.
3. Leave the build settings at their defaults (no framework, no build command needed) → **Deploy**.
4. Vercel gives you a live URL like `todddelivers.vercel.app`. The site is up — but the chat won't work yet (no key). Next step fixes that.

---

## Part 4 — Add your key and turn the chat on (5 min)

1. In Vercel → your project → **Settings → Environment Variables**. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your `sk-ant-...` key
   - Apply to **Production** (and Preview) → **Save**.
2. Edit `index.html` (in GitHub, click the file → pencil icon) and change one line near the bottom, in the CONFIG block:
   - from `PREVIEW_MODE: true`
   - to `PREVIEW_MODE: false`
   - Commit. Vercel auto-redeploys in ~30 seconds.
3. Open `todddelivers.vercel.app` and **test the ChatBox** — ask it a couple of questions. It should answer live.

> If it shows the "can't reach the model" message: re-check the env var name is exactly `ANTHROPIC_API_KEY`, that the key is valid, and that you redeployed after adding it.

---

## Part 5 — Register the domain (5 min)

1. Go to **porkbun.com** → search **todddelivers.ai**.
2. If available, register it. `.ai` domains run ~$65–80/year with a **2-year minimum** (~$130–160 up front).
3. Complete checkout. (No hosting add-ons needed — Vercel is your host.)

---

## Part 6 — Point the domain at Vercel (10 min, mostly waiting)

1. In Vercel → your project → **Settings → Domains** → add `todddelivers.ai` (and `www.todddelivers.ai`).
2. Vercel shows you the DNS records to set (an A record and/or CNAME).
3. In **Porkbun → Domain → DNS**, add those exact records.
4. Wait for it to verify (usually minutes, up to a couple hours). Vercel issues HTTPS automatically.
5. Open **https://todddelivers.ai** and **test the ChatBox one more time** on the real domain.

---

## Part 7 — Go live for real

Only now:
- Add **todddelivers.ai** to your resume, LinkedIn, and email signature.
- The resume line: **AI portfolio & live AI ChatBox — todddelivers.ai**

---

## Later / optional
- **Cut costs further:** prompt caching can reduce the repeated system-prompt cost by ~90% — worth it only if traffic grows.
- **Redirect allsetai.ai → todddelivers.ai:** if you ever buy that name, it's a one-setting redirect at the registrar.
- **Swap the model:** if you want slightly richer answers, change `MODEL` in `api/chat.js` to a current Sonnet ID (higher quality, a bit pricier). Verify the latest ID in the Anthropic console first.

---

### Quick reference
| Thing | Where | Cost |
|---|---|---|
| API key + spend cap | console.anthropic.com | pennies/mo of usage |
| Code repo | github.com | free |
| Hosting + functions | vercel.com | free |
| Domain | porkbun.com | ~$130–160 / 2 yr |
