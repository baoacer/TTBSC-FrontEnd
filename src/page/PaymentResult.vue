<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const status = route.query.vnp_TransactionStatus;
const isCOD = route.query.cod === "true";

const isSuccess = status === "00";

function formatPrice(value) {
  const num = Number(value || 0);
  return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
</script>

<template>
  <div class="p-8 text-center">
    <h1
      :class="isSuccess ? 'text-green-600' : 'text-red-600'"
      class="text-3xl font-bold mb-4"
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

    <p class="text-lg">Mã đơn hàng: {{ route.query.vnp_TxnRef }}</p>
    <p class="text-lg">
      Số tiền:
      {{
        isCOD
          ? formatPrice(route.query.vnp_Amount)
          : formatPrice(Number(route.query.vnp_Amount) / 100)
      }}
    </p>
    <p class="text-lg">
      Trạng thái: {{ isSuccess ? "Thành công" : "Thất bại" }}
    </p>
    <p class="text-lg mt-4">
      <span v-if="isSuccess" class="text-green-600">
        {{
          isCOD
            ? "Cảm ơn bạn đã đặt hàng! Đơn hàng sẽ được xử lý sớm."
            : "Cảm ơn bạn đã thanh toán!"
        }}
      </span>
      <span v-else class="text-red-600">
        Vui lòng thử lại hoặc liên hệ hỗ trợ.
      </span>
    </p>

    <a
  href="/"
  class="text-blue-600 hover:underline"
>
  🏠 Quay lại trang chủ
</a>
  </div>
</template>
