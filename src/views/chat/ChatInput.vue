<template>
  <div class="p-4 bg-white flex dark:bg-gray-800 transition-all duration-200">
    <input
      v-model="message"
      placeholder="请输入问题"
      @keyup.enter="sendMessage"
      type="text"
      autocomplete="off"
      class="flex-grow p-2 rounded-lg border-2 focus:outline-none placeholder:text-gray-400 bg-white text-gray-700 border-gray-400 hover:border-gray-700 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-400 dark:hover:border-gray-300 dark:focus:border-blue-400 transition-all duration-200"
    />
    <!-- 上面这边border设置为2，效果更明显，设置为1更美观；输入框有三种状态，正常，鼠标悬浮，获得焦点，分别设置了三种颜色 -->

    <button
      @click="sendMessage"
      class="ml-4 px-4 py-2 rounded-lg cursor-pointer text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-900 transition-all duration-200"
    >
      点我发送
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');

const sendMessage = () => {
  console.log(111);
};
</script>
