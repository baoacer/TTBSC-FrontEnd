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
          <button class="p-2 rounded" @click="removeItem(item._id, item.size)">
            <font-awesome-icon :icon="['fas', 'circle-xmark']" />
          </button>
          <img :src="item.image" :alt="item.name" class="w-24 h-24 mx-4" />
          <span class="font-bold max-w-80 line-clamp-3">{{ item.name }}</span>
        </div>

        <!-- Hiển thị giá gốc nếu có giảm giá -->
        <span
          v-if="item.discount > 0"
          class="text-black font-semibold text-lg line-through"
        >
          {{ formatPrice(item.price) }}
        </span>
        <span v-else style="width: 90px; display: inline-block"></span>

        <div class="flex items-center">
          <button
            class="bg-gray-200 px-3 py-1"
            @click="decreaseQuantity(index)"
          >
            -
          </button>
          <span class="px-4">{{ item.quantity }}</span>
          <button
            class="bg-gray-200 px-3 py-1"
            @click="increaseQuantity(index)"
          >
            +
          </button>
        </div>

        <!-- Hiển thị giá sau giảm -->
        <span class="text-red-600 font-semibold text-lg">
          {{
            formatPrice(item.price * (1 - (item.discount || 0)) * item.quantity)
          }}
        </span>
      </div>

      <div class="text-right space-y-2 mt-6">
        <p><strong>Tạm tính:</strong> {{ formatPrice(review.totalPrice) }}</p>
        <p>
          <strong>Giảm giá:</strong> {{ formatPrice(review.totalDiscount) }}
        </p>
        <p class="text-xl">
          <strong>Tổng tiền:</strong> {{ formatPrice(review.totalCheckout) }}
        </p>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <router-link to="/" class="border border-black py-2 px-6 font-semibold"
          >← TIẾP TỤC XEM SẢN PHẨM</router-link
        >
        <button
          class="border border-black bg-black text-white py-2 px-6 font-semibold"
          @click="goToConfirm"
        >
          THANH TOÁN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import cartService from "../services/cartServices";
import userService from "../services/userSercices";

const cartItems = ref([]);
const review = ref({
  totalPrice: 0,
  totalDiscount: 0,
  totalCheckout: 0,
});
const router = useRouter();

onMounted(async () => {
  try {
    const cartData = await cartService.getCart();
    cartItems.value = cartData.cart_products || [];
    await fetchReview(cartData._id);
  } catch (error) {
    cartItems.value = [];
    alert("Không thể tải giỏ hàng!");
  }
});

const fetchReview = async (cartID) => {
  const res = await fetch(
    "http://nguyenlequocbao.id.vn/v1/api/checkout/review",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartID }),
    }
  );
  const data = await res.json();
  if (data && data.data) {
    review.value = data.data;
  }
};

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + "₫";
};

const removeItem = (id, size) => {
  cartService.removeFromCart(id, size);
  cartItems.value = cartService.getCart();
};

const increaseQuantity = async (index) => {
  const item = cartItems.value[index];
  await cartService.addToCart(item, 1);
  // Reload cart
  const cartData = await cartService.getCart();
  cartItems.value = cartData.cart_products || [];
  if (cartData._id) {
    await fetchReview(cartData._id);
  }
};

const decreaseQuantity = async (index) => {
  const item = cartItems.value[index];
  if (item.quantity > 1) {
    await cartService.addToCart(item, -1);
    // Reload cart
    const cartData = await cartService.getCart();
    cartItems.value = cartData.cart_products || [];

    if (cartData._id) {
      await fetchReview(cartData._id);
    }
  }
};

const goToConfirm = () => {
  if (cartItems.value.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  const isLogin = userService.isLoggedIn();
  if (!isLogin) {
    alert("Vui lòng đăng nhập trước khi thanh toán!");
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'))

  const order = {
    name: user.name || "Khách chưa rõ tên",
    address: user.address || "Chưa có địa chỉ",
    total: review.value.totalCheckout,
  };

  console.log("GO TO CONFIRM:", order);
  router.push({ name: "PaymentConfirm", query: order });
};
</script>
