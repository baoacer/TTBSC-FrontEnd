<template>
  <!-- Thanh tìm kiếm và category trên cùng một hàng -->
  <div class="container mx-auto py-3 px-8">
    <form
      @submit.prevent="onSearch"
      class="flex items-center gap-3 max-w-4xl mx-auto"
    >
      <!-- Dropdown chọn danh mục -->
      <div class="relative" ref="categoryDropdownRef">
        <button
          type="button"
          class="flex items-center border px-3 py-2 rounded bg-white hover:bg-gray-100 min-w-[140px]"
          @click="toggleCategoryDropdown"
        >
          <span class="material-icons mr-1 text-base">category</span>
          <span
            class="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] block"
          >
            {{ selectedCategoryName || "Tất cả" }}
          </span>
          <span class="material-icons ml-1 text-sm">expand_more</span>
        </button>
        <div
          v-if="showCategoryDropdown"
          class="absolute left-0 mt-2 bg-white shadow-lg rounded w-56 z-30 max-h-72 overflow-y-auto"
        >
          <div
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            :class="{ 'font-bold text-blue-600': !selectedCategory }"
            @click="selectCategory(null)"
          >
            Tất cả
          </div>
          <div
            v-for="category in categories"
            :key="category._id"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            :class="{
              'font-bold text-blue-600': selectedCategory === category.name,
            }"
            @click="selectCategory(category.name)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>
      <!-- Input tìm kiếm -->
      <input
        v-model="keyword"
        type="text"
        class="border rounded-l px-4 py-2 w-full focus:outline-none"
        placeholder="Tìm kiếm sản phẩm..."
      />
      <!-- Nút filter giá -->
      <div class="relative" ref="priceFilterButtonRef">
        <button
          type="button"
          class="bg-gray-100 border-l px-3 py-2 rounded-r flex items-center gap-1 hover:bg-gray-200"
          @mousedown.stop="togglePriceFilter"
        >
          <span class="material-icons text-base">filter_alt</span>
        </button>
        <div
          v-if="showPriceFilter"
          class="absolute left-0 mt-2 bg-white shadow-lg rounded p-4 z-20 w-64"
          ref="priceFilterRef"
        >
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Giá từ</label>
            <input
              v-model.number="minPrice"
              type="number"
              min="0"
              class="border rounded w-full p-2"
              placeholder="Tối thiểu"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Đến giá</label>
            <input
              v-model.number="maxPrice"
              type="number"
              min="0"
              class="border rounded w-full p-2"
              placeholder="Tối đa"
            />
          </div>
          <div class="flex justify-end mt-3 gap-2">
            <button
              type="button"
              class="text-gray-500 px-2 py-1"
              @click="resetPriceFilter"
            >
              Đặt lại
            </button>
            <button
              type="button"
              class="bg-blue-600 text-white px-3 py-1 rounded"
              @click="applyPriceFilter"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        :disabled="loading"
      >
        <span class="material-icons align-middle">search</span>
      </button>
    </form>
  </div>
  <div class="flex flex-col">
    <div
      class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      <ProductCard
        v-for="(product, index) in paginatedProducts"
        :key="index"
        :product="product"
      />
    </div>
    <div class="mt-4 self-center">
      <Pagination :totalPage="totalPage" @page-changed="onPageChanged" />
    </div>
  </div>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";
import Pagination from "../Pagination.vue";
import { ref, computed, onMounted } from "vue";
import { useUser } from "../../composables/useUser";
import { useCart } from "../../composables/useCart";
import { useRouter } from "vue-router";
import { useProduct } from "../../composables/useProduct";
import { useCategory } from "../../composables/useCategory";
import { MODE_PAGINATION } from "../../utils/constant";

const { categories, fetchCategories } = useCategory();
const selectedCategory = ref(null);
const showCategoryDropdown = ref(false);
const categoryDropdownRef = ref(null);

const { totalItems } = useCart();
const showDropdown = ref(false);
const dropdownRef = ref(null);
const priceFilterRef = ref(null);
const priceFilterButtonRef = ref(null);
const router = useRouter();
const { isLogin, logout, user } = useUser();

const keyword = ref("");
const minPrice = ref("");
const maxPrice = ref("");
const showPriceFilter = ref(false);

const {
  loading,
  setMode,
  setSearchParams,
  products,
  fetchProducts,
  fetchSearchProducts,
  fetchProductsByCategory,
  totalPage,
  mode,
  search,
} = useProduct();

const currentPage = ref(1);
const itemsPerPage = ref(8);

const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return "";
  const cat = categories.value.find((c) => c.name === selectedCategory.value);
  return cat ? cat.name : "";
});

const onSearch = async () => {
  currentPage.value = 1;
  setMode(MODE_PAGINATION.SEARCH);
  setSearchParams({
    keyword: keyword.value,
    minPrice: minPrice.value || undefined,
    maxPrice: maxPrice.value || undefined,
    category: selectedCategory.value || undefined,
  });
  await fetchSearchProducts({
    keyword: keyword.value,
    minPrice: minPrice.value || undefined,
    maxPrice: maxPrice.value || undefined,
    category: selectedCategory.value || undefined,
    page: 1,
    limit: itemsPerPage.value,
  });
  showPriceFilter.value = false;
  showCategoryDropdown.value = false;
};

function resetPriceFilter() {
  minPrice.value = "";
  maxPrice.value = "";
}

function applyPriceFilter() {
  onSearch();
}

const paginatedProducts = computed(() =>
  Array.isArray(products.value) ? products.value : []
);

const onPageChanged = async (page) => {
  currentPage.value = page;
  if (mode.value === MODE_PAGINATION.ALL) {
    await fetchProducts({ page: currentPage.value, limit: itemsPerPage.value });
  } else if (mode.value === MODE_PAGINATION.SEARCH) {
    await fetchSearchProducts({
      keyword: search.value.keyword,
      minPrice: search.value.minPrice,
      maxPrice: search.value.maxPrice,
      category: selectedCategory.value,
      page: currentPage.value,
      limit: itemsPerPage.value,
    });
  } else if (mode.value === MODE_PAGINATION.CATEGORY) {
    await fetchProductsByCategory({
      category: selectedCategory.value,
      page: currentPage.value,
      limit: itemsPerPage.value,
    });
  }
};

// Hàm chọn category
const selectCategory = async (name) => {
  selectedCategory.value = name;
  showCategoryDropdown.value = false;
  currentPage.value = 1;
  if (!name) {
    setMode(MODE_PAGINATION.ALL);
    await fetchProducts({ page: 1, limit: itemsPerPage.value });
  } else {
    setMode(MODE_PAGINATION.CATEGORY);
    await fetchProductsByCategory({
      category: name,
      page: 1,
      limit: itemsPerPage.value,
    });
  }
};

const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value;
};

const togglePriceFilter = () => {
  showPriceFilter.value = !showPriceFilter.value;
};

onMounted(async () => {
  await fetchCategories();
  await fetchProducts({ page: currentPage.value, limit: itemsPerPage.value });
});
</script>
<style scoped></style>
