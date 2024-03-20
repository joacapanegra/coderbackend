const sqlite3 = require("sqlite3").verbose();

class ProductManager {
  constructor(databasePath) {
    this.db = new sqlite3.Database(databasePath);
    this.createTable();
  }

  createTable() {
    this.db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            price REAL,
            thumbnail TEXT,
            code TEXT,
            stock INTEGER
        )`);
  }

  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    this.db.run(
      `INSERT INTO products (title, description, price, thumbnail, code, stock) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, price, thumbnail, code, stock],
      function (err) {
        if (err) {
          console.error("Error al agregar producto:", err.message);
        } else {
          console.log("Producto agregado con ID:", this.lastID);
        }
      }
    );
  }

  getProducts(callback) {
    this.db.all(`SELECT * FROM products`, [], function (err, rows) {
      if (err) {
        console.error("Error al obtener productos:", err.message);
      } else {
        callback(rows);
      }
    });
  }

  getProductById(id, callback) {
    this.db.get(
      `SELECT * FROM products WHERE id = ?`,
      [id],
      function (err, row) {
        if (err) {
          console.error("Error al obtener producto por ID:", err.message);
        } else {
          callback(row);
        }
      }
    );
  }

  updateProduct(id, newData) {
    const { title, description, price, thumbnail, code, stock } = newData;
    this.db.run(
      `UPDATE products SET title = ?, description = ?, price = ?, thumbnail = ?, code = ?, stock = ? WHERE id = ?`,
      [title, description, price, thumbnail, code, stock, id],
      function (err) {
        if (err) {
          console.error("Error al actualizar producto:", err.message);
        } else {
          console.log("Producto actualizado:", id);
        }
      }
    );
  }

  deleteProduct(id) {
    this.db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
      if (err) {
        console.error("Error al eliminar producto:", err.message);
      } else {
        console.log("Producto eliminado:", id);
      }
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = ProductManager;
