<template>
  <div class="p-8">
    <div v-if="product" class="flex">
      <!-- Ảnh sản phẩm -->
      <div class="w-1/2 relative">
        <img
          :src="product.image"
          alt="Product image"
          class="w-full h-80 object-cover"
        />
        <div
          v-if="product.discount > 0"
          class="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-2 ribbon"
        >
          {{ product.discount * 100 }} % OFF
          <br />
          GIÁ SỐC
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="w-1/2">
        <div class="max-w-md mx-auto">
          <h1 class="text-xl font-bold">{{ product.name }}</h1>

          <div class="flex gap-4 items-center mt-2">
            <div v-if="product.discount > 0" class="text-gray-500 line-through">
              {{ formatPrice(product.price) }}
            </div>
            <div class="text-red-600 text-xl font-bold">
              {{ formatPrice(discountedPrice) }}
            </div>
          </div>

          <!-- Size -->
          <div class="mt-4">
            <span class="font-bold">Size:</span>
            <button
              v-for="size in product.sizes"
              :key="size"
              @click="selectedSize = size"
              :class="[
                'border px-3 py-1 mx-1',
                selectedSize === size
                  ? 'border-gray-500 bg-black text-white'
                  : 'border-gray-300',
              ]"
            >
              {{ size }}
            </button>
          </div>

          <!-- Kho hàng -->
          <div class="mt-4">
            <span class="font-bold text-orange-400">Còn hàng</span>
          </div>

          <!-- Nút thêm vào giỏ -->
          <div class="mt-4 flex space-x-2">
            <button
              @click="handleAddToCart"
              class="bg-gray-600 text-white px-4 py-2 text-sm font-semibold"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          <!-- Mã & danh mục -->
          <div class="mt-4 font-medium text-gray-500 text-sm">
            <div class="border-t border-gray-300 pt-2 pb-2">
              Mã: {{ product.code }}
            </div>
            <div class="border-t border-gray-300 pt-1">
              Danh mục: {{ categoryName }}
            </div>

            <div class="border-t border-gray-300 pt-2 pb-2">
              Mô tả: {{ product.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import cartServices from "../../services/cartServices";

export default defineComponent({
  name: "ProductDetail",
  data() {
    return {
      selectedSize: null,
      categoryName: "Đang tải...", // ✅ biến lưu tên danh mục
    };
  },
  computed: {
    discountedPrice() {
      if (this.product) {
        return this.product.price * (1 - this.product.discount);
      }
      return 0;
    },
  },
  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      }).format(value);
    },
    handleAddToCart() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        this.$toast.open({
          message: "Bạn chưa đăng nhập",
          type: "error"
        })
        return;
      }
      if (!this.selectedSize) {
        this.$toast.open({
          message: "Vui lòng chọn kích thước",
          type: "error",
        });
        return;
      }
      this.product.size = this.selectedSize
      debugger
      cartServices.addToCart(this.product, 1);
      this.$toast.open({
        message: `${this.product.name} (Size: ${this.selectedSize}) đã được thêm vào giỏ hàng!`,
        type: "success",
      });
    },
  },
  setup() {
    const route = useRoute();
    const product = ref(null);
    const categoryName = ref("Đang tải...");

    onMounted(async () => {
      const id = route.params.id;
      try {
        // Lấy thông tin sản phẩm
        const productRes = await axios.get(
          `http://nguyenlequocbao.id.vn/v1/api/product/${id}`
        );
        product.value = productRes.data.data;

        // Gọi API để lấy tên danh mục từ product.category
        const catId = product.value.category;
        const categoryRes = await axios.get(
          `http://nguyenlequocbao.id.vn/v1/api/category/${catId}`
        );
        categoryName.value = categoryRes.data.data.name;
      } catch (error) {
        alert("Không thể tải sản phẩm hoặc danh mục.");
        console.error(error);
        categoryName.value = "Không rõ";
      }
    });

    return {
      product,
      categoryName,
    };
  },
});
</script>

<style scoped>
/* Add styles if needed */
</style>
