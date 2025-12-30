<template>
  <div class="min-h-screen min-w-250 flex dark:bg-gray-900 transition-all duration-200">
    <div><Siderbar /></div>

    <div v-if="isHome" class="grow">
      <ChatHome />
    </div>

    <div class="grow flex flex-col h-screen overflow-hidden">
      <ChatHeader />
      <ChatMessage />
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Siderbar from './siderbar/index.vue';
import ChatHome from './ChatHome.vue';
import ChatHeader from './ChatHeader.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

const isHome = ref(false);
</script>
