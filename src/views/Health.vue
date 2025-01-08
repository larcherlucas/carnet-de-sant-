<script setup lang="ts">
import { ref } from 'vue'
import { usePetStore } from '@/stores/pet'
import { PlusIcon, HeartPulseIcon } from 'lucide-vue-next'
import type { HealthRecord } from '@/types'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import HealthForm from '@/components/health/HealthForm.vue'
import HealthList from '@/components/health/HealthList.vue'

const petStore = usePetStore()
const showForm = ref(false)
const editingRecord = ref<HealthRecord | null>(null)

const handleSubmit = (record: HealthRecord) => {
  if (editingRecord.value) {
    petStore.updateHealthRecord(editingRecord.value.id, record)
  } else {
    petStore.addHealthRecord(record)
  }
  closeForm()
}

const handleEdit = (record: HealthRecord) => {
  editingRecord.value = record
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingRecord.value = null
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-3">
          <HeartPulseIcon class="text-primary-600" :size="28" />
          <h1 class="text-2xl font-bold text-primary-700">Santé</h1>
        </div>
        <Button
          v-if="!showForm"
          @click="showForm = true"
          class="flex items-center space-x-2 btn-primary animate-bounce-in"
        >
          <PlusIcon :size="20" />
          <span>Ajouter un événement</span>
        </Button>
      </div>

      <div class="grid gap-6">
        <Card
          v-if="showForm"
          class="animate-slide-up transform hover:scale-[1.02] transition-transform duration-300"
        >
          <HealthForm
            :initial-data="editingRecord"
            @submit="handleSubmit"
            @cancel="closeForm"
          />
        </Card>

        <Card
          v-else
          class="animate-bounce-in"
        >
          <HealthList
            :records="petStore.currentHealthRecords"
            @edit="handleEdit"
            @delete="petStore.deleteHealthRecord"
          />
        </Card>
      </div>
    </div>
  </div>
</template>
