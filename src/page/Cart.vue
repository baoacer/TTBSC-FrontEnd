<template>
  <div class="flex justify-between flex-col p-8">
    <div class="w-full">
      <div class="flex justify-between border-b pb-2 mb-4">
        <span class="font-bold uppercase text-lg">Giỏ hàng của bạn</span>
      </div>

      <div
        v-for="(item, index) in cartItems"
        :key="index"
        class="flex items-center justify-between mb-4 border-b pb-4"
      >
        <div class="flex items-center">
          <button class="p-2 rounded" @click="removeItem(item.id, item.size)">
            <font-awesome-icon :icon="['fas', 'circle-xmark']" />
          </button>
          <img :src="item.image" :alt="item.name" class="w-24 h-24 mx-4" />
          <span :class="'font-bold max-w-80 line-clamp-3'">{{
            item.name
          }}</span>
        </div>
        <span class="text-black font-semibold text-lg line-through">{{
          formatPrice(item.price)
        }}</span>

        <div class="flex items-center">
          <button
            class="bg-gray-200 p-2 rounded"
            @click="decrementQuantity(item)"
          >
            -
          </button>
          <span class="mx-2">{{ item.quantity }}</span>
          <button
            class="bg-gray-200 p-2 rounded"
            @click="incrementQuantity(item)"
          >
            +
          </button>
        </div>
        <span class="text-red-500 font-semibold text-lg">{{
          formatPrice(discountedPrice(item))
        }}</span>
      </div>
    </div>

    <!-- Right side: Order Summary -->
    <div class="p-6 rounded-lg self-end">
      <div class="flex pb-2 border-b gap-2 justify-between">
        <span>Tạm tính: </span>
        <span>{{ formatPrice(subtotalPrice) }}</span>
      </div>

      <div class="flex gap-2 font-bold mt-2 items-center justify-between">
        <span class="text-gray-500 font-medium">Giảm giá:</span>
        <span class="text-black text-xl line-through">{{
          formatPrice(totalDiscount)
        }}</span>
      </div>
      <div
        class="flex gap-2 font-bold mt-2 border-b-2 pb-4 items-center justify-between"
      >
        <span class="text-gray-500 font-medium">Tổng tiền:</span>
        <span class="text-black text-xl">{{ formatPrice(totalPrice) }}</span>
      </div>
      <div class="flex flex-row items-center justify-center gap-4 mt-4">
        <router-link to="/">
          <button
            class="border-2 border-black px-4 py-1 uppercase font-semibold hover:bg-gray-800 hover:text-white"
          >
            <font-awesome-icon
              class="mr-1 font-light"
              :icon="['fas', 'arrow-left']"
            />
            Tiếp tục xem sản phẩm
          </button>
        </router-link>
        <button
          class="bg-black font-bold text-white py-1.5 text-center w-40 uppercase"
          @click="checkLoginBeforePayment"
        >
          thanh toán
        </button>
      </div>
    </div>
  </div>

  <!-- Popup Modal -->
  <div
    v-if="showLoginPopup"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white p-6 rounded-lg w-96">
      <h2 class="font-bold text-lg mb-4">Bạn chưa đăng nhập</h2>
      <p class="mb-4">Bạn cần phải đăng nhập để tiến hành thanh toán.</p>
      <div class="flex flex-row gap-8">
        <router-link
          to="/login"
          class="bg-gray-800 text-white py-2 px-4 rounded-md"
        >
          Đăng nhập</router-link
        >
        <button
          @click="closePopup"
          class="border border-black text-black py-2 px-8 rounded-md"
        >
          Hủy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import cartService from "../services/cartServices";
import userService from "../services/userSercices"; // Assuming you have a service to manage users
export default {
  name: "Cart",

  data() {
    return {
      cartItems: [],
      showLoginPopup: false,
      user: null,
    };
  },
  computed: {
    subtotalPrice() {
      return this.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    totalDiscount() {
      return this.cartItems.reduce(
        (total, item) => total + item.price * item.discount * item.quantity,
        0
      );
    },
    
    totalPrice() {
      return this.cartItems.reduce(
        (total, item) =>
          total + item.price * item.quantity * (1 - item.discount),
        0
      );
    },
  },

  methods: {

    formatPrice(value) {
      return (
        new Intl.NumberFormat("vi-VN", {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }).format(value) + "đ"
      );
    },
   
    discountedPrice(product) {
      return product.price * (1 - product.discount); 
    },
   
    loadCart() {
      this.cartItems = cartService.getCart();
    },
 
    incrementQuantity(item) {
      item.quantity += 1;
      cartService.updateCart(this.cartItems); // Update cart in localStorage
    },
   
    decrementQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        cartService.updateCart(this.cartItems); // Update cart in localStorage
      }
    },
   
    removeItem(itemId, size) {
      cartService.removeFromCart(itemId, size);
      this.loadCart();
    },
   
    checkLoginBeforePayment() {
      const user = userService.isLoggedIn();
      if (!this.cartItems || this.cartItems.length === 0)
        return alert("Your cart is currently empty.");

      if (!user) {
        this.showLoginPopup = true;
      } else {
        this.user = user;
        const orderId = Math.floor(10000000 + Math.random() * 90000000);

        this.$router.push({
          name: "Payment",
          params: {
            orderId: orderId,
            totalPrice: this.totalPrice,
            name: this.user.name,
            address: this.user.address,
          },
        });
        cartService.clearCart();
      }
    },
    closePopup() {
      this.showLoginPopup = false;
    },
  },
  mounted() {
    this.loadCart(); // Load cart items when component is mounted
  },
};
</script>

<style scoped>
/* Add any custom styles for your modal */
.fixed {
  z-index: 9999;
}
.bg-gray-600 {
  backdrop-filter: blur(5px);
}
</style>
