<template>
  <div class="min-h-screen flex dark:bg-gray-900 transition-colors duration-200">
    <div><Siderbar /></div>

    <div class="flex-grow">
      <ChatHeader />
      <ChatMessage />
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeader from './ChatHeader.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';
import Siderbar from './siderbar/index.vue';
</script>
