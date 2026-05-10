const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "homcafe_secret_key";

let products = [
  { id: 1, name: "Clătită cu șuncă și cașcaval", category: "sarat", price: 60 },
  { id: 2, name: "Clătită cu Brânză", category: "sarat", price: 50 },
  { id: 3, name: "Hot-Dog", category: "sarat", price: 45 },
  { id: 4, name: "Cartofi Pai", category: "sarat", price: 40 },

  { id: 5, name: "Clătită cu banană și ciocolată", category: "dulce", price: 65 },
  { id: 6, name: "Clătită cu vișină și ciocolată", category: "dulce", price: 65 },
  { id: 7, name: "Vafe", category: "dulce", price: 70 },

  { id: 8, name: "Espresso", category: "cafea", price: 25 },
  { id: 9, name: "Cappuccino", category: "cafea", price: 35 },
  { id: 10, name: "Latte", category: "cafea", price: 40 },

  { id: 11, name: "Chai Latte", category: "cald", price: 40 },
  { id: 12, name: "Ciocolată caldă", category: "cald", price: 45 },

  { id: 13, name: "Ice Latte", category: "rece", price: 45 },
  { id: 14, name: "Limonadă", category: "rece", price: 35 },
];

let orders = [];

function checkPermission(permission) {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    next();
  };
}

app.post("/token", (req, res) => {
  const { password, role } = req.body;

  if (password !== "8885553535") {
    return res.status(401).json({
      message: "Wrong password",
    });
  }

  let permissions = [];

  if (role === "ADMIN") {
    permissions = ["READ", "WRITE", "DELETE"];
  } else if (role === "WRITER") {
    permissions = ["READ", "WRITE"];
  } else {
    permissions = ["READ"];
  }

  const token = jwt.sign(
    {
      role,
      permissions,
    },
    SECRET_KEY,
    {
      expiresIn: "1m",
    }
  );

  res.status(200).json({ token });
});

app.get("/", (req, res) => {
  res.send("HOM Cafe Backend Running");
});

// PRODUCTS CRUD

app.get(
  "/api/products",
  authenticateToken,
  checkPermission("READ"),
  (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;

    const paginatedProducts = products.slice(skip, skip + limit);

    res.status(200).json({
      total: products.length,
      limit,
      skip,
      data: paginatedProducts,
    });
  }
);

app.get(
  "/api/products/:id",
  authenticateToken,
  checkPermission("READ"),
  (req, res) => {
    const id = Number(req.params.id);
    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  }
);

app.post(
  "/api/products",
  authenticateToken,
  checkPermission("WRITE"),
  (req, res) => {
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    const newProduct = {
      id: Date.now(),
      name,
      category,
      price: Number(price),
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
  }
);

app.put(
  "/api/products/:id",
  authenticateToken,
  checkPermission("WRITE"),
  (req, res) => {
    const id = Number(req.params.id);
    const { name, category, price } = req.body;

    const product = products.find((item) => item.id === id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = name ?? product.name;
    product.category = category ?? product.category;
    product.price = price ?? product.price;

    res.status(200).json(product);
  }
);

app.delete(
  "/api/products/:id",
  authenticateToken,
  checkPermission("DELETE"),
  (req, res) => {
    const id = Number(req.params.id);
    const productExists = products.some((item) => item.id === id);

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    products = products.filter((item) => item.id !== id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  }
);

// ORDERS API

app.post("/api/orders", (req, res) => {
  const { customer, items, total } = req.body;

  if (!customer || !items || !total) {
    return res.status(400).json({
      message: "Customer, items and total are required",
    });
  }

  const newOrder = {
    id: Date.now(),
    customer,
    items,
    total: Number(total),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});

app.get(
  "/api/orders",
  authenticateToken,
  checkPermission("READ"),
  (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;

    const paginatedOrders = orders.slice(skip, skip + limit);

    res.status(200).json({
      total: orders.length,
      limit,
      skip,
      data: paginatedOrders,
    });
  }
);

app.get(
  "/api/orders/:id",
  authenticateToken,
  checkPermission("READ"),
  (req, res) => {
    const id = Number(req.params.id);
    const order = orders.find((item) => item.id === id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  }
);

app.put(
  "/api/orders/:id/status",
  authenticateToken,
  checkPermission("WRITE"),
  (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    const order = orders.find((item) => item.id === id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    res.status(200).json(order);
  }
);

app.delete(
  "/api/orders/:id",
  authenticateToken,
  checkPermission("DELETE"),
  (req, res) => {
    const id = Number(req.params.id);
    const orderExists = orders.some((item) => item.id === id);

    if (!orderExists) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    orders = orders.filter((item) => item.id !== id);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
