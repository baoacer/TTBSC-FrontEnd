<template>
  <div class="fixed bottom-4 right-4 z-50 text-sm font-sans">
    <!-- Toggle Button -->
    <button
      @click="show = !show"
      class="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
    >
      <span class="font-semibold text-base">
        <img
          src="../assets/chatbot.png"
          alt="chat"
          class="h-7 w-7 object-contain"
        />
      </span>
      <span class="hidden sm:inline">Trợ lý ảo</span>
    </button>

    <!-- Chat Box -->
    <div
      v-if="show"
      class="w-[90vw] sm:w-96 bg-white border rounded-2xl shadow-2xl mt-3 flex flex-col overflow-hidden animate-fadeIn"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between bg-gradient-to-r from-pink-400 to-indigo-400 text-white p-2 rounded-t-2xl"
      >
        <span class="font-semibold text-base">Chatbot</span>
        <button
          @click="show = false"
          class="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>

      <!-- Chat Body -->
      <div
        ref="chatContainer"
        class="p-4 h-64 overflow-y-auto bg-pink-50 flex flex-col space-y-3"
      >
        <!-- Welcome -->
        <div v-if="messages.length === 0" class="chat-bubble-left">
          🥰 Xin chào! Mình là trợ lý ảo của TTBSC. Bạn cần tư vấn gì nè?
        </div>

        <!-- Messages -->
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="msg.isUser ? 'chat-bubble-right' : 'chat-bubble-left'"
        >
          <div v-if="msg.isUser">{{ msg.content }}</div>
          <div v-else v-html="msg.content" class="prose prose-sm"></div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="chat-bubble-left">
          <div class="flex space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"
            ></div>
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"
            ></div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="border-t bg-white p-2">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="input"
            type="text"
            placeholder="..."
            class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            :disabled="isLoading"
            required
          />
          <button
            type="submit"
            class="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? "..." : "💌" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useChat } from "../composables/useChat";

const show = ref(false);
const input = ref("");
const messages = ref([]);
const isLoading = ref(false);
const chatContainer = ref(null);

const { askChat, fetchChatHistory } = useChat();

const scrollToBottom = () => {
  const el = chatContainer.value;
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
};

onMounted(async () => {
  try {
    const history = await fetchChatHistory();
    messages.value = history.map((item) => ({
      content: item.message || item.reply,
      isUser: item.isBot !== 1,
    }));

    await nextTick();
    scrollToBottom();
  } catch (err) {
    messages.value.push({
      content: "Không thể tải lịch sử chat.",
      isUser: false,
    });
  }
});

const sendMessage = async () => {
  if (!input.value.trim()) return;
  const userMessage = input.value.trim();

  messages.value.push({ content: userMessage, isUser: true });
  input.value = "";
  isLoading.value = true;
  await nextTick();
  scrollToBottom();

  try {
    const reply = await askChat(userMessage);
    messages.value.push({ content: reply, isUser: false });
  } catch (err) {
    messages.value.push({
      content: "Đã có lỗi xảy ra, vui lòng thử lại.",
      isUser: false,
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

watch(show, async (val) => {
  if (val) {
    await nextTick();
    scrollToBottom();
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}

/* Chat bubbles */
.chat-bubble-left {
  align-self: flex-start;
  max-width: 75%;
  background-color: #fff;
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative;
}
.chat-bubble-left::before {
  content: "";
  position: absolute;
  top: 10px;
  left: -8px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent white transparent transparent;
}

.chat-bubble-right {
  align-self: flex-end;
  max-width: 75%;
  background-color: #e0e7ff; /* indigo-100 */
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  position: relative;
}
.chat-bubble-right::before {
  content: "";
  position: absolute;
  top: 10px;
  right: -8px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent transparent #e0e7ff;
}

/* Bot content formatting */
:deep(.prose) {
  color: #374151;
}
:deep(.prose p) {
  margin-bottom: 0.5rem;
}
:deep(.prose button) {
  margin-top: 0.25rem;
  display: inline-block;
  background-color: #4f46e5; /* indigo-600 */
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s;
}
:deep(.prose button:hover) {
  background-color: #4338ca; /* indigo-700 */
}
</style>
