import TiktokDiscoveryModule from "./tiktok.js";

// 兼容：有些文件可能 export default，有些可能是命名导出
const TiktokDiscovery =
  TiktokDiscoveryModule?.default || TiktokDiscoveryModule;

export default async function handler(req, res) {
  // CORS：让 GitHub Pages 可以访问
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // ✅ 关键：用 new 实例化
    const api = new TiktokDiscovery();

    // 先做一个“健康检查”，确保不再崩
    return res.status(200).json({
      ok: true,
      message: "API handler is running",
      hint: "Next step: wire real endpoints (hashtags/songs/videos...)",
      url: req.url
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: String(e?.message || e)
    });
  }
}
