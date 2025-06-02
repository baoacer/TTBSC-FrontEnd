<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-10">
    <!-- Thanh toán lựa chọn -->
    <div class="mb-6 w-full max-w-lg">
      <label class="block text-lg font-semibold text-gray-700 mb-2">Chọn phương thức thanh toán:</label>
      <select v-model="paymentMethod" class="border rounded w-full p-2">
        <option value="COD">Thanh toán khi nhận hàng (COD)</option>
        <option value="VNPAY">Thanh toán qua VNPAY</option>
      </select>
    </div>

    <!-- Nút đặt hàng -->
    <button
      @click="order"
      class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
    >
      Đặt hàng
    </button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      cartID: this.$route.query.cartID || "",
      userID: this.$route.query.userID || "",
      paymentMethod: "COD"
    };
  },
  methods: {
    async order() {
      try {
        const res = await axios.post("http://nguyenlequocbao.id.vn/v1/api/checkout/order", {
          cartID: this.cartID,
          userID: this.userID,
          payment: this.paymentMethod
        });

        if (this.paymentMethod === "VNPAY" && res.data?.url) {
          window.location.href = res.data.url;
        } else {
          this.$router.push("/payment-result?success=true");
        }
      } catch (err) {
        console.error("Lỗi đặt hàng:", err);
        this.$router.push("/payment-result?success=false");
      }
    }
  }
};
</script>

<style scoped></style>
