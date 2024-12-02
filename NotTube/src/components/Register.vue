<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '', // Add confirmPassword as part of the data
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      try {
        const response = await axios.post('auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        await router.push('/login');
      } catch (error) {
        console.error('Error during registration:', error);
      }
    },
  },
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 py-12 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo -->
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      </div>

      <!-- Form -->
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
        <form class="space-y-6 mt-8" @submit.prevent="register">
          <div>
            <label for="username" class="block text-sm font-medium leading-6 text-gray-900">User name</label>
            <div class="mt-2">
              <input v-model="username" id="username" name="username" type="text" autocomplete="username" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Confirm your password</label>
            <div class="mt-2">
              <input v-model="confirmPassword" id="confirm-password" name="confirm-password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

