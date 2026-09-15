// api/crypto-pulse.js — Vercel Serverless Function (Node.js)
// Live loop: pull real crypto prices (CoinGecko) -> update Snowflake ->
// capture the changes via a Snowflake Stream (CDC) -> ask Claude to narrate
// what changed and why it matters. No external npm packages (Node crypto only).

import crypto from "crypto";

export const maxDuration = 60; // give the Snowflake warehouse time to resume

// ---- Config (from Vercel Environment Variables) ----
const SF_ACCOUNT = process.env.SNOWFLAKE_ACCOUNT;         // e.g. BOMGGZA-CJ98643
const SF_USER    = process.env.SNOWFLAKE_USER;            // e.g. TMIXON25
const SF_KEY_B64 = process.env.SNOWFLAKE_PRIVATE_KEY_B64; // base64 of your private key
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;      // you already have this

const SF_DB = "LIVE_DATA_DEMO";
const SF_SCHEMA = "CRYPTO";
const SF_WAREHOUSE = "COMPUTE_WH";
const SF_ROLE = "ACCOUNTADMIN";

const COINS = [
  { id: "bitcoin",  symbol: "BTC",  name: "Bitcoin"  },
  { id: "ethereum", symbol: "ETH",  name: "Ethereum" },
  { id: "solana",   symbol: "SOL",  name: "Solana"   },
  { id: "cardano",  symbol: "ADA",  name: "Cardano"  },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" }
];

// ---- Snowflake key-pair JWT, built with Node's crypto (no libraries) ----
function b64url(buf) {
  return Buffer.from(buf).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function buildJwt() {
  const pem = Buffer.from(SF_KEY_B64, "base64").toString("utf8");
  const privateKey = crypto.createPrivateKey({ key: pem, format: "pem" });

  // Fingerprint = SHA256 of the DER (SPKI) public key, base64, prefixed "SHA256:"
  const pubDer = crypto.createPublicKey(privateKey).export({ type: "spki", format: "der" });
  const fp = "SHA256:" + crypto.createHash("sha256").update(pubDer).digest("base64");

  const account = SF_ACCOUNT.toUpperCase();
  const user = SF_USER.toUpperCase();
  const qualified = `${account}.${user}`;
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const payload = { iss: `${qualified}.${fp}`, sub: qualified, iat: now, exp: now + 3600 };

  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const signature = b64url(crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey));
  return `${signingInput}.${signature}`;
}

// ---- Execute one SQL statement via the Snowflake SQL REST API ----
async function sfExec(statement, jwt) {
  const host = SF_ACCOUNT.toLowerCase() + ".snowflakecomputing.com";
  const res = await fetch(`https://${host}/api/v2/statements`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "X-Snowflake-Authorization-Token-Type": "KEYPAIR_JWT",
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      statement, timeout: 60,
      database: SF_DB, schema: SF_SCHEMA, warehouse: SF_WAREHOUSE, role: SF_ROLE
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Snowflake ${res.status}: ${data.message || JSON.stringify(data)}`);
  const cols = (data.resultSetMetaData?.rowType || []).map(c => c.name);
  return (data.data || []).map(r => {
    const o = {}; cols.forEach((c, i) => { o[c] = r[i]; }); return o;
  });
}

// ---- Ask Claude to narrate the captured changes ----
async function narrate(changes) {
  const system = "You are a sharp financial data analyst. Given crypto price changes just captured from a live feed, write a concise plain-English business narrative (3-4 sentences) on what changed in the last few minutes and why it matters. Lead with the biggest mover, be specific with numbers, flag any risk or opportunity, and keep it useful for a decision-maker. No hype, no disclaimers.";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: "Changes just captured:\n" + JSON.stringify(changes, null, 2) }]
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Claude ${res.status}: ${data.error?.message || "error"}`);
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
}

// ---- Handler ----
export default async function handler(req, res) {
  try {
    // 1) Live prices from CoinGecko (free, no key)
    const ids = COINS.map(c => c.id).join(",");
    const cg = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    ).then(r => r.json());

    // Build one UPDATE (CASE per coin) so the Stream captures all changes at once
    const priceCase = [], changeCase = [], mcapCase = [];
    for (const c of COINS) {
      const d = cg[c.id]; if (!d) continue;
      priceCase.push(`WHEN '${c.id}' THEN ${Number(d.usd) || 0}`);
      changeCase.push(`WHEN '${c.id}' THEN ${Number(d.usd_24h_change) || 0}`);
      mcapCase.push(`WHEN '${c.id}' THEN ${Number(d.usd_market_cap) || 0}`);
    }
    const updateSql = `
      UPDATE crypto_prices SET
        price_usd = CASE coin_id ${priceCase.join(" ")} ELSE price_usd END,
        change_24h_pct = CASE coin_id ${changeCase.join(" ")} ELSE change_24h_pct END,
        market_cap_usd = CASE coin_id ${mcapCase.join(" ")} ELSE market_cap_usd END,
        updated_at = CURRENT_TIMESTAMP()
      WHERE coin_id IN (${COINS.map(c => `'${c.id}'`).join(",")});`;

    const jwt = buildJwt();

    // 2) Apply the update -> Stream records the changes (real CDC)
    await sfExec(updateSql, jwt);

    // 3) Consume the Stream into the change log (this advances the Stream offset)
    await sfExec(`
      INSERT INTO crypto_change_log (coin_id, symbol, name, new_price, change_24h_pct, market_cap_usd, action, is_update, captured_at)
      SELECT coin_id, symbol, name, price_usd, change_24h_pct, market_cap_usd, METADATA$ACTION, METADATA$ISUPDATE, CURRENT_TIMESTAMP()
      FROM crypto_changes
      WHERE METADATA$ACTION = 'INSERT';`, jwt);

    // 4) Read just this pull's changes
    const rows = await sfExec(`
      SELECT symbol, name, new_price, change_24h_pct, market_cap_usd
      FROM crypto_change_log
      WHERE captured_at = (SELECT MAX(captured_at) FROM crypto_change_log)
      ORDER BY market_cap_usd DESC;`, jwt);

    const changes = rows.map(r => ({
      symbol: r.SYMBOL, name: r.NAME,
      price: Number(r.NEW_PRICE),
      change24h: Number(r.CHANGE_24H_PCT),
      marketCap: Number(r.MARKET_CAP_USD)
    }));

    // 4b) Rolling history — the last 15 minutes of captured changes
    const recentRows = await sfExec(`
      SELECT TO_VARCHAR(captured_at, 'HH24:MI:SS') AS t, symbol, new_price, change_24h_pct
      FROM crypto_change_log
      WHERE captured_at > DATEADD(minute, -15, CURRENT_TIMESTAMP())
      ORDER BY captured_at DESC, market_cap_usd DESC;`, jwt);
    const recent = recentRows.map(r => ({
      t: r.T, symbol: r.SYMBOL, price: Number(r.NEW_PRICE), change24h: Number(r.CHANGE_24H_PCT)
    }));

    // 5) Narrate
    const narrative = changes.length ? await narrate(changes) : "No changes captured in this pull.";

    res.status(200).json({ ok: true, ranAt: new Date().toISOString(), changes, recent, narrative });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
