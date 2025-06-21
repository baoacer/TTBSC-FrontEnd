import { defineStore } from "pinia";
import { MODE_PAGINATION } from "../utils/constant";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
    productDetail: null,
    total: 0,
    totalPage: 0,
    loading: false,
    mode: MODE_PAGINATION.ALL, // "all", "search", "category"

    // Search Params
    search: {
      keyword: "",
      minPrice: null,
      maxPrice: null,
    },
  }),
  getters: {
    allProducts: (state) => state.products,
    product: (state) => state.productDetail,
  },
});