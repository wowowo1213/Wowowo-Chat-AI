<template>
  <div class="flex flex-col min-h-screen items-center justify-center">
    <h1 class="mb-10 text-xl font-bold dark:text-white transition-all duration-200">
      欢迎来到Wowowo Chat AI!
    </h1>
    <img :src="logoImg" alt="logo" class="max-h-190 max-w-190" />
  </div>
</template>

<script setup lang="ts">
import logoImg from '@/assets/logo.jpg';
</script>
