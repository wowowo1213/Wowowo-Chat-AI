<template>
  <div class="flex-1 pb-2 overflow-hidden relative">
    <div
      class="absolute bottom-1 left-1/2 transform -translate-x-1/2 z-100 flex items-center justify-center cursor-pointer bg-blue-100 dark:bg-gray-800 rounded-full transition-colors duration-200"
    >
      <el-icon class="px-1" @click="scrollToBottom" :size="34">
        <ArrowDownBold class="text-gray-700 dark:text-gray-500 transition-colors duration-200" />
      </el-icon>
    </div>

    <DynamicScroller
      class="Dynamic_content h-full w-full"
      :items="messages"
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
              class="overflow-hidden dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[80%]"
            >
              <p class="max-w-full dark:text-white transition-colors duration-200">
                {{ getMessageText(item.content) }}
              </p>
              <div
                v-show="item.attachments && item.attachments.length > 0"
                class="mt-2 flex flex-wrap gap-3"
              >
                <div
                  v-for="file in item.attachments"
                  :key="file.name"
                  class="mt-2 p-2 flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-700 transition-all duration-200"
                >
                  <img
                    v-if="file.type.startsWith('image/')"
                    :src="file?.previewUrl"
                    alt="预览"
                    class="w-20 h-20 object-cover"
                  />
                  <el-icon v-else :size="20"><Document /></el-icon>
                  <div class="flex flex-col w-20">
                    <span
                      class="mt-1 text-xs text-gray-800 dark:text-gray-300 truncate max-w-[100px] transition-all duration-200"
                    >
                      {{ file.name }}
                    </span>
                    <span
                      class="text-xs text-gray-500 dark:text-gray-400 transition-all duration-200"
                    >
                      {{ formatFileSize(file.size) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-blue-50 dark:text-white dark:bg-gray-700 rounded-lg py-3 px-4 transition-all duration-200 w-full"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 pb-2">
                回答来自 通义千问-plus 大模型
              </p>
              <AiMessageContent :source="item.content[0].text" />
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useChatStore, type ContentItem } from '@/stores/chat';
import AiMessageContent from './AiMessageContent.vue';

const chatStore = useChatStore();

const messages = computed(() => chatStore.getCurrentMessages());

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

const isScrolling = ref(false);

const forceScrollToBottom = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 200));
  const container = document.querySelector('.Dynamic_content');
  if (!container) return;
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth',
  });
};

watch(
  () => chatStore.curname,
  async () => {
    isScrolling.value = true;
    await forceScrollToBottom();
    isScrolling.value = false;
  },
  { immediate: true }
);

const scrollToBottom = async () => {
  if (isScrolling.value) return;
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const container = document.querySelector('.Dynamic_content');
  if (!container) return;
  container.scrollTop = container.scrollHeight;
};
</script>
