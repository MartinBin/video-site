<template>
  <div class="container mx-auto p-6 mt-16">
    <div v-if="loading">Loading...</div>
    <div v-else-if="profile" class="bg-white shadow-md rounded-lg p-6">
      <!-- Profile Header -->
      <div class="flex items-center space-x-4 mb-6">
        <!--<div class="h-20 w-20 rounded-full bg-gray-300"></div>-->
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ profile.username }}</h2>
          <p class="text-sm text-gray-600" :title="subscriberTooltip">
            Subscribers: {{ profile.subscribers.length }}
          </p>
          <!-- Subscribe / Unsubscribe Buttons -->
          <button v-if="userId!==user.userId && !profile.subscribers.some(subscriber => subscriber.userId===user.userId) && auth.isAuthenticated" @click="subscribeToUser" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Subscribe
          </button>
          <button v-if="profile.subscribers.some(subscriber => subscriber.userId===user.userId) && auth.isAuthenticated" @click="unsubscribeToUser" class="mt-4 bg-red-500 text-white py-2 px-4 rounded">
            Unsubscribe
          </button>
          <!-- Edit Profile Button
          <button v-if="userId === user.userId" @click="showEditProfileModal = true" class="mt-4 bg-yellow-500 text-white py-2 px-4 rounded">
            Edit Profile
          </button>-->
          <!-- Delete Account Button -->
          <button v-if="userId === user.userId" @click="showDeleteModal = true" class="mt-4 bg-red-600 text-white py-2 px-4 rounded">
            Delete Account
          </button>
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
                :src="apiUrl + item.thumbnail"
              >
            </div>
            <h3 class="font-bold text-black px-4 pb-2">{{ item.title }}</h3>
            <p class="text-sm text-black px-4">{{ item.description }}</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal
    <div v-if="showEditProfileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Edit Profile</h3>
        <form @submit.prevent="updateProfile">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Username</label>
            <input v-model="profile.username" type="text" class="w-full border rounded p-2">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Bio</label>
            <textarea v-model="profile.bio" class="w-full border rounded p-2" rows="3"></textarea>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="showEditProfileModal = false" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
          </div>
        </form>
      </div>
    </div> -->

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg">
        <h3 class="text-xl font-bold mb-4">Confirm Deletion</h3>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="showDeleteModal = false" class="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button @click="deleteAccount()" class="bg-red-500 text-white px-4 py-2 rounded">Delete Account</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import router from "@/router";
import { useRoute } from "vue-router";
import { type Video } from '@/types'

const user = useUserStore();
const profile = ref<Profile>();
const videos = ref<Video[]>([]);
const loading = ref(true);
const auth = useAuthStore();
const showDeleteModal = ref(false);

const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000');

interface Profile {
  _id: string;
  username: string;
  email: string;
  subscribers:[{
    userId: string,
    username: string,
  }];
  subscribed: string[];
  isEditing: boolean;
}

const subscriberTooltip = computed(() => {
  return profile.value?.subscribers.slice(0, 3).join(', ') || '';
});

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

const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await getUserVideos();
    showDeleteModal.value = false;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    auth.logout();
    user.logout();
    await router.push('/login');
  } catch (error) {
    console.error('Error deleting video:', error);
  }
};

const openVideo= (id: string) =>{
  router.push(`/video/${id}`);
};

const subscribeToUser = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response=await axios.post(`/users/${userId}/subscribe`,
        {
          headers: { Authorization: `Bearer ${token}` }
        });
    profile.value?.subscribers.push(response.data);
  } catch (error) {
    console.error('Error subscribing to user:', error);
  }
};

const unsubscribeToUser = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response=await axios.post(`/users/${userId}/unsubscribe`,
        {
          headers: { Authorization: `Bearer ${token}` }
        });
    const unsubscribedUserId = response.data.userId;

    const index = profile.value?.subscribers.findIndex(
      (subscriber) => subscriber.userId === unsubscribedUserId
    );

    if (index !== undefined && index !== -1) {
      profile.value?.subscribers.splice(index, 1);
    } else {
      console.error("Subscriber not found in the list");
    }
  } catch (error) {
    console.error('Error unsubscribing to user:', error);
  }
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
