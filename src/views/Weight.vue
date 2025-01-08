<script setup lang="ts">
import { ref } from 'vue'
import { usePetStore } from '@/stores/pet'
import { PlusIcon, ScaleIcon } from 'lucide-vue-next'
import type { WeightRecord } from '@/types'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import WeightChart from '@/components/weight/WeightChart.vue'
import WeightForm from '@/components/weight/WeightForm.vue'

const petStore = usePetStore()
const showForm = ref(false)

const handleSubmit = (record: WeightRecord) => {
  if (petStore.currentPetId) {
    if (!petStore.weightHistory[petStore.currentPetId]) {
      petStore.weightHistory[petStore.currentPetId] = []
    }
    petStore.addWeightRecord(record)
    showForm.value = false
  } else {
    console.warn('Aucun animal sélectionné')
  }
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-3">
          <ScaleIcon class="text-primary-600" :size="28" />
          <h1 class="text-2xl font-bold text-primary-700">Suivi du poids</h1>
        </div>
        <Button
          v-if="!showForm && petStore.currentPetId"
          @click="showForm = true"
          class="flex items-center space-x-2 btn-primary animate-bounce-in"
        >
          <PlusIcon :size="20" />
          <span>Ajouter une pesée</span>
        </Button>
      </div>

      <div class="grid gap-6">
        <Card class="animate-bounce-in delay-100">
          <WeightChart :records="petStore.currentWeightHistory" />
        </Card>

        <Card
          v-if="showForm"
          class="animate-slide-up transform hover:scale-[1.02] transition-transform duration-300"
        >
          <WeightForm
            @submit="handleSubmit"
            @cancel="showForm = false"
          />
        </Card>
      </div>
    </div>
  </div>
</template>