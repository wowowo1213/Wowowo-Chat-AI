<template>
  <div class="py-4 px-6 bg-gray-800 shadow-md flex justify-between items-center">
    <img :src="logoImage" alt="logo" class="w-8 h-8">
    <h1 class="text-lg font-semibold">Chat</h1>
    <button @click="handleLogout" class="text-gray-400 hover:text-white">Logout</button>
  </div>
</template>

<script lang="ts" setup name="Header">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import logoImage from '@/assets/logo.png';

const userStore = useUserStore(); 
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
}
</script>