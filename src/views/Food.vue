<script setup lang="ts">
import { ref } from 'vue'
import { usePetStore } from '@/stores/pet'
import type { FoodLog } from '@/types'
import { PlusIcon, UtensilsCrossedIcon } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import FoodForm from '@/components/food/FoodForm.vue'
import FoodList from '@/components/food/FoodList.vue'

const petStore = usePetStore()
const showForm = ref(false)
const editingLog = ref<FoodLog | null>(null)

const handleSubmit = (log: FoodLog) => {
  if (editingLog.value) {
    petStore.updateFoodLog(editingLog.value.id, log)
  } else {
    petStore.addFoodLog(log)
  }
  closeForm()
}

const handleEdit = (log: FoodLog) => {
  editingLog.value = log
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingLog.value = null
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-3">
          <UtensilsCrossedIcon class="text-primary-600" :size="28" />
          <h1 class="text-2xl font-bold text-primary-700">Alimentation</h1>
        </div>
        <Button 
          v-if="!showForm" 
          @click="showForm = true"
          class="flex items-center space-x-2 btn-primary animate-bounce-in"
        >
          <PlusIcon :size="20" />
          <span>Ajouter un repas</span>
        </Button>
      </div>

      <div class="grid gap-6">
        <Card 
          v-if="showForm" 
          class="animate-slide-up transform hover:scale-[1.02] transition-transform duration-300"
        >
          <FoodForm
            :initial-data="editingLog"
            @submit="handleSubmit"
            @cancel="closeForm"
          />
        </Card>

        <Card 
          v-else 
          class="animate-bounce-in"
        >
          <FoodList
            :logs="petStore.foodLogs"
            @edit="handleEdit"
            @delete="petStore.deleteFoodLog"
          />
        </Card>
      </div>
    </div>
  </div>
</template>