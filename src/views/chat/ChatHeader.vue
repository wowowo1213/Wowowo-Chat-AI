<template>
  <div class="relative flex items-center justify-between p-4">
    <img :src="logoImg" alt="logo" class="w-12 h-12" />
    <h1
      class="display-none sm:block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 text-sm lg:text-md font-bold dark:text-white transition-colors duration-200"
    >
      Wowowo Chat AI
    </h1>
    <div>
      <button
        class="mr-4 px-4 py-2 rounded-lg cursor-pointer text-sm lg:text-md text-white bg-blue-500 0 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
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
