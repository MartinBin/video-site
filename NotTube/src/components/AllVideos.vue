<template>
  <div class="mt-16 p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-if="loading" class="text-center">Loading videos...</div>
      <div
        v-for="item in items"
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
</template>

<script setup lang="ts">
    import axios from "axios";
    import { ref, onMounted } from 'vue';
    import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
    import { useRouter } from "vue-router";
    let items = ref([]);
    const loading = ref(true);
    const router = useRouter();

    const openVideo= (id: string) =>{
        router.push(`/video/${id}`);
    };

    onMounted(() => {
        axios.get('videos')
            .then(response => {
                items.value = response.data;
                loading.value = false;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                loading.value = false;
            });
    });
</script>
