<script setup lang="ts"></script>

<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/chat">Chat</router-link>
    </nav>
    
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
