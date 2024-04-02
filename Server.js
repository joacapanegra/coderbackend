// server.js
const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = express.Router();

productsRouter.get("/", (req, res) => {
  fs.readFile("productos.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer los productos" });
    } else {
      const productos = JSON.parse(data);
      res.json(productos);
    }
  });
});

productsRouter.get("/:pid", (req, res) => {
  const productId = req.params.pid;
  fs.readFile("productos.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer los productos" });
    } else {
      const productos = JSON.parse(data);
      const producto = productos.find((p) => p.id === productId);
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    }
  });
});

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;
  newProduct.id = uuidv4();
  fs.readFile("productos.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer los productos" });
    } else {
      const productos = JSON.parse(data);
      productos.push(newProduct);
      fs.writeFile("productos.json", JSON.stringify(productos), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al guardar el nuevo producto" });
        } else {
          res.status(201).json(newProduct);
        }
      });
    }
  });
});

productsRouter.put("/:pid", (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  fs.readFile("productos.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer los productos" });
    } else {
      const productos = JSON.parse(data);
      const index = productos.findIndex((p) => p.id === productId);
      if (index !== -1) {
        productos[index] = { ...productos[index], ...updatedProduct };
        fs.writeFile("productos.json", JSON.stringify(productos), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al actualizar el producto" });
          } else {
            res.json(productos[index]);
          }
        });
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    }
  });
});

productsRouter.delete("/:pid", (req, res) => {
  const productId = req.params.pid;
  fs.readFile("productos.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer los productos" });
    } else {
      let productos = JSON.parse(data);
      productos = productos.filter((p) => p.id !== productId);
      fs.writeFile("productos.json", JSON.stringify(productos), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al eliminar el producto" });
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

app.use("/api/products", productsRouter);

const cartsRouter = express.Router();

cartsRouter.post("/", (req, res) => {
  const newCart = { id: uuidv4(), products: [] };
  fs.readFile("carrito.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer el carrito" });
    } else {
      const carritos = JSON.parse(data);
      carritos.push(newCart);
      fs.writeFile("carrito.json", JSON.stringify(carritos), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error al guardar el nuevo carrito" });
        } else {
          res.status(201).json(newCart);
        }
      });
    }
  });
});

cartsRouter.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  fs.readFile("carrito.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer el carrito" });
    } else {
      const carritos = JSON.parse(data);
      const carrito = carritos.find((c) => c.id === cartId);
      if (carrito) {
        res.json(carrito.products);
      } else {
        res.status(404).json({ message: "Carrito no encontrado" });
      }
    }
  });
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  fs.readFile("carrito.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al leer el carrito" });
    } else {
      let carritos = JSON.parse(data);
      const cartIndex = carritos.findIndex((c) => c.id === cartId);
      if (cartIndex !== -1) {
        const productIndex = carritos[cartIndex].products.findIndex(
          (p) => p.productId === productId
        );
        if (productIndex !== -1) {
          carritos[cartIndex].products[productIndex].quantity += quantity;
        } else {
          carritos[cartIndex].products.push({ productId, quantity });
        }
        fs.writeFile("carrito.json", JSON.stringify(carritos), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Error al guardar el carrito" });
          } else {
            res.status(201).json({ message: "Producto agregado al carrito" });
          }
        });
      } else {
        res.status(404).json({ message: "Carrito no encontrado" });
      }
    }
  });
});

app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
