<template>
  <div class="space-y-4 px-40">
    <div class="flex justify-end">
      <div
        class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200 max-w-[60%]"
      >
        <div>
          <p class="text-gray-800 dark:text-gray-200 transition-all duration-200">
            用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题用户问题
          </p>
        </div>

        <!-- margin这边加到v-if的元素上，这样的话，不渲染文件div时，上面的用户问题div也不会有margin-bottom -->
        <div v-if="isFile" class="mt-4 inline-flex space-x-5 rounded-lg flex">
          <div class="flex items-center space-x-3 rounded-lg cursor-pointer inline-flex">
            <div>
              <img
                :src="logoImg"
                alt="图片"
                class="w-14 h-14 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200">
                图片标题.pdf
              </span>
              <span class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200">
                114514kb
              </span>
            </div>
          </div>

          <div class="flex items-center space-x-3 rounded-lg cursor-pointer inline-flex">
            <div>
              <img
                :src="logoImg"
                alt="图片"
                class="w-14 h-14 text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
              />
            </div>
            <div class="flex flex-col">
              <span class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200">
                图片标题.pdf
              </span>
              <span class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200">
                114514kb
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200">
      <p class="text-gray-800 dark:text-gray-100 transition-all duration-200">AI回复内容...</p>
      <p class="mt-3 text-gray-500">回答来自 通义千问-plus 大模型</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import logoImg from '@/assets/logo.jpg';

const isFile = ref(false);

import { apiChat } from '@/api/chat';

async function handleChat() {
  try {
    const response = await apiChat(['你好，我是wowowo，介绍一下前端开发是什么']);
    console.log('API 返回结果:', response);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 调用函数
handleChat();
</script>
