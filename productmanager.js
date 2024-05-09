const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

class ProductManager {
  async addProduct(product) {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts({ limit = 10, page = 1, sort, query }) {
    const skip = (page - 1) * limit;
    const filter = query ? { category: query } : {};
    const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : {};

    try {
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const prevLink = hasPrevPage
        ? `/api/products?limit=${limit}&page=${page - 1}`
        : null;
      const nextLink = hasNextPage
        ? `/api/products?limit=${limit}&page=${page + 1}`
        : null;

      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product ? product.toObject() : null;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, newData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return updatedProduct ? updatedProduct.toObject() : null;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductManager;
