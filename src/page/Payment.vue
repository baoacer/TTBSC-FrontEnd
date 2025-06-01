<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-10">
    <!-- Checkmark Icon with Modern Animation -->
    <div
      class="flex items-center justify-center bg-gradient-to-br from-blue-200 to-teal-300 p-8 rounded-full mb-12 shadow-lg animate-bounce"
    >
      <svg
        class="w-28 h-28 text-teal-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>

    <!-- Congratulatory Message with Modern Style -->
    <div class="text-center mb-10 max-w-3xl w-full">
      <h1 class="text-5xl font-extrabold text-gray-800 mb-6 tracking-tight">
       ĐẶT HÀNG THÀNH CÔNG
      </h1>
      <p class="text-xl text-gray-600">Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi.</p>
    </div>

    <!-- Order Information with a Glassmorphism Card Style -->
    <div
      class="bg-white/70 backdrop-blur-sm border-l-8 border-teal-400 shadow-xl rounded-2xl p-10 w-full max-w-xl mb-14"
    >
      <h3 class="text-2xl font-semibold text-teal-700 text-center mb-6">
        Chi tiết đơn hàng
      </h3>
      <div class="text-gray-800 space-y-5 text-lg leading-relaxed">
        <p><strong>Mã Đơn Hàng:</strong> {{ orderId }}</p>
        <p><strong>Tên Khách Hàng:</strong> {{ name }}</p>
        <p><strong>Địa Chỉ Nhận Hàng:</strong> {{ address }}</p>
        <p><strong>Tổng Giá Trị Đơn Hàng:</strong> {{ formatPrice(totalPrice) }}</p>
      </div>
    </div>

    <!-- Call-to-Action Buttons with Modern Animation -->
    <div class="flex gap-6">
      <router-link to="/">
        <button
          class="bg-gradient-to-r from-blue-500 to-teal-600 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-4 px-12 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105"
        >
          Trở về Trang Chủ
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Payment",

  data() {
    return {
      orderId: "",
      name: "",
      address: "",
      totalPrice: 0,
    };
  },
  methods: {
    formatPrice(price) {
      if (isNaN(price) || price < 0) {
        return "0₫";
      }
      return price.toLocaleString("vi-VN") + "₫";
    },
  },
  mounted() {
    const { orderId, totalPrice, name, address } = this.$route.params;

    this.totalPrice = totalPrice ? parseFloat(totalPrice) : 0;
    this.orderId = orderId || "";
    this.name = name || "";
    this.address = address || "";
  },
};
</script>
