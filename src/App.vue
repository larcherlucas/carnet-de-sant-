<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <main class="ml-64 p-8">
      <router-view></router-view>
    </main>
  </div>
</template>