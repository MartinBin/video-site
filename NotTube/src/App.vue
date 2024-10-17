```NotTube/src/App.vue
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div>
    <Navbar/>
    <router-view />
  </div>
</template>