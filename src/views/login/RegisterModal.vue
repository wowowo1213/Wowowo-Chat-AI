<template>
  <div
    v-if="isRegisterModalShow"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-100"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
      <h2 class="text-xl font-semibold mb-4 dark:text-gray-200">注册账号</h2>

      <form @submit.prevent="handleRegister">
        <input
          :disabled="loading"
          type="text"
          class="w-full p-2 mb-2 rounded-lg border text-gray-900 bg-white dark:text-white dark:bg-gray-700 border-black-300 dark:border-gray-400 pr-10 focus:border-black-400 dark:focus:border-gray-300 focus:ring-1 focus:ring-black-400 dark:focus:ring-gray-300 focus:outline-none"
          placeholder="手机号"
          v-model="phoneNumber"
        />

        <div class="relative mb-2">
          <input
            :disabled="loading"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="w-full p-2 rounded-lg border text-gray-900 bg-white dark:text-white dark:bg-gray-700 border-black-300 dark:border-gray-400 pr-10 focus:border-black-400 dark:focus:border-gray-300 focus:ring-1 focus:ring-black-400 dark:focus:ring-gray-300 focus:outline-none"
            placeholder="密码"
            v-model="password"
          />

          <button
            type="button"
            @click="showPassword = !showPassword"
            class="cursor-pointer absolute flex items-center justify-center right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white"
          >
            <el-icon :size="20" v-if="showPassword"><View /></el-icon>
            <el-icon :size="20" v-else><Hide /></el-icon>
          </button>
        </div>

        <div class="relative mb-4">
          <input
            :disabled="loading"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            class="w-full p-2 rounded-lg border text-gray-900 bg-white dark:text-white dark:bg-gray-700 border-black-300 dark:border-gray-400 pr-10 focus:border-black-400 dark:focus:border-gray-300 focus:ring-1 focus:ring-black-400 dark:focus:ring-gray-300 focus:outline-none"
            placeholder="确认密码"
            v-model="confirmPassword"
          />

          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="cursor-pointer absolute flex items-center justify-center right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white"
          >
            <el-icon :size="20" v-if="showConfirmPassword"><View /></el-icon>
            <el-icon :size="20" v-else><Hide /></el-icon>
          </button>
        </div>

        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="close"
            class="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            取消
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>
      </form>

      <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
  isRegisterModalShow: Boolean,
});

const emit = defineEmits(['close', 'register-success']);

const phoneNumber = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const close = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  phoneNumber.value = '';
  password.value = '';
  confirmPassword.value = '';
  error.value = '';
  loading.value = false;
  showPassword.value = false;
  showConfirmPassword.value = false;
};

const handleRegister = async () => {
  if (!phoneNumber.value.trim()) {
    error.value = '请输入手机号';
    return;
  } else if (!password.value.trim()) {
    error.value = '请输入密码';
    return;
  } else if (!confirmPassword.value.trim()) {
    error.value = '请输入确认密码';
    return;
  } else if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/userinfo/register`, {
      phoneNumber: phoneNumber.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    emit('register-success');
    close();
  } catch (err: any) {
    if (Array.isArray(err.response?.data?.message)) {
      error.value = err.response?.data?.message[0] || '注册失败，网络出问题啦~';
    } else {
      error.value = err.response?.data?.message || '注册失败，网络出问题啦~';
    }
  } finally {
    loading.value = false;
  }
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
