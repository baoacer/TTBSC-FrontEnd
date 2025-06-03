<template>
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Xác nhận đơn hàng</h1>
    <div class="bg-white shadow p-4 rounded border mb-4">
    <h2 class="text-xl font-semibold mb-2">Thông tin đơn hàng</h2>
    <p><strong>Họ tên:</strong> {{ order.name }}</p>
    <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
    <p><strong>Tổng tiền:</strong> {{ formatPrice(order.total) }}</p>
    </div>
    <div class="mb-4">
      <label class="font-semibold mb-2 block">Chọn phương thức thanh toán:</label>
      <label class="mr-6">
        <input type="radio" value="VNPAY" v-model="paymentMethod" />
        VNPAY
      </label>
      <label>
        <input type="radio" value="COD" v-model="paymentMethod" />
        Thanh toán khi nhận hàng (COD)
      </label>
    </div>
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded"
      @click="goToProcessing"
      :disabled="!paymentMethod"
    >
      Xác nhận thanh toán
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const paymentMethod = ref("");

const order = {
  name: route.query.name,
  address: route.query.address,
  total: route.query.total,
};

const goToProcessing = () => {
  router.push({ 
    name: 'PaymentProcessing', 
    query: { ...order, payment: paymentMethod.value }
  });
};

function formatPrice(value) {
  const num = Number(value || 0);
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
</script>
