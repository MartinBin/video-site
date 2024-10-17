import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import VideoDetail from '@/components/VideoDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/video/:id',
      component: VideoDetail,
      props: true,
    },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
  ]
})

export default router
