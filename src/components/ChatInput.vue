<template>
  <div class="p-4 bg-gray-800 flex">
    <input
      v-model="message"
      placeholder="请输入问题"
      @keyup.enter="sendMessage"
      type="text"
      class="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
    />
    <button @click="sendMessage" class="ml-2 px-4 py-2 bg-blue-500 rounded-lg">点我发送</button>
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
