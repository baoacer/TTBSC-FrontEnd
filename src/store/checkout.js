import { defineStore } from "pinia";

export const useCheckoutStore = defineStore("checkout", {
    state: () => ({
        order: null,
        orders: [],
        adminOrders: [],
        adminOrdersPagination: {}
    })    
})