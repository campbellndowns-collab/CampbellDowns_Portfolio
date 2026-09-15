/**
 * First-party traffic API for the portfolio.
 *
 * POST /api/traffic  { type, path, name?, vid? }
 * GET  /api/traffic  ?days=30
 *
 * Uses Vercel KV when KV_REST_API_URL + KV_REST_API_TOKEN are set
 * (Vercel → Storage → Create KV Database / Upstash). Falls back to an
 * in-memory store for local testing.
 */

const KEY = "portfolio:traffic:v1";
const MAX_EVENTS = 5000;
const MEMORY = { events: [] };

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function configured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function loadEvents() {
  if (!configured()) return MEMORY.events;
  try {
    const { kv } = require("@vercel/kv");
    const data = await kv.get(KEY);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("traffic load failed", error);
    return MEMORY.events;
  }
}

async function saveEvents(events) {
  const trimmed = events.slice(-MAX_EVENTS);
  if (!configured()) {
    MEMORY.events = trimmed;
    return trimmed;
  }
  try {
    const { kv } = require("@vercel/kv");
    await kv.set(KEY, trimmed);
    return trimmed;
  } catch (error) {
    console.error("traffic save failed", error);
    MEMORY.events = trimmed;
    return trimmed;
  }
}

function dayKey(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

function summarize(events, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = events.filter((event) => event.t >= cutoff);

  const byDay = {};
  const byPath = {};
  const byAction = {};
  const visitors = new Set();

  for (const event of recent) {
    const day = dayKey(event.t);
    byDay[day] ||= { views: 0, actions: 0, visitors: new Set() };
    if (event.type === "pageview") {
      byDay[day].views += 1;
      byPath[event.path] = (byPath[event.path] || 0) + 1;
      if (event.vid) {
        visitors.add(`${day}:${event.vid}`);
        byDay[day].visitors.add(event.vid);
      }
    } else {
      byDay[day].actions += 1;
      const label = event.name || event.type;
      byAction[label] = (byAction[label] || 0) + 1;
    }
  }

  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const row = byDay[key];
    series.push({
      day: key,
      views: row ? row.views : 0,
      actions: row ? row.actions : 0,
      visitors: row ? row.visitors.size : 0,
    });
  }

  const topPages = Object.entries(byPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([path, count]) => ({ path, count }));

  const topActions = Object.entries(byAction)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, count]) => ({ name, count }));

  return {
    configured: configured(),
    days,
    totals: {
      views: recent.filter((e) => e.type === "pageview").length,
      actions: recent.filter((e) => e.type !== "pageview").length,
      visitors: visitors.size,
      events: recent.length,
    },
    series,
    topPages,
    topActions,
    updatedAt: new Date().toISOString(),
  };
}

function normalizePath(value) {
  try {
    const url = new URL(String(value || "/"), "https://www.campbelldowns.com");
    let path = url.pathname || "/";
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    if (path.endsWith("/index.html")) path = path.slice(0, -11) || "/";
    return path.slice(0, 180) || "/";
  } catch {
    return "/";
  }
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
    const events = await loadEvents();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(summarize(events, days));
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const type = String(body.type || "").slice(0, 40);
  if (!type) {
    res.status(400).json({ error: "missing_type" });
    return;
  }

  const path = normalizePath(body.path || "/");
  if (path.includes("traffic")) {
    res.status(204).end();
    return;
  }

  const event = {
    t: Date.now(),
    type,
    path,
    name: body.name ? String(body.name).slice(0, 80) : undefined,
    vid: body.vid ? String(body.vid).slice(0, 64) : undefined,
  };

  const events = await loadEvents();
  events.push(event);
  await saveEvents(events);
  res.status(204).end();
};
