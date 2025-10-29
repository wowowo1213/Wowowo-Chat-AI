<template>
  <div
    class="chat-input px-40 py-4 bg-white flex items-center dark:bg-gray-800 transition-all duration-200"
  >
    <el-input
      type="textarea"
      v-model="message"
      placeholder="请输入问题"
      class="max-h-44 font-bold"
      resize="none"
      :autosize="{ minRows: 2, maxRows: 4 }"
      @keydown="handleKeydown"
    />

    <div class="flex items-center">
      <div class="ml-6 flex items-center justify-center">
        <input
          type="file"
          multiple
          :accept="uploadFileType"
          ref="fileInputRef"
          style="display: none"
        />

        <el-tooltip effect="dark" content="上传图片" placement="top">
          <button
            class="rounded-full w-6 h-6 cursor-pointer hover:scale-130 hover:rotate-360 transition-all duration-200"
            @click="loadFile"
          >
            <img :src="loadIcon" alt="上传图片" class="rounded-full w-full h-full" />
          </button>
        </el-tooltip>
      </div>

      <button
        @click="sendMessage"
        class="min-h-12 min-w-26 ml-4 px-4 py-2 h-11 rounded-lg cursor-pointer text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-amber-500 transition-all duration-200"
      >
        点我发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import loadIcon from '@/assets/icon1.jpg';

const message = ref('');

// 这边实现只有 shift + enter 时才会换行，单按 enter 会发送信息
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
    message.value = '';
  }
};

const fileInputRef = ref<HTMLInputElement | null>(null);

const loadFile = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const uploadFileType = '.pdf,.docx,.jpg,.png';

const sendMessage = () => {
  console.log(111);
};
</script>

<style scoped>
/* 强制更改el-input的css样式 */
.chat-input >>> .el-textarea__inner {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.8);
}
</style>
