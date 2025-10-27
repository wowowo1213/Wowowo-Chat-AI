<template>
  <div
    class="py-4 px-6 border-b-2 border-gray-200 dark:border-gray-700 flex flex-col items-center transition-all duration-200"
  >
    <div class="w-full flex justify-between items-center transition-all duration-200">
      <h1 class="text-lg font-bold dark:text-white transition-all duration-200">Wowowo Chat AI</h1>
      <img :src="logoImg" alt="logo" class="h-10 w-10" />
    </div>

    <div class="mt-4 w-full flex justify-center">
      <button
        class="px-6 py-2 rounded-lg cursor-pointer text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-800 transition-all duration-200"
        @click="createNewDialog"
      >
        新建对话
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoImg from '@/assets/logo.jpg';

const createNewDialog = () => {
  console.log(222);
};
</script>
