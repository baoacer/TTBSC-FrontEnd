import axios from "./axios"

/**
 * data: { userID, product: { id, quantity, size } }
 */ 
export const addToCart = (data) => {
  return axios.post("/cart", data);
};

export const getCart = (userID) => {
  return axios.get("/cart", { params: { userID } });
};

/**
 * data: { userID, productID, size }
 */
export const deleteFromCart = (data) => {
  return axios.delete("/cart", { data });
};

