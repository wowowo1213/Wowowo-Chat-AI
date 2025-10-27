<template>
  <div class="relative flex items-center justify-between p-4">
    <img :src="logoImg" alt="logo" class="w-12 h-12" />
    <h1
      class="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold dark:text-white transition-all duration-200"
    >
      Wowowo Chat AI
    </h1>
    <div>
      <button
        class="mr-2 px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
        @click="handleLogout"
      >
        Logout
      </button>
      <ThemeButton />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import ThemeButton from '@/components/ThemeButton.vue';
import logoImg from '@/assets/logo.jpg';

const router = useRouter();

const handleLogout = () => {
  router.push('./');
};
</script>
