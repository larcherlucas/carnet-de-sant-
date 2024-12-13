<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      <div class="text-center space-y-4">
        <div class="flex justify-center mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-16 w-16 text-green-500"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">Enregistrement réussi</h2>
        <p class="text-gray-600">Votre animal a été enregistré avec succès</p>
        <button 
          @click="closeModal"
          class="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const router = useRouter()

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  router.push('/')  // Navigate to home page
}

defineExpose({
  openModal,
  closeModal
})
</script>