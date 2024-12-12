<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow-md">
    <h3 
      v-if="title" 
      class="mb-4 text-lg font-semibold border-b pb-2"
    >
      {{ title }}
    </h3>
    <slot></slot>
  </div>
</template>