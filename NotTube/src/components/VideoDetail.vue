<template>
    <div class="max-w-2xl w-fit mx-auto lg:mt-16 mt-9 ">
        <video
        :src="'http://localhost:3000' + video.url"
        controls
        autoplay
        class="w-full h-auto shadow-lg mb-4"
        style="object-fit: contain;"
        ></video>
      <h1 class="text-2xl font-bold mb-2 text-black">{{ video.title }}</h1>
      <h1 class="text-sm font-bold mb-2 text-black"><a href="">{{ username }}</a></h1>
        <!---<div class="flex items-center space-x-4">
            <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Like</button>
            <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Dislike</button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Share</button>
        </div>-->
      <div class="md:container md:mx-auto bg-gray-400 rounded-md p-3">
        <p class="text-white mb-4" v-html="formatContent(video.description)"></p>
      </div>
        <div class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Comments ({{ comments.length }})</h2>
            <form v-if="auth.isAuthenticated" @submit.prevent="addComment" class="mt-4">
                <textarea v-model="newComment" placeholder="Add a comment..." class="w-full border rounded-lg p-2" rows="3"></textarea>
                <button type="submit" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post Comment</button>
            </form>
            <div v-for="comment in comments" :key="comment._id" class="border-b border-gray-300 py-2">
                <p class="font-bold">{{ comment.userDisplayName }}</p>
                <p class="text-gray-700" v-html="formatContent(comment.content)"></p>
                <div v-if="auth.isAuthenticated" class="flex items-center space-x-2 mt-1">
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
  import {useAuthStore} from "@/stores/authStore";
  import DOMPurify from 'dompurify';
  import router from "@/router";

  const route = useRoute();
  const videoId = route.params.id as string;

  const video = ref<{ title: string; description: string; url: string; comments?: Comment[] }>({
    title: '',
    description: '',
    url: '',
  });
  const username = ref<string>('');
  const comments = ref<Comment[]>([]);
  const newComment = ref<string>('');
  const auth = useAuthStore();

  const formatContent = (content: string): string => {
    if (!content) return '';

    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const sanitizedDescription = DOMPurify.sanitize(content);
    const linkedDescription = sanitizedDescription.replace(
      urlRegex,
      (url) => `<a href="${url}" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Replace newlines with <br>
    return linkedDescription.replace(/\n/g, '<br>');
  };

  interface Comment {
    _id: string;
    content: string;
    userDisplayName: string;
    likesCount: number;
  }

  onMounted(async () => {
    try {
      const response = await axios.get(`videos/${videoId}`);
      video.value = response.data.foundVideo;
      username.value = response.data.userName;
      comments.value = response.data.foundVideo.comments || [];

      for (const comment of comments.value) {
        const likeResponse = await axios.get(
          `videos/${videoId}/comments/${comment._id}/likes/count`
        );
        comment.likesCount = likeResponse.data.likesCount;
      }
    } catch (error: unknown) {
      console.error('Error fetching video data:', error);
      if(error.code === "ERR_BAD_REQUEST"){
        router.push("/404");
      }
    }
  });

  const addComment = async () => {
    try {
      if (newComment.value.trim()) {
        const token = localStorage.getItem("access_token");
        const response = await axios.post(`videos/${videoId}/comments`, {
          content: newComment.value,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        comments.value.push({
          _id: response.data._id,
          userDisplayName: response.data.userDisplayName,
          content: response.data.content,
          likesCount: 0,
        });

        newComment.value = '';
      }
    } catch (error: unknown) {
      console.error('Error creating comment:', error);
    }
  };

</script>
