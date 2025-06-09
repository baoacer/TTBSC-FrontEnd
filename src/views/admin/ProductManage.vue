<template>
  <div class="max-w-5xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div class="flex items-center mb-4 justify-between">
      <h2 class="text-xl font-semibold">Quản lý sản phẩm</h2>
      <button class="bg-blue-600 text-white px-4 py-2 rounded" @click="addProduct">Thêm sản phẩm</button>
    </div>
    <div class="flex mb-4">
      <input
        v-model="search"
        @input="searchProducts"
        class="border rounded p-2 w-full"
        placeholder="Tìm kiếm sản phẩm theo tên..."
      />
    </div>
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-2 py-1">STT</th>
          <th class="border px-2 py-1">Tên sản phẩm</th>
          <th class="border px-2 py-1">Giá</th>
          <th class="border px-2 py-1">Khuyến mãi</th>
          <th class="border px-2 py-1">Số lượng</th>
          <th class="border px-2 py-1">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, idx) in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
          <td class="border px-2 py-1">{{ idx + 1 + (page-1)*pageSize }}</td>
          <td class="border px-2 py-1">{{ product.name }}</td>
          <td class="border px-2 py-1">{{ product.price.toLocaleString() }}₫</td>
          <td class="border px-2 py-1">{{ product.discount }}%</td>
          <td class="border px-2 py-1">{{ product.quantity }}</td>
          <td class="border px-2 py-1">
            <button class="bg-yellow-400 px-2 py-1 rounded mr-2" @click="editProduct(product)">Sửa</button>
            <button class="bg-red-500 text-white px-2 py-1 rounded" @click="deleteProduct(product.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-center space-x-2">
      <button :disabled="page === 1" @click="page--" class="px-3 py-1 border rounded">Prev</button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button :disabled="page === totalPages" @click="page++" class="px-3 py-1 border rounded">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const products = ref([
  { id: 1, name: 'Áo thun trắng', price: 150000, discount: 10, quantity: 50 },
  { id: 2, name: 'Quần jeans', price: 250000, discount: 0, quantity: 30 },
  { id: 3, name: 'Áo khoác kaki', price: 350000, discount: 20, quantity: 20 },
  { id: 4, name: 'Váy hoa', price: 200000, discount: 5, quantity: 25 },
  { id: 5, name: 'Sơ mi caro', price: 180000, discount: 0, quantity: 40 },
  { id: 6, name: 'Chân váy', price: 160000, discount: 0, quantity: 10 },
])
const search = ref('')
const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
const page = ref(1)
const pageSize = 3
const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / pageSize)
)
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredProducts.value.slice(start, start + pageSize)
})
function searchProducts() { page.value = 1 }
function addProduct() { alert('Chuyển sang trang thêm sản phẩm!') }
function editProduct(p) { alert('Chuyển sang trang sửa: ' + p.name) }
function deleteProduct(id) {
  if (confirm('Bạn chắc muốn xóa?')) products.value = products.value.filter(p => p.id !== id)
}
</script>
