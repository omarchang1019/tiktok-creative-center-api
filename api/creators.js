import TiktokDiscovery from "./tiktok.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
}
function num(v, d) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url, "https://dummy.base");
  const country = (url.searchParams.get("country") || "US").toUpperCase();
  const page = num(url.searchParams.get("page"), 1);
  const limit = num(url.searchParams.get("limit"), 20);

  try {
    // ✅ creators 不传 period
    const data = await TiktokDiscovery.getTrendingCreators(country, page, limit);
    return res.status(200).json({ ok: true, country, page, limit, data });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
