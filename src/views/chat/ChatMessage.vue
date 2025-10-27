<template>
  <div class="space-y-6">
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-200">
      <div class="mb-4">
        <p class="text-gray-800 dark:text-gray-200 transition-all duration-200">用户问题</p>
      </div>

      <!-- 这边v-if不需要使用:进行绑定，isFile本身就是布尔值 -->
      <div
        v-if="true"
        class="mt-4 border border-gray-200 dark:border-gray-600 rounded-lg p-3 transition-all duration-200"
      >
        <div class="flex items-center space-x-3">
          <div>
            <img
              src=""
              alt="文件图片"
              class="w-14 h-14 cursor-pointer text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
            />
          </div>
          <div class="flex flex-col cursor-pointer">
            <span class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
              >文档标题.pdf</span
            >
            <span class="text-sm text-gray-700 dark:text-gray-300 transition-all duration-200"
              >114514kb</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200">
      <p class="text-gray-800 dark:text-gray-100 transition-all duration-200">AI回复内容...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isFile = ref(false); // 使用布尔类型更合适，别用字符串，这个用来判断是否有文件
</script>
