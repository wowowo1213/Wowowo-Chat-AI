<template>
  <div class="min-h-screen relative">
    <ThemeButton class="absolute right-10 top-10" />

    <div class="min-h-screen flex items-center justify-center dark:bg-gray-900">
      <div class="p-8 max-w-md rounded-lg bg-blue-400 dark:bg-gray-700">
        <img :src="logoImg" alt="logo" class="mx-auto w-24 h-24 mb-4" />
        <h1 class="text-2xl font-semibold mb-4 text-center dark:text-gray-200">
          欢迎来到WOWOWO CHAT AI😊
        </h1>

        <form @submit.prevent="handleLogin">
          <input
            type="text"
            class="w-full p-2 mb-2 rounded-lg border text-gray-900 border-gray-300 bg-white dark:text-white dark:border-gray-600 dark:bg-gray-700"
            placeholder="手机号"
            v-model="phoneNumber"
          />

          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="w-full p-2 mb-4 rounded-lg border text-gray-900 border-gray-300 bg-white dark:text-white dark:border-gray-600 dark:bg-gray-700 pr-10"
              placeholder="密码"
              v-model="password"
            />

            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
            >
              <img
                :src="showPassword ? eyeOpen : eyeClose"
                alt="toggle password"
                class="w-5 h-5 rounded-full"
              />
            </button>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full p-2 rounded-lg font-medium cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:from-gray-700 dark:to-purple-500 dark:hover:from-gray-800 dark:hover:to-purple-700 text-white disabled:opacity-50"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <p v-if="error" class="text-red-500 dark:text-red-700 mt-2 text-center">{{ error }}</p>

        <p v-if="isRegister" class="text-gray-600 dark:text-gray-300 mt-2 text-center">
          注册成功，请登录
        </p>

        <div class="mt-4 text-center">
          <button
            @click="showRegisterModal = true"
            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
          >
            没有账号？立即注册
          </button>
        </div>
      </div>
    </div>

    <RegisterModal
      :isOpen="showRegisterModal"
      @close="showRegisterModal = false"
      @register-success="handleRegisterSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ThemeButton from '@/components/ThemeButton.vue';
import RegisterModal from '@/components/RegisterModal.vue';
import logoImg from '@/assets/logo.jpg';
import eyeOpen from '@/assets/eye-open.png';
import eyeClose from '@/assets/eye-close.png';

const router = useRouter();
const phoneNumber = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const showRegisterModal = ref(false);
const isRegister = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  isRegister.value = false;

  if (!phoneNumber.value.trim() || !password.value.trim()) {
    error.value = '手机号和密码不能为空';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/userinfo/login`, {
      phoneNumber: phoneNumber.value,
      password: password.value,
    });

    if (response.data) {
      router.push('/chat');
    }
  } catch (err: any) {
    if (Array.isArray(err.response?.data?.message)) {
      error.value = err.response?.data?.message[0] || '登录失败';
    } else {
      error.value = err.response?.data?.message || '登录失败';
    }
  } finally {
    loading.value = false;
  }
};

const handleRegisterSuccess = () => {
  phoneNumber.value = '';
  password.value = '';
  isRegister.value = true;
  error.value = '';
};
</script>

<style scoped>
/* 隐藏原生密码图标 */
:deep(input[type='password']),
:deep(input[type='text']) {
  &::-webkit-contacts-auto-fill-button,
  &::-webkit-credentials-auto-fill-button {
    display: none;
  }

  &::-ms-reveal {
    display: none;
  }
}
</style>
