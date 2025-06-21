import axios from "./axios";

export const getProduct = (id) => {
  return axios.get(`/product/${id}`);
};

export const getAllProducts = (params = {}) => {
  return axios.get("/product", { params });
};

export const getAllProductsByCategory = (params = {}) => {
  return axios.get("/product/category", { params });
};

/**
 * @params: { keyword, minPrice, maxPrice, sortBy, sortOrder, page, limit }
 */
export const searchProduct = (params = {}) => {
  return axios.get("/product/search", { params });
};

/**
 * data: FormData chứa images, name, price, category, sizes, code, description
 */
export const createProduct = (data) => {
  return axios.post("/product", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * data: { price, description, discount, ... }
 */
export const updateProduct = (id, data) => {
  return axios.patch(`/product/${id}`, data);
};

export const deleteProduct = (productID) => {
  debugger
  return axios.delete(`/product/delete?productID=${productID}`);
};