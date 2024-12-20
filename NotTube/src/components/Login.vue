<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import router from '@/router';
import { useAuthStore } from '../stores/authStore';
import {useUserStore} from '@/stores/userStore'

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('auth/login', {
          email: this.email,
          password: this.password,
        });

        const { accessToken, refreshToken } = response.data;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        const auth = useAuthStore();
        auth.setAuthData();
        const user = useUserStore();
        user.setUserInfo();

        console.log('Login successful');
        await router.push('/');
      } catch (error: any) {
        this.errorMessage = error.response?.data?.message || 'Login failed';
        console.error('Error during login:', error);
      }
    },
  },
});
</script>
<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-16">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" @submit.prevent="login" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" v-model="email" autocomplete="email" required=true class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <!--<div class="text-sm">
                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>-->
            </div>
            <div class="mt-2">
              <input id="password" name="password" type="password" v-model="password" autocomplete="current-password" required=true class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Not a user?
          {{ ' ' }}
          <a href="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register now</a>
        </p>
      </div>
    </div>
</template>
<style scoped>
.error {
  color: red;
}
</style>
