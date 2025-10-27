<template>
  <div class="min-h-screen min-w-250 flex dark:bg-gray-900 transition-all duration-200">
    <div><Siderbar /></div>

    <!-- <div v-if="isHome" class="flex-grow"> -->
    <!-- <ChatHome /> -->
    <!-- </div> -->

    <div class="flex-grow flex flex-col justify-between">
      <ChatHeader />
      <ChatMessage class="flex-grow" />
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Siderbar from './siderbar/index.vue';
// import ChatHome from './ChatHome.vue';
import ChatHeader from './ChatHeader.vue';
import ChatMessage from './ChatMessage.vue';
import ChatInput from './ChatInput.vue';

// const isHome = ref(true);
</script>
