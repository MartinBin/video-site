<template>
  <div class="mt-16 p-4">
    <h2 class="text-2xl font-bold mb-6">Searched for "{{ query }}"</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-if="loading" class="text-center">Loading videos...</div>
      <div
        v-for="item in results"
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { type Video } from '@/types'

const route = useRoute();
const query = ref<string>(route.query.query ? String(route.query.query) : '');
const results = ref<Video[]>([]);
const loading = ref(true);
const router = useRouter();
const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    const openVideo= (id: string) =>{
        router.push(`/video/${id}`);
    };

  const performSearch = async () => {
  if (query.value.trim()) {
    loading.value = true;
    try {
      const response = await axios.get(`videos/search?query=${encodeURIComponent(query.value)}`);
      results.value = response.data;
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      loading.value = false;
    }
  }
};

watch(() => route.query.query, (newQuery) => {
  query.value = typeof newQuery === 'string' ? newQuery : '';
  performSearch();
}, { immediate: true });
</script>