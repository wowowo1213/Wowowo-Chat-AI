<template>
  <div
    class="chat-input px-40 pb-4 bg-white flex flex-col items-center dark:bg-gray-800 transition-all duration-200"
  >
    <div class="w-full my-3">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        multiple
        style="display: none"
      />

      <!-- 这边是文件预览区域 -->
      <div v-if="files.length > 0" class="flex gap-2">
        <div
          v-for="(file, index) in previewFiles"
          :key="index"
          class="flex items-center p-2 rounded-lg border border-gray-200"
        >
          <div class="mr-2">
            <!-- 如果上传的是图片，就使用图片自己的缩略图，如果是其他文件，就用自己的默认的icon -->
            <img
              v-if="isImage(file)"
              :src="getImageFilePreview(file)"
              alt="预览"
              class="w-10 h-10 object-cover rounded"
            />
            <span v-else class="text-2xl">{{ getFileIcon(file) }}</span>
          </div>

          <!-- 文件名通过truncate来省略 -->
          <span class="text-sm truncate w-24 dark:text-white transition-all duration-200">
            {{ file.name }}
          </span>

          <button
            @click="removeFile(index)"
            class="ml-2 text-black cursor-pointer dark:text-white transition-all duration-200"
          >
            ×
          </button>
        </div>

        <span v-if="files.length > 4" class="text-gray-500"> +{{ files.length - 4 }} 个文件 </span>
      </div>
    </div>

    <div class="w-full flex">
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
        <div class="ml-4 flex space-x-2 items-center justify-center">
          <el-tooltip effect="dark" content="上传文件" placement="top">
            <span>
              <el-popover placement="top" trigger="click" :hide-after="0" :width="150">
                <template #reference>
                  <button
                    class="rounded-full w-6 h-6 cursor-pointer flex items-center justify-center hover:scale-130 hover:rotate-360 transition-all duration-200"
                  >
                    <el-icon :size="28"><CirclePlus /></el-icon>
                  </button>
                </template>

                <div>
                  <button
                    class="cursor-pointer w-full px-2 py-2 rounded-md text-sm flex items-center justify-between hover:bg-gray-100"
                    @click="triggerFileInput('bigDocument')"
                  >
                    <span>大文件</span>
                    <el-icon :size="14">
                      <Document />
                    </el-icon>
                  </button>
                  <button
                    class="cursor-pointer w-full px-2 py-2 rounded-md text-sm flex items-center justify-between hover:bg-gray-100"
                    @click="triggerFileInput('document')"
                  >
                    <span> 文档 </span>
                    <el-icon :size="14">
                      <Document />
                    </el-icon>
                  </button>
                  <button
                    class="cursor-pointer w-full px-2 py-2 rounded-md text-sm flex items-center justify-between hover:bg-gray-100"
                    @click="triggerFileInput('image')"
                  >
                    <span> 图片 </span>
                    <el-icon :size="14">
                      <Picture />
                    </el-icon>
                  </button>
                </div>
              </el-popover>
            </span>
          </el-tooltip>

          <el-tooltip effect="dark" content="录音转文字" placement="top">
            <button
              class="rounded-full w-6 h-6 cursor-pointer flex items-center justify-center hover:scale-130 transition-all duration-200"
            >
              <el-icon :size="28"> <Microphone /></el-icon>
            </button>
          </el-tooltip>
        </div>

        <button
          v-if="!isLoading"
          @click="handleSubmit"
          class="min-h-12 min-w-26 ml-4 px-4 py-2 h-12 w-26 rounded-lg cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:from-gray-700 dark:to-purple-500 dark:hover:from-gray-800 dark:hover:to-purple-700 transition-all duration-200"
        >
          点我发送
        </button>
        <button
          v-else
          @click="handlePause"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="min-h-12 min-w-26 ml-4 px-4 py-2 h-12 w-26 rounded-lg cursor-pointer text-white bg-gray-400 hover:bg-red-500 transition-all duration-200"
        >
          {{ isHovered ? '点我暂停' : '发送中...' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from '@/stores/chat';
import type { Attachment } from '@/stores/chat';
import { chatService } from '@/services/chatService';

defineOptions({ name: 'ChatInput' });

const chatStore = useChatStore();
const message = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const previewFiles = ref<File[]>([]);
const isLoading = ref(false);
const isHovered = ref(false);

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

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;

  files.value.push(...Array.from(target.files));
  previewFiles.value = files.value.slice(0, 4);

  target.value = '';
};

const triggerFileInput = (type?: 'image' | 'document' | 'bigDocument') => {
  if (!fileInput.value) return;

  if (type === 'image') {
    fileInput.value.accept = 'image/*';
  } else if (type === 'document') {
    fileInput.value.accept = '.pdf,.docx,.xlsx,.xls,.pptx,.txt';
  } else if (type === 'bigDocument') {
    // 大文件实现分片上传和断点续传
    fileInput.value.accept = '*/*';
  }

  fileInput.value.click();
};

const isImage = (file: File) => {
  return file.type.startsWith('image/');
};

const getImageFilePreview = (file: File) => {
  if (!isImage(file)) return;
  return URL.createObjectURL(file); // 生成临时URL用于图片预览
};

const getFileIcon = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const icons: Record<string, string> = {
    pdf: '📄',
    docx: '📝',
    xlsx: '📊',
    xls: '📊',
    pptx: '📑',
    txt: '📄',
    zip: '🗜️',
    default: '📁',
  };
  return icons[extension] || icons.default;
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  previewFiles.value = files.value.slice(0, 4);
};

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

  if (files.value.length > 0) {
    userMessage.attachments = await Promise.all(
      files.value.map(async (file) => {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          body: await readFileAsText(file),
        };
      })
    );
    files.value = [];
    previewFiles.value = [];
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
