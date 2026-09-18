// api/faceoff.js — Vercel Serverless Function (Node.js)
// Runs one prompt against Claude (managed API) and Llama 3.1 (open weights,
// via Hugging Face's Inference API) and returns both answers + a verdict.

export const maxDuration = 60;

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const HF_TOKEN = process.env.HF_TOKEN;
const CLAUDE_MODEL = "claude-haiku-4-5-20251001";
const LLAMA_MODEL = "meta-llama/Llama-3.1-8B-Instruct";

async function callClaude(prompt) {
  const t0 = Date.now();
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 500, messages: [{ role: "user", content: prompt }] })
    });
    const ms = Date.now() - t0;
    const data = await r.json();
    if (!r.ok) return { text: `_Claude error ${r.status}: ${(data.error?.message || "").slice(0, 160)}_`, ms, cost: null };
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    const u = data.usage || {};
    const cost = (u.input_tokens || 0) / 1e6 * 1 + (u.output_tokens || 0) / 1e6 * 5; // Haiku 4.5 $1/$5 per M
    return { text, ms, cost };
  } catch (e) {
    return { text: `_Claude unavailable: ${String(e.message || e).slice(0, 160)}_`, ms: Date.now() - t0, cost: null };
  }
}

async function callLlama(prompt) {
  const t0 = Date.now();
  try {
    const r = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": `Bearer ${HF_TOKEN}` },
      body: JSON.stringify({ model: LLAMA_MODEL, max_tokens: 500, messages: [{ role: "user", content: prompt }] })
    });
    const ms = Date.now() - t0;
    const data = await r.json();
    if (!r.ok) {
      const msg = (data.error?.message || data.error || JSON.stringify(data)).toString().slice(0, 180);
      return { text: `_Llama unavailable (${r.status}): ${msg}_\n\n(Free open-model inference can be rate-limited or waking up — try again in a moment.)`, ms };
    }
    const text = (data.choices?.[0]?.message?.content || "").trim();
    return { text: text || "_Llama returned no content._", ms };
  } catch (e) {
    return { text: `_Llama unavailable: ${String(e.message || e).slice(0, 160)}_`, ms: Date.now() - t0 };
  }
}

function buildVerdict(c, l) {
  const cs = (c.ms / 1000).toFixed(1), ls = (l.ms / 1000).toFixed(1);
  const faster = c.ms < l.ms ? "Claude" : "Llama";
  const parts = [`**Speed** — Claude ${cs}s vs. Llama ${ls}s. ${faster} was quicker this run.`];
  if (c.cost != null) parts.push(`**Cost** — Claude answered for about **$${c.cost.toFixed(4)}**. The open Llama model is effectively **free** to run on your own hardware (open weights, self-hostable).`);
  parts.push("**The delivery call** — read both answers. If the open model is *good enough* for the task, its cost advantage compounds enormously at scale — that's when you self-host. When quality, safety, or reliability are non-negotiable, you pay for the managed API. Matching the model to the job, not defaulting to the biggest one, is the decision that saves real money.");
  return parts.join("\n\n");
}

export default async function handler(req, res) {
  let prompt = "";
  try {
    if (req.body) prompt = (typeof req.body === "string" ? JSON.parse(req.body) : req.body).prompt || "";
  } catch (e) { /* ignore */ }
  if (!prompt && req.query) prompt = req.query.prompt || "";
  if (!prompt.trim()) { res.status(400).json({ ok: false, error: "No prompt provided" }); return; }

  const [claude, llama] = await Promise.all([callClaude(prompt), callLlama(prompt)]);
  res.status(200).json({ ok: true, claude, llama, verdict: buildVerdict(claude, llama) });
}
