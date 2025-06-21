<template>
  <div class="max-w-6xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <div class="flex gap-2 w-full md:w-auto">
        <input
          v-model="search"
          @input="searchUsers"
          class="border rounded px-3 py-2 w-full md:w-64"
          placeholder="Tìm kiếm người dùng..."
        />
        <select
          v-model="statusFilter"
          class="border rounded px-3 py-2 w-full md:w-40"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="blocked">Đã khóa</option>
        </select>
      </div>
      <!-- Có thể thêm nút thêm user nếu cần -->
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border text-sm">
        <thead>
          <tr class="bg-gray-100 text-center">
            <th class="border px-2 py-2">Email</th>
            <th class="border px-2 py-2">Vai trò</th>
            <th class="border px-2 py-2">Trạng thái</th>
            <th class="border px-2 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user._id"
            class="hover:bg-gray-50 text-center"
          >
            <td class="border px-2 py-2">{{ user.email }}</td>
            <td class="border px-2 py-2">{{ user.role }}</td>
            <td class="border px-2 py-2 text-center">
              <span
                v-if="user.isActive"
                class="flex items-center justify-center gap-1 text-green-600 font-bold"
              >
                <span class="material-icons" title="Đang hoạt động"
                  >check_circle</span
                >
              </span>
              <span
                v-else
                class="flex items-center justify-center gap-1 text-red-600 font-bold"
              >
                <span class="material-icons" title="Đã khóa">block</span>
              </span>
            </td>
            <td class="border px-2 py-2 flex gap-2 justify-center">
              <!-- 🔒 Khóa/mở -->
              <button
                :class="
                  user.isActive
                    ? 'text-red-600 hover:text-red-800'
                    : 'text-green-600 hover:text-green-800'
                "
                @click="toggleActive(user.email)"
                :title="user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'"
              >
                <span class="material-icons">{{
                  user.isActive ? "lock" : "lock_open"
                }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-center space-x-2">
      <button
        :disabled="page === 1"
        @click="page--"
        class="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button
        :disabled="page === totalPages"
        @click="page++"
        class="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useUser } from "../../composables/useUser";

const { fetchUsers, activeUser } = useUser();

const users = ref([]);
const search = ref("");
const roleFilter = ref("");
const statusFilter = ref("");
const page = ref(1);
const limit = ref(10);
const totalPages = ref(1);

async function loadUsers() {
  const query = {
    page: page.value,
    limit: limit.value,
    search: search.value,
  };

  if (statusFilter.value === "active") query.status = true;
  if (statusFilter.value === "blocked") query.status = false;
  if (roleFilter.value) query.role = roleFilter.value;

  const res = await fetchUsers(query);
  users.value = res.users;
  totalPages.value = res.pagination.totalPage;
}

onMounted(loadUsers);

// Tự động gọi API lại khi thay đổi bộ lọc hoặc trang
watch([search, roleFilter, statusFilter, page], loadUsers);

const toggleActive = async (email) => {
  await activeUser({ email });
  await loadUsers();
};
</script>
