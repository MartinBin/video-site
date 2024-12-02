<template>
  <div class="container mx-auto p-6 mt-16">
    <div v-if="loading">Loading...</div>
    <div v-else-if="profile" class="bg-white shadow-md rounded-lg p-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="h-20 w-20 rounded-full bg-gray-300"></div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ profile.username }}</h2>
        </div>
      </div>
      <h3 class="text-lg font-semibold mb-3">Uploaded Videos</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="video in videos"
          :key="video._id"
          class="bg-gray-100 rounded-lg shadow p-4"
        >
          <img
            :src="'http://localhost:3000' + video.thumbnail"
            alt="Video thumbnail"
            class="w-full h-36 object-cover rounded mb-2"
          />
          <h4 class="text-sm font-semibold truncate">{{ video.title }}</h4>
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
import { useRoute } from "vue-router";

const user = useUserStore();
const profile = ref<Profile>();
const videos = ref([]);
const loading = ref(true);

interface Profile {
  _id: string;
  username: string;
  email: string;
  subscribers: number;
  subscribed: string;
  isEditing: boolean;
}

const route = useRoute();
const userId = route.params.id as string;

const getUserVideos = async () => {
  try {
    const response = await axios.get(`/users/${userId}/video`);
    videos.value = response.data;
  } catch (e) {
    console.error('Error fetching user videos:', e);
  }
}

onMounted(async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/users/${userId}`);
    profile.value = response.data;
    await getUserVideos();
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error.response?.status === 404 || error.response?.status === 400) {
      router.push("/404");
    }
  } finally {
    loading.value = false;
  }
});
</script>