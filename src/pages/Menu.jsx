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
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

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
    setCustomer({
      name: "",
      phone: "",
      location: "",
      date: "",
    });

    alert("Catering request submitted successfully!");
  };

  return (
    <div>
      <h1>HOM Caffee Menu</h1>

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("sarat")}>Sărat</button>
        <button onClick={() => setFilter("dulce")}>Dulce</button>
        <button onClick={() => setFilter("cafea")}>Cafea</button>
        <button onClick={() => setFilter("cald")}>Calde</button>
        <button onClick={() => setFilter("rece")}>Reci</button>
      </div>

      <h2>Products</h2>

      <div>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <hr />

      <h2>Catering Cart</h2>

      {cart.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id}>
              <strong>{item.name}</strong> — {item.quantity} x {item.price} MDL
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}

          <h3>Total: {total} MDL</h3>
        </div>
      )}

      <hr />

      <h2>Submit Catering Request</h2>

      <form onSubmit={handleSubmitOrder}>
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

        <button type="submit">Submit Catering Request</button>
      </form>
    </div>
  );
}
