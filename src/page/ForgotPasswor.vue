<template>
  <div class="flex items-center justify-center mt-10">
    <div class="bg-white p-8 rounded-md shadow-md w-full max-w-md">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        Quên mật khẩu
      </h2>
      <p class="text-sm text-gray-600 mb-4 text-center">
        Nhập địa chỉ email của bạn để nhận mật khẩu mới qua email.
      </p>
      <form @submit.prevent="handleForgotPassword">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="you@example.com"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none transition duration-200"
          :disabled="loading"
        >
          {{ loading ? "Đang gửi..." : "Gửi mật khẩu mới" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useUser } from "../composables/useUser";

const { reset } = useUser()
const email = ref("");
const loading = ref(false);

const handleForgotPassword = async () => {
  if (!email.value) {
    toast.warning("Vui lòng nhập email hợp lệ");
    return;
  }
  loading.value = true;
  try {
    await reset({ email: email.value });
    toast.success("Mật khẩu mới đã được gửi đến email của bạn!");
    email.value = "";
  } catch (error) {
    toast.error(error.message);
  } finally {
    loading.value = false;
  }
};
</script>
