<template>
  <div class="p-4 bg-white flex dark:bg-gray-900 transition-colors duration-200">
    <input
      v-model="message"
      placeholder="请输入问题"
      @keyup.enter="sendMessage"
      type="text"
      autocomplete="off"
      class="flex-1 p-2 rounded-lg bg-white text-gray-500 border focus:outline-none dark:bg-gray-600 dark:text-gray-100 transition-colors duration-200"
    />

    <button
      @click="sendMessage"
      class="ml-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200"
    >
      点我发送
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
</script>
