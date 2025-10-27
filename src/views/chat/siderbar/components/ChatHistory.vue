<template>
  <div class="mt-6 px-6">
    <h2 class="mb-2 text-xl font-semibold dark:text-white transition-all duration-200">
      对话历史记录
    </h2>
    <div
      v-for="item in conversationList"
      :key="item.id"
      class="px-4 py-2 w-full rounded-xl cursor-pointer text-lg text-black bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-900 dark:hover:bg-gray-700 transition-all duration-200"
      @click="handleConversationClick(item)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const conversationList = ref([
  { title: '你好', id: 1 },
  { title: 'hello，world', id: 2 },
]);

interface Conversation {
  id?: string | number;
  title: string;
}

const handleConversationClick = (item: Conversation) => {
  // 这边进行跳转，每一个都对应不同的请求资源路径
  console.log(333);
};
</script>
