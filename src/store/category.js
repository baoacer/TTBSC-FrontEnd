import { defineStore } from "pinia";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
    selectCategory: null,
  }),
});