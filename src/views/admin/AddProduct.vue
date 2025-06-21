<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Thêm sản phẩm</h2>
    <form @submit.prevent="submit" enctype="multipart/form-data">
      <div class="mb-4">
        <label class="block font-medium">Tên sản phẩm</label>
        <input v-model="form.name" class="border rounded w-full p-2" required />
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium">Giá</label>
          <input v-model.number="form.price" type="number" class="border rounded w-full p-2" required min="0" />
        </div>
        <div>
          <label class="block font-medium">Khuyến mãi (%)</label>
          <input v-model.number="form.discount" type="number" class="border rounded w-full p-2" min="0" max="100" />
        </div>
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block font-medium">Mã sản phẩm</label>
          <input v-model="form.code" class="border rounded w-full p-2" />
        </div>
        <div>
          <label class="block font-medium">Danh mục</label>
          <select v-model="form.category" class="border rounded w-full p-2">
            <option value="">Chọn danh mục</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
          </select>
        </div>
      </div>
      <!-- Size nhập động -->
      <div class="mb-4">
        <label class="block font-medium mb-2">Sizes & Số lượng</label>
        <div v-for="(sz, idx) in form.sizes" :key="idx" class="flex gap-2 mb-2">
          <input v-model="sz.size" class="border rounded p-2 w-1/2" placeholder="Size (VD: 39)" required />
          <input v-model.number="sz.stock" type="number" min="0" class="border rounded p-2 w-1/2" placeholder="Tồn kho" required />
          <button type="button" class="text-red-600 px-2" @click="removeSize(idx)" title="Xóa size">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <button type="button" class="bg-blue-100 text-blue-700 px-3 py-1 rounded mt-1" @click="addSize">
          + Thêm size
        </button>
      </div>
      <div class="mb-4">
        <label class="block font-medium">Mô tả</label>
        <textarea v-model="form.description" class="border rounded w-full p-2" rows="3"></textarea>
      </div>
      <!-- Upload ảnh -->
      <div class="mb-4">
        <label class="block font-medium">Ảnh sản phẩm</label>
        <input type="file" accept="image/*" @change="onFileChange" class="border rounded w-full p-2" />
        <img v-if="previewImage" :src="previewImage" alt="Preview" class="w-24 h-24 object-cover mt-2 rounded" />
      </div>
      <div class="flex justify-center mt-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="loading">
          {{ loading ? "Đang lưu..." : "Lưu" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useProduct } from '../../composables/useProduct'
import { useCategory } from '../../composables/useCategory'

const router = useRouter()
const loading = ref(false)
const previewImage = ref(null)
const categories = ref([])
const { createNewProduct } = useProduct()
const { categories: loadCategories, fetchCategories } = useCategory()

const form = reactive({
  name: '',
  price: 0,
  discount: 0,
  code: '',
  category: '',
  sizes: [{ size: '', stock: 0 }],
  description: '',
  image: null // File object
})

onMounted(async () => {
  await fetchCategories()
  categories.value = loadCategories.value || []
})

const addSize = () => {
  form.sizes.push({ size: '', stock: 0 })
}
const removeSize = (idx) => {
  if (form.sizes.length > 1) form.sizes.splice(idx, 1)
}
const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.image = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const submit = async () => {
  if (!form.name || !form.price || !form.sizes.length || !form.image) {
    toast.error('Vui lòng nhập đầy đủ thông tin và chọn ảnh!')
    return
  }
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('price', form.price)
    formData.append('discount', form.discount / 100) 
    formData.append('code', form.code)
    formData.append('category', form.category)
    formData.append('description', form.description)
    formData.append('image', form.image)
    formData.append('sizes', JSON.stringify(form.sizes))
    await createNewProduct(formData)
    toast.success('Thêm sản phẩm thành công!')
  } catch (e) {
    toast.error(e.message || 'Lỗi khi thêm sản phẩm!')
  } finally {
    loading.value = false
  }
}
</script>