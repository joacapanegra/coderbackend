// Server.js
const express = require("express");
const ProductManager = require("./ProductManager");
const path = require("path");

const app = express();
const PORT = 8080;
const productsFilePath = path.join(__dirname, "productos.json");
const productManager = new ProductManager(productsFilePath);

app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  const newProduct = req.body;
  try {
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  const updatedProduct = req.body;
  try {
    await productManager.updateProduct(productId, updatedProduct);
    res.json({ message: "Producto actualizado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    await productManager.deleteProduct(productId);
    res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
