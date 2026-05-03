import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Menu() {
  const [filter, setFilter] = useState("all");

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    location: "",
    date: "",
  });

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    const existing = cart.find((item) => item.id === product.id);

    const updatedCart = existing
      ? cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + safeQuantity }
          : item
      )
      : [...cart, { ...product, quantity: safeQuantity }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Please add products to cart first.");
      return;
    }

    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrder = {
      id: Date.now(),
      customer,
      items: cart,
      total,
      status: "new",
      createdAt: new Date().toLocaleString(),
    };

    localStorage.setItem("orders", JSON.stringify([...savedOrders, newOrder]));
    localStorage.removeItem("cart");

    setCart([]);
    setCustomer({ name: "", phone: "", location: "", date: "" });

    alert("Catering request submitted successfully!");
  };

  return (
    <main className="menu-page">
      <section className="hero-panel">
        <p className="eyebrow">HOM Caffee Catering</p>
        <h1>Build your event order</h1>
        <p className="hero-text">
          Choose products, calculate the total automatically, and submit a
          catering request for your event.
        </p>
      </section>

      <section className="filter-bar">
        {["all", "sarat", "dulce", "cafea", "cald", "rece"].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </section>

      <section className="app-layout">
        <div>
          <h2 className="section-title">Products</h2>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        <aside className="cart-panel">
          <h2>Catering Cart</h2>

          {cart.length === 0 ? (
            <p className="muted">No products added yet.</p>
          ) : (
            <>
              <div className="cart-list">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>
                        {item.quantity} x {item.price} MDL
                      </span>
                    </div>

                    <button
                      className="small-btn danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="total-box">Total: {total} MDL</div>
            </>
          )}

          <form className="order-form" onSubmit={handleSubmitOrder}>
            <h2>Submit Request</h2>

            <input
              type="text"
              placeholder="Your name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              required
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Event location"
              value={customer.location}
              onChange={(e) =>
                setCustomer({ ...customer, location: e.target.value })
              }
              required
            />

            <input
              type="date"
              value={customer.date}
              onChange={(e) =>
                setCustomer({ ...customer, date: e.target.value })
              }
              required
            />

            <button className="submit-btn" type="submit">
              Submit Catering Request
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}
