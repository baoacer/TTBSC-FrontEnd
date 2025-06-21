import axios from "./axios";

/**
 * Review
 */
export const reviewCheckout = ({ cartID }) => {
  return axios.post("/order/review", { cartID });
};

/**
 * Order
 */
export const orderCheckout = (orderData) => {
  return axios.post("/order", orderData);
};

/**
 * Get List Order [User]
 */
export const getOrders = (userID) => {
  return axios.get(`/order/${userID}`);
};

/**
 * Update Order Status [ADMIN]
 */
export const updateOrderStatus = (orderID, status) => {
  return axios.post(`/order/status/${orderID}`, { status });
};

export const getOrdersByAdmin = (params = {}) => {
  return axios.get(`/order`, { params });
};

export const cancelOrder = (data) => {
  return axios.post(`/order/cancel`, data);
};

