<template>
  <div class="flex min-h-screen bg-gray-100">
    <div class="hidden lg:flex lg:w-1/2 items-center justify-center">
      <img
        src="../assets/Premium Vector _ Converse Shoes Hight Vectro Image and Illustration.jpg"
        alt="Register Illustration"
        class="object-cover h-full w-full"
      />
    </div>

    <div class="flex flex-col w-full lg:w-1/2 p-12 bg-white">
      <div class="max-w-lg mx-auto">
        <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6">
          Đăng ký tài khoản
        </h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-6">
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
          >
            Đăng ký
          </button>
          <p class="mt-4 text-center">
            Đã có tài khoản?
            <router-link to="/login" class="text-blue-500 hover:text-blue-700">
              Đăng nhập
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { signup } from "../api/user";
export default {
  data() {
    return {
      email: "",
      message: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      try {
        const res = await signup({ email: this.email });
        if (res.data && res.data.message) {
          this.message = res.data.message;
          toast.success(this.message);
        } else {
          toast.error("Đăng ký không thành công. Vui lòng thử lại.");
        }
      } catch (error) {
        let msg = "Đăng ký thất bại. Vui lòng thử lại.";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          msg = error.response.data.message;
        }
        this.errorMessage = msg;
        toast.error(this.errorMessage);
      }
    },
  },
};
</script>

<style scoped></style>
