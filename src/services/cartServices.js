import axios from "axios";
import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
const cartService = {
  getUser(){
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Chưa đăng nhập!");
    }
    return JSON.parse(userStr);
  },

  async getCart() {
    const user = this.getUser();
    const userID = user._id;
    const response = await axios.get(`http://nguyenlequocbao.id.vn/v1/api/cart?userID=${userID}`);
    return response.data.data;
  },

  async getTotalItems() {
    const cart = await this.getCart();
    if (
      cart &&
      Array.isArray(cart.cart_products)
    ) {
      return cart.cart_products.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
    }
    return 0;
  },

  async addToCart(product, quantity) {
    const user = this.getUser();
    const body = {
      userID: user._id,
      product: {
        id: product._id,
        quantity: quantity,
        size: product.size
      },
    };
    const result = await axios.post(
      "http://nguyenlequocbao.id.vn/v1/api/cart",
      body
    );
    localStorage.setItem("cartID", result.data.data._id)
    eventEmitter.emit("cartUpdated");
  },

  async removeFromCart(productID, size) {
    const user = this.getUser();
    await axios.delete("http://nguyenlequocbao.id.vn/v1/api/cart", {
      headers: { "Content-Type": "application/json" },
      data: {
        userID: user._id,
        productID,
        size,
      },
    });
    eventEmitter.emit("cartUpdated");
  },

  clearCart() {
    localStorage.removeItem("store");
    eventEmitter.emit("cartUpdated");
  },

  async fetchReview(cartID) {
    const res = await axios.post(
      "http://nguyenlequocbao.id.vn/v1/api/checkout/review",
      { cartID },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  },

  eventEmitter,
};

export default cartService;
