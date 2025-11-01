<template>
  <div class="flex-1 overflow-y-auto">
    <DynamicScroller
      class="h-full w-full"
      :items="messages"
      :min-item-size="100"
      :key="chatStore.curname"
      key-field="_key"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <!-- 这边内容过多之后，滚动条会显示，然后破坏padding的原有设定样式 -->
          <div :class="item.role === 'user' ? 'flex justify-end pr-40 pb-6' : 'px-40 pb-6'">
            <div
              v-if="item.role === 'user'"
              class="dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200 max-w-[60%]"
            >
              <p>
                {{ item.content }}
              </p>

              <!-- 用户上传的文件还得优化一下 -->
              <div v-if="item.attachments && item.attachments.length > 0" class="mt-4">
                <div
                  v-for="(attachment, index) in item.attachments"
                  :key="index"
                  class="mt-2 inline-flex items-center space-x-3 rounded-lg bg-white dark:bg-gray-700 p-2"
                >
                  <img :src="getFileIcon(attachment.type)" alt="文件图标" class="w-8 h-8" />
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {{ attachment.name }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatFileSize(attachment.size) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="bg-blue-50 dark:text-white dark:bg-gray-800 rounded-lg py-4 px-6 transition-all duration-200"
            >
              <p class="mt-3 text-gray-600 dark:text-gray-400 pb-4">
                回答来自 通义千问-plus 大模型
              </p>
              <p v-if="item.content" class="mb-3">
                {{ item.content }}
              </p>
              <p v-else class="mb-3">网络出错啦，芙宁娜暂时无法回答您的问题🌹</p>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from '@/stores/chat';
import type { Attachment } from '@/stores/chat';
import pdfIcon from '@/assets/pdf.jpg';
import docIcon from '@/assets/doc.jpg';
import imageIcon from '@/assets/logo.jpg';
import defaultIcon from '@/assets/default.jpg';

const chatStore = useChatStore();
const messages = computed(() => chatStore.getCurrentMessages());

const getFileIcon = (type?: string) => {
  if (!type) return defaultIcon;
  if (type.includes('pdf')) return pdfIcon;
  if (type.includes('image')) return imageIcon;
  if (type.includes('word') || type.includes('doc')) return docIcon;
  return defaultIcon;
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

const describeAttachment = (attachment?: Attachment): string => {
  if (!attachment) return '';
  const { name, size, type, body, note } = attachment;
  const header = [`文件名: ${name}`, `大小: ${formatFileSize(size)}`];
  if (type) {
    header.push(`类型: ${type}`);
  }

  const bodyText = body ? `内容预览:\n${body.slice(0, 4000)}` : note || '未提供内容';

  return `${header.join(' | ')}\n${bodyText}`;
};
</script>
