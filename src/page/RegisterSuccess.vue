<template>
  <div
    class="flex flex-col items-center justify-center "
  >
    <div class="p-8 rounded-xl max-w-md w-full">
      <!-- Success Icon -->
      <div class="flex justify-center mb-6">
        <div
          class="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center shadow"
        >
          <svg
            class="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="11"
              stroke="currentColor"
              stroke-width="2"
              fill="white"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M7 13l3 3 7-7"
            />
          </svg>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
        Đăng ký thành công!
      </h2>
      <p class="text-center text-gray-600 mb-4">
        Chào mừng bạn đến với ShopBSC!
      </p>
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Email:</span>
            <span class="font-medium text-gray-800">{{ email }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Mật khẩu mặc định:</span>
            <span class="font-medium text-gray-800">{{ password }}</span>
          </div>
        </div>
      </div>
      <p class="text-center text-yellow-600 font-medium mb-6">
        Vui lòng đổi mật khẩu sau khi đăng nhập để bảo mật tài khoản.
      </p>
      <router-link
        to="/login"
        class="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Đăng nhập ngay
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const email = route.query.email || "";
const password = route.query.password || "";
</script>
