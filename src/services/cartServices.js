import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
const cartService = {
  getCart() {
    const cart = localStorage.getItem("store");
    return cart ? JSON.parse(cart) : [];
  },

  getTotalItems() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  updateCart(cartItems) {
    localStorage.setItem("store", JSON.stringify(cartItems));
    eventEmitter.emit("cartUpdated");
  },

  addToCart(item) {
    const cart = this.getCart();
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      item.quantity = 1;
      cart.push(item);
    }

    this.updateCart(cart);
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
