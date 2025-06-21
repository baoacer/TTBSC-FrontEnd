<template>
  <div class="min-h-screen py-10">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Cột trái: Avatar & Thông tin tóm tắt -->
        <div class="flex flex-col items-center md:w-1/3 w-full border-r md:pr-8 mb-8 md:mb-0">
          <div class="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center mb-4 shadow">
            <span class="material-icons text-blue-700 text-6xl">account_circle</span>
          </div>
          <div class="text-center">
            <div class="font-bold text-xl text-blue-800 mb-1">{{ user?.name }}</div>
            <div class="text-gray-500 text-sm mb-2">{{ user?.email }}</div>
            <div class="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <span class="material-icons text-base">phone</span>
              <span>{{ user?.phone || "Chưa cập nhật" }}</span>
            </div>
            <div
              class="flex items-center justify-center gap-2 text-gray-600 text-sm mt-1 cursor-pointer hover:text-blue-700"
              @click="showAddressModal = true"
            >
              <span class="material-icons text-base">location_on</span>
              <span>
                {{ user?.address || "Chưa cập nhật" }}
                <span class="ml-1 underline text-blue-600">[Sửa]</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            class="btn-main mt-6 w-full"
            @click="showChangePasswordModal = true"
          >
            <span class="material-icons mr-2">lock</span>Đổi mật khẩu
          </button>
        </div>

        <!-- Cột phải: Form chỉnh sửa -->
        <div class="flex-1">
          <h2 class="text-2xl font-bold mb-6 text-blue-800 tracking-tight text-center md:text-left">
            Chỉnh sửa thông tin
          </h2>
          <form v-if="user" @submit.prevent="onSave" class="space-y-7">
            <div class="form-group">
              <label class="form-label">Họ tên</label>
              <input
                v-model="editUser.name"
                class="form-input"
                type="text"
                required
                :disabled="!isEditing"
                placeholder="Nhập họ tên"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="editUser.email"
                class="form-input bg-gray-100"
                type="email"
                required
                disabled
              />
            </div>
            <div class="form-group">
              <label class="form-label">Số điện thoại</label>
              <input
                v-model="editUser.phone"
                class="form-input"
                type="text"
                :disabled="!isEditing"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <!-- Địa chỉ chỉ sửa qua modal -->
            <div class="form-group">
              <label class="form-label">Địa chỉ giao hàng</label>
              <div
                class="form-input bg-gray-100 cursor-pointer hover:bg-blue-50 flex items-center gap-2"
                @click="showAddressModal = true"
              >
                <span class="material-icons text-base text-blue-600">location_on</span>
                <span>{{ user?.address || "Chưa cập nhật" }}</span>
                <span class="ml-auto text-blue-600 underline">[Sửa]</span>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button
                v-if="!isEditing"
                type="button"
                class="btn-main"
                @click="isEditing = true"
              >
                <span class="material-icons mr-2">edit</span>Chỉnh sửa
              </button>
              <button
                v-else
                type="submit"
                class="btn-success"
              >
                <span class="material-icons mr-2">save</span>Lưu
              </button>
              <button
                v-if="isEditing"
                type="button"
                class="btn-cancel"
                @click="onCancel"
              >
                <span class="material-icons mr-2">close</span>Hủy
              </button>
            </div>
          </form>
          <div v-else class="text-center text-gray-500 mt-8">
            Không tìm thấy thông tin người dùng.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal nhập địa chỉ -->
    <div
      v-if="showAddressModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
        <h3 class="text-xl font-semibold text-blue-800 mb-6 text-center">Cập nhật địa chỉ giao hàng</h3>
        <form @submit.prevent="onSaveAddress" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Tỉnh/Thành phố</label>
            <select v-model="addressForm.province" class="form-input" @change="onProvinceChange" required>
              <option value="">Chọn tỉnh/thành</option>
              <option v-for="p in provinces" :key="p.code" :value="p.name">{{ p.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Quận/Huyện</label>
            <select v-model="addressForm.district" class="form-input" @change="onDistrictChange" required>
              <option value="">Chọn quận/huyện</option>
              <option v-for="d in districts" :key="d.code" :value="d.name">{{ d.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Phường/Xã</label>
            <select v-model="addressForm.ward" class="form-input" required>
              <option value="">Chọn phường/xã</option>
              <option v-for="w in wards" :key="w.code" :value="w.name">{{ w.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Địa chỉ chi tiết</label>
            <input v-model="addressForm.addressDetail" class="form-input" type="text" placeholder="Số nhà, tên đường..." required />
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="submit" class="btn-success">
              <span class="material-icons mr-2">save</span>Lưu
            </button>
            <button type="button" class="btn-cancel" @click="showAddressModal = false">
              <span class="material-icons mr-2">close</span>Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal đổi mật khẩu -->
    <div
      v-if="showChangePasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
        <h3 class="text-xl font-semibold text-blue-800 mb-6 text-center">Đổi mật khẩu</h3>
        <form @submit.prevent="onChangePassword" class="space-y-4">
          <div class="form-group">
            <label class="form-label">Mật khẩu hiện tại</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-input"
              required
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Mật khẩu mới</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              required
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Xác nhận mật khẩu mới</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-input"
              required
              placeholder="Nhập lại mật khẩu mới"
            />
            <p v-if="passwordError" class="text-red-600 text-sm mt-1">{{ passwordError }}</p>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button type="submit" class="btn-success">
              <span class="material-icons mr-2">save</span>Lưu
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="showChangePasswordModal = false"
            >
              <span class="material-icons mr-2">close</span>Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { useUser } from "../composables/useUser";

const { update, user, change } = useUser();

const editUser = reactive({ ...(user.value || {}) });
const isEditing = ref(false);

// Địa chỉ modal
const showAddressModal = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);
const addressForm = reactive({
  province: "",
  district: "",
  ward: "",
  addressDetail: "",
});

// Đổi mật khẩu modal
const showChangePasswordModal = ref(false);
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordError = ref('');

const fetchProvinces = async () => {
  const res = await fetch("https://provinces.open-api.vn/api/p/");
  provinces.value = await res.json();
};
const fetchDistricts = async (provinceName) => {
  const province = provinces.value.find(p => p.name === provinceName);
  if (!province) return districts.value = [];
  const res = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
  const data = await res.json();
  districts.value = data.districts || [];
};
const fetchWards = async (districtName) => {
  const district = districts.value.find(d => d.name === districtName);
  if (!district) return wards.value = [];
  const res = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
  const data = await res.json();
  wards.value = data.wards || [];
};

const onProvinceChange = async () => {
  addressForm.district = "";
  addressForm.ward = "";
  wards.value = [];
  await fetchDistricts(addressForm.province);
};
const onDistrictChange = async () => {
  addressForm.ward = "";
  await fetchWards(addressForm.district);
};

const onSaveAddress = async () => {
  const fullAddress = [
    addressForm.addressDetail,
    addressForm.ward,
    addressForm.district,
    addressForm.province,
  ].filter(Boolean).join(", ");
  try {
    await update({ address: fullAddress });
    toast.success("Cập nhật địa chỉ thành công!");
    showAddressModal.value = false;
    user.value.address = fullAddress;
    // Nếu muốn cập nhật luôn trên form chỉnh sửa, có thể:
    editUser.address = fullAddress;
  } catch {
    toast.error("Cập nhật thất bại. Vui lòng thử lại");
  }
};

const onSave = async () => {
  try {
    await update({
      name: editUser.name,
      phone: editUser.phone,
      // address cập nhật qua modal riêng
    });
    isEditing.value = false;
    toast.success("Cập nhật thông tin thành công!");
  } catch {
    toast.error("Cập nhật thất bại. Vui lòng thử lại");
  }
};

const onCancel = () => {
  Object.assign(editUser, user.value);
  isEditing.value = false;
};

const onChangePassword = async () => {
  passwordError.value = '';
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = 'Mật khẩu xác nhận không khớp.';
    return;
  }

  try {
    await change({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    toast.success("Đổi mật khẩu thành công!");
    showChangePasswordModal.value = false;
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch {
    toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
  }
};

onMounted(fetchProvinces);
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.form-label {
  font-size: 1rem;
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.1rem;
}
.form-input {
  border: 1.5px solid #cbd5e1;
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  font-size: 1.08rem;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.form-input:focus {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 0 0 2px #93c5fd;
}
.btn-main {
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}
.btn-main:hover {
  background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
}
.btn-success {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}
.btn-success:hover {
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
}
.btn-cancel {
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.75rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.08rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn-cancel:hover {
  background: #e5e7eb;
  border-color: #a5b4fc;
}
.material-icons {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>