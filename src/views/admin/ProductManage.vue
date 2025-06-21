<template>
  <div class="max-w-7xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <!-- Tìm kiếm -->
        <input
          v-model="search"
          @input="searchProducts"
          class="border rounded px-3 py-2 w-full md:w-64"
          placeholder="Tìm sản phẩm..."
        />

        <!-- Giá từ -->
        <input
          type="number"
          v-model="minPrice"
          placeholder="Giá từ"
          class="border rounded px-3 py-2 w-full md:w-32"
        />
        <!-- Giá đến -->
        <input
          type="number"
          v-model="maxPrice"
          placeholder="Giá đến"
          class="border rounded px-3 py-2 w-full md:w-32"
        />

        <!-- Sắp xếp -->
        <select
          v-model="sortOrder"
          class="border rounded px-3 py-2 w-full md:w-40"
        >
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>
      </div>

      <button
        class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-medium"
        @click="searchProducts"
      >
        Tìm
      </button>

      <!-- Nút thêm sản phẩm -->
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2"
        @click="addProduct"
      >
        <span class="material-icons">add</span>
        Thêm
      </button>
    </div>

    <!-- Bảng sản phẩm -->
    <div class="overflow-x-auto">
      <table class="w-full border text-sm">
        <thead>
          <tr class="bg-gray-100 text-center">
            <th class="border px-2 py-2">Ảnh</th>
            <th class="border px-2 py-2">Tên sản phẩm</th>
            <th class="border px-2 py-2">Mã code</th>
            <th class="border px-2 py-2">Giá gốc</th>
            <th class="border px-2 py-2">Giảm giá</th>
            <th class="border px-2 py-2">Giá sau giảm</th>
            <th class="border px-2 py-2">Tồn kho</th>
            <th class="border px-2 py-2">Ngày tạo</th>
            <th class="border px-2 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product._id"
            class="hover:bg-gray-50 text-center"
          >
            <td class="border px-2 py-2">
              <img
                :src="product.images?.url"
                :alt="product.name"
                class="w-14 h-14 object-cover rounded shadow mx-auto"
              />
            </td>
            <td class="border px-2 py-2 font-semibold">{{ product.name }}</td>
            <td class="border px-2 py-2">{{ product.code }}</td>
            <td class="border px-2 py-2">{{ formatPrice(product.price) }}</td>
            <td class="border px-2 py-2">
              {{ product.discount ? (product.discount * 100).toFixed(0) : 0 }}%
            </td>
            <td class="border px-2 py-2 text-red-600 font-bold">
              {{ formatPrice(product.price * (1 - (product.discount || 0))) }}
            </td>
            <td class="border px-2 py-2">
              {{ totalStock(product.sizes) }}
            </td>
            <td class="border px-2 py-2">
              {{ formatDate(product.createdAt) }}
            </td>
            <td class="border px-2 py-2">
              <button
                class="text-blue-600 hover:text-blue-800 mr-2"
                @click="editProduct(product)"
              >
                <span class="material-icons align-middle">edit_note</span>
              </button>
              <button
                class="text-red-600 hover:text-red-800 mr-2"
                @click="handleDelete(product._id)"
              >
                <span class="material-icons align-middle">delete_forever</span>
              </button>
              <button
                class="text-gray-600 hover:text-gray-800"
                @click="showSizes(product)"
              >
                <span class="material-icons align-middle">pageview</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
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

    <!-- Modal size -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-xs w-full relative"
      >
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
          @click="showModal = false"
          aria-label="Đóng"
        >
          &times;
        </button>
        <h3
          class="text-xl font-bold mb-5 text-blue-700 text-center tracking-wide"
        >
          Số lượng từng size
        </h3>
        <table class="w-full border rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-blue-50 text-blue-700">
              <th class="py-2 px-3 text-left font-semibold">Size</th>
              <th class="py-2 px-3 text-left font-semibold">Tồn kho</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="sz in selectedProduct?.sizes || []"
              :key="sz.size"
              class="even:bg-gray-50"
            >
              <td class="py-2 px-3">{{ sz.size }}</td>
              <td class="py-2 px-3 font-semibold">{{ sz.stock }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProduct } from "../../composables/useProduct";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { formatPrice, formatDate } from "../../utils/index";

const {
  products,
  fetchProducts,
  fetchSearchProducts,
  deleteProductById,
  total,
  loading,
} = useProduct();

const router = useRouter();

const search = ref("");
const sortBy = ref("createdAt");
const sortOrder = ref("desc");
const minPrice = ref("");
const maxPrice = ref("");
const page = ref(1);
const limit = ref(8);

const isSearching = ref(false);

const showModal = ref(false);
const selectedProduct = ref(null);

const fetchFilteredProducts = async () => {
  try {
    await fetchProducts({
      page: page.value,
      limit: limit.value,
    });
  } catch (e) {
    toast.error("Không thể tải danh sách sản phẩm!");
  }
};

const searchProducts = async () => {
  page.value = 1;
  isSearching.value = true;
  try {
    await fetchSearchProducts({
      keyword: search.value || "",
      minPrice: minPrice.value || undefined,
      maxPrice: maxPrice.value || undefined,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      page: page.value,
      limit: limit.value,
    });
  } catch (e) {
    toast.error("Tìm kiếm thất bại!");
  } finally {
    if (!search.value.trim()) {
      isSearching.value = false;
      await fetchFilteredProducts();
    }
  }
};

onMounted(fetchFilteredProducts);

watch([page, sortOrder, minPrice, maxPrice], () => {
  if (!isSearching.value) {
    fetchFilteredProducts();
  }
});

const addProduct = () => {
  router.push({ name: "AddProduct" });
};

const editProduct = (product) => {
  router.push({ name: "EditProduct", query: { id: product._id } });
};

const handleDelete = async (id) => {
  if (!confirm("Bạn chắc muốn xóa sản phẩm này?")) return;
  try {
    debugger
    await deleteProductById(id);
    toast.success("Xóa sản phẩm thành công!");
    await fetchFilteredProducts();
    if (products.value.length === 0 && page.value > 1) {
      page.value--;
      await fetchFilteredProducts(); 
    }
  } catch (e) {
    toast.error("Xóa sản phẩm thất bại!");
  }
};

const showSizes = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const totalStock = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return 0;
  return sizes.reduce((sum, sz) => sum + (sz.stock || 0), 0);
};

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / limit.value))
);
</script>

<style scoped>
.material-icons {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>
