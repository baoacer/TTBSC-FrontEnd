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
      totalPages: 1, // Initialize to 1 to avoid initial issues
    };
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.products.slice(start, start + this.itemsPerPage);
    },
  },
  watch: {
    // Watch products array for changes to update totalPages
    products(newProducts) {
      this.calculateTotalPages(newProducts);
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products"); // Replace with your actual API endpoint
        this.products = response.data;
        console.log("Products fetched:", this.products.length); // Debugging line
        // Calculate total pages after fetching the products
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

<style></style>
