import { useState, useEffect } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
      alert("Session expired. Login again.");
      localStorage.removeItem("token");
      window.location.reload();
      return true;
    }

    return false;
  };

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:5000/api/orders?limit=100&skip=0", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (handleAuthError(response)) return;

    const data = await response.json();
    setOrders(data.data);
  };

  const fetchProducts = async () => {
    const response = await fetch("http://localhost:5000/api/products?limit=100&skip=0", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (handleAuthError(response)) return;

    const data = await response.json();
    setProducts(data.data);
  };

  const updateStatus = async (id, newStatus) => {
    const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (handleAuthError(response)) return;

    fetchOrders();
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Complete all product fields");
      return;
    }

    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
      }),
    });

    if (handleAuthError(response)) return;

    setNewProduct({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (handleAuthError(response)) return;

    fetchProducts();
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const productStats = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productStats[item.name]) {
        productStats[item.name] = 0;
      }

      productStats[item.name] += item.quantity;
    });
  });

  const mostOrdered = Object.entries(productStats).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const totalProductsSold = Object.values(productStats).reduce(
    (sum, val) => sum + val,
    0
  );

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Total Orders: {filteredOrders.length}</h2>
      <h2>Total Revenue: {totalRevenue} MDL</h2>
      <h2>Total Products Sold: {totalProductsSold}</h2>

      {mostOrdered && (
        <h2>
          Most Ordered Product: {mostOrdered[0]} ({mostOrdered[1]} pcs)
        </h2>
      )}

      <hr />

      <h2>Products CRUD from Backend</h2>

      <input
        placeholder="Product name"
        value={newProduct.name}
        onChange={(e) =>
          setNewProduct({ ...newProduct, name: e.target.value })
        }
      />

      <input
        placeholder="Category"
        value={newProduct.category}
        onChange={(e) =>
          setNewProduct({ ...newProduct, category: e.target.value })
        }
      />

      <input
        placeholder="Price"
        type="number"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
      />

      <button onClick={addProduct}>Add Product</button>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
          }}
        >
          <strong>{product.name}</strong> — {product.category} —{" "}
          {product.price} MDL

          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}

      <hr />

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("new")}>New</button>
        <button onClick={() => setFilter("preparing")}>Preparing</button>
        <button onClick={() => setFilter("done")}>Done</button>
        <button onClick={() => setFilter("cancelled")}>Cancelled</button>
      </div>

      <hr />

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>Order ID: {order.id}</h3>

            <p>
              <strong>Name:</strong> {order.customer.name}
            </p>
            <p>
              <strong>Phone:</strong> {order.customer.phone}
            </p>
            <p>
              <strong>Location:</strong> {order.customer.location}
            </p>
            <p>
              <strong>Date:</strong> {order.customer.date}
            </p>

            <p>
              <strong>Total:</strong> {order.total} MDL
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                <option value="new">New</option>
                <option value="preparing">Preparing</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </p>

            <h4>Items:</h4>

            {order.items.map((item) => (
              <p key={item.id}>
                {item.name} — {item.quantity} x {item.price} MDL
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
