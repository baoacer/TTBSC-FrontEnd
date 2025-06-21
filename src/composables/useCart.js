import { addToCart, getCart, deleteFromCart } from "../api/cart";
import { useCartStore } from "../store/cart";
import { computed } from "vue";
import { toast } from "vue3-toastify";

export function useCart(){
    const cartStore = useCartStore()

    const fetchCart = async (userID) => {
        const res = await getCart(userID)
        const cart = res.data.metadata || null
        cartStore.setCart(cart)
    }

    const addItem = async ({ userID, product }) => {
        try {
            debugger
            await addToCart({ userID, product })
            await fetchCart(userID)
        } catch (error) {
            let messageError = error.response?.data?.message || error.message
            throw new Error(messageError)
        }
    }

    const removeItem = async (userID, productID, size) => {
        try {
            await deleteFromCart({ userID, productID, size })
            await fetchCart(userID)
        } catch (error) {
            console.error("composable_usecart_additem Error::", error.message)
            throw new Error("Cập nhật thất bại")
        }
    }

    return {
        cart: computed(() => cartStore.cart),
        totalItems: computed(() => cartStore.totalItems),
        cartProducts: computed(() => cartStore.cartProducts),
        fetchCart,
        addItem,
        removeItem
    }
}