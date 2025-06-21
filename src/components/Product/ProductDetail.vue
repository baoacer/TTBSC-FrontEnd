<template>
  <div class="p-8">
    <div v-if="productDetail" class="flex">
      <!-- Ảnh sản phẩm -->
      <div class="w-1/2 relative">
        <img
          :src="cloudinaryThumb(productDetail.images?.url)"
          alt="Product image"
          class="w-full h-auto object-cover"
        />
        <div
          v-if="productDetail.discount > 0"
          class="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-2 ribbon"
        >
          {{ productDetail.discount * 100 }} % OFF
          <br />
          GIÁ SỐC
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="w-1/2">
        <div class="max-w-md mx-auto">
          <h1 class="text-xl font-bold">{{ productDetail.name }}</h1>

          <div class="flex gap-4 items-center mt-2">
            <div
              v-if="productDetail.discount > 0"
              class="text-gray-500 line-through"
            >
              {{ formatPrice(productDetail.price) }}
            </div>
            <div class="text-red-600 text-xl font-bold">
              {{ formatPrice(discountedPrice()) }}
            </div>
          </div>

          <!-- Size -->
          <div class="mt-4">
            <span class="font-bold">Size:</span>
            <button
              v-for="sizeObj in productDetail.sizes"
              :key="sizeObj.size"
              @click="selectedSize = sizeObj"
              :class="[
                'border px-3 py-1 mx-1',
                selectedSize?.size === sizeObj.size
                  ? 'border-gray-500 bg-black text-white'
                  : 'border-gray-300',
              ]"
            >
              {{ sizeObj.size }}
            </button>
          </div>

          <!-- Kho hàng -->
          <div class="mt-4">
            <span class="font-bold text-orange-400">
              Hàng tồn:
              <span v-if="selectedSize">{{ selectedSize.stock }}</span>
              <span v-else>Chọn size để xem tồn kho</span>
            </span>
          </div>

          <!-- Nút thêm vào giỏ -->
          <div class="mt-4 flex space-x-2">
            <button
              @click="handleAddToCart"
              class="bg-gray-600 text-white px-4 py-2 text-sm font-semibold"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              @click="handleBuyNow"
              class="bg-orange-500 text-white px-4 py-2 text-sm font-semibold"
            >
              MUA NGAY
            </button>
          </div>

          <!-- Mã & danh mục -->
          <div class="mt-4 font-medium text-gray-500 text-sm">
            <div class="border-t border-gray-300 pt-2 pb-2">
              Mã: {{ productDetail.code }}
            </div>
            <div class="border-t border-gray-300 pt-2 pb-2">
              Mô tả: {{ productDetail.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useCart } from "../../composables/useCart";
import { useUser } from "../../composables/useUser";
import { useProduct } from "../../composables/useProduct";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { formatPrice } from "../../utils/index.js";
/**
 * Variable
 */
const route = useRoute();
const { user } = useUser();
const { addItem } = useCart();
const { fetchProductDetail, productDetail } = useProduct();
const selectedSize = ref(null);
const router = useRouter();

const discountedPrice = () => {
  if (productDetail.value) {
    return productDetail.value.price * (1 - productDetail.value.discount);
  }
  return 0;
};

const handleAddToCart = async () => {
  if (!user.value) {
    toast.warning("Vui lòng đăng nhập để mua hàng");
    return;
  }
  if (!selectedSize.value) {
    toast.warning("Vui lòng chọn kích thước");
    return;
  }

  try {
    await addItem({
      userID: user.value._id,
      product: {
        id: productDetail.value._id,
        quantity: 1,
        size: selectedSize.value.size,
      },
    });
    toast.success("Thêm vào giỏ hàng thành công");
  } catch (error) {
    toast.error(error.message);
  }
};

const handleBuyNow = async () => {
  if (!user.value) {
    toast.warning("Vui lòng đăng nhập để mua hàng");
    return;
  }
  if (!selectedSize.value) {
    toast.warning("Vui lòng chọn kích thước");
    return;
  }

  try {
    await addItem({
      userID: user.value._id,
      product: {
        id: productDetail.value._id,
        quantity: 1,
        size: selectedSize.value.size,
      },
    });
    router.push("/cart");
  } catch (error) {
    toast.error(error.message);
  }
};

onMounted(async () => {
  const id = route.params.id;
  try {
    debugger;
    await fetchProductDetail(id);
  } catch (error) {
    console.error(error.message);
    toast.error("Lỗi load sản phẩm");
  }
});

const cloudinaryThumb = (url, quality = "auto:best") => {
  if (!url) return "";
  return url.replace("/upload/", `/upload/c_fill,q_${quality}/`);
};
</script>

<style scoped></style>
