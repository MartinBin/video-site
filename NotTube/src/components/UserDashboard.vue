<template>
    <div class="container mx-auto p-6 mt-16">
      <div v-if="loading">Loading...</div>
      <div v-else class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6">My Videos</h2>

        <div class="grid grid-cols-1 gap-4">
          <div v-for="video in videos" :key="video._id"
               class="border rounded-lg p-4 flex justify-between items-center bg-gray-50">
            <div class="flex items-center space-x-4">
              <img
                :src="video.thumbnail ? apiUrl + video.thumbnail : 'default-thumbnail.jpg'"
                class="w-32 h-20 object-cover rounded"
                alt="Video thumbnail"
              />
              <div>
                <h3 class="font-semibold">{{ video.title }}</h3>
                <p class="text-sm text-gray-600">{{ video.description }}</p>
              </div>
            </div>

            <div class="flex space-x-2">
              <button @click="editVideo(video)"
                      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit
              </button>
              <button @click="confirmDelete(video)"
                      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
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
            <button @click="deleteVideo"
                    class="bg-red-500 text-white px-4 py-2 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useUserStore } from '@/stores/userStore';
  import router from "@/router";
  import { type Video } from '@/types'

  const user = useUserStore();
  const videos = ref<Video[]>([])
  const loading = ref(true);
  const showEditModal = ref(false);
  const showDeleteModal = ref(false);
  const editingVideo = ref<Video | null>(null)
  const videoToDelete = ref<Video | null>(null)
  const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  const getUserVideos = async () => {
    try {
      const response = await axios.get(`/users/${user.userId}/video`);
      videos.value = response.data;
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
      router.push('/login');
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
