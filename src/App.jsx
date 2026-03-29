import { useState, useEffect, useReducer } from "react";

/* ─────────────── DATA ─────────────── */
const CATEGORIES = ["Todos", "Collares", "Ropa", "Juguetes", "Camas", "Accesorios", "Bebidas"];

/* image field: URL string = real photo, single emoji = emoji fallback */
const INITIAL_PRODUCTS = [
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
  { id: 13, name: "Botella de Ron", price: 18.99, category: "Bebidas", image: "https://i.ibb.co/RkC6QPJw/8e33cb5c-e453-43c7-9e9e-e76e6866bbda.jpg", desc: "Ron", stock: 15, featured: true },
];

/* ─────────────── CART REDUCER ─────────────── */
const isUrl = (str) => str && str.startsWith("http");
const ProductImage = ({ src, size = 48, style: extraStyle = {} }) => {
  if (isUrl(src)) {
    return <img src={src} alt="" style={{ width: size, height: size, objectFit: "cover", borderRadius: 12, ...extraStyle }} />;
  }
  return <span style={{ fontSize: size * 0.75, ...extraStyle }}>{src}</span>;
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.find((i) => i.id === action.product.id);
      if (exists) return state.map((i) => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "UPDATE_QTY":
      return state.map((i) => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

/* ─────────────── MAIN APP ─────────────── */
export default function Kenis4Pets() {
  const [page, setPage] = useState("home");
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const addToCart = (product) => {
    dispatch({ type: "ADD", product });
    notify(`${product.name} añadido al carrito 🛒`);
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={styles.app}>
      {/* ─── NOTIFICATION TOAST ─── */}
      {notification && (
        <div style={styles.toast}>
          <span>{notification}</span>
        </div>
      )}

      {/* ─── HEADER ─── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoArea} onClick={() => { setPage("home"); setShowCart(false); setSelectedProduct(null); }}>
            <span style={styles.logoIcon}>🐾</span>
            <div>
              <h1 style={styles.logoText}>Kenis4Pets</h1>
              <p style={styles.logoSub}>Accesorios con amor</p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.navBtn} onClick={() => { setPage("home"); setShowCart(false); setSelectedProduct(null); }}>
              🏠
            </button>
            <button style={styles.navBtn} onClick={() => { setPage("admin"); setShowCart(false); }}>
              ⚙️
            </button>
            <button style={styles.cartBtn} onClick={() => setShowCart(!showCart)}>
              🛒
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ─── CART SIDEBAR ─── */}
      {showCart && (
        <div style={styles.overlay} onClick={() => setShowCart(false)}>
          <div style={styles.cartSidebar} onClick={(e) => e.stopPropagation()}>
            <div style={styles.cartHeader}>
              <h2 style={styles.cartTitle}>🛒 Tu Carrito</h2>
              <button style={styles.closeBtn} onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div style={styles.emptyCart}>
                <span style={{ fontSize: 48 }}>🐕</span>
                <p style={{ color: "#888", marginTop: 12 }}>Tu carrito está vacío</p>
                <p style={{ color: "#aaa", fontSize: 13 }}>¡Agrega algo bonito para tu mascota!</p>
              </div>
            ) : (
              <>
                <div style={styles.cartItems}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      <div style={styles.cartItemEmoji}><ProductImage src={item.image} size={40} /></div>
                      <div style={styles.cartItemInfo}>
                        <p style={styles.cartItemName}>{item.name}</p>
                        <p style={styles.cartItemPrice}>${item.price.toFixed(2)}</p>
                        <div style={styles.qtyRow}>
                          <button style={styles.qtyBtn} onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty - 1 })}>−</button>
                          <span style={styles.qtyNum}>{item.qty}</span>
                          <button style={styles.qtyBtn} onClick={() => dispatch({ type: "UPDATE_QTY", id: item.id, qty: item.qty + 1 })}>+</button>
                        </div>
                      </div>
                      <button style={styles.removeBtn} onClick={() => dispatch({ type: "REMOVE", id: item.id })}>🗑️</button>
                    </div>
                  ))}
                </div>
                <div style={styles.cartFooter}>
                  <div style={styles.cartTotalRow}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>Total:</span>
                    <span style={styles.cartTotalPrice}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button style={styles.checkoutBtn} onClick={() => { setShowCart(false); setPage("checkout"); }}>
                    Ir a Pagar 💳
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── PAGES ─── */}
      <main style={styles.main}>
        {page === "home" && !selectedProduct && (
          <HomePage
            products={products}
            filteredProducts={filteredProducts}
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            addToCart={addToCart}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {page === "home" && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            addToCart={addToCart}
            goBack={() => setSelectedProduct(null)}
          />
        )}

        {page === "checkout" && !orderPlaced && (
          <CheckoutPage
            cart={cart}
            cartTotal={cartTotal}
            onOrder={() => {
              setOrderPlaced(true);
              dispatch({ type: "CLEAR" });
            }}
            goBack={() => setPage("home")}
          />
        )}

        {page === "checkout" && orderPlaced && (
          <OrderConfirmation onContinue={() => { setOrderPlaced(false); setPage("home"); }} />
        )}

        {page === "admin" && (
          <AdminPanel
            products={products}
            setProducts={setProducts}
            adminAuth={adminAuth}
            setAdminAuth={setAdminAuth}
          />
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer style={styles.footer}>
        <p>🐾 Kenis4Pets © 2026 — Hecho con amor para tus mascotas</p>
      </footer>
    </div>
  );
}

/* ═══════════════ HOME PAGE ═══════════════ */
function HomePage({ products, filteredProducts, categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, addToCart, setSelectedProduct }) {
  const featured = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h2 style={styles.heroTitle}>¡Tu mascota merece lo mejor! 🐶🐱</h2>
          <p style={styles.heroSub}>Accesorios únicos, coloridos y llenos de amor para tu compañero peludo</p>
          <div style={styles.heroEmojis}>
            {["🦮", "🐕‍🦺", "🐩", "🐈", "🐇"].map((e, i) => (
              <span key={i} style={{ ...styles.heroEmoji, animationDelay: `${i * 0.2}s` }}>{e}</span>
            ))}
          </div>
        </div>
        <div style={styles.heroBubble1} />
        <div style={styles.heroBubble2} />
        <div style={styles.heroBubble3} />
      </div>

      {/* Featured */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>⭐ Destacados</h3>
        <div style={styles.featuredScroll}>
          {featured.map((p) => (
            <div key={p.id} style={styles.featuredCard} onClick={() => setSelectedProduct(p)}>
              <div style={styles.featuredEmoji}><ProductImage src={p.image} size={50} /></div>
              <p style={styles.featuredName}>{p.name}</p>
              <p style={styles.featuredPrice}>${p.price.toFixed(2)}</p>
              <button style={styles.addBtnSmall} onClick={(e) => { e.stopPropagation(); addToCart(p); }}>+ Carrito</button>
            </div>
          ))}
        </div>
      </section>

      {/* Search & Filters */}
      <section style={styles.section}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.categoryRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              style={selectedCategory === cat ? styles.catBtnActive : styles.catBtn}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>🛍️ Catálogo</h3>
        {filteredProducts.length === 0 ? (
          <div style={styles.noResults}>
            <span style={{ fontSize: 40 }}>🐾</span>
            <p>No encontramos productos con ese filtro</p>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map((p) => (
              <div key={p.id} style={styles.productCard} onClick={() => setSelectedProduct(p)}>
                <div style={styles.productEmoji}><ProductImage src={p.image} size={80} /></div>
                <div style={styles.productInfo}>
                  <span style={styles.productCat}>{p.category}</span>
                  <h4 style={styles.productName}>{p.name}</h4>
                  <p style={styles.productDesc}>{p.desc}</p>
                  <div style={styles.productBottom}>
                    <span style={styles.productPrice}>${p.price.toFixed(2)}</span>
                    <button style={styles.addBtn} onClick={(e) => { e.stopPropagation(); addToCart(p); }}>
                      🛒 Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ═══════════════ PRODUCT DETAIL ═══════════════ */
function ProductDetail({ product, addToCart, goBack }) {
  const [qty, setQty] = useState(1);
  return (
    <div style={styles.detailPage}>
      <button style={styles.backBtn} onClick={goBack}>← Volver</button>
      <div style={styles.detailCard}>
        <div style={styles.detailEmojiBox}>
          <ProductImage src={product.image} size={120} />
        </div>
        <div style={styles.detailInfo}>
          <span style={styles.detailCat}>{product.category}</span>
          <h2 style={styles.detailName}>{product.name}</h2>
          <p style={styles.detailDesc}>{product.desc}</p>
          <p style={styles.detailStock}>
            {product.stock > 0 ? `✅ ${product.stock} en stock` : "❌ Agotado"}
          </p>
          <div style={styles.detailPriceRow}>
            <span style={styles.detailPrice}>${product.price.toFixed(2)}</span>
            <div style={styles.qtyRow}>
              <button style={styles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span style={styles.qtyNum}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <button style={styles.addBtnLarge} onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}>
            🛒 Añadir al Carrito — ${(product.price * qty).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ CHECKOUT ═══════════════ */
function CheckoutPage({ cart, cartTotal, onOrder, goBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "", cardName: "", cardNum: "", expiry: "", cvv: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const update = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onOrder();
    }, 2000);
  };

  return (
    <div style={styles.checkoutPage}>
      <button style={styles.backBtn} onClick={goBack}>← Seguir comprando</button>
      <h2 style={styles.checkoutTitle}>💳 Checkout</h2>

      {/* Steps indicator */}
      <div style={styles.steps}>
        {["Datos", "Envío", "Pago"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={step > i ? styles.stepDone : step === i + 1 ? styles.stepActive : styles.stepPending}>
              {step > i ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 13, color: step >= i + 1 ? "#FF6B6B" : "#ccc", fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
            {i < 2 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>📋 Tus Datos</h3>
          <input style={styles.input} placeholder="Nombre completo" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <input style={styles.input} placeholder="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input style={styles.input} placeholder="Teléfono" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          <button style={styles.nextBtn} onClick={() => setStep(2)}>Continuar →</button>
        </div>
      )}

      {step === 2 && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>📦 Dirección de Envío</h3>
          <input style={styles.input} placeholder="Dirección" value={form.address} onChange={(e) => update("address", e.target.value)} />
          <div style={{ display: "flex", gap: 10 }}>
            <input style={{ ...styles.input, flex: 1 }} placeholder="Ciudad" value={form.city} onChange={(e) => update("city", e.target.value)} />
            <input style={{ ...styles.input, width: 100 }} placeholder="C.P." value={form.zip} onChange={(e) => update("zip", e.target.value)} />
          </div>
          <div style={styles.btnRow}>
            <button style={styles.prevBtn} onClick={() => setStep(1)}>← Atrás</button>
            <button style={styles.nextBtn} onClick={() => setStep(3)}>Continuar →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>💰 Método de Pago</h3>
          <div style={styles.payMethods}>
            {[["card", "💳 Tarjeta"], ["paypal", "🅿️ PayPal"], ["transfer", "🏦 Transferencia"]].map(([val, label]) => (
              <button key={val} style={payMethod === val ? styles.payMethodActive : styles.payMethodBtn} onClick={() => setPayMethod(val)}>
                {label}
              </button>
            ))}
          </div>

          {payMethod === "card" && (
            <>
              <input style={styles.input} placeholder="Nombre en la tarjeta" value={form.cardName} onChange={(e) => update("cardName", e.target.value)} />
              <input style={styles.input} placeholder="Número de tarjeta" value={form.cardNum} onChange={(e) => update("cardNum", e.target.value)} />
              <div style={{ display: "flex", gap: 10 }}>
                <input style={{ ...styles.input, flex: 1 }} placeholder="MM/AA" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} />
                <input style={{ ...styles.input, width: 80 }} placeholder="CVV" value={form.cvv} onChange={(e) => update("cvv", e.target.value)} />
              </div>
            </>
          )}
          {payMethod === "paypal" && (
            <div style={styles.paypalBox}>
              <p style={{ fontSize: 14, color: "#555" }}>Serás redirigido a PayPal para completar tu pago de forma segura.</p>
            </div>
          )}
          {payMethod === "transfer" && (
            <div style={styles.paypalBox}>
              <p style={{ fontSize: 14, color: "#555" }}>Recibirás los datos bancarios por email para completar la transferencia.</p>
            </div>
          )}

          {/* Order Summary */}
          <div style={styles.orderSummary}>
            <h4 style={{ margin: "0 0 10px", fontSize: 14 }}>Resumen del Pedido</h4>
            {cart.map((item) => (
              <div key={item.id} style={styles.summaryRow}>
                <span>{item.image} {item.name} x{item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ ...styles.summaryRow, borderTop: "2px solid #FF6B6B", paddingTop: 8, marginTop: 8, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: "#FF6B6B", fontSize: 18 }}>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.btnRow}>
            <button style={styles.prevBtn} onClick={() => setStep(2)}>← Atrás</button>
            <button style={styles.payBtn} onClick={handlePay} disabled={processing}>
              {processing ? "Procesando..." : `Pagar $${cartTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ ORDER CONFIRMATION ═══════════════ */
function OrderConfirmation({ onContinue }) {
  return (
    <div style={styles.confirmPage}>
      <div style={styles.confirmCard}>
        <span style={{ fontSize: 64 }}>🎉</span>
        <h2 style={styles.confirmTitle}>¡Pedido Confirmado!</h2>
        <p style={styles.confirmText}>Tu pedido ha sido procesado exitosamente. Recibirás un email con los detalles de tu compra y seguimiento.</p>
        <div style={styles.confirmOrder}>
          <p style={{ fontWeight: 700, color: "#FF6B6B" }}>Orden #KP-{Math.floor(Math.random() * 90000 + 10000)}</p>
          <p style={{ fontSize: 13, color: "#888" }}>Tiempo estimado de entrega: 3-5 días hábiles</p>
        </div>
        <button style={styles.addBtnLarge} onClick={onContinue}>Seguir Comprando 🛍️</button>
      </div>
    </div>
  );
}

/* ═══════════════ ADMIN PANEL ═══════════════ */
function AdminPanel({ products, setProducts, adminAuth, setAdminAuth }) {
  const [pin, setPin] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [imageMode, setImageMode] = useState("url"); // "url" or "emoji"
  const [editImageMode, setEditImageMode] = useState("url");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Collares", image: "", desc: "", stock: "", featured: false });

  const allCategories = [...CATEGORIES.filter(c => c !== "Todos"), ...customCategories];

  if (!adminAuth) {
    return (
      <div style={styles.adminLogin}>
        <div style={styles.adminLoginCard}>
          <span style={{ fontSize: 48 }}>🔐</span>
          <h2 style={{ margin: "12px 0 4px", color: "#333" }}>Panel Admin</h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>PIN: 1234 (demo)</p>
          <input style={styles.input} type="password" placeholder="PIN de acceso" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} />
          <button style={styles.nextBtn} onClick={() => { if (pin === "1234") setAdminAuth(true); else alert("PIN incorrecto"); }}>
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({ ...p });
    setEditImageMode(isUrl(p.image) ? "url" : "emoji");
  };
  const saveEdit = () => {
    setProducts((prev) => prev.map((p) => p.id === editingId ? { ...editForm, price: parseFloat(editForm.price), stock: parseInt(editForm.stock) } : p));
    setEditingId(null);
  };
  const deleteProduct = (id) => {
    if (confirm("¿Eliminar este producto?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Completa nombre, precio y stock");
      return;
    }
    if (!newProduct.image) {
      alert("Agrega una imagen (URL o emoji)");
      return;
    }
    const p = { ...newProduct, id: Date.now(), price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) };
    setProducts((prev) => [...prev, p]);
    setNewProduct({ name: "", price: "", category: "Collares", image: "", desc: "", stock: "", featured: false });
    setShowAdd(false);
    setImageMode("url");
  };
  const addCategory = () => {
    if (newCatName.trim() && !allCategories.includes(newCatName.trim())) {
      setCustomCategories((prev) => [...prev, newCatName.trim()]);
      setNewProduct({ ...newProduct, category: newCatName.trim() });
      setNewCatName("");
      setShowNewCat(false);
    }
  };

  return (
    <div style={styles.adminPage}>
      <div style={styles.adminHeader}>
        <h2 style={styles.adminTitle}>⚙️ Panel de Administración</h2>
        <button style={styles.addProductBtn} onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "✕ Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: "Productos", value: products.length, icon: "📦" },
          { label: "En Stock", value: products.reduce((s, p) => s + p.stock, 0), icon: "✅" },
          { label: "Destacados", value: products.filter((p) => p.featured).length, icon: "⭐" },
          { label: "Valor Inv.", value: `$${products.reduce((s, p) => s + p.price * p.stock, 0).toFixed(0)}`, icon: "💰" },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <p style={styles.statValue}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ──── ADD PRODUCT FORM ──── */}
      {showAdd && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>➕ Nuevo Producto</h3>

          <input style={styles.input} placeholder="Nombre del producto" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

          <div style={{ display: "flex", gap: 10 }}>
            <input style={{ ...styles.input, flex: 1 }} placeholder="Precio" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <input style={{ ...styles.input, width: 80 }} placeholder="Stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
          </div>

          <input style={styles.input} placeholder="Descripción del producto" value={newProduct.desc} onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })} />

          {/* Category with option to add new */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <select style={{ ...styles.input, flex: 1, marginBottom: 0 }} value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
              {allCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button style={styles.newCatBtn} onClick={() => setShowNewCat(!showNewCat)}>
              {showNewCat ? "✕" : "+ Cat."}
            </button>
          </div>
          {showNewCat && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input style={{ ...styles.input, flex: 1, marginBottom: 0 }} placeholder="Nueva categoría" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
              <button style={styles.newCatBtn} onClick={addCategory}>Añadir</button>
            </div>
          )}

          {/* Image: URL or Emoji toggle */}
          <div style={styles.imageSection}>
            <p style={styles.imageSectionTitle}>📷 Imagen del producto</p>
            <div style={styles.imageToggle}>
              <button style={imageMode === "url" ? styles.imgToggleActive : styles.imgToggleBtn} onClick={() => { setImageMode("url"); setNewProduct({ ...newProduct, image: "" }); }}>
                🔗 URL de foto
              </button>
              <button style={imageMode === "emoji" ? styles.imgToggleActive : styles.imgToggleBtn} onClick={() => { setImageMode("emoji"); setNewProduct({ ...newProduct, image: "" }); }}>
                😀 Emoji
              </button>
            </div>

            {imageMode === "url" ? (
              <>
                <input style={styles.input} placeholder="Pega aquí el link directo de imgBB" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                <p style={styles.imgHelp}>💡 Sube tu foto en <strong>imgbb.com</strong> y pega el "Direct link"</p>
                {newProduct.image && isUrl(newProduct.image) && (
                  <div style={styles.imgPreview}>
                    <img src={newProduct.image} alt="Preview" style={styles.imgPreviewImg} onError={(e) => { e.target.style.display = "none"; }} />
                    <p style={styles.imgPreviewLabel}>Vista previa</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <input style={styles.input} placeholder="Escribe un emoji (ej: 🐾 🦴 🎾)" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                {newProduct.image && (
                  <div style={styles.emojiPreview}>
                    <span style={{ fontSize: 48 }}>{newProduct.image}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <label style={styles.checkLabel}>
            <input type="checkbox" checked={newProduct.featured} onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })} />
            <span style={{ marginLeft: 8 }}>Producto destacado ⭐</span>
          </label>

          <button style={styles.nextBtn} onClick={addProduct}>✅ Guardar Producto</button>
        </div>
      )}

      {/* ──── PRODUCT LIST ──── */}
      <div style={styles.adminList}>
        {products.map((p) => (
          <div key={p.id} style={styles.adminRow}>
            {editingId === p.id ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <input style={styles.inputSm} placeholder="Nombre" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <input style={styles.inputSm} placeholder="Descripción" value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} />
                <div style={{ display: "flex", gap: 8 }}>
                  <input style={{ ...styles.inputSm, width: 80 }} type="number" placeholder="Precio" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                  <input style={{ ...styles.inputSm, width: 60 }} type="number" placeholder="Stock" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
                  <select style={styles.inputSm} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                    {allCategories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Edit image */}
                <div style={styles.imageToggle}>
                  <button style={editImageMode === "url" ? styles.imgToggleActiveSm : styles.imgToggleBtnSm} onClick={() => { setEditImageMode("url"); setEditForm({ ...editForm, image: "" }); }}>
                    🔗 URL
                  </button>
                  <button style={editImageMode === "emoji" ? styles.imgToggleActiveSm : styles.imgToggleBtnSm} onClick={() => { setEditImageMode("emoji"); setEditForm({ ...editForm, image: "" }); }}>
                    😀 Emoji
                  </button>
                </div>
                <input style={styles.inputSm} placeholder={editImageMode === "url" ? "URL de la imagen" : "Emoji"} value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
                {editForm.image && isUrl(editForm.image) && (
                  <img src={editForm.image} alt="Preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
                )}

                <label style={{ ...styles.checkLabel, marginBottom: 0 }}>
                  <input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} />
                  <span style={{ marginLeft: 8, fontSize: 13 }}>Destacado ⭐</span>
                </label>

                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.saveBtnSm} onClick={saveEdit}>💾 Guardar</button>
                  <button style={styles.cancelBtnSm} onClick={() => setEditingId(null)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div style={styles.adminRowImg}>
                  <ProductImage src={p.image} size={44} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: "#333" }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{p.category} · ${p.price.toFixed(2)} · Stock: {p.stock} {p.featured && "⭐"}</p>
                </div>
                <button style={styles.editBtnSm} onClick={() => startEdit(p)}>✏️</button>
                <button style={styles.deleteBtnSm} onClick={() => deleteProduct(p.id)}>🗑️</button>
              </>
            )}
          </div>
        ))}
      </div>

      <button style={{ ...styles.prevBtn, marginTop: 20 }} onClick={() => setAdminAuth(false)}>🔒 Cerrar Sesión Admin</button>
    </div>
  );
}

/* ═══════════════ STYLES ═══════════════ */
const K = {
  coral: "#FF6B6B",
  yellow: "#FFE66D",
  mint: "#4ECDC4",
  purple: "#A855F7",
  pink: "#FF8FA3",
  blue: "#60A5FA",
  orange: "#FDBA74",
  bg: "#FFF9F0",
  card: "#FFFFFF",
  radius: 16,
};

const bounce = "cubic-bezier(0.34, 1.56, 0.64, 1)";

const styles = {
  app: { fontFamily: "'Nunito', 'Quicksand', 'Segoe UI', sans-serif", background: K.bg, minHeight: "100vh", color: "#333", position: "relative" },

  /* Toast */
  toast: { position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: K.mint, color: "#fff", padding: "10px 20px", borderRadius: 50, fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: "0 4px 15px rgba(78,205,196,0.4)", animation: "slideDown 0.4s ease" },

  /* Header */
  header: { background: "linear-gradient(135deg, #FF6B6B 0%, #FF8FA3 50%, #A855F7 100%)", padding: "0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(255,107,107,0.3)" },
  headerInner: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", maxWidth: 900, margin: "0 auto" },
  logoArea: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoIcon: { fontSize: 32, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" },
  logoText: { margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.5, textShadow: "0 2px 8px rgba(0,0,0,0.15)" },
  logoSub: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 600 },
  headerActions: { display: "flex", alignItems: "center", gap: 8 },
  navBtn: { background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 12px", fontSize: 18, cursor: "pointer", backdropFilter: "blur(10px)" },
  cartBtn: { background: "rgba(255,255,255,0.25)", border: "none", borderRadius: 14, padding: "8px 14px", fontSize: 20, cursor: "pointer", position: "relative", backdropFilter: "blur(10px)" },
  cartBadge: { position: "absolute", top: -4, right: -4, background: K.yellow, color: "#333", borderRadius: 50, width: 20, height: 20, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FF6B6B" },

  /* Cart Sidebar */
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, backdropFilter: "blur(4px)" },
  cartSidebar: { position: "absolute", right: 0, top: 0, bottom: 0, width: "min(360px, 90vw)", background: "#fff", boxShadow: "-5px 0 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease" },
  cartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "2px solid #f0f0f0" },
  cartTitle: { margin: 0, fontSize: 18, fontWeight: 800, color: "#333" },
  closeBtn: { background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999", padding: 4 },
  emptyCart: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 },
  cartItems: { flex: 1, overflowY: "auto", padding: "12px 16px" },
  cartItem: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f5f5f5" },
  cartItemEmoji: { fontSize: 32, width: 50, height: 50, background: "#FFF0F0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" },
  cartItemInfo: { flex: 1 },
  cartItemName: { margin: 0, fontWeight: 700, fontSize: 14, color: "#333" },
  cartItemPrice: { margin: "2px 0 6px", fontSize: 13, color: K.coral, fontWeight: 700 },
  removeBtn: { background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 4, opacity: 0.5 },
  cartFooter: { padding: "16px 20px", borderTop: "2px solid #f0f0f0", background: "#FAFAFA" },
  cartTotalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cartTotalPrice: { fontSize: 22, fontWeight: 900, color: K.coral },
  checkoutBtn: { width: "100%", background: `linear-gradient(135deg, ${K.coral}, ${K.purple})`, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: 0.3 },

  /* Main */
  main: { maxWidth: 900, margin: "0 auto", padding: "0 16px" },

  /* Hero */
  hero: { background: `linear-gradient(135deg, ${K.yellow} 0%, ${K.orange} 40%, ${K.pink} 100%)`, borderRadius: 24, padding: "32px 24px", margin: "16px 0", position: "relative", overflow: "hidden" },
  heroContent: { position: "relative", zIndex: 2 },
  heroTitle: { margin: "0 0 8px", fontSize: 24, fontWeight: 900, color: "#5D3A1A", lineHeight: 1.2 },
  heroSub: { margin: 0, fontSize: 14, color: "#7A4B2A", fontWeight: 600, lineHeight: 1.4 },
  heroEmojis: { display: "flex", gap: 10, marginTop: 16 },
  heroEmoji: { fontSize: 32, animation: "float 2s ease-in-out infinite" },
  heroBubble1: { position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.2)", top: -30, right: -20 },
  heroBubble2: { position: "absolute", width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)", bottom: -20, right: 60 },
  heroBubble3: { position: "absolute", width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.25)", top: 10, right: 80 },

  /* Sections */
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 800, color: "#333", margin: "20px 0 12px", letterSpacing: -0.3 },

  /* Featured Scroll */
  featuredScroll: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" },
  featuredCard: { minWidth: 140, background: "#fff", borderRadius: 16, padding: "16px 12px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", scrollSnapAlign: "start", border: "2px solid #FFF0F0", cursor: "pointer" },
  featuredEmoji: { fontSize: 40, marginBottom: 8 },
  featuredName: { margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: "#333" },
  featuredPrice: { margin: "0 0 8px", fontWeight: 800, fontSize: 16, color: K.coral },
  addBtnSmall: { background: K.mint, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" },

  /* Search */
  searchBar: { display: "flex", alignItems: "center", background: "#fff", borderRadius: 14, padding: "4px 12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "2px solid #f0f0f0", marginBottom: 12 },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, border: "none", outline: "none", padding: "10px 0", fontSize: 15, fontFamily: "inherit", background: "transparent" },

  /* Categories */
  categoryRow: { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" },
  catBtn: { whiteSpace: "nowrap", background: "#fff", border: "2px solid #eee", borderRadius: 50, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#888", cursor: "pointer" },
  catBtnActive: { whiteSpace: "nowrap", background: `linear-gradient(135deg, ${K.coral}, ${K.pink})`, border: "2px solid transparent", borderRadius: 50, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" },

  /* Product Grid */
  productGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 },
  productCard: { background: "#fff", borderRadius: K.radius, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s ease" },
  productEmoji: { fontSize: 48, padding: "24px 0", textAlign: "center", background: "linear-gradient(180deg, #FFF5F5, #fff)" },
  productInfo: { padding: "12px 16px 16px" },
  productCat: { fontSize: 11, fontWeight: 700, color: K.purple, textTransform: "uppercase", letterSpacing: 0.5 },
  productName: { margin: "4px 0 6px", fontSize: 16, fontWeight: 800, color: "#333" },
  productDesc: { margin: "0 0 12px", fontSize: 13, color: "#888", lineHeight: 1.4 },
  productBottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  productPrice: { fontSize: 18, fontWeight: 900, color: K.coral },
  addBtn: { background: `linear-gradient(135deg, ${K.coral}, ${K.pink})`, color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },

  noResults: { textAlign: "center", padding: 40, color: "#aaa" },

  /* Detail */
  detailPage: { padding: "16px 0" },
  backBtn: { background: "none", border: "none", color: K.coral, fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginBottom: 12 },
  detailCard: { background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  detailEmojiBox: { textAlign: "center", padding: "40px 0", background: "linear-gradient(180deg, #FFF0F0, #FFF5FF)" },
  detailEmoji: { fontSize: 80 },
  detailInfo: { padding: "20px 24px 24px" },
  detailCat: { fontSize: 12, fontWeight: 700, color: K.purple, textTransform: "uppercase", letterSpacing: 1 },
  detailName: { margin: "6px 0 10px", fontSize: 24, fontWeight: 900, color: "#333" },
  detailDesc: { fontSize: 15, color: "#666", lineHeight: 1.5, margin: "0 0 12px" },
  detailStock: { fontSize: 14, fontWeight: 700, margin: "0 0 16px" },
  detailPriceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  detailPrice: { fontSize: 28, fontWeight: 900, color: K.coral },
  addBtnLarge: { width: "100%", background: `linear-gradient(135deg, ${K.coral}, ${K.purple})`, color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: 0.3 },

  /* Qty */
  qtyRow: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, border: "2px solid #eee", background: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  qtyNum: { fontSize: 16, fontWeight: 800, minWidth: 24, textAlign: "center" },

  /* Checkout */
  checkoutPage: { padding: "16px 0" },
  checkoutTitle: { margin: "0 0 16px", fontSize: 22, fontWeight: 900, color: "#333" },
  steps: { display: "flex", alignItems: "center", gap: 4, marginBottom: 20, flexWrap: "wrap" },
  stepActive: { width: 28, height: 28, borderRadius: 50, background: K.coral, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  stepDone: { width: 28, height: 28, borderRadius: 50, background: K.mint, color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  stepPending: { width: 28, height: 28, borderRadius: 50, background: "#eee", color: "#bbb", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  stepLine: { width: 20, height: 2, background: "#eee", borderRadius: 2 },

  formCard: { background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", marginBottom: 16 },
  formTitle: { margin: "0 0 14px", fontSize: 17, fontWeight: 800, color: "#333" },
  input: { width: "100%", padding: "12px 14px", border: "2px solid #eee", borderRadius: 12, fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 10, boxSizing: "border-box", transition: "border 0.2s ease" },
  inputSm: { padding: "8px 10px", border: "2px solid #eee", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  btnRow: { display: "flex", gap: 10, marginTop: 8 },
  nextBtn: { flex: 1, background: `linear-gradient(135deg, ${K.coral}, ${K.pink})`, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  prevBtn: { background: "#f5f5f5", color: "#888", border: "none", borderRadius: 12, padding: "13px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  payBtn: { flex: 1, background: `linear-gradient(135deg, ${K.mint}, ${K.blue})`, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer" },

  payMethods: { display: "flex", gap: 8, marginBottom: 14 },
  payMethodBtn: { flex: 1, background: "#f5f5f5", border: "2px solid #eee", borderRadius: 12, padding: "12px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center" },
  payMethodActive: { flex: 1, background: "#FFF0F0", border: `2px solid ${K.coral}`, borderRadius: 12, padding: "12px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", color: K.coral },
  paypalBox: { background: "#f9f9f9", borderRadius: 12, padding: 16, marginBottom: 12 },
  orderSummary: { background: "#FAFAFA", borderRadius: 12, padding: 16, marginTop: 12 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#555" },

  /* Confirm */
  confirmPage: { padding: "40px 0", textAlign: "center" },
  confirmCard: { background: "#fff", borderRadius: 24, padding: "40px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  confirmTitle: { margin: "16px 0 8px", fontSize: 24, fontWeight: 900, color: "#333" },
  confirmText: { fontSize: 14, color: "#666", lineHeight: 1.5, margin: "0 0 16px" },
  confirmOrder: { background: "#FFF5F5", borderRadius: 12, padding: 16, marginBottom: 20 },

  /* Admin */
  adminLogin: { display: "flex", justifyContent: "center", padding: "60px 0" },
  adminLoginCard: { background: "#fff", borderRadius: 24, padding: "40px 30px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", width: "100%", maxWidth: 300 },
  adminPage: { padding: "16px 0" },
  adminHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  adminTitle: { margin: 0, fontSize: 20, fontWeight: 900, color: "#333" },
  addProductBtn: { background: K.mint, color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 20 },
  statCard: { background: "#fff", borderRadius: 16, padding: "16px 12px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  statValue: { margin: "6px 0 2px", fontSize: 22, fontWeight: 900, color: "#333" },
  statLabel: { margin: 0, fontSize: 12, color: "#888", fontWeight: 600 },
  adminList: { display: "flex", flexDirection: "column", gap: 8 },
  adminRow: { display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "12px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  editBtnSm: { background: "#FFF5E6", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 16, cursor: "pointer" },
  deleteBtnSm: { background: "#FFF0F0", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 16, cursor: "pointer" },
  saveBtnSm: { background: K.mint, color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  cancelBtnSm: { background: "#f0f0f0", color: "#888", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  checkLabel: { display: "flex", alignItems: "center", fontSize: 14, color: "#555", marginBottom: 12 },

  /* Admin Image */
  adminRowImg: { width: 44, height: 44, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF5F5", flexShrink: 0 },
  newCatBtn: { background: K.purple, color: "#fff", border: "none", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  imageSection: { background: "#FAFAFA", borderRadius: 14, padding: 16, marginBottom: 12 },
  imageSectionTitle: { margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#555" },
  imageToggle: { display: "flex", gap: 8, marginBottom: 12 },
  imgToggleBtn: { flex: 1, background: "#fff", border: "2px solid #eee", borderRadius: 10, padding: "10px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", color: "#888" },
  imgToggleActive: { flex: 1, background: "#FFF0F0", border: `2px solid ${K.coral}`, borderRadius: 10, padding: "10px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", color: K.coral },
  imgToggleBtnSm: { flex: 1, background: "#fff", border: "2px solid #eee", borderRadius: 8, padding: "6px", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center", color: "#888" },
  imgToggleActiveSm: { flex: 1, background: "#FFF0F0", border: `2px solid ${K.coral}`, borderRadius: 8, padding: "6px", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center", color: K.coral },
  imgHelp: { fontSize: 12, color: "#aaa", margin: "-6px 0 8px", lineHeight: 1.4 },
  imgPreview: { background: "#fff", borderRadius: 12, padding: 12, textAlign: "center", border: "2px dashed #eee" },
  imgPreviewImg: { maxWidth: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 8 },
  imgPreviewLabel: { fontSize: 11, color: "#aaa", marginTop: 6 },
  emojiPreview: { textAlign: "center", padding: 12, background: "#fff", borderRadius: 12, border: "2px dashed #eee" },

  /* Footer */
  footer: { textAlign: "center", padding: "20px 16px", fontSize: 13, color: "#aaa", borderTop: "1px solid #f0f0f0", marginTop: 40 },
};
