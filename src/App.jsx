import { useState, useEffect, useReducer, useRef } from "react";

/* ═══════════════ DEFAULT SITE CONFIG ═══════════════ */
const DEFAULT_CONFIG = {
  brand: { name: "PinaWoof", slogan: "Accesorios con amor", icon: "/brand/pinawoof-dog.png" },
  hero: {
    title: "Accesorios pensados para tu mascota",
    subtitle: "Piezas únicas, cómodas y hechas con cuidado para tu compañero de siempre",
    show: true,
  },
  colors: {
    primary: "#9C3A4C",
    secondary: "#1A1A1A",
    accent: "#D49AA3",
    highlight: "#D49AA3",
    background: "#F5F2EC",
    headerGradient: ["#9C3A4C", "#9C3A4C", "#9C3A4C"],
    heroGradient: ["#F5F2EC", "#F5F2EC", "#F5F2EC"],
  },
  footer: { text: "PinaWoof © 2026 — Hecho con amor para tus mascotas", show: true },
  nav: { showHome: true, showAdmin: true, showCart: true },
  sections: { showFeatured: true, showSearch: true, showCategories: true, featuredTitle: "Destacados", catalogTitle: "Catálogo" },
};

const DEFAULT_CATEGORIES = ["Collares", "Ropa", "Juguetes", "Camas", "Accesorios"];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Collar Arcoíris", price: 18.99, category: "Collares", image: "🌈", desc: "Collar ajustable con diseño multicolor para perros medianos", stock: 15, featured: true },
  { id: 2, name: "Suéter Patitas", price: 24.99, category: "Ropa", image: "🐾", desc: "Suéter tejido con estampado de patitas, ideal para invierno", stock: 8, featured: true },
  { id: 3, name: "Hueso Mordedor", price: 12.50, category: "Juguetes", image: "🦴", desc: "Juguete resistente de goma natural, seguro y duradero", stock: 25, featured: false },
  { id: 4, name: "Cama Nube Rosa", price: 45.00, category: "Camas", image: "☁️", desc: "Cama ultrasuave con relleno premium, lavable a máquina", stock: 5, featured: true },
  { id: 5, name: "Bandana Tropical", price: 9.99, category: "Accesorios", image: "🌺", desc: "Bandana con estampado tropical, tela fresca y ligera", stock: 30, featured: false },
  { id: 6, name: "Arnés Estrellado", price: 22.00, category: "Collares", image: "⭐", desc: "Arnés acolchado con estrellas reflectantes para paseos nocturnos", stock: 12, featured: true },
  { id: 7, name: "Pijama Ositos", price: 19.99, category: "Ropa", image: "🧸", desc: "Pijama de algodón con diseño de ositos, suave al tacto", stock: 10, featured: false },
  { id: 8, name: "Pelota Sonora", price: 8.99, category: "Juguetes", image: "🎾", desc: "Pelota con cascabel interno, estimula el juego activo", stock: 40, featured: false },
  { id: 9, name: "Comedero Cerámico", price: 16.50, category: "Accesorios", image: "🍽️", desc: "Comedero de cerámica antideslizante con diseño artesanal", stock: 18, featured: false },
  { id: 10, name: "Cama Donut Lila", price: 39.99, category: "Camas", image: "🍩", desc: "Cama en forma de donut, abraza a tu mascota mientras duerme", stock: 7, featured: true },
  { id: 11, name: "Correa Retráctil", price: 15.99, category: "Collares", image: "🔗", desc: "Correa retráctil de 5m con freno de seguridad", stock: 20, featured: false },
  { id: 12, name: "Chubasquero Fun", price: 28.00, category: "Ropa", image: "🌧️", desc: "Impermeable con capucha y patitas reflectantes", stock: 6, featured: false },
];

/* ═══════════════ ICONS (SVG lineales, sustituyen emojis) ═══════════════ */
const Icon = ({ path, size = 20, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);
const IconHome = (p) => <Icon {...p} path={<><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>} />;
const IconSettings = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>} />;
const IconCart = (p) => <Icon {...p} path={<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>} />;
const IconSearch = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>} />;
const IconPlus = (p) => <Icon {...p} path={<><path d="M12 5v14M5 12h14" /></>} />;
const IconMinus = (p) => <Icon {...p} path={<><path d="M5 12h14" /></>} />;
const IconTrash = (p) => <Icon {...p} path={<><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /></>} />;
const IconCheck = (p) => <Icon {...p} path={<><path d="M20 6 9 17l-5-5" /></>} />;
const IconLock = (p) => <Icon {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>} />;
const IconClose = (p) => <Icon {...p} path={<><path d="M18 6 6 18M6 6l12 12" /></>} />;
const IconArrowLeft = (p) => <Icon {...p} path={<><path d="M19 12H5M12 19l-7-7 7-7" /></>} />;
const IconArrowRight = (p) => <Icon {...p} path={<><path d="M5 12h14M12 5l7 7-7 7" /></>} />;

/* ═══════════════ HELPERS ═══════════════ */
const isUrl = (s) => s && (s.startsWith("http") || s.startsWith("data:") || s.startsWith("/"));

const ProductImage = ({ src, size = 48, style: sx = {} }) =>
  isUrl(src)
    ? <img src={src} alt="" style={{ width: size, height: size, objectFit: "cover", borderRadius: 12, ...sx }} />
    : <span style={{ fontSize: size * 0.75, ...sx }}>{src}</span>;

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const ex = state.find((i) => i.id === action.product.id);
      if (ex) return state.map((i) => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE": return state.filter((i) => i.id !== action.id);
    case "UPDATE_QTY": return state.map((i) => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case "CLEAR": return [];
    default: return state;
  }
}

/* ═══════════════ IMAGE UPLOADER ═══════════════ */
function ImageUploader({ value, onChange, size = "normal" }) {
  const [mode, setMode] = useState(value && isUrl(value) ? (value.startsWith("data:") ? "gallery" : "url") : value ? "emoji" : "gallery");
  const [error, setError] = useState("");
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX = 2 * 1024 * 1024;
  const fmt = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return; setError("");
    if (!ALLOWED.includes(f.type)) { setError(`❌ Formato "${f.type.split("/")[1] || "?"}" no soportado. Solo JPG, PNG, WEBP, GIF.`); e.target.value = ""; return; }
    if (f.size > MAX) { setError(`❌ Pesa ${fmt(f.size)}, máximo 2 MB.`); e.target.value = ""; return; }
    const r = new FileReader(); r.onload = (ev) => onChange(ev.target.result); r.readAsDataURL(f);
  };

  const sm = size === "small";
  const tA = sm ? ST.imgToggleActiveSm : ST.imgToggleActive;
  const tB = sm ? ST.imgToggleBtnSm : ST.imgToggleBtn;

  return (
    <div style={sm ? {} : ST.imageSection}>
      {!sm && <p style={ST.imageSectionTitle}>📷 Imagen del producto</p>}
      <div style={ST.imageToggle}>
        <button style={mode === "gallery" ? tA : tB} onClick={() => { setMode("gallery"); onChange(""); setError(""); }}>📱{sm ? "" : " Galería"}</button>
        <button style={mode === "url" ? tA : tB} onClick={() => { setMode("url"); onChange(""); setError(""); }}>🔗{sm ? "" : " URL"}</button>
        <button style={mode === "emoji" ? tA : tB} onClick={() => { setMode("emoji"); onChange(""); setError(""); }}>😀{sm ? "" : " Emoji"}</button>
      </div>
      {mode === "gallery" && <>
        <label style={sm ? ST.uploadBtnSm : ST.uploadBtn}><input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />📷 {sm ? "Foto" : "Elegir de galería"}</label>
        {!sm && <p style={ST.imgHelp}>JPG, PNG, WEBP, GIF · Máx 2MB</p>}
        {error && <div style={ST.imgErrorBox}><p style={ST.imgErrorText}>{error}</p></div>}
        {value && value.startsWith("data:") && <div style={ST.imgPreview}><img src={value} alt="" style={ST.imgPreviewImg} /><div style={ST.imgPreviewActions}><p style={ST.imgPreviewLabel}>✅ Cargada</p><button style={ST.imgRemoveBtn} onClick={() => onChange("")}>✕</button></div></div>}
      </>}
      {mode === "url" && <>
        <input style={sm ? ST.inputSm : ST.input} placeholder="URL de la imagen" value={isUrl(value) && !value.startsWith("data:") ? value : ""} onChange={(e) => onChange(e.target.value)} />
        {value && isUrl(value) && !value.startsWith("data:") && <div style={ST.imgPreview}><img src={value} alt="" style={ST.imgPreviewImg} onError={(e) => e.target.style.display = "none"} /></div>}
      </>}
      {mode === "emoji" && <>
        <input style={sm ? ST.inputSm : ST.input} placeholder="Emoji ej: 🐾" value={!isUrl(value) ? value : ""} onChange={(e) => onChange(e.target.value)} />
        {value && !isUrl(value) && <div style={ST.emojiPreview}><span style={{ fontSize: sm ? 32 : 48 }}>{value}</span></div>}
      </>}
    </div>
  );
}

/* ═══════════════ MAIN APP ═══════════════ */
export default function PinaWoof() {
  const [page, setPage] = useState("home");
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPinValue, setAdminPinValue] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const catalogRef = useRef(null);
  const [syncStatus, setSyncStatus] = useState(""); // "", "saving", "saved", "error"
  const hydrated = useRef(false);

  // Cargar catálogo real desde el servidor (Vercel Blob) al arrancar
  useEffect(() => {
    fetch("/api/store")
      .then((r) => r.json())
      .then((res) => {
        if (res.exists && res.data) {
          if (res.data.products) setProducts(res.data.products);
          if (res.data.categories) setCategories(res.data.categories);
          if (res.data.config) setConfig((prev) => ({ ...prev, ...res.data.config }));
        }
      })
      .catch((err) => console.error("No se pudo cargar el catálogo remoto:", err))
      .finally(() => { hydrated.current = true; setDataLoaded(true); });
  }, []);

  // Guardar automáticamente cualquier cambio del admin (productos, categorías, config)
  useEffect(() => {
    if (!hydrated.current || !adminAuth || !adminPinValue) return;
    setSyncStatus("saving");
    const t = setTimeout(() => {
      fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPinValue },
        body: JSON.stringify({ products, categories, config }),
      })
        .then((r) => r.json())
        .then((res) => setSyncStatus(res.ok ? "saved" : "error"))
        .catch(() => setSyncStatus("error"));
    }, 700);
    return () => clearTimeout(t);
  }, [products, categories, config, adminAuth, adminPinValue]);

  // Al volver de Stripe Checkout, Stripe añade ?checkout=success o ?checkout=cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("checkout");
    if (result === "success") {
      dispatch({ type: "CLEAR" });
      setPage("checkout");
      setOrderPlaced(true);
    } else if (result === "cancel") {
      setPage("checkout");
      setOrderPlaced(false);
    }
    if (result) window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const C = config.colors;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const notify = (m) => { setNotification(m); setTimeout(() => setNotification(null), 2500); };
  const addToCart = (p) => { dispatch({ type: "ADD", product: p }); notify(`${p.name} añadido al carrito`); };
  const allCats = ["Todos", ...categories];
  const filtered = products.filter((p) => (selectedCategory === "Todos" || p.category === selectedCategory) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const dyn = {
    header: { background: "rgba(245,242,236,0.85)", padding: 0, position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(26,26,26,0.08)" },
    hero: { background: "transparent", borderTop: `1px solid ${C.primary}33`, borderBottom: `1px solid ${C.primary}33`, padding: "44px 4px", margin: "8px 0 24px", position: "relative", overflow: "hidden" },
    app: { fontFamily: "'Poppins','Segoe UI',sans-serif", background: C.background, minHeight: "100vh", color: "#1A1A1A", position: "relative" },
    catActive: { whiteSpace: "nowrap", background: C.primary, border: `1px solid ${C.primary}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" },
    addBtn: { background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
    badge: { position: "absolute", top: -4, right: -4, background: C.highlight, color: "#1A1A1A", borderRadius: 50, width: 20, height: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.primary}` },
    grad: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
    heroGlow: { position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 80% at 15% 30%, ${C.primary}14 0%, transparent 65%)`, pointerEvents: "none" },
    heroTag: { display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.primary, border: `1px solid ${C.primary}44`, padding: "5px 12px", borderRadius: 20, marginBottom: 16 },
    eyebrow: { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: C.primary, marginTop: 20 },
  };

  return (
    <div style={dyn.app}>
      {notification && <div style={ST.toast}><span>{notification}</span></div>}

      <header style={dyn.header} className="k4p-header">
        <div style={ST.headerInner}>
          <div style={ST.logoArea} onClick={() => { setPage("home"); setShowCart(false); setSelectedProduct(null); }}>
            <img src="/brand/pinawoof-dog.png" alt="" style={ST.headerIcon} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <img src="/brand/pinawoof-wordmark.png" alt={config.brand.name} style={ST.wordmarkImg} />
              <p style={ST.logoSub}>{config.brand.slogan}</p>
            </div>
          </div>
          <div style={ST.headerActions}>
            {config.nav.showHome && <button style={ST.navBtn} onClick={() => { setPage("home"); setShowCart(false); setSelectedProduct(null); }}><IconHome color="#1A1A1A" size={19} /></button>}
            {config.nav.showAdmin && <button style={ST.navBtn} onClick={() => { setPage("admin"); setShowCart(false); }}><IconSettings color="#1A1A1A" size={19} /></button>}
            {config.nav.showCart && <button style={ST.cartBtn} onClick={() => setShowCart(!showCart)}><IconCart color="#1A1A1A" size={19} />{cartCount > 0 && <span style={dyn.badge}>{cartCount}</span>}</button>}
          </div>
        </div>
      </header>

      {showCart && (
        <div style={ST.overlay} onClick={() => setShowCart(false)}>
          <div style={ST.cartSidebar} onClick={(e) => e.stopPropagation()}>
            <div style={ST.cartHeader}><h2 style={ST.cartTitle}>Tu carrito</h2><button style={ST.closeBtn} onClick={() => setShowCart(false)}><IconClose size={18} /></button></div>
            {cart.length === 0 ? <div style={ST.emptyCart}><IconCart size={40} color="#ddd" /><p style={{ color: "#888", marginTop: 12 }}>Tu carrito está vacío</p></div> : <>
              <div style={ST.cartItems}>{cart.map((it) => (
                <div key={it.id} style={ST.cartItem}>
                  <div style={ST.cartItemBox}><ProductImage src={it.image} size={40} /></div>
                  <div style={{ flex: 1 }}>
                    <p style={ST.cartItemName}>{it.name}</p>
                    <p style={{ ...ST.cartItemPrice, color: C.primary }}>${it.price.toFixed(2)}</p>
                    <div style={ST.qtyRow}><button style={ST.qtyBtn} onClick={() => dispatch({ type: "UPDATE_QTY", id: it.id, qty: it.qty - 1 })}>−</button><span style={ST.qtyNum}>{it.qty}</span><button style={ST.qtyBtn} onClick={() => dispatch({ type: "UPDATE_QTY", id: it.id, qty: it.qty + 1 })}>+</button></div>
                  </div>
                  <button style={ST.removeBtn} onClick={() => dispatch({ type: "REMOVE", id: it.id })}><IconTrash size={16} /></button>
                </div>
              ))}</div>
              <div style={ST.cartFooter}>
                <div style={ST.cartTotalRow}><span style={{ fontWeight: 700 }}>Total:</span><span style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>${cartTotal.toFixed(2)}</span></div>
                <button style={{ ...ST.checkoutBtn, background: dyn.grad }} onClick={() => { setShowCart(false); setPage("checkout"); }}>Ir a pagar</button>
              </div>
            </>}
          </div>
        </div>
      )}

      <main style={ST.main}>
        {page === "home" && !selectedProduct && <div>
          {config.hero.show && <div style={dyn.hero}>
            <div style={dyn.heroGlow} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <span style={dyn.heroTag}>Accesorios para mascotas</span>
              <h2 style={ST.heroTitle}>{config.hero.title}</h2>
              <p style={ST.heroSub}>{config.hero.subtitle}</p>
              <button style={ST.heroCta} onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>Ver catálogo</button>
            </div>
          </div>}

          {config.sections.showFeatured && products.some((p) => p.featured) && <section style={ST.section}><span style={dyn.eyebrow}>Selección</span><h3 style={ST.sectionTitle}>{config.sections.featuredTitle}</h3><div style={ST.featuredScroll}>{products.filter((p) => p.featured).map((p) => (
            <div key={p.id} style={ST.featuredCard} className="k4p-card" onClick={() => setSelectedProduct(p)}><div style={{ marginBottom: 8 }}><ProductImage src={p.image} size={50} /></div><p style={ST.featuredName}>{p.name}</p><p style={{ ...ST.featuredPrice, color: C.primary }}>${p.price.toFixed(2)}</p><button style={{ ...ST.smallBtn, background: C.primary }} onClick={(e) => { e.stopPropagation(); addToCart(p); }}>Añadir</button></div>
          ))}</div></section>}

          <section style={ST.section}>
            {config.sections.showSearch && <div style={ST.searchBar}><IconSearch size={17} color="#999" /><input style={ST.searchInput} placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>}
            {config.sections.showCategories && <div style={ST.catRow}>{allCats.map((c) => <button key={c} style={selectedCategory === c ? dyn.catActive : ST.catBtn} onClick={() => setSelectedCategory(c)}>{c}</button>)}</div>}
          </section>

          <section style={ST.section} ref={catalogRef}><span style={dyn.eyebrow}>Catálogo completo</span><h3 style={ST.sectionTitle}>{config.sections.catalogTitle}</h3>
            {filtered.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}><IconSearch size={32} color="#ddd" /><p style={{ marginTop: 8 }}>Sin resultados</p></div> : <div style={ST.grid}>{filtered.map((p) => (
              <div key={p.id} style={ST.card} className="k4p-card" onClick={() => setSelectedProduct(p)}>
                <div style={ST.cardImg}><ProductImage src={p.image} size={80} /></div>
                <div style={ST.cardInfo}><span style={{ ...ST.cardCat, color: C.secondary }}>{p.category}</span><h4 style={ST.cardName}>{p.name}</h4><p style={ST.cardDesc}>{p.desc}</p><div style={ST.cardBot}><span style={{ fontSize: 18, fontWeight: 900, color: C.primary }}>${p.price.toFixed(2)}</span><button style={dyn.addBtn} onClick={(e) => { e.stopPropagation(); addToCart(p); }}><IconCart size={14} color="#fff" /> Añadir</button></div></div>
              </div>
            ))}</div>}
          </section>
        </div>}

        {page === "home" && selectedProduct && <ProductDetail product={selectedProduct} addToCart={addToCart} goBack={() => setSelectedProduct(null)} C={C} grad={dyn.grad} />}
        {page === "checkout" && !orderPlaced && <CheckoutPage cart={cart} cartTotal={cartTotal} onOrder={() => { setOrderPlaced(true); dispatch({ type: "CLEAR" }); }} goBack={() => setPage("home")} C={C} grad={dyn.grad} />}
        {page === "checkout" && orderPlaced && <OrderConfirmation onContinue={() => { setOrderPlaced(false); setPage("home"); }} C={C} grad={dyn.grad} />}
        {page === "admin" && <AdminPanel products={products} setProducts={setProducts} categories={categories} setCategories={setCategories} config={config} setConfig={setConfig} adminAuth={adminAuth} setAdminAuth={setAdminAuth} adminPinValue={adminPinValue} setAdminPinValue={setAdminPinValue} syncStatus={syncStatus} />}
      </main>

      {config.footer.show && <footer style={ST.footer}><img src="/brand/pinawoof-wordmark.png" alt={config.brand.name} style={ST.footerLogo} /><p>{config.footer.text}</p></footer>}
    </div>
  );
}

/* ═══════════════ PRODUCT DETAIL ═══════════════ */
function ProductDetail({ product, addToCart, goBack, C, grad }) {
  const [qty, setQty] = useState(1);
  return <div style={{ padding: "16px 0" }}>
    <button style={ST.backBtn} onClick={goBack}>← Volver</button>
    <div style={ST.detailCard}>
      <div style={ST.detailImgBox}><ProductImage src={product.image} size={120} /></div>
      <div style={{ padding: "20px 24px 24px" }}>
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.secondary }}>{product.category}</span>
        <h2 style={{ margin: "6px 0 10px", fontSize: 24, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{product.name}</h2>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.5, margin: "0 0 12px" }}>{product.desc}</p>
        <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8, color: product.stock > 0 ? "#16A34A" : "#DC2626" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: product.stock > 0 ? "#16A34A" : "#DC2626", display: "inline-block" }} />{product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>${product.price.toFixed(2)}</span>
          <div style={ST.qtyRow}><button style={ST.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span style={ST.qtyNum}>{qty}</span><button style={ST.qtyBtn} onClick={() => setQty(qty + 1)}>+</button></div>
        </div>
        <button style={{ ...ST.lgBtn, background: grad }} onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}>Añadir al carrito — ${(product.price * qty).toFixed(2)}</button>
      </div>
    </div>
  </div>;
}

/* ═══════════════ CHECKOUT ═══════════════ */
function CheckoutPage({ cart, cartTotal, onOrder, goBack, C, grad }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const u = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePay = async () => {
    setError("");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) { setError("Revisa el email, no tiene un formato válido."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customer: { email: form.email, name: form.name } }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Error al iniciar el pago");
      window.location.href = data.url; // redirige a Stripe Checkout (página segura de Stripe)
    } catch (e) {
      setBusy(false);
      setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
    }
  };

  return <div style={{ padding: "16px 0" }}>
    <button style={ST.backBtn} onClick={goBack}>← Seguir comprando</button>
    <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 900 }}>Checkout</h2>
    <div style={ST.steps}>{["Datos", "Envío", "Pago"].map((s, i) => <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={step > i ? ST.stepDone : step === i + 1 ? { ...ST.stepCircle, background: C.primary, color: "#fff" } : ST.stepPending}>{step > i ? "✓" : i + 1}</div><span style={{ fontSize: 13, color: step >= i + 1 ? C.primary : "#ccc", fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>{i < 2 && <div style={ST.stepLine} />}</div>)}</div>
    {step === 1 && <div style={ST.formCard}><h3 style={ST.formTitle}>Tus datos</h3><input style={ST.input} placeholder="Nombre" value={form.name} onChange={(e) => u("name", e.target.value)} /><input style={ST.input} placeholder="Email" value={form.email} onChange={(e) => u("email", e.target.value)} /><input style={ST.input} placeholder="Teléfono" value={form.phone} onChange={(e) => u("phone", e.target.value)} /><button style={{ ...ST.nextBtn, background: grad }} onClick={() => setStep(2)}>Continuar</button></div>}
    {step === 2 && <div style={ST.formCard}><h3 style={ST.formTitle}>Envío</h3><input style={ST.input} placeholder="Dirección" value={form.address} onChange={(e) => u("address", e.target.value)} /><div style={{ display: "flex", gap: 10 }}><input style={{ ...ST.input, flex: 1 }} placeholder="Ciudad" value={form.city} onChange={(e) => u("city", e.target.value)} /><input style={{ ...ST.input, width: 100 }} placeholder="C.P." value={form.zip} onChange={(e) => u("zip", e.target.value)} /></div><div style={ST.btnRow}><button style={ST.prevBtn} onClick={() => setStep(1)}>Atrás</button><button style={{ ...ST.nextBtn, background: grad }} onClick={() => setStep(3)}>Continuar</button></div></div>}
    {step === 3 && <div style={ST.formCard}><h3 style={ST.formTitle}>Pago</h3>
      <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 16, marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 10 }}><IconLock size={16} color="#888" /><p style={{ fontSize: 14, color: "#555", margin: 0 }}>Pagarás en la página segura de Stripe. Aceptamos tarjeta de crédito/débito.</p></div>
      <div style={{ background: "#FAFAFA", borderRadius: 12, padding: 16, marginTop: 12 }}><h4 style={{ margin: "0 0 10px", fontSize: 14 }}>Resumen</h4>{cart.map((i) => <div key={i.id} style={ST.sumRow}><span>{i.name} x{i.qty}</span><span>${(i.price * i.qty).toFixed(2)}</span></div>)}<div style={{ ...ST.sumRow, borderTop: `2px solid ${C.primary}`, paddingTop: 8, marginTop: 8, fontWeight: 700 }}><span>Total</span><span style={{ color: C.primary, fontSize: 18 }}>${cartTotal.toFixed(2)}</span></div></div>
      {error && <div style={{ background: "#FFF0F0", borderRadius: 10, padding: 12, marginTop: 12 }}><p style={{ color: "#E11D48", fontSize: 13, margin: 0 }}>{error}</p></div>}
      <div style={ST.btnRow}><button style={ST.prevBtn} onClick={() => setStep(2)}>Atrás</button><button style={{ ...ST.nextBtn, background: grad }} onClick={handlePay} disabled={busy}>{busy ? "Redirigiendo..." : `Pagar $${cartTotal.toFixed(2)}`}</button></div>
    </div>}
  </div>;
}

function OrderConfirmation({ onContinue, C, grad }) {
  return <div style={{ padding: "40px 0", textAlign: "center" }}><div style={{ background: "#fff", borderRadius: 24, padding: "40px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}><IconCheck size={30} color="#16A34A" strokeWidth={3} /></div>
    <h2 style={{ margin: "16px 0 8px", fontSize: 24, fontWeight: 800 }}>Pedido confirmado</h2><p style={{ fontSize: 14, color: "#666", margin: "0 0 16px" }}>Recibirás un email con detalles y seguimiento.</p>
    <div style={{ background: "#FFF5F5", borderRadius: 12, padding: 16, marginBottom: 20 }}><p style={{ fontWeight: 700, color: C.primary }}>Orden #PW-{Math.floor(Math.random() * 90000 + 10000)}</p><p style={{ fontSize: 13, color: "#888" }}>Entrega: 3-5 días hábiles</p></div>
    <button style={{ ...ST.lgBtn, background: grad }} onClick={onContinue}>Seguir comprando</button>
  </div></div>;
}

/* ═══════════════════════════════════════════
   ADMIN CMS PANEL
   ═══════════════════════════════════════════ */
function AdminPanel({ products, setProducts, categories, setCategories, config, setConfig, adminAuth, setAdminAuth, adminPinValue, setAdminPinValue, syncStatus }) {
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState("products");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [np, setNp] = useState({ name: "", price: "", category: categories[0] || "", image: "", desc: "", stock: "", featured: false });
  const [newCat, setNewCat] = useState("");
  const [saved, setSaved] = useState("");

  const flash = (m = "✅ Guardado") => { setSaved(m); setTimeout(() => setSaved(""), 2000); };
  const uc = (path, val) => setConfig((prev) => {
    const c = JSON.parse(JSON.stringify(prev)); const k = path.split("."); let r = c;
    for (let i = 0; i < k.length - 1; i++) r = r[k[i]]; r[k[k.length - 1]] = val; return c;
  });

  const tryLogin = async () => {
    setChecking(true); setLoginError("");
    try {
      const r = await fetch("/api/verify-pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
      const data = await r.json();
      if (data.ok) { setAdminPinValue(pin); setAdminAuth(true); }
      else setLoginError("❌ PIN incorrecto");
    } catch {
      setLoginError("❌ No se pudo verificar el PIN");
    } finally {
      setChecking(false);
    }
  };

  if (!adminAuth) return <div style={ST.adminLogin}><div style={ST.adminLoginCard}><span style={{ fontSize: 48 }}>🔐</span><h2 style={{ margin: "12px 0 4px" }}>Panel Admin</h2><p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>Introduce el PIN de administrador</p><input style={ST.input} type="password" placeholder="PIN" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryLogin()} />{loginError && <p style={{ color: "#E11D48", fontSize: 13, margin: "0 0 10px" }}>{loginError}</p>}<button style={ST.nextBtn} onClick={tryLogin} disabled={checking}>{checking ? "Verificando..." : "Entrar"}</button></div></div>;

  const TABS = [
    { id: "products", icon: "📦", label: "Productos" },
    { id: "categories", icon: "🏷️", label: "Categorías" },
    { id: "brand", icon: "✨", label: "Marca" },
    { id: "hero", icon: "🖼️", label: "Hero" },
    { id: "colors", icon: "🎨", label: "Colores" },
    { id: "sections", icon: "📐", label: "Secciones" },
    { id: "footer", icon: "📄", label: "Footer" },
    { id: "settings", icon: "🔒", label: "Config" },
  ];

  return <div style={{ padding: "16px 0", position: "relative" }}>
    {saved && <div style={ST.savedToast}>{saved}</div>}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>⚙️ Panel de Administración</h2>
      <span style={{ fontSize: 11, fontWeight: 700, color: syncStatus === "error" ? "#E11D48" : syncStatus === "saving" ? "#888" : "#16A34A" }}>
        {syncStatus === "saving" ? "☁️ Guardando..." : syncStatus === "error" ? "❌ Error al guardar" : syncStatus === "saved" ? "☁️ Guardado" : ""}
      </span>
    </div>
    <div style={ST.tabNav}>{TABS.map((t) => <button key={t.id} style={tab === t.id ? ST.tabActive : ST.tabInactive} onClick={() => setTab(t.id)}><span style={{ fontSize: 16 }}>{t.icon}</span><span style={{ fontSize: 11 }}>{t.label}</span></button>)}</div>

    {/* PRODUCTS */}
    {tab === "products" && <div>
      <div style={ST.statsRow}>{[{ l: "Productos", v: products.length, i: "📦" }, { l: "Stock", v: products.reduce((s, p) => s + p.stock, 0), i: "✅" }, { l: "Destacados", v: products.filter((p) => p.featured).length, i: "⭐" }, { l: "Valor", v: `$${products.reduce((s, p) => s + p.price * p.stock, 0).toFixed(0)}`, i: "💰" }].map((s) => <div key={s.l} style={ST.statCard}><span style={{ fontSize: 20 }}>{s.i}</span><p style={ST.statVal}>{s.v}</p><p style={ST.statLbl}>{s.l}</p></div>)}</div>
      <button style={ST.addBtn} onClick={() => setShowAdd(!showAdd)}>{showAdd ? "✕ Cancelar" : "+ Nuevo Producto"}</button>
      {showAdd && <div style={ST.formCard}><h3 style={ST.formTitle}>➕ Nuevo Producto</h3>
        <input style={ST.input} placeholder="Nombre" value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} />
        <div style={{ display: "flex", gap: 10 }}><input style={{ ...ST.input, flex: 1 }} placeholder="Precio" type="number" step="0.01" value={np.price} onChange={(e) => setNp({ ...np, price: e.target.value })} /><input style={{ ...ST.input, width: 80 }} placeholder="Stock" type="number" value={np.stock} onChange={(e) => setNp({ ...np, stock: e.target.value })} /></div>
        <input style={ST.input} placeholder="Descripción" value={np.desc} onChange={(e) => setNp({ ...np, desc: e.target.value })} />
        <select style={ST.input} value={np.category} onChange={(e) => setNp({ ...np, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <ImageUploader value={np.image} onChange={(v) => setNp({ ...np, image: v })} />
        <label style={ST.checkLabel}><input type="checkbox" checked={np.featured} onChange={(e) => setNp({ ...np, featured: e.target.checked })} /><span style={{ marginLeft: 8 }}>Destacado ⭐</span></label>
        <button style={ST.nextBtn} onClick={() => { if (!np.name || !np.price || !np.stock) { alert("Completa nombre, precio y stock"); return; } setProducts((p) => [...p, { ...np, id: Date.now(), price: parseFloat(np.price), stock: parseInt(np.stock) }]); setNp({ name: "", price: "", category: categories[0] || "", image: "", desc: "", stock: "", featured: false }); setShowAdd(false); flash("✅ Producto añadido"); }}>✅ Guardar</button>
      </div>}
      <div style={ST.list}>{products.map((p) => <div key={p.id} style={ST.row}>
        {editId === p.id ? <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <input style={ST.inputSm} placeholder="Nombre" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <input style={ST.inputSm} placeholder="Descripción" value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} />
          <div style={{ display: "flex", gap: 8 }}><input style={{ ...ST.inputSm, width: 80 }} type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /><input style={{ ...ST.inputSm, width: 60 }} type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} /><select style={ST.inputSm} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
          <ImageUploader value={editForm.image} onChange={(v) => setEditForm({ ...editForm, image: v })} size="small" />
          <label style={{ ...ST.checkLabel, marginBottom: 0 }}><input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} /><span style={{ marginLeft: 8, fontSize: 13 }}>Destacado ⭐</span></label>
          <div style={{ display: "flex", gap: 8 }}><button style={ST.saveSm} onClick={() => { setProducts((pr) => pr.map((x) => x.id === editId ? { ...editForm, price: parseFloat(editForm.price), stock: parseInt(editForm.stock) } : x)); setEditId(null); flash(); }}>💾 Guardar</button><button style={ST.cancelSm} onClick={() => setEditId(null)}>Cancelar</button></div>
        </div> : <>
          <div style={ST.rowImg}><ProductImage src={p.image} size={44} /></div>
          <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{p.name}</p><p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{p.category} · ${p.price.toFixed(2)} · Stock: {p.stock} {p.featured && "⭐"}</p></div>
          <button style={ST.editSm} onClick={() => { setEditId(p.id); setEditForm({ ...p }); }}>✏️</button>
          <button style={ST.delSm} onClick={() => { if (confirm("¿Eliminar?")) setProducts((pr) => pr.filter((x) => x.id !== p.id)); }}>🗑️</button>
        </>}
      </div>)}</div>
    </div>}

    {/* CATEGORIES */}
    {tab === "categories" && <div style={ST.formCard}><h3 style={ST.formTitle}>🏷️ Categorías</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}><input style={{ ...ST.input, flex: 1, marginBottom: 0 }} placeholder="Nueva categoría" value={newCat} onChange={(e) => setNewCat(e.target.value)} /><button style={ST.catAddBtn} onClick={() => { if (newCat.trim() && !categories.includes(newCat.trim())) { setCategories((p) => [...p, newCat.trim()]); setNewCat(""); flash("✅ Categoría añadida"); } }}>+ Añadir</button></div>
      <div style={ST.list}>{categories.map((c) => <div key={c} style={ST.row}><span style={{ fontSize: 14, fontWeight: 700, flex: 1 }}>{c}</span><span style={{ fontSize: 12, color: "#888" }}>{products.filter((p) => p.category === c).length} prod.</span><button style={ST.delSm} onClick={() => { if (confirm(`¿Eliminar "${c}"?`)) setCategories((p) => p.filter((x) => x !== c)); }}>🗑️</button></div>)}</div>
    </div>}

    {/* BRAND */}
    {tab === "brand" && <div style={ST.formCard}><h3 style={ST.formTitle}>✨ Marca y Logo</h3>
      <label style={ST.fLabel}>Nombre de la tienda</label><input style={ST.input} value={config.brand.name} onChange={(e) => uc("brand.name", e.target.value)} />
      <label style={ST.fLabel}>Slogan</label><input style={ST.input} value={config.brand.slogan} onChange={(e) => uc("brand.slogan", e.target.value)} />
      <label style={ST.fLabel}>Icono / Logo</label>
      <ImageUploader value={config.brand.icon} onChange={(v) => uc("brand.icon", v)} size="small" />
      <div style={ST.previewBox}><p style={ST.previewLbl}>Vista previa:</p><div style={{ display: "flex", alignItems: "center", gap: 10, background: config.colors.primary, padding: "12px 16px", borderRadius: 14 }}><ProductImage src={config.brand.icon} size={28} /><div><p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#fff" }}>{config.brand.name}</p><p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.85)" }}>{config.brand.slogan}</p></div></div></div>
      <button style={ST.saveBtn} onClick={() => flash()}>💾 Guardar</button>
    </div>}

    {/* HERO */}
    {tab === "hero" && <div style={ST.formCard}><h3 style={ST.formTitle}>🖼️ Sección Hero</h3>
      <label style={ST.checkLabel}><input type="checkbox" checked={config.hero.show} onChange={(e) => uc("hero.show", e.target.checked)} /><span style={{ marginLeft: 8 }}>Mostrar Hero</span></label>
      <label style={ST.fLabel}>Título</label><input style={ST.input} value={config.hero.title} onChange={(e) => uc("hero.title", e.target.value)} />
      <label style={ST.fLabel}>Subtítulo</label><input style={ST.input} value={config.hero.subtitle} onChange={(e) => uc("hero.subtitle", e.target.value)} />
      <button style={ST.saveBtn} onClick={() => flash()}>💾 Guardar</button>
    </div>}

    {/* COLORS */}
    {tab === "colors" && <div style={ST.formCard}><h3 style={ST.formTitle}>🎨 Colores</h3>
      {[["primary", "Principal"], ["secondary", "Secundario"], ["accent", "Acento"], ["highlight", "Resaltado"], ["background", "Fondo"]].map(([k, l]) => <div key={k} style={{ marginBottom: 12 }}><label style={ST.fLabel}>{l}</label><div style={{ display: "flex", gap: 10, alignItems: "center" }}><input type="color" value={config.colors[k]} onChange={(e) => uc(`colors.${k}`, e.target.value)} style={ST.colorPick} /><input style={{ ...ST.inputSm, width: 100 }} value={config.colors[k]} onChange={(e) => uc(`colors.${k}`, e.target.value)} /></div></div>)}
      <label style={ST.fLabel}>Gradiente Header (3 colores)</label><div style={{ display: "flex", gap: 8, marginBottom: 8 }}>{[0, 1, 2].map((i) => <input key={i} type="color" value={config.colors.headerGradient[i]} onChange={(e) => { const g = [...config.colors.headerGradient]; g[i] = e.target.value; uc("colors.headerGradient", g); }} style={ST.colorPick} />)}</div>
      <label style={ST.fLabel}>Gradiente Hero (3 colores)</label><div style={{ display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <input key={i} type="color" value={config.colors.heroGradient[i]} onChange={(e) => { const g = [...config.colors.heroGradient]; g[i] = e.target.value; uc("colors.heroGradient", g); }} style={ST.colorPick} />)}</div>
      <div style={{ ...ST.previewBox, marginTop: 16 }}><p style={ST.previewLbl}>Preview Header:</p><div style={{ background: `linear-gradient(135deg, ${config.colors.headerGradient.join(",")})`, padding: "12px 16px", borderRadius: 14, color: "#fff", fontWeight: 800, fontSize: 16 }}>{config.brand.name}</div></div>
      <button style={ST.saveBtn} onClick={() => flash()}>💾 Guardar</button>
    </div>}

    {/* SECTIONS */}
    {tab === "sections" && <div style={ST.formCard}><h3 style={ST.formTitle}>📐 Secciones</h3>
      <label style={ST.checkLabel}><input type="checkbox" checked={config.sections.showFeatured} onChange={(e) => uc("sections.showFeatured", e.target.checked)} /><span style={{ marginLeft: 8 }}>Mostrar Destacados</span></label>
      <label style={ST.fLabel}>Título Destacados</label><input style={ST.input} value={config.sections.featuredTitle} onChange={(e) => uc("sections.featuredTitle", e.target.value)} />
      <label style={ST.checkLabel}><input type="checkbox" checked={config.sections.showSearch} onChange={(e) => uc("sections.showSearch", e.target.checked)} /><span style={{ marginLeft: 8 }}>Buscador</span></label>
      <label style={ST.checkLabel}><input type="checkbox" checked={config.sections.showCategories} onChange={(e) => uc("sections.showCategories", e.target.checked)} /><span style={{ marginLeft: 8 }}>Filtros de categorías</span></label>
      <label style={ST.fLabel}>Título Catálogo</label><input style={ST.input} value={config.sections.catalogTitle} onChange={(e) => uc("sections.catalogTitle", e.target.value)} />
      <label style={ST.checkLabel}><input type="checkbox" checked={config.nav.showHome} onChange={(e) => uc("nav.showHome", e.target.checked)} /><span style={{ marginLeft: 8 }}>Botón Inicio</span></label>
      <label style={ST.checkLabel}><input type="checkbox" checked={config.nav.showCart} onChange={(e) => uc("nav.showCart", e.target.checked)} /><span style={{ marginLeft: 8 }}>Botón Carrito</span></label>
      <button style={ST.saveBtn} onClick={() => flash()}>💾 Guardar</button>
    </div>}

    {/* FOOTER */}
    {tab === "footer" && <div style={ST.formCard}><h3 style={ST.formTitle}>📄 Footer</h3>
      <label style={ST.checkLabel}><input type="checkbox" checked={config.footer.show} onChange={(e) => uc("footer.show", e.target.checked)} /><span style={{ marginLeft: 8 }}>Mostrar Footer</span></label>
      <label style={ST.fLabel}>Texto</label><input style={ST.input} value={config.footer.text} onChange={(e) => uc("footer.text", e.target.value)} />
      <button style={ST.saveBtn} onClick={() => flash()}>💾 Guardar</button>
    </div>}

    {/* SETTINGS */}
    {tab === "settings" && <div style={ST.formCard}><h3 style={ST.formTitle}>🔒 Configuración</h3>
      <div style={ST.previewBox}><p style={{ margin: 0, fontSize: 13, color: "#555" }}>El PIN de administrador se gestiona desde la variable de entorno <code>ADMIN_PIN</code> en Vercel, no aquí — así nunca queda expuesto en el catálogo público.</p></div>
      <div style={{ ...ST.previewBox, marginTop: 12, background: "#F0FDF4", borderColor: "#BBF7D0" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#166534" }}>
          {syncStatus === "saving" && "☁️ Guardando cambios..."}
          {syncStatus === "saved" && "✅ Todo guardado en la nube — visible para cualquier visitante"}
          {syncStatus === "error" && "❌ Error al guardar. Revisa tu conexión e inténtalo de nuevo."}
          {!syncStatus && "Los cambios se guardan automáticamente."}
        </p>
      </div>
      <div style={{ ...ST.previewBox, marginTop: 12 }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#555" }}>Restablece colores, textos del hero, secciones y footer al diseño más reciente del código (útil tras una actualización de diseño). Tu nombre de marca, slogan y logo se mantienen.</p>
        <button style={{ ...ST.saveBtn, background: "#1A1A1A" }} onClick={() => { if (confirm("¿Restablecer el diseño (colores, hero, secciones, footer) a los valores por defecto? Tu marca y logo se conservan.")) { setConfig((prev) => ({ ...DEFAULT_CONFIG, brand: prev.brand })); flash("✅ Diseño restablecido"); } }}>Restablecer diseño por defecto</button>
      </div>
    </div>}

    <button style={{ ...ST.prevBtn, marginTop: 24, width: "100%" }} onClick={() => setAdminAuth(false)}>🔒 Cerrar Sesión</button>
  </div>;
}

/* ═══════════════ STYLES ═══════════════ */
const ST = {
  toast: { position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 15px rgba(0,0,0,0.15)", animation: "slideDown 0.4s ease" },
  savedToast: { position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#22C55E", color: "#fff", padding: "10px 20px", borderRadius: 50, fontSize: 14, fontWeight: 700, zIndex: 9999, animation: "slideDown 0.4s ease" },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", maxWidth: 900, margin: "0 auto" },
  logoArea: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  headerIcon: { height: 40, width: "auto", display: "block" },
  wordmarkImg: { height: 24, width: "auto", display: "block" },
  footerLogo: { height: 16, width: "auto", opacity: 0.55, marginBottom: 8 },
  logoSub: { margin: 0, fontSize: 11, color: "#8A8072", fontWeight: 500 },
  headerActions: { display: "flex", alignItems: "center", gap: 8 },
  navBtn: { background: "none", border: "none", padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center" },
  cartBtn: { background: "none", border: "none", padding: "8px 10px", cursor: "pointer", position: "relative", display: "flex", alignItems: "center" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, backdropFilter: "blur(4px)" },
  cartSidebar: { position: "absolute", right: 0, top: 0, bottom: 0, width: "min(360px, 90vw)", background: "#fff", boxShadow: "-5px 0 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease" },
  cartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "2px solid #B9B2AA" },
  cartTitle: { margin: 0, fontSize: 18, fontWeight: 700, fontFamily: "'Poppins',sans-serif" },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" },
  emptyCart: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 },
  cartItems: { flex: 1, overflowY: "auto", padding: "12px 16px" },
  cartItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f5f5f5" },
  cartItemBox: { width: 50, height: 50, background: "#F5F2EC", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  cartItemName: { margin: 0, fontWeight: 700, fontSize: 14 },
  cartItemPrice: { margin: "2px 0 6px", fontSize: 13, fontWeight: 700 },
  removeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", opacity: 0.5 },
  cartFooter: { padding: "16px 20px", borderTop: "2px solid #B9B2AA", background: "#FAFAFA" },
  cartTotalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  checkoutBtn: { width: "100%", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  main: { maxWidth: 900, margin: "0 auto", padding: "0 16px" },
  heroTitle: { margin: "0 0 10px", fontSize: 28, fontWeight: 300, fontFamily: "'Poppins',sans-serif", color: "#1A1A1A", lineHeight: 1.25, letterSpacing: 0.4 },
  heroSub: { margin: "0 0 20px", fontSize: 15, color: "#6B6255", fontWeight: 400, lineHeight: 1.5, maxWidth: 440 },
  heroCta: { background: "#1A1A1A", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  heroEmojis: { display: "flex", gap: 10, marginTop: 16 },
  heroEmoji: { fontSize: 32, animation: "float 2s ease-in-out infinite" },
  bubble1: { position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.2)", top: -30, right: -20 },
  bubble2: { position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", bottom: -20, right: 60 },
  bubble3: { position: "absolute", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.25)", top: 10, right: 80 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Poppins',sans-serif", margin: "6px 0 12px" },
  featuredScroll: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch" },
  featuredCard: { minWidth: 140, background: "#fff", borderRadius: 12, padding: "16px 12px", textAlign: "center", border: "1px solid #B9B2AA8C", cursor: "pointer" },
  featuredName: { margin: "0 0 4px", fontWeight: 600, fontFamily: "'Poppins',sans-serif", fontSize: 13 },
  featuredPrice: { margin: "0 0 8px", fontWeight: 800, fontSize: 16 },
  smallBtn: { color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  searchBar: { display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 14, padding: "4px 12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "2px solid #B9B2AA", marginBottom: 12 },
  searchInput: { flex: 1, border: "none", outline: "none", padding: "10px 0", fontSize: 15, fontFamily: "inherit", background: "transparent" },
  catRow: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 },
  catBtn: { whiteSpace: "nowrap", background: "#fff", border: "1px solid #B9B2AA", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#6B6255", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 },
  card: { background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #B9B2AA8C", cursor: "pointer" },
  cardImg: { padding: "24px 0", textAlign: "center", background: "#F5F2EC" },
  cardInfo: { padding: "12px 16px 16px" },
  cardCat: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 },
  cardName: { margin: "4px 0 6px", fontSize: 16, fontWeight: 600, fontFamily: "'Poppins',sans-serif" },
  cardDesc: { margin: "0 0 12px", fontSize: 13, color: "#888", lineHeight: 1.4 },
  cardBot: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  backBtn: { background: "none", border: "none", color: "#9C3A4C", fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 12 },
  detailCard: { background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #B9B2AA8C" },
  detailImgBox: { textAlign: "center", padding: "40px 0", background: "#F5F2EC" },
  lgBtn: { width: "100%", color: "#fff", border: "none", borderRadius: 10, padding: "16px", fontSize: 16, fontWeight: 600, cursor: "pointer" },
  qtyRow: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, border: "2px solid #B9B2AA", background: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  qtyNum: { fontSize: 16, fontWeight: 800, minWidth: 24, textAlign: "center" },
  steps: { display: "flex", alignItems: "center", gap: 4, marginBottom: 20, flexWrap: "wrap" },
  stepCircle: { width: 28, height: 28, borderRadius: 50, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  stepDone: { width: 28, height: 28, borderRadius: 50, background: "#9C3A4C", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  stepPending: { width: 28, height: 28, borderRadius: 50, background: "#eee", color: "#bbb", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  stepLine: { width: 20, height: 2, background: "#eee", borderRadius: 2 },
  formCard: { background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #B9B2AA8C", marginBottom: 16 },
  formTitle: { margin: "0 0 14px", fontSize: 17, fontWeight: 800 },
  input: { width: "100%", padding: "12px 14px", border: "2px solid #B9B2AA", borderRadius: 12, fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 10, boxSizing: "border-box" },
  inputSm: { padding: "8px 10px", border: "2px solid #B9B2AA", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  btnRow: { display: "flex", gap: 10, marginTop: 8 },
  nextBtn: { flex: 1, background: "#9C3A4C", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  prevBtn: { background: "#F5F2EC", color: "#6B6255", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  payBtn: { flex: 1, background: "#f5f5f5", border: "2px solid #B9B2AA", borderRadius: 12, padding: "12px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center" },
  payActive: { flex: 1, background: "#FFF0F0", border: "2px solid", borderRadius: 12, padding: "12px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center" },
  sumRow: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#555" },
  footer: { textAlign: "center", padding: "20px 16px", fontSize: 13, color: "#aaa", borderTop: "1px solid #B9B2AA", marginTop: 40 },
  /* Admin */
  adminLogin: { display: "flex", justifyContent: "center", padding: "60px 0" },
  adminLoginCard: { background: "#fff", borderRadius: 24, padding: "40px 30px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: 300 },
  tabNav: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, marginBottom: 12 },
  tabInactive: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 12px", background: "#fff", border: "2px solid #B9B2AA", borderRadius: 14, cursor: "pointer", minWidth: 56 },
  tabActive: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 12px", background: "#FFF0F0", border: "2px solid #9C3A4C", borderRadius: 14, cursor: "pointer", minWidth: 56, color: "#9C3A4C", fontWeight: 700 },
  addBtn: { width: "100%", background: "#9C3A4C", color: "#fff", border: "none", borderRadius: 14, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 12 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 },
  statCard: { background: "#fff", borderRadius: 14, padding: "12px 6px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  statVal: { margin: "4px 0 2px", fontSize: 18, fontWeight: 900 },
  statLbl: { margin: 0, fontSize: 10, color: "#888", fontWeight: 600 },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  row: { display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "12px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  rowImg: { width: 44, height: 44, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF5F5", flexShrink: 0 },
  editSm: { background: "#FFF5E6", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 16, cursor: "pointer" },
  delSm: { background: "#FFF0F0", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 16, cursor: "pointer" },
  saveSm: { background: "#9C3A4C", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  cancelSm: { background: "#f0f0f0", color: "#888", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  checkLabel: { display: "flex", alignItems: "center", fontSize: 14, color: "#555", marginBottom: 12 },
  catAddBtn: { background: "#9C3A4C", color: "#fff", border: "none", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  fLabel: { display: "block", fontSize: 13, fontWeight: 700, color: "#666", margin: "0 0 4px" },
  saveBtn: { width: "100%", background: "linear-gradient(135deg, #22C55E, #9C3A4C)", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 12 },
  colorPick: { width: 44, height: 44, border: "2px solid #B9B2AA", borderRadius: 12, cursor: "pointer", padding: 2 },
  previewBox: { background: "#F9F9F9", border: "2px dashed #ddd", borderRadius: 14, padding: 16, marginTop: 8, marginBottom: 8 },
  previewLbl: { margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase" },
  /* Image Uploader */
  imageSection: { background: "#FAFAFA", borderRadius: 14, padding: 16, marginBottom: 12 },
  imageSectionTitle: { margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#555" },
  imageToggle: { display: "flex", gap: 6, marginBottom: 10 },
  imgToggleBtn: { flex: 1, background: "#fff", border: "2px solid #B9B2AA", borderRadius: 10, padding: "10px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", color: "#888" },
  imgToggleActive: { flex: 1, background: "#FFF0F0", border: "2px solid #9C3A4C", borderRadius: 10, padding: "10px 6px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", color: "#9C3A4C" },
  imgToggleBtnSm: { flex: 1, background: "#fff", border: "2px solid #B9B2AA", borderRadius: 8, padding: "6px", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center", color: "#888" },
  imgToggleActiveSm: { flex: 1, background: "#FFF0F0", border: "2px solid #9C3A4C", borderRadius: 8, padding: "6px", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center", color: "#9C3A4C" },
  uploadBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "14px", background: "linear-gradient(135deg, #9C3A4C, #9C3A4C)", color: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none", marginBottom: 8 },
  uploadBtnSm: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "8px", background: "linear-gradient(135deg, #9C3A4C, #9C3A4C)", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none" },
  imgHelp: { fontSize: 12, color: "#aaa", margin: "-4px 0 8px" },
  imgPreview: { background: "#fff", borderRadius: 12, padding: 12, textAlign: "center", border: "2px dashed #B9B2AA" },
  imgPreviewImg: { maxWidth: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 8 },
  imgPreviewActions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  imgPreviewLabel: { fontSize: 11, color: "#aaa", margin: 0 },
  imgRemoveBtn: { background: "#FFF0F0", color: "#9C3A4C", border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  emojiPreview: { textAlign: "center", padding: 12, background: "#fff", borderRadius: 12, border: "2px dashed #B9B2AA" },
  imgErrorBox: { background: "#FFF0F0", border: "2px solid #FF4444", borderRadius: 12, padding: "12px 14px", marginBottom: 10 },
  imgErrorText: { margin: 0, color: "#CC0000", fontSize: 13, fontWeight: 700, lineHeight: 1.4 },
};
