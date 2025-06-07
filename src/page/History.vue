<template>
  <div class="flex flex-col p-8">
    <div class="w-full">
      <div class="flex justify-between border-b pb-2 mb-4">
        <span class="font-bold uppercase text-lg">Lịch sử đơn hàng</span>
      </div>

      <div v-if="orders.length === 0" class="text-center text-gray-500 py-8">
        Bạn chưa có đơn hàng nào.
      </div>

      <div
        v-for="order in orders"
        :key="order._id"
        class="mb-8 border-b pb-4"
      >
        <div class="flex justify-between items-center mb-2">
          <div>
            <span class="font-semibold">Mã đơn hàng:</span> {{ order._id }}
          </div>
          <div>
            <span class="font-semibold">Ngày đặt:</span>
            {{ formatDate(order.createdAt) }}
          </div>
          <div>
            <span class="font-semibold">Trạng thái: </span>
            <span :class="statusColor(order.order_status)">
              {{ statusText(order.order_status) }}
            </span>
          </div>
        </div>
        <div class="mb-2">
          <span class="font-semibold">Địa chỉ giao hàng:</span> {{ order.order_shipping }}
        </div>
        <div class="mb-2">
          <span class="font-semibold">Phương thức thanh toán:</span> {{ order.order_payment }}
        </div>
        <div class="mb-2">
          <span class="font-semibold">Tổng tiền: </span>
          <span class="text-red-600 font-semibold">{{ formatPrice(order.order_checkout) }}</span>
        </div>
        <div>
          <span class="font-semibold">Sản phẩm:</span>
          <div
            v-for="item in order.order_products"
            :key="item._id"
            class="flex items-center mt-2"
          >
            <img :src="item.image" :alt="item.name" class="w-16 h-16 mr-4" />
            <div>
              <div class="font-bold">{{ item.name }}</div>
              <div>Size: {{ item.size }}</div>
              <div>Số lượng: {{ item.quantity }}</div>
              <div>Giá: {{ formatPrice(item.price) }}</div>
              <div v-if="item.discount > 0" class="text-sm text-gray-500">
                Giảm giá: {{ (item.discount * 100).toFixed(0) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const orders = ref([]);

const formatPrice = (price) => {
  return Number(price).toLocaleString("vi-VN") + "₫";
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN");
};

const statusText = (status) => {
  switch (status) {
    case "pending":
      return "Chờ xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "completed":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "";
  }
};

onMounted(async () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    orders.value = [];
    return;
  }
  const user = JSON.parse(userStr);
  const userID = user._id;
  try {
    const res = await fetch(`http://nguyenlequocbao.id.vn/v1/api/checkout/${userID}`);
    const data = await res.json();
    if (data && data.data) {
      orders.value = data.data;
    }
  } catch (e) {
    orders.value = [];
  }
});
</script>