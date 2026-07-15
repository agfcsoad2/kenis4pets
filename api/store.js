import { put, list } from "@vercel/blob";

const BLOB_PATH = "kenis4pets/store-data.json";
const LIST_PREFIX = "kenis4pets/";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { blobs } = await list({ prefix: LIST_PREFIX });
      const match = blobs.find((b) => b.pathname === BLOB_PATH) || blobs.find((b) => b.pathname.startsWith("kenis4pets/store-data"));
      if (!match) return res.status(200).json({ exists: false, debug: { allPathnames: blobs.map((b) => b.pathname), hasToken: !!process.env.BLOB_READ_WRITE_TOKEN } });
      const r = await fetch(`${match.url}?t=${Date.now()}`, { cache: "no-store" });
      const data = await r.json();
      return res.status(200).json({ exists: true, data, debug: { matchedPathname: match.pathname, blobUploadedAt: match.uploadedAt, blobSize: match.size } });
    } catch (err) {
      console.error("Store GET error:", err);
      return res.status(500).json({ error: "No se pudo cargar el catálogo", debug: String(err) });
    }
  }

  if (req.method === "POST") {
    const pin = req.headers["x-admin-pin"];
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return res.status(401).json({ error: "PIN incorrecto" });
    }
    try {
      const { products, categories, config } = req.body;
      if (!Array.isArray(products) || !Array.isArray(categories) || !config) {
        return res.status(400).json({ error: "Datos incompletos" });
      }
      const json = JSON.stringify({ products, categories, config, updatedAt: new Date().toISOString() });
      const result = await put(BLOB_PATH, json, {
        access: "public",
        contentType: "application/json",
        allowOverwrite: true,
        addRandomSuffix: false,
        cacheControlMaxAge: 0,
      });
      console.log("BLOB PUT OK:", JSON.stringify({ pathname: result.pathname, url: result.url }));
      return res.status(200).json({ ok: true, debug: { pathname: result.pathname, url: result.url } });
    } catch (err) {
      console.error("Store POST error:", err);
      return res.status(500).json({ error: "No se pudo guardar", debug: String(err) });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método no permitido" });
}
