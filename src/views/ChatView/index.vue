<template>
  <div
    class="flex flex-col h-screen bg-white transition-colors duration-200 text-gray-500 dark:bg-gray-900 dark:text-gray-100"
  >
    <Header />

    <div id="chat-container" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="(msg, index) in chatStore.messages"
        :key="index"
        class="flex items-start gap-2"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[80%] px-4 py-3 rounded-xl transition-all duration-200 break-words"
          :class="
            msg.role === 'user'
              ? 'bg-blue-600 text-white dark:bg-gray-700'
              : 'bg-blue-600 text-white dark:bg-gray-700'
          "
        >
          <div v-html="renderMarkdown(msg.content)" class="prose dark:prose-invert" />
        </div>
      </div>

      <div v-if="chatStore.isLoading" class="flex justify-start">
        <div
          class="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 dark:bg-gray-600 dark:text-gray-100"
        >
          <span class="animate-pulse">我正在思考🤔，啊啊啊啊啊~~~~~</span>
        </div>
      </div>
    </div>

    <ChatInput @send="chatStore.sendMessage" />
  </div>
</template>

<script lang="ts" setup name="ChatView">
import { onMounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { useRouter } from 'vue-router';
import Header from '@/views/ChatView/Header.vue';
import ChatInput from '@/views/ChatView/ChatInput.vue';
import { marked } from 'marked';

const userStore = useUserStore();
const chatStore = useChatStore();
const router = useRouter();

if (!userStore.userId) {
  router.push('/');
}

const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

onMounted(() => {
  chatStore.loadChatHistory().then(() => scrollToBottom);
  scrollToBottom();
});

marked.setOptions({ breaks: true });

const renderMarkdown = (text) => {
  return marked.parse(text);
};
</script>
