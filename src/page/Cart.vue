<template>
  <div class="flex justify-between flex-col p-8">
    <div class="w-full">
      <div class="flex justify-between border-b pb-2 mb-4">
        <span class="font-bold uppercase text-lg">Giỏ hàng của bạn</span>
      </div>

      <div
        v-for="(item, index) in cartItems"
        :key="item._id + '-' + item.size"
        class="flex items-center justify-between mb-4 border-b pb-4"
      >
        <div class="flex items-center">
          <button class="p-2 rounded" @click="removeItem(item._id, item.size)">
            <font-awesome-icon :icon="['fas', 'circle-xmark']" />
          </button>
          <img :src="item.image" :alt="item.name" class="w-24 h-24 mx-4" />
          <div>
            <span class="font-bold max-w-80 line-clamp-3">{{ item.name }}</span>
            <div class="text-gray-500 text-sm mt-1">Size: {{ item.size }}</div>
          </div>
        </div>

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
            :disabled="item.quantity <= 1"
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

        <span class="text-red-600 font-semibold text-lg">
          {{ formatPrice(item.price * (1 - (item.discount || 0)) * item.quantity) }}
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import cartService from "../services/cartServices";
import userService from "../services/userSercices";
import { toast } from "vue3-toastify";

const cartItems = ref([]);
const review = ref({
  totalPrice: 0,
  totalDiscount: 0,
  totalCheckout: 0,
});
const router = useRouter();

const loadCart = async () => {
  try {
    const cartData = await cartService.getCart();
    cartItems.value = cartData.cart_products || [];
    if (cartData._id) await fetchReview(cartData._id);
  } catch {
    cartItems.value = [];
  }
};

onMounted(loadCart);

const fetchReview = async (cartID) => {
  try {
    const data = await cartService.fetchReview(cartID);
    if (data && data.data) {
      review.value = data.data;
    }
  } catch {
    review.value = {
      totalPrice: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
  }
};

const formatPrice = (price) => {
  if (!price && price !== 0) return "";
  return price.toLocaleString("vi-VN") + "₫";
};

const removeItem = async (productID, size) => {
  try {
    await cartService.removeFromCart(productID, size);
    await loadCart();
  } catch {
    toast.error("Xóa sản phẩm thất bại");
  }
};

const updateQuantity = async (index, delta) => {
  const item = cartItems.value[index];
  if (item.quantity + delta < 1) {
    toast.error("Số lượng không thể nhỏ hơn 1");
    return;
  }
  
  try {
    await cartService.addToCart({...item, size: item.size}, delta);
    await loadCart();
  } catch {
    toast.error("Cập nhật số lượng thất bại");
  }
}

const increaseQuantity = async (index) => updateQuantity(index, 1);

const decreaseQuantity = async (index) => updateQuantity(index, -1);

const goToConfirm = () => {
  if (cartItems.value.length === 0) {
    toast.warning("Giỏ hàng của bạn đang trống");
    return;
  }
  
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const order = {
    name: user.name || "Khách chưa rõ tên",
    address: user.address || "Chưa có địa chỉ",
    total: review.value.totalCheckout,
  };

  router.push({ name: "PaymentConfirm", query: order });
};
</script>