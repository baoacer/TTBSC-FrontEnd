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
            <font-awesome-icon :icon="[ 'fas', 'circle-xmark' ]" />
          </button>
          <img :src="item.image" :alt="item.name" class="w-24 h-24 mx-4" />
          <span class="font-bold max-w-80 line-clamp-3">{{ item.name }}</span>
        </div>
        <span class="text-black font-semibold text-lg line-through">
          {{ formatPrice(item.price) }}
        </span>

        <div class="flex items-center">
          <button class="bg-gray-200 px-3 py-1" @click="decreaseQuantity(index)">-</button>
          <span class="px-4">{{ item.quantity }}</span>
          <button class="bg-gray-200 px-3 py-1" @click="increaseQuantity(index)">+</button>
        </div>

        <span class="text-red-600 font-semibold text-lg">
          {{ formatPrice(item.price * item.quantity) }}
        </span>
      </div>

      <div class="text-right space-y-2 mt-6">
        <p><strong>Tạm tính:</strong> {{ formatPrice(totalAmount) }}</p>
        <p><strong>Giảm giá:</strong> 0₫</p>
        <p class="text-xl"><strong>Tổng tiền:</strong> {{ formatPrice(totalAmount) }}</p>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <router-link to="/" class="border border-black py-2 px-6 font-semibold">← TIẾP TỤC XEM SẢN PHẨM</router-link>
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
const router = useRouter();

onMounted(() => {
  cartItems.value = cartService.getCart();
});

const totalAmount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const formatPrice = (price) => {
  return price.toLocaleString("vi-VN") + "₫";
};

const removeItem = (id, size) => {
  cartService.removeFromCart(id, size);
  cartItems.value = cartService.getCart();
};

const increaseQuantity = (index) => {
  cartItems.value[index].quantity++;
  cartService.updateCart(cartItems.value);
};

const decreaseQuantity = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity--;
    cartService.updateCart(cartItems.value);
  }
};

const goToConfirm = () => {
  if (cartItems.value.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  const user = userService.isLoggedIn();
  if (!user) {
    alert("Vui lòng đăng nhập trước khi thanh toán!");
    return;
  }

  const order = {
    id: Math.floor(Math.random() * 100000000),
    name: user.name || "Khách chưa rõ tên",
    address: user.address || "Chưa có địa chỉ",
    total: totalAmount.value.toLocaleString("vi-VN") + "₫"
  };

  console.log("GO TO CONFIRM:", order);
  router.push({ name: "PaymentConfirm", query: order });
};
</script>
