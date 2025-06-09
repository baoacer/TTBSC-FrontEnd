<template>
  <div class="max-w-4xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div class="flex items-center mb-4 justify-between">
      <h2 class="text-xl font-semibold">Quản lý người dùng</h2>
    </div>
    <div class="flex mb-4 gap-2">
      <input
        v-model="search"
        @input="searchUsers"
        class="border rounded p-2 flex-1"
        placeholder="Tìm kiếm theo email hoặc SĐT..."
      />
    </div>
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1">ID</th>
          <th class="border px-2 py-1">Email</th>
          <th class="border px-2 py-1">SĐT</th>
          <th class="border px-2 py-1">Trạng thái</th>
          <th class="border px-2 py-1">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
          <td class="border px-2 py-1">{{ user.id }}</td>
          <td class="border px-2 py-1">{{ user.email }}</td>
          <td class="border px-2 py-1">{{ user.phone }}</td>
          <td class="border px-2 py-1">
            <span :class="user.active ? 'text-green-600' : 'text-red-600'">
              {{ user.active ? 'Active' : 'Blocked' }}
            </span>
          </td>
          <td class="border px-2 py-1">
            <button
              v-if="user.active"
              class="bg-red-500 text-white px-2 py-1 rounded"
              @click="blockUser(user)"
            >Block</button>
            <button
              v-else
              class="bg-green-500 text-white px-2 py-1 rounded"
              @click="activeUser(user)"
            >Active</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-center space-x-2">
      <button :disabled="page===1" @click="page--" class="px-3 py-1 border rounded">Prev</button>
      <span>Trang {{ page }}/{{ totalPages }}</span>
      <button :disabled="page===totalPages" @click="page++" class="px-3 py-1 border rounded">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const users = ref([
  { id: 1, email: "a@gmail.com", phone: "0912345678", active: true },
  { id: 2, email: "b@gmail.com", phone: "0987654321", active: false },
  { id: 3, email: "c@gmail.com", phone: "0909090909", active: true },
  { id: 4, email: "d@gmail.com", phone: "0933333333", active: false },
])
const search = ref('')
const filteredUsers = computed(() => {
  if (!search.value) return users.value
  return users.value.filter(u =>
    u.email.toLowerCase().includes(search.value.toLowerCase()) ||
    u.phone.includes(search.value)
  )
})
const page = ref(1)
const pageSize = 2
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))
const paginatedUsers = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})
function searchUsers() { page.value = 1 }
function blockUser(user) { user.active = false }
function activeUser(user) { user.active = true }
</script>
