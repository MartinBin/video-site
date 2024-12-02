<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">User Profile</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="h-20 w-20 rounded-full bg-gray-300"></div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ profile.username }}</h2>
        </div>
      </div>
      <h3 class="text-lg font-semibold mb-3">Uploaded Videos</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="video in user.videos"
          :key="video._id"
          class="bg-gray-100 rounded-lg shadow p-4"
        >
          <img
            :src="video.thumbnail"
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
import {useRoute} from "vue-router";

const user = useUserStore();
const profile = ref<Profile>();
interface Profile {
  _id: string;
  username: string;
  email: string;
  subscribers: number;
  subscribed:string;
  isEditing: boolean;
}
const route = useRoute();
const userId = route.params.id as string;


const fetchUserData = async () => {
  try {
    const response = await axios.get(`/user/${userId}`);
    profile.value=response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    if(error.code === "ERR_BAD_REQUEST" || error.status === 404){
      router.push("/404");
    }
  }
};

const getUserVideos = async () => {
  try{
    const response = await axios.get(`/user/${userId}/video`);
  }catch (e){

  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(() => {
  fetchUserData();
});
</script>
