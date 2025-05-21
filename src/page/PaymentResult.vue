
<template>
  <div class="p-6 max-w-2xl mx-auto text-center">
    <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" alt="success" class="w-24 h-24 mx-auto mb-4" />
    <h1 class="text-3xl font-extrabold text-green-700 mb-2">ĐẶT HÀNG THÀNH CÔNG</h1>
    <p class="mb-6 text-gray-600">Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi.</p>

    <div class="bg-white p-6 shadow-md rounded border text-left max-w-lg mx-auto">
      <h2 class="text-lg font-bold text-green-600 mb-4 text-center">Chi tiết đơn hàng</h2>
      <p><strong>Mã Đơn Hàng:</strong> {{ order.id }}</p>
      <p><strong>Tên Khách Hàng:</strong> {{ order.name }}</p>
      <p><strong>Địa Chỉ Nhận Hàng:</strong> {{ order.address }}</p>
      <p><strong>Tổng Tiền:</strong> {{ order.total }}</p>
    </div>

    <a href="/" class="inline-block mt-6 text-blue-600 underline">
  Quay về trang chủ
</a>

  </div>
</template>

<script setup>
localStorage.removeItem('store'); // 🧹 Clear cart after payment
import { useRoute } from 'vue-router';

const route = useRoute();

const order = {
  id: route.query.id,
  name: route.query.name,
  address: route.query.address,
  total: route.query.total
};
</script>
