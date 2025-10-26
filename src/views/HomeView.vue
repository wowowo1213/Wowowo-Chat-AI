<template>
  <div class="relative min-h-screen w-full">
    <button
      class="absolute right-10 top-10 rounded-lg px-4 py-2 text-white transition-colors duration-200 bg-blue-600 hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-900"
      @click="toggleTheme"
    >
      {{ theme === 'dark' ? '🌙 暗黑模式' : '☀️ 明亮模式' }}
    </button>
    <button
      class="text-black h-10 w-32 bg-blue-600 rounded-lg hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-900"
    >
      this is text
    </button>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white z-10">
      <div class="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <img :src="logoImage" alt="logo" class="mx-auto w-24 h-24 mb-4" />
        <h1 class="text-2xl font-semibold mb-4 text-center">欢迎来到WOWOWO AI CHAT!</h1>

        <input
          type="text"
          class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          placeholder="Name"
          v-model="name"
        />

        <input
          type="email"
          class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          placeholder="Email"
          v-model="email"
        />

        <button
          class="w-full p-2 bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-700"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? 'Logging in..' : 'Start' }}
        </button>

        <p v-if="error" class="text-red-400 text-center mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="HomeView">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import logoImage from '@/assets/logo.jpg';

const userStore = useUserStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');
const theme = ref('dark');

const toggleTheme = () => {
  if (theme.value === 'light') {
    theme.value = 'dark';
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    theme.value = 'light';
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = savedTheme;
    if (theme.value === 'dark') document.documentElement.classList.add('dark');
  } else {
    theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
});

const handleLogin = async () => {
  if (!name.value || !email.value) {
    error.value = '请输入用户名和邮箱';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/register-user`, {
      name: name.value,
      email: email.value,
    });

    userStore.setUser({
      userId: data.userId,
      name: data.name,
    });

    router.push('/chat');
  } catch (err) {
    error.value = 'Something went wrong. Please try again';
  } finally {
    loading.value = false;
  }
};
</script>
