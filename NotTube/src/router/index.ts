import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import VideoDetail from '@/components/VideoDetail.vue';
import PageNotFound from '@/components/404Found.vue'
import VideoUpload from '@/components/VideoUpload.vue'
import UserProfile from '../components/UserPage.vue'
import UserDashboard from '../components/UserDashboard.vue';
import SearchResults from '../components/SearchResults.vue';
import AllUsers from '../components/AllUsers.vue';

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
    {
      name:'Page Not Found',
      path:'/:pathMatch(.*)*',
      component: PageNotFound
    },
    {
      name: 'Upload Video',
      path: '/upload-video',
      component: VideoUpload
    },
    {
      name: 'User Profile',
      path: '/user/:id',
      component: UserProfile,
      props: true,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: UserDashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults,
      props: (route) => ({ query: route.query.query }),
    },
    {
      path: '/users',
      name: 'All users',
      component: AllUsers,
      meta: { requiresAuth: true }
    }
  ]
})

export default router
