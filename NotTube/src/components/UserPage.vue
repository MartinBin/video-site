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
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-if="loading" class="text-center">Loading videos...</div>
        <div
          v-for="item in videos"
          :key="item._id"
          class="shadow-2xl bg-gray-200 pb-4 rounded-lg border-gray-300 border"
        >
          <button class="w-full text-left" @click="openVideo(item._id)">
            <div class="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg">
              <img
                v-if="item.thumbnail == null"
                class="absolute inset-0 w-full h-full object-cover"
                src="https://www.yeoandyeo.com/wp-content/uploads/07_02_21_1253437873_AAB_560x292.jpg"
              >
              <img
                v-else
                class="absolute inset-0 w-full h-full object-cover"
                :src="'http://localhost:3000' + item.thumbnail"
              >
            </div>
            <h3 class="font-bold text-black px-4 pb-2">{{ item.title }}</h3>
            <p class="text-sm text-black px-4">{{ item.description }}</p>
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
import { useRoute } from "vue-router";
import { type Video } from '@/types'

const user = useUserStore();
const profile = ref<Profile>();
const videos = ref<Video[]>([]);
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

const openVideo= (id: string) =>{
  router.push(`/video/${id}`);
};

onMounted(async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/users/${userId}`);
    profile.value = response.data;
    await getUserVideos();
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    if (error.response?.status === 404 || error.response?.status === 400) {
      router.push("/404");
    }
  } finally {
    loading.value = false;
  }
});
</script>
