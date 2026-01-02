<template>
  <div
    class="hidden md:block md:w-50 lg:w-70 border-r-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 transition-all duration-200"
  >
    <div class="min-h-screen w-full flex flex-col justify-between">
      <SiderbarHeader />
      <ChatHistory class="grow" />
      <UserInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import SiderbarHeader from './SiderbarHeader.vue';
import ChatHistory from './ChatHistory.vue';
import UserInfo from './UserInfo.vue';
</script>
