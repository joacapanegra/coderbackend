const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

class CartManager {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart.toObject(); // Convertir a objeto plano
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate("products.productId");
      return cart ? cart.toObject() : null;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const product = cart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (!product) {
        throw new Error("Product not found in cart");
      }

      product.quantity = newQuantity;
      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId
      );

      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw error;
    }
  }

  async removeAllProductsFromCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products = [];
      await cart.save();
      return cart.toObject();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManager;
