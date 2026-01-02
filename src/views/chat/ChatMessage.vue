<template>
  <div class="flex-1 overflow-y-auto">
    <DynamicScroller
      class="h-full w-full"
      :items="chatStore.getCurrentMessages()"
      :min-item-size="100"
      key-field="_key"
      style="scrollbar-width: none"
    >
      <template #default="{ item, active, index }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <div
            class="px-20 md:px-30 xl:px-40 pb-6"
            :class="item.role === 'user' ? 'flex justify-end ' : ''"
          >
            <div
              v-if="item.role === 'user'"
              class="dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[80%]"
            >
              <p>{{ getMessageText(item.content) }}</p>
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
              <MarkdownRenderer v-if="item.content" :source="getMessageText(item.content)" />
              <p v-else class="text-gray-500">网络出错啦，暂时无法回答您的问题🌹</p>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { useChatStore, type ContentItem } from '@/stores/chat';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';

const chatStore = useChatStore();

const getMessageText = (content: ContentItem[]) => {
  return content.reduce((acc: string, cur: ContentItem) => acc + (cur?.text || ''), '');
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
