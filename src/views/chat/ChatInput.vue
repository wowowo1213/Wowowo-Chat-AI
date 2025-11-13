<template>
  <div
    class="chat-input px-40 py-4 bg-white flex items-center dark:bg-gray-800 transition-all duration-200"
  >
    <el-input
      type="textarea"
      v-model="message"
      placeholder="请输入问题( shift + enter 换行)"
      class="max-h-44 font-bold"
      resize="none"
      :autosize="{ minRows: 2, maxRows: 4 }"
      @keydown="handleKeydown"
    />

    <div class="flex items-center">
      <div class="ml-6 flex items-center justify-center">
        <FlieSlice
          :isFileSliceShow="true"
          :accept="uploadFileType"
          ref="fileSliceRef"
          style="display: none"
          @change="handleFileChange"
        />

        <el-tooltip effect="light" content="上传文件" placement="top">
          <button
            class="rounded-full w-6 h-6 cursor-pointer hover:scale-130 hover:rotate-360 transition-all duration-200"
            @click="loadFile"
          >
            <img :src="loadIcon" alt="上传文件" class="rounded-full w-full h-full" />
          </button>
        </el-tooltip>
      </div>

      <button
        v-if="!isLoading"
        @click="handleSubmit"
        class="min-h-12 min-w-26 ml-4 px-4 py-2 h-11 rounded-lg cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:from-gray-700 dark:to-purple-500 dark:hover:from-gray-800 dark:hover:to-purple-700 transition-all duration-200"
      >
        点我发送
      </button>
      <button
        v-else
        @click="handlePause"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        class="min-h-12 min-w-26 ml-4 px-4 py-2 h-11 rounded-lg cursor-pointer text-white bg-gray-400 hover:bg-red-500 transition-all duration-200"
      >
        {{ isHovered ? '点我暂停' : '发送中...' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '@/stores/chat';
import type { Attachment } from '@/stores/chat';
import { chatService } from '@/services/chatService';
import FlieSlice from './FileSlice.vue';
import loadIcon from '@/assets/icon1.jpg';

const chatStore = useChatStore();
const message = ref('');

const handleKeydown = (event: Event) => {
  // 这边实现只有 shift + enter 时才会换行，单按 enter 会发送信息
  // 也可以实现只有 shift + enter 时才会提问，单按 enter 会换行
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
    event.preventDefault();
    handleSubmit();
    message.value = '';
  }
};

const fileSliceRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const uploadFileType = '.pdf,.docx,.jpg,.png';

const loadFile = () => {
  fileSliceRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  selectedFiles.value = Array.from(input.files);
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const isLoading = ref(false);
const isHovered = ref(false);

const handleSubmit = async () => {
  const trimmedMessage = message.value.trim();
  if (!trimmedMessage) {
    alert('问题不能为空');
    return;
  }

  isLoading.value = true;

  const userMessage = {
    role: 'user',
    content: trimmedMessage,
    attachments: [] as Attachment[],
  };

  if (selectedFiles.value.length > 0) {
    userMessage.attachments = await Promise.all(
      selectedFiles.value.map(async (file) => {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          body: await readFileAsText(file),
        };
      })
    );
    selectedFiles.value = [];
  }

  chatStore.chatPushMessage(userMessage);

  message.value = '';
  try {
    const messages = chatStore.session[chatStore.curname] || [];
    if (!messages) return alert('当前对话为空');
    await chatService.connectToStream(messages);
  } catch (err) {
    console.log('ChatInput组件中流式对话前端提交处理出错', err);
  } finally {
    isLoading.value = false;
  }
};

const handlePause = () => {
  chatService.disconnect();
  isLoading.value = false;
};
</script>

<style scoped>
/* 强制更改el-input的css样式 */
.chat-input >>> .el-textarea__inner {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.8);
}
</style>
