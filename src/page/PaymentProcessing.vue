<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
    <p class="text-lg mb-2">Đang xử lý thanh toán cho <strong>{{ nameDisplay }}</strong>, vui lòng chờ trong giây lát...</p>
    <p v-if="totalDisplay"><strong>Số tiền:</strong> {{ totalDisplay }}</p>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const nameDisplay = computed(() => route.query.name || 'khách hàng');
const totalDisplay = computed(() => {
  const num = Number(route.query.total || 0);
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
});

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'PaymentResult', query: route.query });
  }, 3000);
});
</script>
<style scoped>  
  .animate-spin {
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .h-screen {
    height: 100vh;
  }
  .text-center {
    text-align: center;
  }
  .text-lg {
    font-size: 1.125rem;
  }
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  .mb-4 {
    margin-bottom: 1rem;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .h-16 {
    height: 4rem;
  }
  .w-16 {
    width: 4rem;
  }     
</style>