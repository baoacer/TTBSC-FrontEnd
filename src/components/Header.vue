<template>
  <header class="border-b border-gray-200 relative">
    <div class="container mx-auto flex items-center py-2 px-8">
      <div class="flex items-center space-x-2 text-gray-500 basis-1/3">
        <font-awesome-icon :icon="['fas', 'location-dot']" />
        <span>Thạnh Ngãi, Mỏ Cày Bắc, Bến Tre</span>
      </div>
      <div class="basis-1/3 flex justify-center">
        <router-link to="/">
          <img
            src="https://pos.nvncdn.com/eb9ddb-116318/store/20220301_M6gPcIeoQ8cwvJrojaQ7a688.png"
            alt="Logo"
            class="w-32 h-18 object-cover"
          />
        </router-link>
      </div>
      <div class="flex items-center justify-end space-x-4 basis-1/3 relative">
        <div class="flex items-center space-x-4">
          <!-- USER ICON -->
          <div v-if="isLogin" class="relative" ref="dropdownRef">
            <div
              class="cursor-pointer border rounded-full w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white"
              @click="toggleDropdown"
            >
              <font-awesome-icon :icon="['far', 'user']" class="text-sm" />
            </div>
            <div
              v-if="showDropdown"
              class="absolute right-0 mt-2 w-32 z-10 bg-white shadow-lg rounded-md"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-black hover:bg-gray-200"
                >Tài khoản</router-link
              >
              <router-link
                to="/history"
                class="block px-4 py-2 text-black hover:bg-gray-200"
                >Đơn hàng</router-link
              >
              <router-link
                v-if="user?.role === 'Admin'"
                to="/admin/products"
                class="block px-4 py-2 text-black hover:bg-gray-200"
                >Admin</router-link
              >
              <a
                href="#"
                @click.prevent="handleLogout"
                class="block px-4 py-2 text-black hover:bg-gray-200"
              >
                Đăng xuất
              </a>
            </div>
          </div>
          <!-- LOGIN ICON -->
          <router-link v-else to="/login">
            <div
              class="cursor-pointer border rounded-full w-8 h-8 border-gray-400 flex items-center justify-center hover:bg-black hover:text-white"
            >
              <font-awesome-icon :icon="['far', 'user']" class="text-sm" />
            </div>
          </router-link>
          <!-- CART -->
          <router-link
            to="/cart"
            class="text-gray-400 font-bold text-sm border-l border-gray-600 pr-l pl-4 relative"
          >
            <div
              class="border rounded-full w-8 h-8 border-gray-400 flex items-center justify-center hover:bg-black hover:text-white"
            >
              <font-awesome-icon
                :icon="['fas', 'bag-shopping']"
                class="text-sm"
              />
              <span
                class="absolute -top-2 -right-1 bg-black text-white text-xs rounded-full px-1.5 py-0.5"
              >
                {{ totalItems > 9 ? "9+" : totalItems }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useUser } from "../composables/useUser";
import { useCart } from "../composables/useCart";
import { useRouter } from "vue-router";

const { totalItems } = useCart();
const showDropdown = ref(false);
const dropdownRef = ref(null);
const router = useRouter();
const { isLogin, logout, user } = useUser();

const handleLogout = async () => {
  logout();
  showDropdown.value = false;
  router.push("/login");
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (e) => {
  const clickedDropdown =
    dropdownRef.value && dropdownRef.value.contains(e.target);
  if (!clickedDropdown) showDropdown.value = false;
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.min-w-\[140px\] {
  min-width: 140px;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
