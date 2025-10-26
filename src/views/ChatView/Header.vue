<template>
  <div
    class="py-4 px-6 bg-white transition-colors duration-200 dark:bg-gray-800 shadow-md flex justify-between items-center"
  >
    <div class="flex items-center">
      <img :src="logoImage" alt="logo" class="w-8 h-8" />
    </div>
    <h1
      class="text-lg font-semibold text-gray-900 dark:text-white absolute left-1/2 transform -translate-x-1/2"
    >
      Chat
    </h1>
    <div class="flex items-center space-x-4 ml-auto">
      <button
        @click="handleLogout"
        class="rounded-lg px-4 py-2 text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-900"
      >
        Logout
      </button>
      <ThemeButton
        class="rounded-lg px-4 py-2 text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-900"
      />
    </div>
  </div>
</template>

<script lang="ts" setup name="Header">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import logoImage from '@/assets/logo.jpg';
import ThemeButton from '@/components/ThemeButton.vue';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>
