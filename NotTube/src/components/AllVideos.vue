<template>
  <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <div v-if="loading" class="text-center">Loading videos...</div>
    <div v-for="item in items" :key="item._id" class="bg-gray-100 p-4">
        <button class="w-full text-left" @click="openVideo(item._id)">
            <h3 class="font-bold text-black">{{ item.title }}</h3>
            <p class="text-sm text-black">{{ item.description }}</p>
      </button>
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
        axios.get('http://localhost:3000/api/videos')
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
