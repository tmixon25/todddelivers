<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Model Face-Off — Claude vs. open-source Llama | Todd Mixon</title>
<meta name="description" content="Same prompt, two models, side by side — Claude vs. open-source Llama — with the cost, speed, and the call on which to actually use." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --ink:#14202E; --ink-2:#35414F; --ink-soft:#5B6675;
    --paper:#F2F4F6; --card:#FFFFFF; --line:#E1E5EA; --line-dark:#2A3746;
    --brass:#9C6B2F; --brass-soft:#C89A5E; --on-ink:#E8ECF1; --on-ink-soft:#A9B4C0;
    --green:#1E9E6A; --purple:#6B57C4; --llama:#2D7D9A;
    --radius:14px; --shadow:0 1px 2px rgba(20,32,46,.04),0 12px 32px rgba(20,32,46,.08);
    --display:"Space Grotesk",system-ui,sans-serif; --body:"IBM Plex Sans",system-ui,sans-serif; --mono:"IBM Plex Mono",ui-monospace,monospace;
  }
  * { box-sizing:border-box; }
  body { margin:0; font-family:var(--body); background:var(--paper); color:var(--ink); line-height:1.6; -webkit-font-smoothing:antialiased; }
  a { color:inherit; }
  .wrap { max-width:1120px; margin:0 auto; padding:0 28px; }

  nav { background:var(--ink); color:var(--on-ink); }
  .nav-inner { display:flex; align-items:center; justify-content:space-between; height:60px; }
  .brand { font-family:var(--display); font-weight:700; font-size:17px; }
  .brand .dot { color:var(--brass-soft); }
  .nav-inner a { text-decoration:none; font-size:13.5px; color:var(--on-ink-soft); font-family:var(--mono); }
  .nav-inner a:hover { color:#fff; }

  header.hero { background:var(--ink); color:var(--on-ink); padding:40px 0 30px; }
  .eyebrow { font-family:var(--mono); font-size:11.5px; letter-spacing:1.6px; text-transform:uppercase; color:var(--brass-soft); margin:0 0 12px; }
  header.hero h1 { font-family:var(--display); font-weight:600; font-size:clamp(26px,3.6vw,36px); letter-spacing:-0.6px; margin:0 0 12px; color:#fff; }
  header.hero p { font-size:16px; color:var(--on-ink-soft); max-width:660px; margin:0; }

  .controls { padding:24px 0 6px; }
  .examples { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
  .ex { font-size:13px; font-family:var(--body); color:var(--ink-2); background:var(--card); border:1px solid var(--line); border-radius:20px; padding:8px 14px; cursor:pointer; transition:all .14s ease; }
  .ex:hover { border-color:var(--brass); color:var(--brass); }
  .composer { display:flex; gap:10px; }
  .composer textarea { flex:1; border:1px solid var(--line); border-radius:10px; padding:12px 14px; font-family:var(--body); font-size:14.5px; color:var(--ink); outline:none; resize:vertical; min-height:52px; }
  .composer textarea:focus { border-color:var(--brass); }
  .btn { border:none; background:var(--brass); color:#fff; font-family:var(--body); font-weight:600; font-size:14px; padding:0 22px; border-radius:10px; cursor:pointer; transition:background .15s ease; }
  .btn:hover { background:#855822; }
  .btn:disabled { background:#C8CDD4; cursor:not-allowed; }

  .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:26px 0 20px; }
  @media (max-width:820px){ .grid { grid-template-columns:1fr; } }
  .panel { background:var(--card); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; }
  .panel-head { padding:14px 20px; border-bottom:1px solid var(--line); display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .panel-head h2 { font-family:var(--display); font-weight:600; font-size:15px; margin:0; letter-spacing:-0.2px; }
  .panel-head .badge { width:9px; height:9px; border-radius:50%; flex:none; }
  .badge-claude { background:var(--purple); } .badge-llama { background:var(--llama); }
  .stat { font-family:var(--mono); font-size:11.5px; color:var(--ink-soft); }
  .panel-body { padding:18px 20px; font-size:14.5px; line-height:1.65; min-height:80px; }
  .panel-body p { margin:0 0 10px; } .panel-body strong { font-weight:600; }
  .muted { color:var(--ink-soft); }

  .verdict { background:var(--ink); color:var(--on-ink); border-radius:var(--radius); padding:26px 28px; margin-bottom:50px; }
  .verdict h3 { font-family:var(--display); font-weight:600; font-size:16px; color:#fff; margin:0 0 14px; }
  .verdict .vbody p { margin:0 0 12px; font-size:14.5px; color:var(--on-ink-soft); }
  .verdict .vbody strong { color:#fff; font-weight:600; }

  footer { border-top:1px solid var(--line); padding:20px 0 40px; font-size:12.5px; color:var(--ink-soft); }
  footer b { color:var(--ink-2); font-weight:600; }
</style>
</head>
<body>

<nav>
  <div class="wrap nav-inner">
    <div class="brand">Todd Mixon<span class="dot"> ·</span> Model Face-Off</div>
    <a href="/">&larr; Back to site</a>
  </div>
</nav>

<header class="hero">
  <div class="wrap">
    <p class="eyebrow">Claude vs. open-source Llama · build-vs-buy</p>
    <h1>Same prompt. Two models. Which should you actually use?</h1>
    <p>One prompt runs against Claude (a managed API) and Llama 3.1 (open weights, via Hugging Face's inference) at the same time — with the cost, speed, and the delivery-leader's call on which one fits the job. This is the decision behind every real AI project.</p>
  </div>
</header>

<div class="wrap">
  <div class="controls">
    <div class="examples" id="examples"></div>
    <div class="composer">
      <textarea id="prompt" placeholder="Type a prompt, or click an example above…"></textarea>
      <button class="btn" id="runBtn" type="button">Run face-off</button>
    </div>
  </div>

  <div class="grid">
    <div class="panel">
      <div class="panel-head"><h2><span class="badge badge-claude"></span> Claude · Haiku 4.5</h2><span class="stat" id="cStat"></span></div>
      <div class="panel-body" id="cOut"><span class="muted">Managed API — run a prompt to compare.</span></div>
    </div>
    <div class="panel">
      <div class="panel-head"><h2><span class="badge badge-llama"></span> Llama 3.1 8B · open source</h2><span class="stat" id="lStat"></span></div>
      <div class="panel-body" id="lOut"><span class="muted">Open weights via Hugging Face — run a prompt to compare.</span></div>
    </div>
  </div>

  <div class="verdict">
    <h3>🧠 The verdict</h3>
    <div class="vbody" id="verdict"><p class="muted" style="color:var(--on-ink-soft)">Run a prompt to see the cost / speed / quality read.</p></div>
  </div>

  <footer>
    Runs live against the <b>Anthropic API</b> (Claude) and <b>Hugging Face Inference</b> (Llama 3.1). Built by Todd Mixon.
  </footer>
</div>

<script>
const EXAMPLES = [
  ["🛠 Summarize an IT incident", "Summarize this IT incident and recommend next steps: Users report intermittent 500 errors on the payments API starting 09:15; error rate ~12%; a config change was deployed at 09:05."],
  ["📊 Exec status update", "Write a 3-sentence executive status update for an ERP migration that is two weeks behind schedule because of data-quality issues."],
  ["🧭 Prioritize AI use cases", "We have a long, unprioritized backlog of AI use-case ideas. Give me a simple framework to prioritize them for a mid-size company."],
  ["💡 Explain RAG to an exec", "Explain retrieval-augmented generation (RAG) to a non-technical executive in plain English."]
];

const promptEl = document.getElementById('prompt');
const runBtn = document.getElementById('runBtn');
const cOut = document.getElementById('cOut'), lOut = document.getElementById('lOut');
const cStat = document.getElementById('cStat'), lStat = document.getElementById('lStat');
const verdictEl = document.getElementById('verdict');
let busy = false;

function md(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .split(/\n\n+/).map(p => '<p>' + p.replace(/\n/g,'<br>') + '</p>').join('');
}

const exWrap = document.getElementById('examples');
EXAMPLES.forEach(([label, text]) => {
  const b = document.createElement('button');
  b.className = 'ex'; b.type = 'button'; b.textContent = label;
  b.addEventListener('click', () => { promptEl.value = text; run(); });
  exWrap.appendChild(b);
});

async function run() {
  const prompt = promptEl.value.trim();
  if (busy || !prompt) return;
  busy = true; runBtn.disabled = true;
  cStat.textContent = ''; lStat.textContent = '';
  cOut.innerHTML = '<span class="muted">Thinking…</span>';
  lOut.innerHTML = '<span class="muted">Thinking… (open model may take a moment to wake up)</span>';
  verdictEl.innerHTML = '<p class="muted" style="color:var(--on-ink-soft)">Running both models…</p>';
  try {
    const res = await fetch('/api/faceoff', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Request failed');
    cOut.innerHTML = md(data.claude.text);
    cStat.textContent = '⏱ ' + (data.claude.ms/1000).toFixed(1) + 's' + (data.claude.cost != null ? '  ·  💲 ~$' + data.claude.cost.toFixed(4) : '');
    lOut.innerHTML = md(data.llama.text);
    lStat.textContent = '⏱ ' + (data.llama.ms/1000).toFixed(1) + 's  ·  💲 ~$0';
    verdictEl.innerHTML = md(data.verdict);
  } catch (e) {
    verdictEl.innerHTML = '<p style="color:#E7A6A2">Something went wrong: ' + e.message + '</p>';
  } finally {
    busy = false; runBtn.disabled = false;
  }
}
runBtn.addEventListener('click', run);
</script>
</body>
</html>
