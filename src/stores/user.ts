import { defineStore } from 'pinia';

interface UserState {
  isUserLogin: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      isUserLogin: false,
    };
  },
  actions: {
    resetUserStore() {
      this.isUserLogin = false;
    },
  },
});
