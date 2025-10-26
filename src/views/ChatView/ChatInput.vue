<template>
  <div class="p-4 bg-white flex dark:bg-gray-900 transition-colors duration-200">
    <input
      v-model="message"
      placeholder="请输入问题"
      @keyup.enter="sendMessage"
      type="text"
      autocomplete="off"
      class="flex-1 p-2 rounded-lg bg-white text-gray-500 border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200 dark:bg-gray-600 dark:text-gray-100"
    />
    <button
      @click="sendMessage"
      class="ml-2 px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
    >
      点我发送
    </button>
  </div>
</template>

<script lang="ts" setup name="ChatInput">
import { ref } from 'vue';

const message = ref('');
const emit = defineEmits(['send']);

const sendMessage = () => {
  if (!message.value.trim()) return;
  emit('send', message.value);
  message.value = '';
};
</script>
