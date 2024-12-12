<script setup lang="ts">
import { usePetStore } from '@/stores/pet'
import { UserIcon } from 'lucide-vue-next'
import PetForm from '@/components/forms/PetForm.vue'
import Card from '@/components/ui/Card.vue'
import type { Pet } from '@/types'

const petStore = usePetStore()

const handleSubmit = (pet: Pet) => {
  petStore.setPet(pet)
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center space-x-3 mb-6">
        <UserIcon class="text-primary-600" :size="28" />
        <h1 class="text-2xl font-bold text-primary-700">Profil de l'animal</h1>
      </div>
      
      <Card class="animate-bounce-in transform hover:scale-[1.01] transition-transform duration-300">
        <PetForm 
          @submit="handleSubmit" 
          class="space-y-6"
        />
      </Card>
    </div>
  </div>
</template>