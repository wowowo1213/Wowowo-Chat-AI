<template>
  <button @click="toggleTheme">
    {{ theme === 'dark' ? '🌙 暗黑模式' : '☀️ 明亮模式' }}
  </button>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

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
</script>
