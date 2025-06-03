<template>
  <div class="w-full h-fit">
    <!-- Image Slider Section -->
    <div class="relative bg-gray-100 h-96 overflow-hidden">
      <div
        v-for="(image, index) in images"
        :key="index"
        :class="[
          'absolute inset-0 transition-opacity duration-1000',
          currentIndex === index ? 'opacity-100' : 'opacity-0',
        ]"
      >
        <img
          :src="image"
          class="w-full h-full object-cover"
          alt="Slider Image"
        />
      </div>
      <!-- Slider Navigation Buttons -->
      <button
        @click="prevSlide"
        class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-2xl"
      >
        &#10094;
      </button>
      <button
        @click="nextSlide"
        class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-2xl"
      >
        &#10095;
      </button>
    </div>

    <!-- Product List -->
    <ProductList />

    <!-- Nút mở chat -->
    <ChatBot />

  </div>
</template>

<script>
import ProductList from "../components/Product/ProductList.vue";
import ChatBot from '@/components/ChatBot.vue';
import { ref, onMounted } from "vue";

export default {
  name: "Home",
  components: {
    ProductList,
    ChatBot
  },
  setup() {
    // Image Slider Setup
    const images = [
      "https://pos.nvncdn.com/eb9ddb-116318/bn/20220324_Oh53NJJ4ig1sNzfa7mH5CDRp.jpg"
    ];
    const currentIndex = ref(0);
    const showChat = ref(false);

  const changeSlide = () => {
      currentIndex.value = (currentIndex.value + 1) % images.length;
    };

  onMounted(() => {
      setInterval(changeSlide, 5000);
    });

  const prevSlide = () => {
      currentIndex.value =
        (currentIndex.value - 1 + images.length) % images.length;
    };
    const nextSlide = () => {
      currentIndex.value = (currentIndex.value + 1) % images.length;
    };

    return {
      images,
      currentIndex,
      prevSlide,
      nextSlide,
      showChat
    };
  },
};
</script>

<style scoped></style>