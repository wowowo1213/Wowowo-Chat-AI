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
        class="mr-4 px-4 py-2 rounded-lg cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:from-gray-700 dark:to-purple-500 dark:hover:from-gray-800 dark:hover:to-purple-700 transition-colors duration-200"
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
import { useUserStore } from '@/stores/user';
import ThemeButton from '@/components/ThemeButton.vue';
import logoImg from '@/assets/logo.jpg';

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.resetUserStore();
  router.push('/');
};
</script>
