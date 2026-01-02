<template>
  <div
    class="min-h-screen w-0 xl:w-80 md:w-60 overflow-hidden flex flex-col justify-between border-r-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 transition-all duration-200"
  >
    <SiderbarHeader />
    <ChatHistory class="grow" />
    <UserInfo />
  </div>
</template>

<script setup lang="ts">
import SiderbarHeader from './SiderbarHeader.vue';
import ChatHistory from './ChatHistory.vue';
import UserInfo from './UserInfo.vue';
</script>
