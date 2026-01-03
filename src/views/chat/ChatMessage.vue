<template>
  <div class="flex-1 overflow-y-auto">
    <DynamicScroller
      class="h-full w-full"
      :items="chatMessages"
      :min-item-size="100"
      key-field="_key"
      style="scrollbar-width: none"
    >
      <template #default="{ item, active, index }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <div
            class="px-4 sm:px-10 md:px-20 lg:px-30 xl:px-40 pb-6"
            :class="item.role === 'user' ? 'flex justify-end ' : ''"
          >
            <div
              v-if="item.role === 'user'"
              class="dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[80%]"
            >
              <p class="prose max-w-full dark:text-gray-300 transition-colors duration-200">
                {{ getMessageText(item.content) }}
              </p>
              <div v-if="item.attachments && item.attachments.length > 0" class="mt-4">
                <div
                  v-for="attachment in item.attachments"
                  :key="attachment.name"
                  class="mt-2 inline-flex items-center space-x-3 rounded-lg bg-white dark:bg-gray-700 p-2 transition-all duration-200"
                >
                  <el-icon class="w-8 h-8" :size="20"><Document /></el-icon>
                  <div class="flex flex-col">
                    <span
                      class="text-sm text-gray-800 dark:text-gray-300 transition-all duration-200"
                    >
                      {{ attachment.name }}
                    </span>
                    <span
                      class="text-xs text-gray-500 dark:text-gray-400 transition-all duration-200"
                    >
                      {{ formatFileSize(attachment.size) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-blue-50 dark:text-white dark:bg-gray-700 rounded-lg py-3 px-4 transition-all duration-200 max-w-[80%]"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 pb-2">
                回答来自 通义千问-plus 大模型
              </p>
              <AiMessageContent :source="getAiMessageText(item.content, item._key)" />
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useChatStore, type ChatMessage, type ContentItem } from '@/stores/chat';
import AiMessageContent from './AiMessageContent.vue';

const chatStore = useChatStore();

const chatMessages = ref<ChatMessage[]>([]);
const temp = ref<number | null>(null);

watch(
  () => chatStore.getCurrentMessages(),
  (newVal) => {
    if (!temp.value) {
      temp.value = setTimeout(() => {
        chatMessages.value = newVal;
        temp.value = null;
      }, 300);
    }
  }
);

const getMessageText = (content: ContentItem[]) => {
  return content.reduce((acc: string, cur: ContentItem) => acc + (cur?.text || ''), '');
};

const messageBuffers = new Map<string, { buffer: string; timer: number | null; first: boolean }>();

const getAiMessageText = (content: ContentItem[], messageKey: string) => {
  if (!messageBuffers.has(messageKey)) {
    messageBuffers.set(messageKey, { buffer: '', timer: null, first: false });
  }

  const msgBuffer = messageBuffers.get(messageKey)!;

  if (!msgBuffer.first) {
    msgBuffer.buffer = content.reduce((acc, cur) => acc + (cur?.text || ''), '');
    msgBuffer.first = true;
  }

  if (!msgBuffer.timer) {
    msgBuffer.timer = setTimeout(() => {
      msgBuffer.buffer = content.reduce((acc, cur) => acc + (cur?.text || ''), '');
      console.log(msgBuffer.buffer);
      msgBuffer.timer = null;
    }, 600);
  }

  return msgBuffer.buffer;
};

const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)}${units[i]}`;
};
</script>
