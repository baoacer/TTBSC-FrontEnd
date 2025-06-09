<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">Thông tin tài khoản</h2>

      <form v-if="user" @submit.prevent="onSave" class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-600">Họ tên:</label>
          <input v-model="editUser.name" class="input" type="text" required />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-600">Email:</label>
          <input v-model="editUser.email" class="input" type="email" required disabled />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-600">Số điện thoại:</label>
          <input v-model="editUser.phone" class="input" type="text" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-600">Địa chỉ:</label>
          <input v-model="editUser.address" class="input" type="text" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium text-gray-600">Ngày tạo:</label>
          <input :value="formatDate(editUser.createdAt)" class="input bg-gray-100" type="text" disabled />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button
            v-if="!isEditing"
            type="button"
            class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
            @click="isEditing = true"
          >
            Chỉnh sửa
          </button>
          <button
            v-else
            type="submit"
            class="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
          >
            Lưu
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-400"
            @click="onCancel"
          >
            Hủy
          </button>
        </div>
      </form>

      <div v-else class="text-center text-gray-500">Không tìm thấy thông tin người dùng.</div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
  name: "Profile",
  setup() {
    const storedUser = localStorage.getItem("user");
    const user = ref(storedUser ? JSON.parse(storedUser) : null);
    const editUser = reactive({ ...(user.value || {}) });
    const isEditing = ref(false);

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    const onSave = async () => {
      try {
        // Gọi API cập nhật thông tin user (giả sử endpoint dưới)
        await axios.put(
          `http://nguyenlequocbao.id.vn/v1/api/user/${editUser._id}`,
          {
            name: editUser.name,
            phone: editUser.phone,
            address: editUser.address,
          }
        );
        Object.assign(user.value, editUser);
        localStorage.setItem("user", JSON.stringify(user.value));
        isEditing.value = false;
        toast.success("Cập nhật thông tin thành công!");
      } catch {
        toast.error("Cập nhật thất bại. Vui lòng thử lại");
      }
    };

    const onCancel = () => {
      Object.assign(editUser, user.value);
      isEditing.value = false;
    };

    return {
      user,
      editUser,
      isEditing,
      formatDate,
      onSave,
      onCancel,
    };
  },
};
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
  width: 100%;
}
</style>
