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
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="self-start max-w-[75%] bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl shadow-md">
          Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?
        </div>
        <!-- Chat Messages -->
        <div v-for="(msg, index) in messages" :key="index" 
             :class="[
               'max-w-[75%] px-4 py-2 rounded-2xl shadow-md',
               msg.isUser ? 'self-end bg-indigo-100 text-gray-800' : 'self-start bg-gray-100 text-gray-800'
             ]">
          <div v-if="msg.isUser">{{ msg.content }}</div>
          <div v-else v-html="msg.content" class="prose prose-sm"></div>
        </div>
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="self-start bg-gray-100 px-4 py-2 rounded-2xl shadow-md">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
      <div class="border-t p-2 bg-white">
        <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
          <input v-model="input" type="text" placeholder="Nhập nội dung..." 
                 class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                 :disabled="isLoading"
                 required>
          <button type="submit" 
                  class="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow disabled:opacity-50"
                  :disabled="isLoading">
            {{ isLoading ? 'Đang gửi...' : 'Gửi' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import userService from '../services/userSercices'

const show = ref(false)
const input = ref('')
const messages = ref([])
const chatContainer = ref(null)
const isLoading = ref(false)

async function sendMessage() {
  if (!input.value.trim() || isLoading.value) return

  const userMessage = input.value.trim()
  messages.value.push({ content: userMessage, isUser: true })
  input.value = ''
  
  isLoading.value = true
  
  try {
    const currentUser = userService.getUser()
    if (!currentUser) {
      throw new Error('User not logged in')
    }

    const response = await fetch('http://nguyenlequocbao.id.vn/v1/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': currentUser._id || currentUser.id
      },
      body: JSON.stringify({ message: userMessage })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    messages.value.push({ content: data.metadata.reply, isUser: false })
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({ 
      content: error.message === 'User not logged in' 
        ? 'Vui lòng đăng nhập để sử dụng chatbot' 
        : 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.', 
      isUser: false 
    })
  } finally {
    isLoading.value = false
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

/* Add styles for HTML content from bot */
:deep(.prose) {
  color: #1f2937; /* text-gray-800 */
}

:deep(.prose p) {
  margin-bottom: 0.5rem;
}

:deep(.prose a) {
  color: #4f46e5; /* text-indigo-600 */
  text-decoration: underline;
}

:deep(.prose ul), :deep(.prose ol) {
  margin-left: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.prose li) {
  margin-bottom: 0.25rem;
}

:deep(.prose strong) {
  font-weight: 600;
  color: #1f2937;
}

:deep(.prose em) {
  font-style: italic;
  color: #1f2937;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  color: #1f2937;
}

:deep(.prose pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

:deep(.prose blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: #4b5563;
}
</style>
