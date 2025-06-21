<template>
  <div class="flex flex-col p-8">
    <div class="w-full max-w-4xl mx-auto">
      <div class="flex justify-between border-b pb-2 mb-4">
        <span class="font-bold uppercase text-lg">Lịch sử đơn hàng</span>
      </div>

      <div v-if="loading" class="text-center text-gray-500 py-8">
        Đang tải dữ liệu...
      </div>
      <div v-else-if="orders.length === 0" class="text-center text-gray-500 py-8">
        Bạn chưa có đơn hàng nào.
      </div>

      <div
        v-for="order in orders"
        :key="order._id"
        class="mb-8 bg-white rounded-xl shadow-lg border p-6 hover:shadow-2xl transition relative"
      >
        <!-- Nút hủy đơn -->
        <button
          v-if="canCancel(order)"
          class="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          @click="cancelOrder(order._id)"
        >
          Hủy đơn
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Cột 1: Thông tin đơn hàng -->
          <div>
            <div class="mb-2">
              <span class="font-semibold">Ngày đặt:</span>
              {{ formatDate(order.createdAt) }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Trạng thái đơn hàng:</span>
              <span :class="orderStatusColor(order.status)" class="font-semibold ml-1">
                {{ orderStatusText(order.status) }}
              </span>
            </div>
            <div class="mb-2">
              <span class="font-semibold">Thanh toán:</span>
              <span :class="paymentStatusColor(order.payment?.status)" class="font-semibold ml-1">
                {{ paymentStatusText(order.payment?.status) }}
              </span>
              <span class="ml-2 text-gray-500">({{ order.payment?.method }})</span>
            </div>
            <div class="mb-2">
              <span class="font-semibold">Số điện thoại:</span> {{ order.shipping?.phone }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Địa chỉ giao hàng:</span> {{ order.shipping?.address }}
            </div>
            <div class="mb-2">
              <span class="font-semibold">Tổng tiền:</span>
              <span class="text-red-600 font-bold ml-1">
                {{ formatPrice(order.checkout?.totalCheckout) }}
              </span>
            </div>
            <div v-if="order.note" class="mt-2 text-gray-500">
              <span class="font-semibold">Ghi chú:</span> {{ order.note }}
            </div>
          </div>
          <!-- Cột 2: Danh sách sản phẩm -->
          <div>
            <div class="font-semibold mb-2">Sản phẩm:</div>
            <div
              v-for="item in order.products"
              :key="item._id"
              class="flex items-center mb-4 bg-gray-50 rounded-lg p-2"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-16 h-16 mr-4 rounded shadow border"
              />
              <div>
                <div class="font-bold">{{ item.name }}</div>
                <div class="text-sm text-gray-600">Size: {{ item.size }}</div>
                <div class="text-sm text-gray-600">Số lượng: {{ item.quantity }}</div>
                <div class="text-sm text-gray-600">
                  Giá: {{ formatPrice(item.price) }}
                  <span v-if="item.discount > 0" class="ml-2 text-green-600">
                    -{{ (item.discount * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useCheckout } from "../composables/useCheckout";
import { useUser } from "../composables/useUser";
import { formatDate } from "../utils/index";
import { toast } from "vue3-toastify";
import { paymentStatusColor, paymentStatusText, orderStatusColor, orderStatusText, formatPrice } from "../utils/index"

const { fetchOrders, loading, cancelOrderByUser, orders } = useCheckout();

const canCancel = (order) => {
  return order.status === "pending" || order.status === "confirmed";
};

const cancelOrder = async (orderId) => {
  if (!confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;
  try {
    debugger
    await cancelOrderByUser(orderId);
    await fetchOrders(); 
    toast.success("Đã hủy đơn hàng!");
  } catch (e) {
    toast.error(e.message);
  }
};

onMounted(async () => {
  await fetchOrders();
});
</script>
