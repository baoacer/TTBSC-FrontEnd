<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">Thông tin tài khoản</h2>

      <div class="space-y-4" v-if="user">
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Họ tên:</span>
          <span>{{ user.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Email:</span>
          <span>{{ user.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Số điện thoại:</span>
          <span>{{ user.phone }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Địa chỉ:</span>
          <span>{{ user.address }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-medium text-gray-600">Ngày tạo:</span>
          <span>{{ formatDate(user.createdAt) }}</span>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">Không tìm thấy thông tin người dùng.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: null,
    };
  },
  created() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
/* Optional: custom styles */
</style>
