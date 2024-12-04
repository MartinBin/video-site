<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      videoFile: null as File | null,
      title: '',
      description: '',
      thumbnail: null as File | null,
      snippetTime: 0,
      videoDuration: 0,
      thumbnailPreview: null as string | null,
      uploadProgress: 0,
      isUploading: false,
      processingStatus: '',
      errorMessage: '',
    };
  },
  methods: {
    onFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const maxSizeInBytes = 500 * 1024 * 1024; // 500 MB

        if (file.size > maxSizeInBytes) {
          this.errorMessage = 'File size exceeds 500 MB limit.';
          this.videoFile = null;
        } else {
          this.errorMessage = '';
          this.videoFile = file;
          this.getVideoDuration();
        }
      }
    },
    onThumbnailChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        this.thumbnail = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.thumbnailPreview = reader.result as string;
        };
        reader.readAsDataURL(this.thumbnail);
      }
    },
    getVideoDuration() {
      if (!this.videoFile) return;
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(this.videoFile);
      videoElement.onloadedmetadata = () => {
        this.videoDuration = videoElement.duration;
      };
    },
    async handleUpload() {
      if (!this.videoFile || !this.thumbnail) {
        alert('Both video and thumbnail files are required.');
        return;
      }

      this.isUploading = true;
      this.uploadProgress = 0;
      this.processingStatus = 'Uploading...';

      const formData = new FormData();
      formData.append('video', this.videoFile);
      formData.append('thumbnail', this.thumbnail);
      formData.append('title', this.title);
      formData.append('description', this.description);
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post('/videos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              this.uploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }
          },
        });
        this.processingStatus = 'Processing video...';
        
        await this.checkProcessingStatus(response.data._id);

        console.log('Video uploaded successfully:', response.data);
        alert('Video uploaded successfully!');
        this.resetForm();
      } catch (error: any) {
        console.error('Error uploading video:', error.response ? error.response.data : error.message);
        alert('Error uploading video. Please try again.');
      } finally {
        this.isUploading = false;
      }
    },

    async checkProcessingStatus(videoId: string) {
      // Poll the backend every 5 seconds to check processing status
      while (true) {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`/videos/${videoId}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.data.status === 'completed') {
          break;
        } else if (response.data.status === 'failed') {
          throw new Error('Video processing failed');
        }

        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    },
    resetForm() {
      this.videoFile = null;
      this.title = '';
      this.description = '';
      this.thumbnail = null;
      this.snippetTime = 0;
      this.thumbnailPreview = null;
    }
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-4 bg-white mt-16 rounded-md shadow-2xl">
    <h2 class="text-3xl font-semibold text-center mb-8">Upload Your Video</h2>

    <form @submit.prevent="handleUpload" class="space-y-6">

      <div>
        <label for="videoFile" class="block text-sm font-medium text-gray-700">Select Video</label>
        <input
          type="file"
          id="videoFile"
          ref="videoFile"
          accept="video/*"
          @change="onFileChange"
          class="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
        <p v-if="videoFile" class="mt-2 text-sm text-gray-600">{{ videoFile.name }}</p>
        <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
      </div>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Video Title</label>
        <input
          type="text"
          id="title"
          v-model="title"
          placeholder="Enter the title of your video"
          class="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Video Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Enter a short description of your video"
          class="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows="4"
        ></textarea>
      </div>

      <div>
        <label for="thumbnail" class="block text-sm font-medium text-gray-700">Upload Thumbnail or Select Snippet</label>

        <input
          type="file"
          id="thumbnail"
          ref="thumbnail"
          accept="image/*"
          @change="onThumbnailChange"
          class="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div v-if="thumbnail && thumbnailPreview" class="mt-2">
          <img :src="thumbnailPreview" alt="Thumbnail Preview" class="w-32 h-32 object-cover rounded-md" />
        </div>

        <div v-if="videoFile && !thumbnail" class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Select Snippet for Thumbnail</label>
          <input
            type="range"
            v-model="snippetTime"
            min="0"
            :max="videoDuration"
            step="1"
            class="mt-2 w-full h-2 bg-gray-200 rounded-md"
          />
          <div class="mt-2 text-sm text-gray-600">Choose a time in the video (seconds): {{ Math.round(snippetTime) }}</div>
        </div>
      </div>

      <div
        class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <p class="text-center mt-2">Uploading: {{ uploadProgress }}%</p>
      </div>

      <div class="flex justify-center">
        <button
          type="submit"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :disabled="isUploading"
        >
          {{ isUploading ? 'Uploading...' : 'Upload Video' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
