class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  constructor() {
    this.products = [];
    this.lastId = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((product) => product.code === code)) {
      console.log("El código del producto ya existe");
      return;
    }

    const product = new Product(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );
    product.id = ++this.lastId;
    this.products.push(product);
    console.log("Producto agregado:", product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  }
}

// Ejemplo de uso
const productManager = new ProductManager();

// Agregar stickers
productManager.addProduct(
  "Sticker de gato",
  "Sticker de gato con diseño divertido",
  2.5,
  "gato.jpg",
  "STK001",
  100
);
productManager.addProduct(
  "Sticker de unicornio",
  "Sticker de unicornio brillante",
  3.0,
  "unicornio.jpg",
  "STK002",
  80
);

// Agregar remeras
productManager.addProduct(
  "Remera de programación",
  "Remera negra con diseño de código",
  15.0,
  "coder.jpg",
  "REM001",
  50
);
productManager.addProduct(
  "Remera de gato",
  "Remera blanca con diseño de gato",
  12.0,
  "gato_remera.jpg",
  "REM002",
  70
);

console.log("Todos los productos:", productManager.getProducts());
console.log("Producto con ID 1:", productManager.getProductById(1));
console.log("Producto con ID 5:", productManager.getProductById(5)); // No existe
