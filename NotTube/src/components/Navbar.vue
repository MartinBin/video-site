<template>
  <header class="bg-white p-4 fixed w-full top-0 left-0 z-50">
    <nav class="container mx-auto flex justify-between" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">NotTube</span>
          <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="NotTube logo" />
        </a>
        <a href="/" class="ml-4 hidden lg:inline-block text-sm font-semibold leading-6 text-gray-900">Home</a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <!-- Show Log Out and Upload if authenticated -->
        <div v-if="auth.isAuthenticated">
          <router-link
            to="/upload-video"
            custom
            v-slot="{ navigate }"
          >
            <button @click="navigate" class="px-2 text-sm font-semibold leading-6 text-gray-900 ml-4 hover:text-red-600">
              Upload
            </button>
          </router-link>
          <button @click="logout" class="px-2 text-sm font-semibold leading-6 text-gray-900 hover:text-red-600">
            Log out
          </button>
        </div>
        <!-- If not authenticated, show Log In -->
        <div v-else>
          <a href="/login" class="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="/" class="-m-1.5 p-1.5">
            <span class="sr-only">NotTube</span>
            <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="NotTube logo" />
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a href="/" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Home</a>
            </div>
            <div class="py-6">
              <!-- Show Log Out and Upload if authenticated -->
              <div v-if="auth.isAuthenticated">
                <router-link
                  to="/upload-video"
                  custom
                  v-slot="{ navigate }"
                >
                <button @click="navigate" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Upload
                </button>
                </router-link>
                <button @click="logout" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Log out
                </button>
              </div>
              <!-- If not authenticated, show Log In -->
              <div v-else>
                <a href="/login" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>



<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import router from '@/router';
import {
  Dialog,
  DialogPanel,
} from '@headlessui/vue';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/authStore'; // Adjust the path as necessary

const auth = useAuthStore();

const mobileMenuOpen = ref(false);

const logout = async () => {
  try {
    await axios.post('auth/logout', {}, { withCredentials: true });

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    auth.logout();
    //await router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
</script>

