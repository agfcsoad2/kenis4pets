import Stripe from "stripe";

// La clave secreta vive SOLO en el servidor (variable de entorno en Vercel).
// Nunca se expone al navegador.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { cart, customer } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    // Reconstruimos los line items en el servidor a partir de id + qty.
    // Nunca confiamos en el precio que llega del cliente.
    const line_items = cart.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image && item.image.startsWith("http") ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // céntimos
      },
      quantity: item.qty,
    }));

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: customer?.email || undefined,
      shipping_address_collection: { allowed_countries: ["ES", "PT", "FR", "AD"] },
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "No se pudo iniciar el pago" });
  }
}
