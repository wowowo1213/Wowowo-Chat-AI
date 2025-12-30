import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },

    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/ChatIndex.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// 先注释掉
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isUserLogin) {
    next({ name: 'login' });
  } else if (to.name === 'login' && userStore.isUserLogin) {
    next({ name: 'chat' });
  } else {
    next();
  }
});

export default router;
