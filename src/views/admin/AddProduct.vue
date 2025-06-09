<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Thêm sản phẩm</h2>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block font-medium">Tên sản phẩm</label>
        <input v-model="form.name" class="border rounded w-full p-2" required />
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium">Giá</label>
          <input v-model.number="form.price" type="number" class="border rounded w-full p-2" required />
        </div>
        <div>
          <label class="block font-medium">Khuyến mãi (%)</label>
          <input v-model.number="form.discount" type="number" class="border rounded w-full p-2" />
        </div>
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium">Số lượng</label>
          <input v-model.number="form.quantity" type="number" class="border rounded w-full p-2" />
        </div>
        <div>
          <label class="block font-medium">Mã sản phẩm</label>
          <input v-model="form.code" class="border rounded w-full p-2" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block font-medium">Sizes (phân tách bằng dấu phẩy)</label>
        <input v-model="form.sizes" class="border rounded w-full p-2" />
      </div>
      <div class="mb-4">
        <label class="block font-medium">Mô tả</label>
        <textarea v-model="form.description" class="border rounded w-full p-2" rows="3"></textarea>
      </div>
      <div class="mb-4">
        <label class="block font-medium">Ảnh sản phẩm (URL)</label>
        <input v-model="form.image" class="border rounded w-full p-2" />
        <img :src="form.image" alt="" class="w-24 h-24 object-cover mt-2" v-if="form.image" />
      </div>
      <div class="flex justify-center mt-4">
  <button class="bg-blue-600 text-white px-4 py-2 rounded">
    Lưu
  </button>
</div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const form = ref({
  name: '',
  price: 0,
  discount: 0,
  quantity: 0,
  code: '',
  sizes: '',
  description: '',
  image: ''
})
function submit() {
  alert('Đã thêm sản phẩm: ' + form.value.name)
}
</script>
