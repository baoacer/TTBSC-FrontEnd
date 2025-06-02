<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const status = route.query.vnp_TransactionStatus
const orderId = route.query.vnp_TxnRef
const amount = route.query.vnp_Amount

const isSuccess = status === '00'
</script>

<template>
  <div class="p-8 text-center">
    <h1 :class="isSuccess ? 'text-green-600' : 'text-red-600'" class="text-3xl font-bold mb-4">
      {{ isSuccess ? 'THANH TOÁN THÀNH CÔNG' : 'THANH TOÁN THẤT BẠI' }}
    </h1>

    <p class="text-lg">Mã đơn hàng: {{ orderId }}</p>
    <p class="text-lg">Trạng thái: {{ isSuccess ? 'Thành công' : 'Thất bại' }}</p>
    <p class="text-lg mt-4">
      <span v-if="isSuccess" class="text-green-600">Cảm ơn bạn đã thanh toán!</span>
      <span v-else class="text-red-600">Vui lòng thử lại hoặc liên hệ hỗ trợ.</span>
    </p>

    <div class="mt-8">
      <router-link to="/" class="text-blue-600 hover:underline">🏠 Quay lại trang chủ</router-link>
      <router-link to="/payments" class="ml-4 text-blue-600 hover:underline">📦 Xem đơn hàng</router-link>
      <router-link to="/contact" class="ml-4 text-blue-600 hover:underline">📞 Liên hệ hỗ trợ</router-link>
    </div>
  </div>
</template>
