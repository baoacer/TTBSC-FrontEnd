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
          :src="product.images.url"
          width="200"
        />
      </router-link>

      <!-- Bookmark icon khi hover -->
      <!-- <div
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
      </div> -->
    </div>

    <!-- Thông tin sản phẩm -->
    <div class="text-center mt-4">
      <div class="text-violet-800 text-sm font-semibold">
        {{ product.name }}
      </div>
      <div class="flex justify-center items-center mt-4">
        <div
          v-if="product.discount > 0"
          class="text-gray-400 line-through text-sm mr-2"
        >
          {{ formatPrice(product.price) }} 
        </div>
        <div class="text-black font-bold text-lg">
          {{ formatPrice(finalPrice) }} 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCart } from "@/composables/useCart";
import { useUser } from "@/composables/useUser";
import { toast } from "vue3-toastify";
import { formatPrice } from '../../utils/index.js'

/**
 * 1. Variable
 */
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
const hovered = ref(false);
const { addItem } = useCart();
const { user } = useUser();

const finalPrice = computed(() =>
  props.product.discount > 0
    ? props.product.price * (1 - props.product.discount)
    : props.product.price
);

const handleAddToCart = async () => {
  if (!user.value) {
    toast.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
    return;
  }
  const size = props.product.sizes?.[0]?.name || "Default";
  try {
    await addItem(user.value._id, {
      id: props.product._id,
      quantity: 1,
      size,
    });
    toast.success(`${props.product.name} (Size: ${size}) đã được thêm vào giỏ hàng!`);
  } catch (e) {
    toast.error("Có lỗi khi thêm vào giỏ hàng!");
  }
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
