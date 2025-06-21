import {
  getProduct,
  getAllProducts,
  searchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsByCategory,
} from "../api/product";
import { useProductStore } from "../store/product";
import { computed, ref } from "vue";
import { MODE_PAGINATION } from "../utils/constant";

export function useProduct() {
  const productStore = useProductStore();
  const error = ref(null);

  const fetchProducts = async (params) => {
    productStore.loading = true;
    try {
      const res = await getAllProducts(params);
      productStore.products = res.data?.metadata || [];
      productStore.total = res.data?.pagination?.total;
      productStore.totalPage = res.data?.pagination?.totalPage;
      productStore.mode = MODE_PAGINATION.ALL
      error.value = null;
    } catch (err) {
      error.value = err;
    } finally {
      productStore.loading = false;
    }
  };

  const fetchProductDetail = async (id) => {
    productStore.loading = true;
    try {
      const res = await getProduct(id);
      productStore.productDetail = res.data?.metadata || null;
      console.log("useProduct", productStore.productDetail);
      error.value = null;
    } catch (err) {
      error.value = err;
    } finally {
      productStore.loading = false;
    }
  };

  const fetchSearchProducts = async (params) => {
    productStore.loading = true;
    try {
      debugger
      const res = await searchProduct(params);
      productStore.products = res.data?.metadata || [];
      productStore.total = res.data?.pagination?.total || 0;
      productStore.totalPage = res.data?.pagination?.totalPage || 0;
      productStore.mode = MODE_PAGINATION.SEARCH
      error.value = null;
    } catch (err) {
      error.value = err;
    } finally {
      productStore.loading = false;
    }
  };

  const fetchProductsByCategory = async (params) => {
    productStore.loading = true;
    try {
      debugger
      const res = await getAllProductsByCategory(params);
      debugger
      productStore.products = res.data?.metadata || [];
      productStore.total = res.data?.pagination?.total;
      productStore.totalPage = res.data?.pagination?.totalPage;
      productStore.mode = MODE_PAGINATION.CATEGORY
      error.value = null;
    } catch (err) {
      error.value = err;
    } finally {
      productStore.loading = false;
    }
  };

  const createNewProduct = async (formData) => {
    try {
      return await createProduct(formData);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Đã có lỗi xảy ra";
      throw new Error(errMsg);
    }
  };

  const updateProductById = async (id, data) => {
    try {
      return await updateProduct(id, data);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Đã có lỗi xảy ra";
      throw new Error(errMsg);
    }
  };

  const deleteProductById = async (productID) => {
    try {
      return await deleteProduct(productID);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const setMode = (mode) => {
    productStore.mode = mode;
  };

  const setSearchParams = (params) => {
    productStore.search.keyword = params.keyword || "";
    productStore.search.minPrice = params.minPrice || null;
    productStore.search.maxPrice = params.maxPrice || null;
    productStore.search.category = params.category || null;
  }

  return {
    products: computed(() => productStore.products),
    productDetail: computed(() => productStore.productDetail),
    total: computed(() => productStore.total),
    totalPage: computed(() => productStore.totalPage),
    loading: computed(() => productStore.loading),
    mode: computed(() => productStore.mode),
    search: computed(() => productStore.search),
    error,
    fetchProducts,
    fetchProductDetail,
    fetchSearchProducts,
    createNewProduct,
    updateProductById,
    deleteProductById,
    fetchProductsByCategory,
    setMode,
    setSearchParams
  };
}
