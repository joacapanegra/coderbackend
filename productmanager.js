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
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO products (title, description, price, thumbnail, code, stock) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, price, thumbnail, code, stock],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...product });
          }
        }
      );
    });
  }

  getAllProducts() {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM products`, [], function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getProductById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM products WHERE id = ?`,
        [id],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  updateProduct(id, newData) {
    const { title, description, price, thumbnail, code, stock } = newData;
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE products SET title = ?, description = ?, price = ?, thumbnail = ?, code = ?, stock = ? WHERE id = ?`,
        [title, description, price, thumbnail, code, stock, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...newData });
          }
        }
      );
    });
  }

  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM products WHERE id = ?`, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = ProductManager;
