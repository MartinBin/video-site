<template>
  <header class="bg-white p-4 fixed w-full top-0 left-0 z-50">
    <nav class="container mx-auto flex justify-between" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="/" class="-m-1.5 p-1.5">
          <span class="sr-only">NotTube</span>
          <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="NotTube logo" />
        </a>
        <a href="/" class="ml-4 hidden lg:inline-flex items-center text-sm font-semibold leading-6 text-gray-900">
          <HomeIcon class="h-5 w-5 mr-1" />
          Home
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <div class="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
            @keyup.enter="performSearch(); mobileMenuOpen = false"
            class="border rounded-md px-2 py-1 w-full"
            style="height: 2rem;"
          />
          <MagnifyingGlassIcon
            @click="performSearch(); mobileMenuOpen = false"
            class="rounded-md hover:bg-blue-700 ml-2 cursor-pointer flex items-center justify-center"
            style="height: 2rem; width: 2rem; padding: 0; line-height: 1;"
          />
        </div>
        <div v-if="auth.isAuthenticated" class="flex space-x-4">
          <router-link v-if="user.roles.includes('admin')" to="/users" custom v-slot="{ navigate }">
            <button @click="navigate(); mobileMenuOpen = false" class="text-sm font-semibold leading-6 text-gray-900 hover:text-red-600">
              Users
            </button>
          </router-link>
          <router-link to="/dashboard" custom v-slot="{ navigate }">
            <button @click="navigate(); mobileMenuOpen = false" class="text-sm font-semibold leading-6 text-gray-900 hover:text-red-600">
              Dashboard
            </button>
          </router-link>
          <router-link to="/upload-video" custom v-slot="{ navigate }">
            <button @click="navigate(); mobileMenuOpen = false" class="text-sm font-semibold leading-6 text-gray-900 hover:text-red-600">
              Upload
            </button>
          </router-link>
          <router-link :to="`/user/${user.userId}`" custom v-slot="{ navigate }">
            <button @click="navigate(); mobileMenuOpen = false" class="text-sm font-semibold leading-6 text-gray-900 hover:text-red-600">
              Profile
            </button>
          </router-link>
          <button @click="logout(); mobileMenuOpen = false" class="text-sm font-semibold leading-6 text-gray-900 hover:text-red-600">
            Log out
          </button>
        </div>
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
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition-transform transform" :class="{ 'translate-x-0': mobileMenuOpen, 'translate-x-full': !mobileMenuOpen }">
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
              <router-link to="/" @click="mobileMenuOpen = false" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 flex items-center">
                <HomeIcon class="h-5 w-5 mr-2" />
                <span>Home</span>
              </router-link>
              <div class="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  v-model="searchQuery"
                  @keyup.enter="performSearch(); mobileMenuOpen = false"
                  class="border rounded-md px-2 py-1 w-full"
                  style="height: 2rem;"
                />
                <MagnifyingGlassIcon
                  @click="performSearch(); mobileMenuOpen = false"
                  class="rounded-md hover:bg-blue-700 ml-2 cursor-pointer flex items-center justify-center"
                  style="height: 2rem; width: 2rem; padding: 0; line-height: 1;"
                />
              </div>
            </div>
            <div class="py-6">
              <div v-if="auth.isAuthenticated">
                <router-link v-if="user.roles.includes('admin')" to="/users" @click="mobileMenuOpen = false" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Users
                </router-link>
                <router-link to="/dashboard" @click="mobileMenuOpen = false" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Dashboard
                </router-link>
                <router-link to="/upload-video" @click="mobileMenuOpen = false" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Upload
                </router-link>
                <router-link :to='`/user/${user.userId}`' @click="mobileMenuOpen = false" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Profile
                </router-link>
                <button @click="logout(); mobileMenuOpen = false" class="-mx-3 block w-full rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 text-left">
                  Log out
                </button>
              </div>
              <div v-else>
                <a href="/login" @click="mobileMenuOpen = false" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
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
import { useAuthStore } from '@/stores/authStore';
import {useUserStore} from "@/stores/userStore";
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const auth = useAuthStore();

const mobileMenuOpen = ref(false);
const user = useUserStore();
const searchQuery = ref('');
user.setUserInfo();
const isAdmin = ref(user.roles.includes('admin'));

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?query=${encodeURIComponent(searchQuery.value)}`);
  }
};
const logout = async () => {
  try {
    await axios.post('auth/logout', {}, { withCredentials: true });

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    auth.logout();
    user.logout();
    await router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
</script>

<style scoped>
.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>

