<template>
  <div class="container mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else class="bg-white shadow-md rounded-lg p-4 sm:p-6">
      <h2 :class="'text-2xl font-bold mb-4 sm:mb-6'">
        {{ isAdmin ? 'All Videos' : 'My Videos' }}
      </h2>
      <div class="space-y-4 sm:space-y-6">
        <div v-for="video in paginatedVideos" :key="video.userId._id"
             class="border rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start bg-gray-50">
          <a :href="`/video/` + video._id">
            <img
              :src="video.thumbnail ? apiUrl + video.thumbnail : 'default-thumbnail.jpg'"
              class="w-full sm:w-32 h-auto object-cover rounded mb-4 sm:mb-0 sm:mr-4"
              alt="Video thumbnail"
            />
          </a>
          <div class="flex flex-col sm:flex-row sm:items-start sm:w-full">
            <div class="text-center sm:text-left sm:w-3/4">
              <h3 class="font-semibold">{{ video.title }}</h3>
              <p class="text-sm text-gray-600 truncate">{{ video.description }}</p>
              <p class="text-sm text-gray-500">
                Uploaded by:
                <a :href="`/user/` + video.userId._id" class="text-indigo-500">
                  {{ video.userId.username }}
                </a>
              </p>
            </div>
            <div class="flex mt-4 sm:mt-0 space-x-2 sm:w-1/4 sm:justify-end sm:ml-4">
              <button v-if="video.userId._id === user.userId"
                      @click="editVideo(video)"
                      class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                Edit
              </button>
              <button v-if="isAdmin || video.userId._id === user.userId"
                      @click="confirmDelete(video)"
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

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Edit Video</h3>
          <form @submit.prevent="updateVideo">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Title</label>
              <input
                v-model="editingVideo!.title"
                type="text"
                class="w-full border rounded p-2"
              >
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Description</label>
              <textarea
                v-model="editingVideo!.description"
                class="w-full border rounded p-2"
                rows="3"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" @click="showEditModal = false"
                      class="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
          <p>Are you sure you want to delete this video?</p>
          <div class="flex justify-end space-x-2 mt-4">
            <button @click="showDeleteModal = false"
                    class="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button @click="deleteVideo()"
                    class="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useUserStore } from '@/stores/userStore';
  import router from "@/router";
  import { type Video } from '@/types'
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

  const user = useUserStore();
  const videos = ref<Video[]>([])
  const loading = ref(true);
  const showEditModal = ref(false);
  const showDeleteModal = ref(false);
  const editingVideo = ref<Video | null>(null)
  const videoToDelete = ref<Video | null>(null)
  const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  const isAdmin = ref(user.roles.includes('admin'));

  const currentPage = ref(1);
  const itemsPerPage = 5;

  const paginatedVideos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return videos.value.slice(start, start + itemsPerPage);
  });

  const totalPages = computed(() => {
    return Math.ceil(videos.value.length / itemsPerPage);
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

  const getUserVideos = async () => {
    try {
      const response = await axios.get(isAdmin.value ? `/videos` : `/users/${user.userId}/video`);
      videos.value = response.data.sort((a:any, b:any) => a.userId._id.localeCompare(b.userId._id)); // Sort by userId
    } catch (e) {
      console.error('Error fetching user videos:', e);
    }
  };

  const editVideo = (video: any) => {
    editingVideo.value = { ...video };
    showEditModal.value = true;
  };

  const confirmDelete = (video: any) => {
    videoToDelete.value = video;
    showDeleteModal.value = true;
  };

  const updateVideo = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `/videos/${editingVideo.value!._id}`,
        {
          title: editingVideo.value!.title,
          description: editingVideo.value!.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await getUserVideos();
      showEditModal.value = false;
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const deleteVideo = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`/videos/${videoToDelete.value!._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await getUserVideos();
      showDeleteModal.value = false;
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  onMounted(async () => {
    if (!user.userId) {
      router.push('/');
      return;
    }

    try {
      loading.value = true;
      await getUserVideos();
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      loading.value = false;
    }
  });
  </script>
