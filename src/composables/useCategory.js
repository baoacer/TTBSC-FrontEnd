import { useCategoryStore } from "../store/category";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/category";
import { computed } from "vue";

export function useCategory() {
  const store = useCategoryStore();

  const fetchCategories = async () => {
    store.loading = true;
    try {
      const res = await getCategories();
      store.categories = res.data?.metadata || [];
      store.error = null;
    } catch (e) {
      store.error = e;
    } finally {
      store.loading = false;
    }
  };

  const addCategory = async (data) => {
    await createCategory(data);
    await fetchCategories();
  };

  const updateCategoryById = async (id, data) => {
    await updateCategory(id, data);
    await fetchCategories();
  };

  const removeCategory = async (id) => {
    await deleteCategory(id);
    await fetchCategories();
  };

  const fetchCategory = async (id) => {
    return await getCategory(id);
  };

  const setCategory = (category) => {
    store.selectCategory = category
  };

  return {
    categories: computed(() => store.categories),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    selectCategory: computed(() => store.selectCategory),
    fetchCategories,
    addCategory,
    updateCategory: updateCategoryById,
    removeCategory,
    fetchCategory,
    setCategory
  };
}