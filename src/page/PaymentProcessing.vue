
<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
    <p class="text-lg">Đang xử lý thanh toán, vui lòng chờ trong giây lát...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'PaymentResult', query: route.query });
  }, 3000);
});
</script>
