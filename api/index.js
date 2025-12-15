import TiktokDiscovery from "./tiktok.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
}

function num(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url, "https://dummy.base");
  const pathname = url.pathname;

  // Common query params
  const country = (url.searchParams.get("country") || "US").toUpperCase();
  const period = num(url.searchParams.get("period"), 7);   // 7 / 30 / 120
  const page   = num(url.searchParams.get("page"), 1);

  // different max limits per type (your lib enforces it too)
  const limit  = num(url.searchParams.get("limit"), 20);

  try {
    // Health check
    if (pathname === "/api") {
      return res.status(200).json({ ok: true, message: "API is alive" });
    }

    // ✅ Trending Hashtags
    if (pathname === "/api/hashtags") {
      // 注意：你的库里 country_code 参数名是 country_code
      const data = await TiktokDiscovery.getTrendingHashtag(country, page, limit, period);
      return res.status(200).json({ ok: true, country, period, page, limit, data });
    }

    // ✅ Trending Songs
    if (pathname === "/api/songs") {
      const data = await TiktokDiscovery.getTrendingSongs(country, page, limit, period);
      return res.status(200).json({ ok: true, country, period, page, limit, data });
    }

    return res.status(404).json({ ok: false, error: "Not Found", pathname });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
