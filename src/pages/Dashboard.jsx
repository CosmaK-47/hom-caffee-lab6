import { useState, useEffect } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  // 🔥 STATISTICS
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

      {/* 🔥 FILTER */}
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
          <div key={order.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h3>Order ID: {order.id}</h3>

            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
            <p><strong>Location:</strong> {order.customer.location}</p>
            <p><strong>Date:</strong> {order.customer.date}</p>

            <p><strong>Total:</strong> {order.total} MDL</p>

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
