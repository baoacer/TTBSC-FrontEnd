<template>
  <div class="p-8">
    <div v-if="product" class="flex">

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

     
      <div class="w-1/2">
        <div class="max-w-md mx-auto">
        
          <h1 class="text-xl font-bold">
            {{ product.name }}
          </h1>

          
          <div class="flex gap-4 items-center mt-2">
           
            <div v-if="product.discount > 0" class="text-gray-500 line-through">
              {{ formatPrice(product.price) }}
            </div>
        
            <div class="text-red-600 text-xl font-bold">
              {{ formatPrice(discountedPrice) }}
            </div>
          </div>

         
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
                  : 'border-gray-300' 
              ]" 
            >
              {{ size }}
            </button>
          </div>

         
          <div class="mt-4">
            <span class="font-bold text-orange-400">Còn hàng</span>
          </div>

          
          <div class="mt-4 flex space-x-2">
            <button
              @click="handleAddToCart" 
              class="bg-gray-600 text-white px-4 py-2 text-sm font-semibold"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          
          <div class="mt-4 font-medium text-gray-500 text-sm">
            <div class="border-t border-gray-300 pt-2 pb-2">
              Mã: {{ product.code }}
            </div>
            <div class="border-t border-gray-300 pt-1">
              Danh mục: {{ product.category }} 
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
      
      if (!this.selectedSize) {
        alert("Vui lòng chọn kích thước."); 
        return;
      }

    
      const productWithSize = {
        ...this.product,
        name: this.product.name + ` - ${this.selectedSize}`,
        size: this.selectedSize,
      };
      cartServices.addToCart(productWithSize); 
      alert(
        `${this.product.name} (Size: ${this.selectedSize}) đã được thêm vào giỏ hàng!`
      ); 
    },
  },
  setup() {
    const route = useRoute(); 
    const product = ref(null); 

    
    onMounted(async () => {
      const id = route.params.id; 
      try {
        const response = await axios.get("http://localhost:3000/products"); 
        const foundProduct = response.data.find((item) => item.id == id); 
        if (foundProduct) {
          product.value = foundProduct; 
        }
      } catch (error) {
        alert("Failed to fetch product:", error); 
      }
    });

    return { product }; 
  },
});
</script>

<style scoped></style>
