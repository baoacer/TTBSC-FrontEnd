import axios from "axios";
import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
const cartService = {
  async getCart() {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("Chưa đăng nhập!");
    }
    const user = JSON.parse(userStr);
    const userID = user._id;
    const response = await axios.get(`http://nguyenlequocbao.id.vn/v1/api/cart?userID=${userID}`);
    return response.data.data;
  },

  async getTotalItems() {
    const cartData = await this.getCart();
    if (
      cartData &&
      Array.isArray(cartData.cart_products)
    ) {
      return cartData.cart_products.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
    }
    return 0;
  },

  async addToCart(product, quantity) {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr);
    if (!user) {
      throw new Error("Chưa đăng nhập!");
    }
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

  removeFromCart(itemId, itemSize) {
    const cart = this.getCart().filter(
      (item) => !(item.id === itemId && item.size === itemSize)
    );

    this.updateCart(cart);

    eventEmitter.emit("cartUpdated");
  },

  clearCart() {
    localStorage.removeItem("store");
    eventEmitter.emit("cartUpdated");
  },

  eventEmitter,
};

export default cartService;
