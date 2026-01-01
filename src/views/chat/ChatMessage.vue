<template>
  <div class="flex-1 overflow-y-auto">
    <DynamicScroller
      class="h-full w-full"
      :items="messages"
      :min-item-size="100"
      :key="chatStore.curname"
      key-field="_key"
      style="scrollbar-width: none"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <div :class="item.role === 'user' ? 'flex justify-end pr-40 pb-6' : 'px-40 pb-6'">
            <div
              v-if="item.role === 'user'"
              class="dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[60%]"
            >
              <p>
                {{ item.content.reduce((acc: string, cur: TextContent) => acc + cur.text, '') }}
              </p>

              <div v-if="item.attachments && item.attachments.length > 0" class="mt-4">
                <div
                  v-for="attachment in item.attachments"
                  :key="attachment.name"
                  class="mt-2 inline-flex items-center space-x-3 rounded-lg bg-white dark:bg-gray-700 p-2 transition-all duration-200"
                >
                  <!-- <img :src="getFileIcon(attachment.type)" alt="文件图标" class="w-8 h-8" /> -->
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
              class="bg-blue-50 dark:text-white dark:bg-gray-700 rounded-lg py-4 px-6 transition-all duration-200"
            >
              <p class="mt-3 text-gray-600 dark:text-gray-400 pb-4 transition-all duration-200">
                回答来自 通义千问-plus 大模型
              </p>
              <p v-if="item.content" class="mb-3" v-html="renderMarkdown(item.content)"></p>
              <p v-else class="mb-3">网络出错啦，暂时无法回答您的问题🌹</p>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore, type TextContent } from '@/stores/chat';

const chatStore = useChatStore();
const messages = computed(() => chatStore.getCurrentMessages());

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};
</script>
