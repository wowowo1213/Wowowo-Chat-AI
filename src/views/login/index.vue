<template>
  <div class="min-h-screen relative">
    <ThemeButton class="absolute right-10 top-10" />

    <div
      class="min-h-screen flex items-center justify-center dark:bg-gray-900 transition-colors duration-200"
    >
      <div
        class="p-8 max-w-md rounded-lg bg-blue-400 dark:bg-gray-700 transition-colors duration-200"
      >
        <img :src="logoImg" alt="logo" class="mx-auto w-24 h-24 mb-4" />
        <h1
          class="text-2xl font-semibold mb-4 text-center dark:text-gray-200 transition-all duration-200"
        >
          欢迎来到WOWOWO CHAT AI😊
        </h1>
        <input
          type="text"
          class="w-full p-2 mb-2 rounded-lg focus:outline-none border text-gray-900 border-gray-300 bg-white dark:text-white dark:border-gray-600 dark:bg-gray-700 transition-colors duration-200"
          placeholder="Name"
          v-model="name"
        />
        <input
          type="email"
          class="w-full p-2 mb-2 rounded-lg focus:outline-none border text-gray-900 border-gray-300 bg-white dark:text-white dark:border-gray-600 dark:bg-gray-700 transition-all duration-200"
          placeholder="Email"
          v-model="email"
        />
        <button
          class="w-full p-2 rounded-lg font-medium cursor-pointer bg-blue-300 hover:bg-blue-500 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 transition-all duration-200"
          @click="handleLogin"
        >
          {{ loading ? 'Logging in..' : 'Start' }}
        </button>
        <p v-if="error" class="text-red-500 text-center mt-2 font-medium">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import axios from 'axios';
import ThemeButton from '@/components/ThemeButton.vue';
import logoImg from '@/assets/logo.jpg';

const router = useRouter();

const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!name.value.trim() || !email.value.trim()) {
    error.value = '请输入用户名和邮箱';
    return;
  }

  loading.value = true;
  error.value = '';

  router.push('/chat');

  // try {
  //   const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/user-login`, {
  //     name: name.value,
  //     email: email.value,
  //   });

  //   userStore.setUser({
  //     userId: data.userId,
  //     name: data.name,
  //   });

  //   router.push('/chat');
  // } catch (err) {
  //   error.value = '有地方出错了，请重新尝试';
  // } finally {
  //   loading.value = false;
  // }
};
</script>
