<template>
  <div
    class="chat_input px-4 sm:px-10 md:px-20 lg:px-30 xl:px-40 pb-4 bg-white flex flex-col items-center dark:bg-gray-800 transition-all duration-200"
  >
    <div class="w-full my-3">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        multiple
        style="display: none"
      />

      <div v-if="files.length > 0" class="flex gap-2">
        <div
          v-for="(file, index) in previewFiles"
          :key="file.name"
          class="flex items-center p-2 rounded-lg border border-gray-200"
        >
          <div class="mr-2">
            <img
              v-if="file.type.startsWith('image/')"
              :src="getImageFilePreview(file)"
              alt="预览"
              class="w-10 h-10 object-cover rounded"
            />
            <el-icon v-else :size="30">
              <Document />
            </el-icon>
          </div>

          <span class="text-sm truncate w-24 dark:text-white transition-all duration-200">
            {{ file.name }}
          </span>

          <el-icon :size="20" @click="removeFile(index)" class="ml-2 cursor-pointer">
            <CircleClose class="dark:text-white transition-all duration-200" />
          </el-icon>
        </div>

        <span v-if="files.length > 4" class="text-gray-500 flex items-center">
          +{{ files.length - 4 }} 个文件
        </span>
      </div>
    </div>

    <div class="w-full flex">
      <el-input
        type="textarea"
        v-model="message"
        placeholder="请输入问题( shift + enter 换行)"
        class="max-h-44"
        resize="none"
        :autosize="{ minRows: 4, maxRows: 5 }"
        @keydown="handleKeydown"
      />

      <div class="flex items-center">
        <div class="ml-4 flex space-x-2 items-center justify-center">
          <button
            class="relative rounded-full w-6 h-6 cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-200 dark:text-white"
            @mouseenter="isDocumentHover = true"
            @mouseleave="
              () => {
                isDocumentHover = false;
                uploadDocumentActive = false;
              }
            "
            @click="uploadDocumentActive = true"
          >
            <span
              v-show="isDocumentHover"
              class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-400 text-black px-2 py-1 rounded-md text-[10px] whitespace-nowrap shadow-md z-50"
            >
              上传文件
            </span>
            <div
              v-show="uploadDocumentActive"
              class="absolute -top-29 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-400 text-black px-2 py-1 rounded-md text-[10px] whitespace-nowrap shadow-md z-100"
            >
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

            <el-icon :size="28">
              <CirclePlus class="dark:text-white transition-all duration-200" />
            </el-icon>
          </button>

          <button
            class="relative rounded-full w-6 h-6 cursor-pointer flex items-center justify-center hover:scale-110 transition-all duration-200"
            @mouseenter="isMicrophoneHover = true"
            @mouseleave="isMicrophoneHover = false"
            @click="toggleRecording"
          >
            <span
              v-show="isRecording || isMicrophoneHover"
              class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-400 text-black px-2 py-1 rounded-md text-[10px] whitespace-nowrap shadow-md z-50"
            >
              {{ isRecording ? '正在听...' : '录音转文字' }}
            </span>

            <el-icon :size="28">
              <Microphone class="dark:text-white transition-all duration-200" />
            </el-icon>
          </button>
        </div>

        <button
          v-if="!isLoading"
          @click="handleSubmit"
          class="min-h-12 ml-4 px-2 md:px-4 py-1 md:py-2 h-8 md:h-12 w-22 md:w-26 rounded-lg cursor-pointer text-white text-sm lg:text-md bg-blue-500 hover:bg-blue-700 dark:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
        >
          点我发送
        </button>
        <button
          v-else
          @click="handlePause"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="min-h-12 ml-4 px-2 md:px-4 py-1 md:py-2 h-8 md:h-12 w-22 md:w-26 rounded-lg cursor-pointer text-white text-sm lg:text-md bg-gray-400 hover:bg-red-500 transition-all duration-200"
        >
          {{ isHovered ? '点我暂停' : '发送中...' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useChatStore } from '@/stores/chat';
import type { ChatMessage } from '@/stores/chat';
import { chatService } from '@/services/chatService';
import * as mammoth from 'mammoth';

const chatStore = useChatStore();
const message = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const previewFiles = ref<File[]>([]);
const isLoading = ref(false);
const isHovered = ref(false);
const isDocumentHover = ref(false);
const uploadDocumentActive = ref(false);
const isMicrophoneHover = ref(false);
const recognition = ref(null);
const isRecording = ref(false);

const isSpeechSupported = computed(
  () =>
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
);

const ensureRecognition = () => {
  if (!isSpeechSupported.value || recognition.value) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const instance = new SpeechRecognition();
  instance.lang = 'zh-CN';
  instance.interimResults = true;
  instance.continuous = true;

  instance.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    if (lastResult.isFinal) {
      const finalText = lastResult[0].transcript;
      message.value = `${message.value} ${finalText}`.trim();
    }
  };

  instance.onerror = () => stopRecording();
  instance.onend = () => stopRecording();

  recognition.value = instance;
};

const startRecording = () => {
  if (!isSpeechSupported.value || isRecording.value) return;
  ensureRecognition();
  if (!recognition.value) return;
  try {
    recognition.value.start();
    isRecording.value = true;
  } catch (error) {
    console.error(error);
    isRecording.value = false;
  }
};

const stopRecording = () => {
  if (recognition.value && typeof recognition.value.stop === 'function') {
    recognition.value.stop();
  }
  isRecording.value = false;
};

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

onBeforeUnmount(() => {
  stopRecording();
});

const handleKeydown = (event: Event | KeyboardEvent) => {
  if (!(event instanceof KeyboardEvent)) return;
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
    message.value = '';
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target;
  if (!target || !(target instanceof HTMLInputElement) || !target.files) return;
  files.value.push(...Array.from(target.files));
  previewFiles.value = files.value.slice(0, 4);
  target.value = '';
};

const triggerFileInput = (type: 'image' | 'document' | 'bigDocument') => {
  if (!fileInput.value) return;

  if (type === 'image') {
    fileInput.value.accept = 'image/*';
  } else if (type === 'document') {
    fileInput.value.accept = '.pdf,.docx,.xlsx,.xls,.pptx,.txt';
  } else if (type === 'bigDocument') {
    fileInput.value.accept = '*/*';
  }

  uploadDocumentActive.value = false;
  fileInput.value.click();
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  previewFiles.value = files.value.slice(0, 4);
};

const getImageFilePreview = (file: File) => {
  return URL.createObjectURL(file);
};

const isDocx = (type: string): boolean => {
  return type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
};

const extractDocxText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (!result.value.trim()) throw new Error('DOCX 文件未检测到可提取的文本内容');

    return result.value;
  } catch (error) {
    console.error('Failed to extract DOCX:', error);
    throw new Error('解析 DOCX 文件失败');
  }
};

const handleSubmit = async () => {
  const trimmedMessage = message.value.trim();
  if (!trimmedMessage && files.value.length === 0) return alert('问题或文件不能为空');

  isLoading.value = true;

  const userMessage: ChatMessage = {
    role: 'user',
    content: [
      {
        type: 'text',
        text: trimmedMessage,
      },
    ],
  };

  if (files.value.length > 0) {
    try {
      userMessage.attachments = await Promise.all(
        files.value.map(async (file) => {
          if (file.type.startsWith('image/')) {
            let url;
            const formData = new FormData();
            formData.append('file', file);

            await fetch('http://localhost:3000/upload/file', {
              method: 'POST',
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                url = data.data.url;
              })
              .catch((error) => console.error('上传失败:', error));

            return {
              name: file.name,
              size: file.size,
              type: file.type,
              imgurl: url,
              previewUrl: URL.createObjectURL(file),
            };
          }

          if (isDocx(file.type)) {
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              text: await extractDocxText(file),
            };
          }

          throw new Error('不支持的文件类型: ' + file.type);
        })
      );
    } catch (error) {
      console.error(error);
      files.value = [];
      previewFiles.value = [];
      isLoading.value = false;
      return;
    }

    files.value = [];
    previewFiles.value = [];
  }

  chatStore.chatPushMessage(userMessage);
  message.value = '';

  try {
    chatStore.time[chatStore.curname] = Date.now();
    const messages = chatStore.session[chatStore.curname];
    if (!messages) return;
    await chatService.connectToStream(messages);
  } catch (err) {
    console.log('ChatInput组件中: ', err);
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
.chat_input >>> .el-textarea__inner {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
}
</style>
