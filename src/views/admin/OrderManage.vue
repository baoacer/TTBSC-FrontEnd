<template>
  <div class="max-w-7xl mx-auto my-8 p-6 bg-white rounded-xl shadow">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <div class="flex gap-2 w-full md:w-auto">
        <input
          v-model="search"
          @input="fetchOrders"
          class="border rounded px-3 py-2 w-full md:w-64"
          placeholder="Tìm kiếm đơn hàng..."
        />
        <select
          v-model="statusFilter"
          @change="fetchOrders"
          class="border rounded px-3 py-2 w-full md:w-48"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Xác nhận</option>
          <option value="shipping">Đã giao</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border text-sm">
        <thead>
          <tr class="bg-gray-100 text-center">
            <th class="border px-2 py-2">Mã đơn</th>
            <th class="border px-2 py-2">Giá trị đơn hàng</th>
            <th class="border px-2 py-2">Thanh toán</th>
            <th class="border px-2 py-2">Trạng thái đơn</th>
            <th class="border px-2 py-2">Ngày đặt</th>
            <th class="border px-2 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in adminOrders"
            :key="order._id"
            class="hover:bg-gray-50 text-center"
          >
            <td class="border px-2 py-2 font-mono">
              {{ order._id }}
            </td>
            <td class="border px-2 py-2 text-red-600 font-bold">
              {{ formatPrice(order.checkout?.totalCheckout) }}
            </td>
            <td class="border px-2 py-2">
              <div>
                <span class="font-semibold">{{ order.payment?.method }}</span>
              </div>
              <span
                :class="[
                  'ml-1 px-2 py-1 rounded text-xs',
                  paymentStatusColor(order.payment?.status),
                ]"
              >
                {{ paymentStatusText(order.payment?.status) }}
              </span>
            </td>
            <td class="border px-2 py-2">
              <div class="relative inline-block text-left">
                <button
                  type="button"
                  @click="order.showDropdown = !order.showDropdown"
                  :class="[
                    'px-2 py-1 rounded text-xs font-semibold w-full',
                    orderStatusColor(order.status),
                  ]"
                >
                  {{ orderStatusText(order.status) }}
                  <span class="ml-1">▼</span>
                </button>

                <div
                  v-if="order.showDropdown"
                  class="absolute z-10 mt-1 w-40 bg-white border rounded shadow-lg"
                >
                  <ul class="py-1 text-sm">
                    <li
                      v-for="option in orderStatusOptions"
                      :key="option.value"
                      @click="selectStatus(order, option.value)"
                      class="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      {{ option.label }}
                    </li>
                  </ul>
                </div>
              </div>
            </td>
            <td class="border px-2 py-2">{{ formatDate(order.createdAt) }}</td>
            <td class="border px-2 py-2 flex gap-2 justify-center">
              <button
                class="text-blue-600 hover:text-blue-800"
                @click="showDetail(order)"
              >
                <span class="material-icons">visibility</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal chi tiết đơn hàng -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
          @click="showModal = false"
        >
          &times;
        </button>
        <h3 class="text-xl font-bold mb-2">Chi tiết đơn hàng</h3>
        <div class="mb-2 text-sm text-gray-600">
          Mã đơn: {{ selectedOrder._id }}
        </div>
        <div class="mb-2 text-sm">
          Ngày đặt: {{ formatDate(selectedOrder.createdAt) }}
        </div>
        <div class="mb-4 border-b pb-2"></div>
        <div class="mb-2 font-semibold">Khách hàng & giao hàng</div>
        <div class="mb-2 text-sm">Tên: {{ selectedOrder.shipping?.name }}</div>
        <div class="mb-2 text-sm">SĐT: {{ selectedOrder.shipping?.phone }}</div>
        <div class="mb-2 text-sm">
          Địa chỉ: {{ selectedOrder.shipping?.address }}
        </div>
        <div class="mb-2 text-sm">Ghi chú: {{ selectedOrder.note || "" }}</div>
        <div class="mb-4 border-b pb-2"></div>
        <div class="mb-2 font-semibold">Danh sách sản phẩm</div>
        <table class="w-full mb-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-1 px-2">Ảnh</th>
              <th class="py-1 px-2">Tên</th>
              <th class="py-1 px-2">Size</th>
              <th class="py-1 px-2">SL</th>
              <th class="py-1 px-2">Giá</th>
              <th class="py-1 px-2">Giảm</th>
              <th class="py-1 px-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedOrder.products" :key="item._id">
              <td class="py-1 px-2">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded"
                />
              </td>
              <td class="py-1 px-2">{{ item.name }}</td>
              <td class="py-1 px-2">{{ item.size }}</td>
              <td class="py-1 px-2">{{ item.quantity }}</td>
              <td class="py-1 px-2">{{ formatPrice(item.price) }}</td>
              <td class="py-1 px-2">
                {{ item.discount ? (item.discount * 100).toFixed(0) : 0 }}%
              </td>
              <td class="py-1 px-2 text-red-600 font-semibold">
                {{
                  formatPrice(
                    item.price * item.quantity * (1 - (item.discount || 0))
                  )
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mb-4 border-b pb-2"></div>
        <div class="mb-2 font-semibold">Tổng đơn hàng</div>
        <div class="mb-1 text-sm">
          Tổng giá: {{ formatPrice(selectedOrder.checkout?.totalPrice) }}
        </div>
        <div class="mb-1 text-sm">
          Giảm giá: {{ formatPrice(selectedOrder.checkout?.totalDiscount) }}
        </div>
        <div class="mb-1 text-sm font-bold text-red-600">
          Tổng thanh toán:
          {{ formatPrice(selectedOrder.checkout?.totalCheckout) }}
        </div>
        <div class="mb-4 border-b pb-2"></div>
        <div class="mb-2 font-semibold">Thanh toán</div>
        <div class="mb-1 text-sm">
          Phương thức: {{ selectedOrder.payment?.method }}
        </div>
        <div class="mb-1 text-sm">
          Trạng thái:
          <span :class="paymentStatusColor(selectedOrder.payment?.status)">
            {{ paymentStatusText(selectedOrder.payment?.status) }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-4 flex justify-center space-x-2">
      <button
        :disabled="page === 1"
        @click="page--"
        class="px-3 py-1 border rounded"
      >
        Prev
      </button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button
        :disabled="page === totalPages"
        @click="page++"
        class="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useCheckout } from "../../composables/useCheckout";
import { toast } from "vue3-toastify";
import {
  formatDate,
  formatPrice,
  paymentStatusColor,
  paymentStatusText,
  orderStatusColor,
  orderStatusText,
} from "../../utils/index";

const {
  adminOrders,
  adminOrdersPagination,
  fetchOrdersByAdmin,
  changeOrderStatus,
  loading,
} = useCheckout();

const search = ref("");
const statusFilter = ref("");
const showModal = ref(false);
const selectedOrder = ref({});
const page = ref(1);
const pageSize = ref(10);

const orderStatusOptions = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const selectStatus = async (order, newStatus) => {
  order.showDropdown = false;
  if (order.status !== newStatus) {
    await updateStatus(order, newStatus);
  }
};

const fetchOrders = async () => {
  try {
    await fetchOrdersByAdmin({
      limit: pageSize.value,
      page: page.value,
      status: statusFilter.value,
      search: search.value,
    });
  } catch (e) {
    toast.error("Lỗi tải đơn hàng!");
  }
};

onMounted(fetchOrders);
watch([page, statusFilter], fetchOrders);

function showDetail(order) {
  selectedOrder.value = JSON.parse(JSON.stringify(order));
  showModal.value = true;
}

async function updateStatus(order, newStatus) {
  try {
    await changeOrderStatus(order._id, newStatus);
    toast.success("Cập nhật trạng thái thành công!");
    fetchOrders();
  } catch (e) {
    toast.error("Cập nhật trạng thái thất bại!");
  }
}
const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil((adminOrdersPagination.value?.total || 0) / pageSize.value)
  )
);
</script>
