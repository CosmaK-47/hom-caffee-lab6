import { useState, useEffect } from "react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

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

  const clearOrders = () => {
    localStorage.removeItem("orders");
    setOrders([]);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Total Orders: {orders.length}</h2>
      <h2>Total Revenue: {totalRevenue} MDL</h2>

      <button onClick={clearOrders}>Clear Orders</button>

      <hr />

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
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
