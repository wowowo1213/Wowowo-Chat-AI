import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/login/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/index.vue'),
    },
  ],
});

export default router;
