const express = require("express");
const mongoose = require("mongoose");
const ProductManager = require("./productmanager");

const app = express();
const PORT = 8080;

mongoose.connect("mongodb://localhost:27017/your-database-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

const productManager = new ProductManager();

// Endpoint para obtener todos los productos
app.get("/api/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;
  try {
    const result = await productManager.getAllProducts({
      limit,
      page,
      sort,
      query,
    });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Otros endpoints para CRUD de productos...

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
