<template>
  <div class="mt-6 px-6">
    <h2 class="mb-2 text-xl font-semibold dark:text-white transition-all duration-200">
      对话历史记录
    </h2>
    <div
      v-for="(item, index) in chatStore.getAllChats()"
      :key="index"
      class="px-4 py-2 w-full rounded-xl cursor-pointer text-lg transition-all duration-200"
      :class="{
        // 这个用来实现选中时一直高亮
        'bg-gray-200 dark:bg-gray-700 text-black dark:text-white': chatStore.curname === item,
        'bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300':
          chatStore.curname !== item,
      }"
      @click="chatStore.selectChat(item)"
    >
      <div class="flex justify-between items-center">
        <span class="flex-1">{{ item }}</span>
        <span class="text-sm ml-4">
          {{ formatTime(chatStore.getTime(item)) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();

const formatTime = (timestamp: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  // 如果是今天的消息(getDate相同表示日期相同)，显示时间
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
