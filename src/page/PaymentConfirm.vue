<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">
      Xác nhận đơn hàng
    </h1>
    <div class="bg-white shadow-lg p-6 rounded-xl border mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Cột 1: Thông tin người nhận -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-700">
            Thông tin người nhận
          </h2>
          <div class="mb-4">
            <label class="font-semibold block mb-1">Họ tên:</label>
            <input
              v-model="userForm.name"
              type="text"
              class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập họ tên"
              autocomplete="name"
              required
            />
          </div>
          <div class="mb-4">
            <label class="font-semibold block mb-1">Số điện thoại:</label>
            <input
              v-model="userForm.phone"
              type="text"
              class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập số điện thoại"
              autocomplete="tel"
              required
            />
          </div>
          <div class="mb-4">
            <label class="font-semibold block mb-1"
              >Ghi chú cho đơn hàng:</label
            >
            <textarea
              v-model="userForm.note"
              class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ghi chú thêm (ví dụ: giao giờ hành chính, gọi trước khi giao...)"
              rows="3"
            ></textarea>
          </div>
        </div>
        <!-- Cột 2: Địa chỉ nhận hàng -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-700">
            Địa chỉ nhận hàng
          </h2>
          <div class="mb-4">
            <label class="font-semibold block mb-1">Tỉnh/Thành phố:</label>
            <select
              v-model="userForm.province"
              class="border rounded px-3 py-2 w-full"
              @change="onProvinceChange"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              <option
                v-for="province in provinces"
                :key="province.code"
                :value="province.name"
              >
                {{ province.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="font-semibold block mb-1">Quận/Huyện:</label>
            <select
              v-model="userForm.district"
              class="border rounded px-3 py-2 w-full"
              @change="onDistrictChange"
              :disabled="!districts.length"
            >
              <option value="">Chọn quận/huyện</option>
              <option
                v-for="district in districts"
                :key="district.code"
                :value="district.name"
              >
                {{ district.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="font-semibold block mb-1">Phường/Xã:</label>
            <select
              v-model="userForm.ward"
              class="border rounded px-3 py-2 w-full"
              :disabled="!wards.length"
            >
              <option value="">Chọn phường/xã</option>
              <option v-for="ward in wards" :key="ward.code" :value="ward.name">
                {{ ward.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="font-semibold block mb-1">Địa chỉ chi tiết:</label>
            <input
              v-model="userForm.addressDetail"
              type="text"
              class="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Số nhà, tên đường..."
              autocomplete="street-address"
              required
            />
          </div>
        </div>
      </div>
      <div
        class="mt-8 text-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <strong>Tổng tiền: </strong>
          <span class="text-red-600 font-bold">{{
            formatPrice(orderInfo?.totalCheckout)
          }}</span>
        </div>
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <label class="font-semibold text-gray-700"
            >Phương thức thanh toán:</label
          >
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              value="VNPAY"
              v-model="paymentMethod"
              class="mr-2"
            />
            <span class="text-blue-700 font-semibold">VNPAY</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="radio"
              value="COD"
              v-model="paymentMethod"
              class="mr-2"
            />
            <span class="text-green-700 font-semibold">COD</span>
          </label>
        </div>
      </div>
      <button
        class="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-xl text-lg font-bold shadow hover:from-blue-600 hover:to-blue-800 transition"
        @click="goToProcessing"
      >
        Xác nhận thanh toán
      </button>
      <div
        v-if="missingFields.length"
        class="mt-3 text-red-600 text-base font-semibold"
      >
        Vui lòng nhập đầy đủ: {{ missingFields.join(", ") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCheckout } from "../composables/useCheckout";
import { useUser } from "../composables/useUser";
import { toast } from "vue3-toastify";
import { formatPrice } from "../utils/index.js";

const router = useRouter();
const route = useRoute();
const { user } = useUser();
const { fetchReview } = useCheckout();
const paymentMethod = ref("");
const orderInfo = ref(null);

const userForm = ref({
  addressDetail: "",
  ward: "",
  district: "",
  province: "",
  name: "",
  phone: "",
  note: "",
});

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

// Hàm fetch chung
const fetchAPI = async (url) => {
  const res = await fetch(url);
  return res.json();
};

// Lấy danh sách tỉnh/thành
const loadProvinces = async () => {
  provinces.value = await fetchAPI("https://provinces.open-api.vn/api/p/");
};

// Lấy danh sách quận/huyện theo tỉnh
const loadDistricts = async (provinceName) => {
  const province = provinces.value.find((p) => p.name === provinceName);
  if (!province) return (districts.value = []);
  const data = await fetchAPI(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
  districts.value = data.districts || [];
};

// Lấy danh sách phường/xã theo quận/huyện
const loadWards = async (districtName) => {
  const district = districts.value.find((d) => d.name === districtName);
  if (!district) return (wards.value = []);
  const data = await fetchAPI(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
  wards.value = data.wards || [];
};

// Khi chọn lại tỉnh/thành
const onProvinceChange = async () => {
  userForm.value.district = "";
  userForm.value.ward = "";
  wards.value = [];
  await loadDistricts(userForm.value.province);
};

// Khi chọn lại quận/huyện
const onDistrictChange = async () => {
  userForm.value.ward = "";
  await loadWards(userForm.value.district);
};

// Tách địa chỉ đã lưu và load districts/wards tương ứng
const fillAddressFields = async () => {
  if (!user.value?.address) return;
  const [addressDetail, ward, district, province] = user.value.address.split(",").map((s) => s.trim());
  userForm.value.addressDetail = addressDetail || "";
  userForm.value.ward = ward || "";
  userForm.value.district = district || "";
  userForm.value.province = province || "";

  if (province) {
    await loadDistricts(province);
    if (district) {
      await loadWards(district);
    }
  }
};

onMounted(async () => {
  const cartID = route.query.cartID;
  if (!cartID) {
    router.replace({ name: "Cart" });
    return;
  }
  orderInfo.value = await fetchReview({ cartID });
  userForm.value.name = user.value.name || "";
  userForm.value.phone = user.value.phone || "";
  await loadProvinces();
  await fillAddressFields();
});

watch(
  () => user.value && user.value.address,
  async (address) => {
    if (address) {
      await fillAddressFields();
    }
  },
  { immediate: false }
);

const missingFields = computed(() => {
  const fields = [];
  if (!userForm.value.name) fields.push("Họ tên");
  if (!userForm.value.phone) fields.push("Số điện thoại");
  if (!userForm.value.province) fields.push("Tỉnh/Thành phố");
  if (!userForm.value.district) fields.push("Quận/Huyện");
  if (!userForm.value.ward) fields.push("Phường/Xã");
  if (!userForm.value.addressDetail) fields.push("Địa chỉ chi tiết");
  if (!paymentMethod.value) fields.push("Phương thức thanh toán");
  return fields;
});

const goToProcessing = () => {
  if (missingFields.value.length > 0) {
    toast.warning("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  const address = [
    userForm.value.addressDetail,
    userForm.value.ward,
    userForm.value.district,
    userForm.value.province,
  ]
    .filter(Boolean)
    .join(", ");

  router.push({
    name: "PaymentProcessing",
    query: {
      name: userForm.value.name,
      phone: userForm.value.phone,
      address,
      note: userForm.value.note,
      total: orderInfo.value?.totalCheckout,
      payment: paymentMethod.value,
    },
  });
};
</script>