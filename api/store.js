import { put, list } from "@vercel/blob";

const BLOB_PATH = "kenis4pets/store-data.json";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { blobs } = await list({ prefix: BLOB_PATH });
      const match = blobs.find((b) => b.pathname === BLOB_PATH);
      if (!match) return res.status(200).json({ exists: false });
      const r = await fetch(match.url, { cache: "no-store" });
      const data = await r.json();
      return res.status(200).json({ exists: true, data });
    } catch (err) {
      console.error("Store GET error:", err);
      return res.status(500).json({ error: "No se pudo cargar el catálogo" });
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
      await put(BLOB_PATH, json, {
        access: "public",
        contentType: "application/json",
        allowOverwrite: true,
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Store POST error:", err);
      return res.status(500).json({ error: "No se pudo guardar" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Método no permitido" });
}
