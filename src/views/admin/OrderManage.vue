<template>
  <div class="max-w-6xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div class="flex items-center mb-4 justify-between">
      <h2 class="text-xl font-semibold">Quản lý đơn hàng</h2>
    </div>
    <div class="flex mb-4 gap-2">
      <input
        v-model="search"
        @input="searchOrders"
        class="border rounded p-2"
        placeholder="Tìm kiếm theo ID, ngày tạo (YYYY-MM-DD)..."
      />
    </div>
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1">ID đơn hàng</th>
          <th class="border px-2 py-1">ID User</th>
          <th class="border px-2 py-1">Sản phẩm</th>
          <th class="border px-2 py-1">Tổng tiền</th>
          <th class="border px-2 py-1">PT thanh toán</th>
          <th class="border px-2 py-1">Ngày tạo</th>
          <th class="border px-2 py-1">Trạng thái</th>
          <th class="border px-2 py-1">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
          <td class="border px-2 py-1">{{ order.id }}</td>
          <td class="border px-2 py-1">{{ order.userId }}</td>
          <td class="border px-2 py-1">{{ order.products }}</td>
          <td class="border px-2 py-1">{{ order.total.toLocaleString() }}₫</td>
          <td class="border px-2 py-1">{{ order.payment }}</td>
          <td class="border px-2 py-1">{{ order.date }}</td>
          <td class="border px-2 py-1">
            <select
  v-model="order.status"
  class="border rounded px-3 py-2 w-full"
  :class="{
    'text-yellow-500': order.status === 'pending',
    'text-green-600': order.status === 'confirmed',
    'text-blue-500': order.status === 'shipped',
    'text-red-500': order.status === 'cancelled',
    'text-purple-500': order.status === 'delivered'
  }"
>
  <option class="text-yellow-500" value="pending">Pending</option>
  <option class="text-green-600" value="confirmed">Confirmed</option>
  <option class="text-blue-500" value="shipped">Shipped</option>
  <option class="text-red-500" value="cancelled">Cancelled</option>
  <option class="text-purple-500" value="delivered">Delivered</option>
</select>


          </td>
          <td class="border px-2 py-1">
            <button class="bg-blue-500 text-white px-2 py-1 rounded" @click="changeStatus(order)">
              Lưu
            </button>
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
const orders = ref([
  { id: 1001, userId: 1, products: 'Áo thun, Quần jeans', total: 400000, payment: 'COD', date: '2024-06-05', status: 'pending' },
  { id: 1002, userId: 2, products: 'Váy hoa', total: 200000, payment: 'VNPAY', date: '2024-06-04', status: 'confirmed' },
  { id: 1003, userId: 1, products: 'Sơ mi caro', total: 180000, payment: 'COD', date: '2024-06-02', status: 'delivered' },
  { id: 1004, userId: 3, products: 'Áo khoác kaki', total: 350000, payment: 'VNPAY', date: '2024-06-01', status: 'cancelled' },
])
const search = ref('')
const filteredOrders = computed(() => {
  if (!search.value) return orders.value
  return orders.value.filter(
    o =>
      o.id.toString().includes(search.value) ||
      o.date.includes(search.value)
  )
})
const page = ref(1)
const pageSize = 2
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))
const paginatedOrders = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})
function searchOrders() { page.value = 1 }
function changeStatus(order) {
  alert('Cập nhật trạng thái: ' + order.status + ' cho đơn hàng ' + order.id)
}
</script>
