const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const productManager = new ProductManager("products.db");

// Endpoint para obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await new Promise((resolve, reject) => {
      productManager.getProducts((err, products) => {
        if (err) {
          reject(err);
        } else {
          resolve(products);
        }
      });
    });
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener un producto por su ID
app.get("/products/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await new Promise((resolve, reject) => {
      productManager.getProductById(productId, (err, product) => {
        if (err) {
          reject(err);
        } else {
          resolve(product);
        }
      });
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
