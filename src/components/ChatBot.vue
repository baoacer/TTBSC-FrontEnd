<template>
  <div class="fixed bottom-4 right-4 z-50 text-sm font-sans">
    <!-- Toggle Button -->
    <button @click="show = !show" class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.4-3.6A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span class="hidden sm:inline text-sm font-medium">Trợ lý ảo</span>
    </button>

    <!-- Chat Box -->
    <div v-if="show" class="w-80 max-w-full sm:w-96 bg-gradient-to-br from-white to-gray-100 border rounded-xl shadow-2xl mt-2 flex flex-col overflow-hidden animate-fadeIn">
      <div class="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-xl">
        <span class="font-semibold text-base tracking-wide">🤖 AI Chatbot</span>
        <button @click="show = false" class="text-white hover:text-gray-200 text-xl">×</button>
      </div>
      <div class="p-4 h-64 overflow-y-auto space-y-3 bg-white flex flex-col" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index" class="self-end max-w-[75%] bg-indigo-100 text-gray-800 px-4 py-2 rounded-2xl shadow-md">
          {{ msg }}
        </div>
      </div>
      <div class="border-t p-2 bg-white">
        <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
          <input v-model="input" type="text" placeholder="Nhập nội dung..." class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
          <button type="submit" class="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow">Gửi</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const show = ref(false)
const input = ref('')
const messages = ref([])
const chatContainer = ref(null)

function sendMessage() {
  if (input.value.trim()) {
    messages.value.push(input.value.trim())
    input.value = ''
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
