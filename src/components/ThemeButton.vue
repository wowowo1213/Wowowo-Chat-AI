<template>
  <button
    @click="toogleTheme"
    class="px-4 py-2 rounded-lg cursor-pointer text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200"
  >
    {{ themeMode }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const theme = ref('light');
const themeMode = ref('☀️ 明亮模式');

const toogleThemeMode = () => {
  if (theme.value === 'light') {
    themeMode.value = '☀️ 明亮模式';
  } else if (theme.value === 'dark') {
    themeMode.value = '🌙 暗黑模式';
  }
};

const toogleTheme = () => {
  if (theme.value === 'light') {
    theme.value = 'dark';
    toogleThemeMode();
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme.value === 'dark') {
    theme.value = 'light';
    toogleThemeMode();
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    theme.value = savedTheme;
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark');
      toogleThemeMode();
    }
  }
});
</script>
