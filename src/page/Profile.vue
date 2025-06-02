
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
    <div v-for="order in orders" :key="order._id" class="border p-4 rounded mb-3 shadow">
      <p><strong>Mã đơn:</strong> {{ order._id }}</p>
      <p><strong>Tổng tiền:</strong> {{ formatPrice(order.total) }}</p>
      <p><strong>Phương thức:</strong> {{ order.payment }}</p>
      <p><strong>Trạng thái:</strong> {{ order.status }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const orders = ref([])
const userID = localStorage.getItem("userID")

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

onMounted(async () => {
  const res = await fetch(`http://nguyenlequocbao.id.vn/v1/api/checkout/${userID}`)
  const json = await res.json()
  orders.value = json.metadata || []
})
</script>
