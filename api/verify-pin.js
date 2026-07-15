export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }
  const { pin } = req.body || {};
  const ok = !!pin && !!process.env.ADMIN_PIN && pin === process.env.ADMIN_PIN;
  return res.status(200).json({ ok });
}
