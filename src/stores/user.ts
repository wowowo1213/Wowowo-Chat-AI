import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const isUserLogin = ref(false);

  function resetUserStore() {
    isUserLogin.value = false;
  }

  return {
    isUserLogin,
    resetUserStore,
  };
});
