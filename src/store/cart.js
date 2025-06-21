import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
    state: () => ({
        cart: null,
        totalItems: 0
    }),
    getters: {
        cartProducts: (state) => state.cart.cart_products || null
    },
    actions: {
        setCart(cart){
            this.cart = cart
            this.totalItems = cart?.cart_products?.reduce(
                (total, item) => total + (item.quantity || 0), 0
            ) || 0
        }
    }
})