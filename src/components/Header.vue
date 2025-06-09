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
          <div v-if="isLoggedIn" class="relative" ref="dropdownRef">
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
              <router-link to="/profile" class="block px-4 py-2 text-black hover:bg-gray-200">Profile</router-link>
              <router-link to="/history" class="block px-4 py-2 text-black hover:bg-gray-200">History</router-link>
              <router-link to="/admin/products" class="block px-4 py-2 text-black hover:bg-gray-200">Quản Lý Admin</router-link>
              <a
                href="#"
                @click.prevent="logout"
                class="block px-4 py-2 text-black hover:bg-gray-200"
              >
                Logout
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
              <font-awesome-icon :icon="['fas', 'bag-shopping']" class="text-sm" />
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

    <nav
      class="container mx-auto flex justify-center space-x-8 py-2 font-bold text-gray-500"
    >
      <a href="#" class="hover:text-black">Accessories <font-awesome-icon :icon="['fas', 'caret-down']" class="ml-1" /></a>
      <a href="#" class="hover:text-black">Giày <font-awesome-icon :icon="['fas', 'caret-down']" class="ml-1" /></a>
      <a href="#" class="hover:text-black">Kí gửi</a>
      <a href="#" class="hover:text-black">Quần áo</a>
      <a href="#" class="hover:text-black">Tin tức</a>
      <a href="#" class="hover:text-black">Khuyến mại</a>
    </nav>
  </header>
</template>

<script>
import cartService from "../services/cartServices";
import userService from "../services/userSercices";
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "Header",
  setup() {
    const totalItems = ref(0);
    const showDropdown = ref(false);
    const dropdownRef = ref(null);
    const isLoggedIn = ref(!!localStorage.getItem("user"));

    const updateTotalItems = async () => {
      totalItems.value = await cartService.getTotalItems();
    };

    const logout = () => {
      localStorage.clear();
      showDropdown.value = false;
      isLoggedIn.value = false;
      window.location.href = "/login";
    };

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        showDropdown.value = false;
      }
    };

    onMounted(() => {
      updateTotalItems();
      document.addEventListener("click", handleClickOutside);
      cartService.eventEmitter.on("cartUpdated", updateTotalItems);

      // Lắng nghe sự kiện đăng nhập
      userService.eventEmitter.on("userLoggedIn", () => {
        isLoggedIn.value = true;
      });

      // Lắng nghe sự kiện đăng xuất (nếu cần)
      userService.eventEmitter.on("userLoggedOut", () => {
        isLoggedIn.value = false;
      });
    });

    onBeforeUnmount(() => {
      cartService.eventEmitter.off("cartUpdated", updateTotalItems);
      document.removeEventListener("click", handleClickOutside);
      userService.eventEmitter.off("userLoggedIn");
      userService.eventEmitter.off("userLoggedOut");
    });

    return {
      totalItems,
      isLoggedIn,
      showDropdown,
      toggleDropdown,
      logout,
      dropdownRef,
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>
