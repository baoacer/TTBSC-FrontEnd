import { 
    reviewCheckout,
    orderCheckout,
    getOrders,
    updateOrderStatus,
    getOrdersByAdmin,
    cancelOrder
} from '../api/order'
import { useCheckoutStore } from '../store/checkout'
import { ref, computed } from 'vue'
import { useUserStore } from '../store/user'

export const useCheckout = () => {
    const checkoutStore = useCheckoutStore();
    const userStore = useUserStore();
    const loading = ref(false);
    const error = ref(null);
    
    const fetchReview = async ({ cartID }) => {
        try {
            const res = await reviewCheckout({ cartID })
            return res.data.metadata
        } catch (error) {
            error.value = error
            console.error(`composables_useCheckout_fetchReview Error::${error.message}`)
            throw new Error(`Review thất bại`)
        }finally {
            loading.value = false
        }
    }

    const createOrder = async (orderData) => {
        loading.value = true;
        try {
            const res = await orderCheckout(orderData);
            checkoutStore.order = res.data?.metadata || null;
            error.value = null;
            return checkoutStore.order;
        } catch (err) {
            error.value = err;
            throw new Error(`Đặt hàng thất bại`);
        } finally {
            loading.value = false;
        }
    };

    const fetchOrders = async () => {
        loading.value = true;
        try {
            const userID = userStore.user?._id;
            const res = await getOrders(userID);
            checkoutStore.orders = res.data?.metadata || [];
            return checkoutStore.orders;
        } catch (err) {
            let errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
            throw new Error(errorMessage);
        } finally {
            loading.value = false;
        }
    };

    const fetchOrdersByAdmin = async (params) => {
        loading.value = true;
        try {
            const res = await getOrdersByAdmin(params);
            const metadata = res.data?.metadata || {};
            checkoutStore.adminOrders = metadata.orders || [];
            checkoutStore.adminOrdersPagination = metadata.pagination || {};
            error.value = null;
            return {
                orders: checkoutStore.adminOrders,
                pagination: checkoutStore.adminOrdersPagination
            };
        } catch (err) {
            error.value = err;
            throw new Error(`Lấy danh sách đơn hàng thất bại`);
        } finally {
            loading.value = false;
        }
    };

    const changeOrderStatus = async (orderID, status) => {
        loading.value = true;
        try {
            const res = await updateOrderStatus(orderID, status);
            error.value = null;
            return res.data.metadata;
        } catch (err) {
            error.value = err;
            throw new Error(`Cập nhật trạng thái thất bại`);
        } finally {
            loading.value = false;
        }
    };

    const cancelOrderByUser = async (orderID) => {
        try {
            const userID = userStore.user?._id;
            await cancelOrder({ orderID, userID });
        } catch (err) {
            throw new Error(err.message || `Hủy đơn hàng thất bại`);
        } 
    };

    return {
        order: computed(() => checkoutStore.order),
        orders: computed(() => checkoutStore.orders),
        adminOrders: computed(() => checkoutStore.adminOrders),
        adminOrdersPagination: computed(() => checkoutStore.adminOrdersPagination),
        loading,
        error,
        fetchReview,
        createOrder,
        fetchOrders,
        changeOrderStatus,
        fetchOrdersByAdmin,
        cancelOrderByUser
    };
}