<template>
  <button
    @click="toogleTheme"
    class="px-4 py-2 rounded-lg cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:from-gray-700 dark:to-purple-500 dark:hover:from-gray-800 dark:hover:to-purple-700 transition-colors duration-200"
  >
    {{ themeMode }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const theme = ref('light');
const themeMode = ref('☀️ 明亮模式');

const toogleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  themeMode.value = theme.value === 'light' ? '☀️ 明亮模式' : '🌙 暗黑模式';
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme.value);
};

onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'light';
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark');
    themeMode.value = '🌙 暗黑模式';
  }
});
</script>
