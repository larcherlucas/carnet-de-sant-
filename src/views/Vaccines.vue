<script setup lang="ts">
import { ref } from 'vue'
import { usePetStore } from '@/stores/pet'
import type { Vaccine } from '@/types'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import VaccineForm from '@/components/vaccines/VaccineForm.vue'
import VaccineList from '@/components/vaccines/VaccineList.vue'

const petStore = usePetStore()
const showForm = ref(false)
const editingVaccine = ref<Vaccine | null>(null)

const handleSubmit = (vaccine: Vaccine) => {
  if (editingVaccine.value) {
    petStore.updateVaccine(editingVaccine.value.id, vaccine)
  } else {
    petStore.addVaccine(vaccine)
  }
  closeForm()
}

const handleEdit = (vaccine: Vaccine) => {
  editingVaccine.value = vaccine
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingVaccine.value = null
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Vaccins</h1>
      <Button v-if="!showForm" variant="primary" @click="showForm = true">
        Ajouter un vaccin
      </Button>
    </div>

    <Card v-if="showForm">
      <VaccineForm
        :initial-data="editingVaccine"
        @submit="handleSubmit"
        @cancel="closeForm"
      />
    </Card>

    <Card v-else>
      <VaccineList
        :vaccines="petStore.currentVaccines"
        @edit="handleEdit"
        @delete="petStore.deleteVaccine"
      />
    </Card>
  </div>
</template>
