<template>
    <div class="max-w-2xl w-fit mx-auto lg:mt-16 mt-9 ">
        <video
        :src="apiUrl + video.url"
        controls
        autoplay
        class="w-full h-auto shadow-lg mb-4"
        style="object-fit: contain;"
        ></video>
      <h1 class="text-2xl font-bold mb-2 text-black">{{ video.title }}</h1>
      <h1 class="text-sm font-bold mb-2 text-black"><a :href='`/user/${video.userId}`'>{{ username }}</a></h1>
        <!---<div class="flex items-center space-x-4">
            <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Like</button>
            <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Dislike</button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Share</button>
        </div>-->
      <div v-if="video.description!=''" class="md:container md:mx-auto bg-gray-400 rounded-md p-3">
        <p class="text-white mb-4" v-html="formatContent(video.description)"></p>
      </div>
        <div class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Comments ({{ comments.length }})</h2>
            <form v-if="auth.isAuthenticated" @submit.prevent="addComment" class="mt-4">
                <textarea v-model="newComment" placeholder="Add a comment..." class="w-full border rounded-lg p-2" rows="3"></textarea>
                <button type="submit" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post Comment</button>
            </form>
            <div v-for="comment in comments" :key="comment._id" class="border-b border-gray-300 py-2">
              <div class="flex justify-between items-center">
                <p class="font-bold">{{ comment.userDisplayName }}</p>
                <div class="flex space-x-2">
                  <PencilSquareIcon
                    v-if="comment.userId === user.userId"
                    @click="enableEdit(comment)"
                    class="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700"
                  />
                  <TrashIcon
                    v-if="comment.userId === user.userId"
                    @click="confirmDelete(comment)"
                    class="h-5 w-5 text-gray-500 cursor-pointer hover:text-red-600"
                  />
                </div>
              </div>
              <div v-if="comment.isEditing">
                  <textarea
                    v-model="comment.content"
                    class="w-full border rounded-lg p-2 mt-2"
                    rows="3"
                  ></textarea>
                <div class="flex space-x-2 mt-2">
                  <button @click="saveEdit(comment)" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Save
                  </button>
                  <button @click="cancelEdit(comment)" class="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </div>
              <p v-else class="text-gray-700" v-html="formatContent(comment.content)"></p>
              <div v-if="auth.isAuthenticated" class="flex items-center space-x-2 mt-1">
                <button v-if="!userHasLiked(comment)"
                  @click="likeComment(comment)"
                  class="text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <HandThumbUpIcon class="h-4 w-4" />
                  <span>Like ({{ comment.likesCount }})</span>
                </button>
                <button v-else
                  @click="unlikeComment(comment)"
                  class="text-red-600 hover:underline flex items-center space-x-1"
                >
                  <HandThumbDownIcon class="h-4 w-4" />
                  <span>Like ({{ comment.likesCount }})</span>
                </button>
              </div>
              <div v-else class="flex items-center space-x-2 mt-1">
                <div
                  class="text-blue-600 flex items-center space-x-1"
                >
                  <HandThumbUpIcon class="h-4 w-4" />
                  <span>Like ({{ comment.likesCount }})</span>
                </div>
              </div>
            </div>
        </div>
    </div>

  <ConfirmationDialog
    :show="confirmationDialog.show"
    title="Delete Comment"
    message="Are you sure you want to delete this comment? This action cannot be undone."
    @cancel="cancelDelete"
    @confirm="deleteComment(confirmationDialog.comment!)"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import {useAuthStore} from "@/stores/authStore";
  import DOMPurify from 'dompurify';
  import router from "@/router";
  import { PencilSquareIcon, TrashIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/vue/24/outline'
  import {useUserStore} from "@/stores/userStore";
  import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
  const apiUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000');
  const confirmationDialog = ref({
    show: false,
    comment: null as Comment | null,
  });
  const route = useRoute();
  const videoId = route.params.id as string;

  const video = ref<{ title: string; description: string; url: string; userId: string; comments?: Comment[] }>({
    title: '',
    description: '',
    url: '',
    userId: '',
  });
  const username = ref<string>('');
  const comments = ref<Comment[]>([]);
  const newComment = ref<string>('');
  const auth = useAuthStore();
  const user=useUserStore();

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

  const userHasLiked = (comment: Comment): boolean =>{
    if (!comment.likes || comment.likes.length === 0) {
      return false;
    }
    return comment.likes.some(liked => liked.userId === user.userId);
  }

  interface Like{
    _id: string;
    userId: string;
    userDisplayName: string;
  }

  interface Comment {
    _id: string;
    content: string;
    userDisplayName: string;
    likesCount: number;
    likes: Like[];
    userId:string;
    isEditing: boolean;
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
    } catch (error: any) {
      console.error('Error fetching video data:', error);
      if(error.code === "ERR_BAD_REQUEST" || error.status === 404){
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
          userId: response.data.userId,
          isEditing: false
        });

        newComment.value = '';
      }
    } catch (error: unknown) {
      console.error('Error creating comment:', error);
    }
  };

  const likeComment = async (comment: Comment) => {
    try{
      const token = localStorage.getItem("access_token");
      const response = await  axios.post(`videos/${videoId}/comments/${comment._id}/likes`, {},{headers: { Authorization: `Bearer ${token}` }})
      const foundComment = comments.value.find(x => x._id === comment._id);
      if (foundComment) {
        foundComment.likesCount += 1;
        foundComment.likes.push({ _id: response.data.likes._id, userId: response.data.likes.userId, userDisplayName: response.data.likes.userDisplayName });
      }
    } catch(error: unknown) {
      console.error('Error adding like to comment:', error);
    }
  }

  const unlikeComment = async (comment: Comment) => {
    try{
      const like = comment.likes.find(liked=> liked.userId===user.userId)
      if(like){
        const token = localStorage.getItem("access_token");
        const response = await  axios.delete(`videos/${videoId}/comments/${comment._id}/likes/${like._id}`,{headers: { Authorization: `Bearer ${token}` }})
        const foundComment = comments.value.find(x => x._id === comment._id);
        if (foundComment) {
          foundComment.likesCount -= 1;
          foundComment.likes = foundComment.likes.filter(liked => liked.userId !== user.userId);
        }
      }
    } catch(error: unknown) {
      console.error('Error removing like to comment:', error);
    }
  }

  const enableEdit = (comment: Comment) => {
    comments.value.forEach(c => c.isEditing = false);
    comment.isEditing = true;
  };

  const saveEdit = async (comment: Comment) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `videos/${videoId}/comments/${comment._id}`,
        { content: comment.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      comment.content = response.data.content;
      comment.isEditing = false;
    } catch (error: unknown) {
      console.error('Error saving edited comment:', error);
    }
  };

  const cancelEdit = (comment: Comment) => {
    comment.isEditing = false;
  };


  const confirmDelete = (comment: Comment) => {
    confirmationDialog.value.show = true;
    confirmationDialog.value.comment = comment;
  };

  const cancelDelete = () => {
    confirmationDialog.value.show = false;
    confirmationDialog.value.comment = null;
  };

  const deleteComment = async (comment: Comment) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`videos/${videoId}/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      comments.value = comments.value.filter(c => c._id !== comment._id);
      cancelDelete();
    } catch (error: unknown) {
      console.error('Error deleting comment:', error);
    }
  };

</script>
