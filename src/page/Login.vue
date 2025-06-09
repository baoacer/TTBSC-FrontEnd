<template>
  <div class="flex bg-gray-100">
    <div
      class="hidden lg:flex lg:w-1/2 h-screen items-center justify-center bg-white"
    >
      <img
        src="../assets/image_login_page.jpg"
        alt="Login Illustration"
        class="object-contain w-full max-h-screen"
      />
    </div>

    <div class="flex flex-col w-full lg:w-1/2 p-12 bg-white">
      <div class="max-w-md mx-auto">
        <h2 class="text-3xl font-semibold text-gray-800 text-center mb-6">
          Chào mừng bạn trở lại!
        </h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Email Address"
              required
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-gray-700 mb-2"
              >Mật khẩu</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
          >
            Đăng nhập
          </button>

          <div class="text-center mt-6">
            <router-link
              to="/forgot-password"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Quên mật khẩu?
            </router-link>
          </div>

          <div class="text-center mt-4">
            <p class="text-gray-600">Chưa có tài khoản?</p>
            <router-link
              to="/register"
              class="text-blue-600 hover:text-blue-700"
            >
              Đăng ký ngay
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUser } from "../composables/useUser";
import { toast } from "vue3-toastify";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const { login } = useUser();

const handleLogin = async () => {
  try {
    const metadata = await login(email.value, password.value);
    if (!metadata?.user || !metadata?.accessToken) {
      toast.error("Tài khoản không hợp lệ");
      return;
    }
    router.push("/");
  } catch (error) {
    let msg = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.";
    if (error.response && error.response.data && error.response.data.message) {
      msg = error.response.data.message;
    }
    errorMessage.value = msg;
    toast.error(msg);
  }
};
</script>

<style scoped></style>
