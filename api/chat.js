// api/chat.js — Vercel Serverless Function (Node.js runtime)
// -----------------------------------------------------------------------------
// This runs ON THE SERVER, so it can safely hold your Anthropic API key.
// The browser calls /api/chat and never sees the key.
//
// Setup (see the deploy guide):
//   1. Put this file at  api/chat.js  in your project.
//   2. In Vercel → Project → Settings → Environment Variables, add:
//        Name:  ANTHROPIC_API_KEY
//        Value: (your key from console.anthropic.com — starts with sk-ant-...)
//   3. In index.html, set CONFIG.PREVIEW_MODE = false and redeploy.
// -----------------------------------------------------------------------------

// Cheapest current model — plenty for a résumé-grounded Q&A bot.
// Verify the latest ID any time at: https://platform.claude.com/docs/en/about-claude/models/overview
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 400; // keeps replies short and costs low

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const { system, messages } = body;

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages[] is required" });
      return;
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system, messages })
    });

    const data = await upstream.json();
    // Pass the Anthropic response straight through — the site expects data.content[]
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(502).json({ error: "Upstream error contacting the model" });
  }
}

