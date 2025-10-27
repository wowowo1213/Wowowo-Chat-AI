<template>
  <div
    class="min-h-screen w-80 flex flex-col justify-between border-r-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 transition-all duration-200"
  >
    <SiderbarHeader />
    <ChatHistory class="flex-grow" />
    <UserInfo />
  </div>
</template>

<script setup lang="ts">
import SiderbarHeader from './components/SiderbarHeader.vue';
import ChatHistory from './components/ChatHistory.vue';
import UserInfo from './components/UserInfo.vue';
</script>
