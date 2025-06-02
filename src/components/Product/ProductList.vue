<template>
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
      <Pagination :totalPage="totalPages" @page-changed="onPageChanged" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProductCard from "./ProductCard.vue";
import Pagination from "../Pagination.vue";

export default {
  name: "ProductList",
  components: {
    ProductCard,
    Pagination,
  },
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 8,
      totalPages: 1,
    };
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.products.slice(start, start + this.itemsPerPage);
    },
  },
  watch: {
    products(newProducts) {
      this.calculateTotalPages(newProducts);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(
          "http://nguyenlequocbao.id.vn/v1/api/product"
        );
        this.products = response.data.data; // ✅ Truy cập đúng mảng sản phẩm
        this.calculateTotalPages(this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    calculateTotalPages(productsArray) {
      this.totalPages =
        productsArray.length > 0
          ? Math.ceil(productsArray.length / this.itemsPerPage)
          : 1;
    },
    onPageChanged(page) {
      this.currentPage = page;
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* Tuỳ chọn: bạn có thể thêm animation khi chuyển trang */
</style>
