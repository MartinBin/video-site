<template>
    <div class="max-w-2xl mx-auto p-4 mt-16">
        <video 
        :src="'http://localhost:3000' + video.url" 
        controls 
        autoplay
        class="w-full h-auto rounded-lg shadow-lg mb-4"
        style="object-fit: cover;"
        ></video>
        <h1 class="text-2xl font-bold mb-2 text-black">{{ username }}</h1>
        <h1 class="text-2xl font-bold mb-2 text-black">{{ video.title }}</h1>
        <!---<div class="flex items-center space-x-4">
            <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Like</button>
            <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Dislike</button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Share</button>
        </div>-->
        <p class="text-gray-600 mb-4">{{ video.description }}</p>

        <div class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Comments</h2>
            <form @submit.prevent="addComment" class="mt-4">
                <textarea v-model="newComment" placeholder="Add a comment..." class="w-full border rounded-lg p-2" rows="3"></textarea>
                <button type="submit" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post Comment</button>
            </form>
            <div v-for="comment in comments" :key="comment._id" class="border-b border-gray-300 py-2">
                <p class="font-bold">{{ comment.userDisplayName }}</p>
                <p class="text-gray-700">{{ comment.content }}</p>
                <div class="flex items-center space-x-2 mt-1">
                    <button @click="likeComment(comment)" class="text-blue-600 hover:underline">
                        Like ({{ comment.likesCount }})
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const video = ref({ title: '', description: '', url: '' });
  const username=ref('')

  const comments = ref([]);
    const newComment = ref('');
  
    onMounted(async () => {
    const videoId = route.params.id;
    try {
        const response = await axios.get(`videos/${videoId}`);
        video.value = response.data.foundVideo;
        username.value=response.data.userName;
        comments.value = response.data.foundVideo.comments || [];

        await Promise.all(comments.value.map(async (comment) => {
            const likeResponse = await axios.get(`videos/${videoId}/comments/${comment._id}/likes/count`);
            comment.likesCount = likeResponse.data.likesCount;
        }));
    } catch (error) {
        console.error('Error fetching video data:', error);
    }
});
  const addComment = () => {
    if (newComment.value.trim()) {
        comments.value.push({ id: comments.value.length + 1, userDisplayName: 'User', content: newComment.value });
        newComment.value = '';
    }
};
</script>