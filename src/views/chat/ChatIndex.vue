<template>
  <div
    class="min-h-screen flex-1 min-w-full md:min-w-200 lg:min-w-230 xl:min-w-250 flex dark:bg-gray-900 transition-all duration-200"
  >
    <div><Siderbar /></div>

    <div v-if="isHome" class="grow">
      <ChatHome />
    </div>

    <div class="flex grow flex-col h-screen overflow-hidden">
      <ChatHeader />
      <ChatMessage />
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Siderbar from './siderbar/SiderbarIndex.vue';
import ChatHome from './ChatHome.vue';
import ChatHeader from './ChatHeader.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

const isHome = ref(false);
</script>
