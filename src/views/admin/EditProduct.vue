<template>
  <div class="max-w-xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <h2 class="text-xl font-bold mb-4">Sửa sản phẩm</h2>
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
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
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
        <img v-else-if="form.images?.url" :src="form.images.url" alt="Preview" class="w-24 h-24 object-cover mt-2 rounded" />
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
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useProduct } from '@/composables/useProduct'
import { useCategory } from '@/composables/useCategory'

const route = useRoute()
const router = useRouter()
const { fetchProductDetail, updateProductById, productDetail, loading } = useProduct()
const { categories, fetchCategories } = useCategory()

const previewImage = ref(null)
const form = reactive({
  name: '',
  price: 0,
  discount: 0,
  code: '',
  category: '',
  sizes: [{ size: '', stock: 0 }],
  description: '',
  images: null, // object {url, public_id}
  image: null   // file object
})

onMounted(async () => {
  await fetchCategories()
  await fetchProductDetail(route.query.id)
  if (productDetail.value) {
    form.name = productDetail.value.name || ''
    form.price = productDetail.value.price || 0
    form.discount = productDetail.value.discount ? productDetail.value.discount * 100 : 0
    form.code = productDetail.value.code || ''
    form.category = productDetail.value.category || ''
    form.sizes = Array.isArray(productDetail.value.sizes) && productDetail.value.sizes.length
      ? productDetail.value.sizes.map(sz => ({ size: sz.size, stock: sz.stock }))
      : [{ size: '', stock: 0 }]
    form.description = productDetail.value.description || ''
    form.images = productDetail.value.images || null
    previewImage.value = null
    form.image = null
  }
})

function addSize() {
  form.sizes.push({ size: '', stock: 0 })
}
function removeSize(idx) {
  if (form.sizes.length > 1) form.sizes.splice(idx, 1)
}
function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.image = file
    previewImage.value = URL.createObjectURL(file)
  }
}

async function submit() {
  if (!form.name || !form.price || !form.sizes.length) {
    toast.error('Vui lòng nhập đầy đủ thông tin!')
    return
  }
  loading.value = true
  try {
    let data
    debugger
    if (form.image) {
      // Nếu có upload ảnh mới, gửi form-data
      data = new FormData()
      data.append('name', form.name)
      data.append('price', form.price)
      data.append('discount', form.discount / 100)
      data.append('code', form.code)
      data.append('category', form.category)
      data.append('description', form.description)
      data.append('image', form.image)
      data.append('sizes', JSON.stringify(form.sizes))

      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }
    } else {
      // Không upload ảnh mới, gửi JSON thường
      data = {
        name: form.name,
        price: form.price,
        discount: form.discount / 100,
        code: form.code,
        category: form.category,
        description: form.description,
        sizes: form.sizes
      }
    }
    await updateProductById(route.query.id, data)
    toast.success('Cập nhật sản phẩm thành công!')
  } catch (e) {
    toast.error(e.message)
  } finally { 
    loading.value = false
  }
}
</script>