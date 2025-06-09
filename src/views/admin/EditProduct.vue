<template>
  <div class="max-w-lg mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <h2 class="text-xl font-semibold mb-4">Sửa sản phẩm</h2>
    <form @submit.prevent="save">
      <div class="mb-2">
        <label class="block font-medium">Tên sản phẩm</label>
        <input v-model="form.name" class="border rounded w-full p-2" required />
      </div>
      <div class="mb-2 flex gap-2">
        <div class="flex-1">
          <label class="block font-medium">Giá</label>
          <input v-model.number="form.price" type="number" class="border rounded w-full p-2" required />
        </div>
        <div class="flex-1">
          <label class="block font-medium">Khuyến mãi (%)</label>
          <input v-model.number="form.discount" type="number" class="border rounded w-full p-2" />
        </div>
      </div>
      <div class="mb-2 flex gap-2">
        <div class="flex-1">
          <label class="block font-medium">Số lượng</label>
          <input v-model.number="form.quantity" type="number" class="border rounded w-full p-2" />
        </div>
        <div class="flex-1">
          <label class="block font-medium">Code</label>
          <input v-model="form.code" class="border rounded w-full p-2" />
        </div>
      </div>
      <div class="mb-2">
        <label class="block font-medium">Sizes (cách nhau dấu phẩy)</label>
        <input v-model="form.sizes" class="border rounded w-full p-2" />
      </div>
      <div class="mb-2">
        <label class="block font-medium">Mô tả</label>
        <textarea v-model="form.description" class="border rounded w-full p-2" rows="3"></textarea>
      </div>
      <div class="mb-2">
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
  name: "Áo thun trắng",
  price: 150000,
  discount: 10,
  quantity: 50,
  code: 'SP01',
  sizes: 'S,M,L',
  description: 'Chất liệu cotton thoáng mát',
  image: 'https://via.placeholder.com/150'
})
function save() {
  alert('Lưu thành công!\n' + JSON.stringify(form.value, null, 2))
}
</script>
