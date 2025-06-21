<script setup>
import { useRoute, useRouter } from "vue-router";
import { formatPrice } from '../utils/index.js'

const route = useRoute();
const router = useRouter();
const status = route.query.vnp_TransactionStatus;
const isCOD = route.query.cod === "true";
const isSuccess = status === "00";
const amount = route.query.vnp_Amount;

const goHome = () => {
  router.push({ name: "Home" });
}
</script>

<template>
  <div class="p-8 text-center">
    <h1
      :class="isSuccess ? 'text-green-600' : 'text-red-600'"
      class="text-3xl font-bold"
    >
      {{
        isCOD
          ? isSuccess
            ? "ĐẶT HÀNG THÀNH CÔNG"
            : "ĐẶT HÀNG THẤT BẠI"
          : isSuccess
          ? "THANH TOÁN THÀNH CÔNG"
          : "THANH TOÁN THẤT BẠI"
      }}
    </h1>

    <div class="bg-white shadow rounded-xl p-6 max-w-lg mx-auto mb-6">
      <p class="text-lg mb-2">
      </p>
      <p class="text-lg mb-2">
        <span class="font-semibold">Số tiền: </span>
        <span class="text-blue-700">
          {{
            isCOD
              ? formatPrice(amount)
              : formatPrice(Number(amount) / 100)
          }}
        </span>
      </p>
      <p class="text-lg mb-2">
        <span class="font-semibold">Trạng thái: </span>
        <span :class="isSuccess ? 'text-green-600' : 'text-red-600'">
          {{ isSuccess ? "Thành công" : "Thất bại" }}
        </span>
      </p>
      <p class="text-lg mt-4">
        <span v-if="isSuccess" class="text-green-600">
          {{
            isCOD
              ? "Cảm ơn bạn đã đặt hàng! Đơn hàng sẽ được xử lý sớm."
              : "Đơn hàng sẽ được sớm được giao, Cảm ơn bạn!"
          }}
        </span>
        <span v-else class="text-red-600">
          Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </span>
      </p>
    </div>

    <button
      @click="goHome"
      class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      🏠 Quay lại trang chủ
    </button>
  </div>
</template>