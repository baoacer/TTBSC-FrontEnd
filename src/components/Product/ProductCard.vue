<template>
  <div class="p-4 w-64 group hover:cursor-pointer">
    <div class="relative">
      <!-- Ribbon giảm giá -->
      <div
        v-if="product.discount > 0"
        class="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-2 ribbon"
      >
        {{ product.discount * 100 }}%
        <br />
        GIÁ SỐC
      </div>

      <!-- Ảnh sản phẩm -->
      <router-link :to="`/product/${product._id}`">
        <img
          alt="Product"
          class="w-full h-auto"
          height="150"
          :src="product.image"
          width="200"
        />
      </router-link>

      <!-- Bookmark icon khi hover -->
      <div
        class="absolute bottom-1 left-2 flex justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div
          class="text-black text-xl cursor-pointer"
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
          @click="handleAddToCart"
        >
          <font-awesome-icon
            :icon="hovered ? ['fas', 'bookmark'] : ['far', 'bookmark']"
            class="transition duration-300"
          />
        </div>
      </div>
    </div>

    <!-- Thông tin sản phẩm -->
    <div class="text-center mt-4">
      <div class="text-gray-500 text-xs">{{ product.category }}</div>
      <div class="text-violet-800 text-sm font-semibold">
        {{ product.name }}
      </div>
      <div class="flex justify-center items-center mt-4">
        <div
          v-if="product.discount > 0"
          class="text-gray-400 line-through text-sm mr-2"
        >
          {{ formatPrice(product.price) }} ₫
        </div>
        <div class="text-black font-bold text-lg">
          {{ formatPrice(finalPrice) }} ₫
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cartServices from "../../services/cartServices";

export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hovered: false,
    };
  },
  computed: {
    finalPrice() {
      return this.product.discount > 0
        ? this.product.price * (1 - this.product.discount)
        : this.product.price;
    },
  },
  methods: {
    handleAddToCart() {
      const productWithSize = {
        ...this.product,
        name: this.product.name + ` - ${this.product.sizes?.[0] || 'Default'}`,
        size: this.product.sizes?.[0] || 'Default',
      };
      cartServices.addToCart(productWithSize);
      alert(`${this.product.name} đã được thêm vào giỏ hàng!`);
    },
    formatPrice(value) {
      return new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
};
</script>

<style scoped>
.ribbon {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  --f: 0.5em;
  --r: 0.8em;
  position: absolute;
  left: 0px;
  top: calc(-1 * var(--f));
  padding: 0.2em;
  background: #bf4d28;
  border-left: var(--f) solid #0005;
  border-bottom: var(--r) solid #0000;
  clip-path: polygon(
    var(--f) 0,
    100% 0,
    100% calc(100% - var(--r)),
    calc(50% + var(--f) / 2) 100%,
    var(--f) calc(100% - var(--r)),
    var(--f) var(--f),
    0 var(--f)
  );
}
</style>
