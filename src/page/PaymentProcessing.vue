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

onMounted(async () => {
  const cartID = localStorage.getItem('cartID')
  const userID = JSON.parse(localStorage.getItem('user'))._id

  console.log(userID, route.query.payment)

  const res = await fetch("http://nguyenlequocbao.id.vn/v1/api/checkout/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartID,
      userID,
      payment: route.query.payment
    }),
  });
  const data = await res.json();

  if (data && data.data) {
    if (typeof data.data === "string") {
      window.location.href = data.data;
    } else if (typeof data.data === "object") {
      router.replace({
        name: "PaymentResult",
        query: {
          vnp_TransactionStatus: "00",
          vnp_TxnRef: data.data._id,
          vnp_Amount: data.data.order_checkout,
          cod: "true"
        }
      });
    }
  } else {
    alert("Không lấy được kết quả thanh toán!");
  }
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