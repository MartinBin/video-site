<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import router from "@/router";
import { useUserStore } from '@/stores/userStore';
import {type User} from '@/types'
import axios from "axios";
import { useAuthStore } from '@/stores/authStore';

const users = ref<User[]>([])
const user = useUserStore();
const isAdmin = ref(user.roles.includes('admin'));
const userToDelete = ref<User | null>(null)
const loading = ref(true);
const showDeleteModal = ref(false);

const auth = useAuthStore();
const currentPage = ref(1);
const itemsPerPage = 5;

const paginatedUsers= computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return users.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(users.value.length / itemsPerPage);
});

const totalPagesArray = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

const setPage = (page: number) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const getUsers = async () => {
  try {
    const response = await axios.get('/users/all');
    users.value = response.data.sort((a:any, b:any) => a.username.localeCompare(b.username));
  } catch (e) {
    console.error('Error fetching user videos:', e);
  }
};

const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(`/users/${userToDelete.value!._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await getUsers();
    showDeleteModal.value = false;
    if(userToDelete.value!._id===user.userId){
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      auth.logout();
      user.logout();
      await router.push('/login');
    }
  } catch (error) {
    console.error('Error deleting video:', error);
  }
};

const confirmDelete = (user: any) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};


onMounted(async () => {
  if (!user.userId || !isAdmin.value) {
    router.push('/');
    return;
  }

  try {
    loading.value = true;
    await getUsers();
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else class="bg-white shadow-md rounded-lg p-4 sm:p-6">
      <h2 :class="'text-2xl font-bold mb-4 sm:mb-6'">
        All Users
      </h2>
      <div class="space-y-4 sm:space-y-6">
        <div v-for="userToShow in users" :key="userToShow._id"
             class="border rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start bg-gray-50">
          <div class="flex flex-col sm:flex-row sm:items-start sm:w-full">
            <div class="text-center sm:text-left sm:w-3/4">
              <a :href='`/user/`+userToShow._id'>
                <h3 class="font-semibold">{{ userToShow.username }}</h3>
                <p class="text-sm text-gray-600 truncate">{{ userToShow.email }}</p>
              </a>
            </div>
            <div class="flex mt-4 sm:mt-0 space-x-2 sm:w-1/4 sm:justify-end sm:ml-4">
              <button v-if="isAdmin || userToShow._id === user.userId"
                      @click="confirmDelete(userToShow)"
                      class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav class="flex justify-center sm:justify-start mt-4">
        <button @click.prevent="prevPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 text-sm rounded-l-md bg-gray-200 hover:bg-gray-300">
          Previous
        </button>
        <span v-for="page in totalPagesArray" :key="page"
              @click.prevent="setPage(page)"
              :class="{'bg-indigo-600 text-white': currentPage === page, 'bg-gray-200': currentPage !== page}"
              class="px-4 py-2 cursor-pointer">
          {{ page }}
        </span>
        <button @click.prevent="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 text-sm rounded-r-md bg-gray-200 hover:bg-gray-300">
          Next
        </button>
      </nav>
    </div>
  </div>
  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg">
      <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
      <p>Are you sure you want to delete this user?</p>
      <div class="flex justify-end space-x-2 mt-4">
        <button @click="showDeleteModal = false"
                class="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
        <button @click="deleteAccount()"
                class="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
