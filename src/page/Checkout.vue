<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Xác nhận đơn hàng</h2>
    <div class="space-y-4">
      <p><strong>Cart ID:</strong> {{ cartID }}</p>
      <p><strong>User ID:</strong> {{ userID }}</p>

      <div class="flex space-x-4">
        <button @click="pay('COD')" class="bg-blue-500 text-white px-4 py-2 rounded">Thanh toán COD</button>
        <button @click="pay('VNPAY')" class="bg-green-500 text-white px-4 py-2 rounded">Thanh toán VNPAY</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createOrder } from '@/services/paymentService'

const cartID = localStorage.getItem('cartID') || '';
const userID = localStorage.getItem('userID') || '';
const pay = async (method) => {
  try {
    const res = await createOrder(cartID, userID, method)
    if (method === 'VNPAY') {
      window.location.href = res.metadata?.url
    } else {
      alert('Đặt hàng thành công với phương thức COD!')
    }
  } catch (err) {
    alert(err.message)
  }
}
</script>