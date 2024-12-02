<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
      <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
      <p class="text-gray-700 mt-2">{{ message }}</p>
      <div class="flex justify-end space-x-4 mt-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
});
</script>

<style scoped>

</style>
