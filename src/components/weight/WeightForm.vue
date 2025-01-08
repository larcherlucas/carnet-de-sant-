<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WeightRecord } from '@/types'
import { useForm } from '@/composables/useForm'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { usePetStore } from '@/stores/pet'

const petStore = usePetStore()
const formData = ref<Partial<WeightRecord>>({
  date: new Date().toISOString().split('T')[0],
  weight: undefined,
  notes: '',
  petId: petStore.currentPetId || '' // Ajoutez l'ID de l'animal sélectionné
})

const emit = defineEmits<{
  (e: 'submit', record: WeightRecord): void
  (e: 'cancel'): void
}>()

const errors = ref({
  date: '',
  weight: ''
})

const validateForm = () => {
  errors.value = {
    date: !formData.value.date ? 'La date est requise' : '',
    weight: !formData.value.weight ? 'Le poids est requis' :
            (formData.value.weight as number) <= 0 ? 'Le poids doit être supérieur à zéro' : ''
  }

  return Object.values(errors.value).every(error => error === '')
}

const handleSubmit = () => {
  if (validateForm()) {
    const record = {
      id: crypto.randomUUID(),
      ...formData.value
    } as WeightRecord

    // Stocker le poids dans le localStorage
    const storedWeights = JSON.parse(localStorage.getItem('weights') || '[]')
    storedWeights.push(record)
    localStorage.setItem('weights', JSON.stringify(storedWeights))

    emit('submit', record)
    resetForm()
  }
}

const resetForm = () => {
  formData.value = {
    date: new Date().toISOString().split('T')[0],
    weight: undefined,
    notes: '',
    petId: petStore.currentPetId || '' // Réinitialisez l'ID de l'animal sélectionné
  }
}

const minDate = computed(() => new Date().toISOString().split('T')[0])
const maxDate = computed(() => new Date().toISOString().split('T')[0])
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        v-model="formData.date"
        label="Date"
        type="date"
        :error="errors.date"
        :min="minDate"
        :max="maxDate"
      />
      <Input
        v-model="formData.weight"
        label="Poids (kg)"
        type="number"
        step="0.1"
        :error="errors.weight"
      />
    </div>
    <Input
      v-model="formData.notes"
      label="Notes"
      placeholder="Notes additionnelles"
    />
    <div class="flex justify-end space-x-4">
      <Button variant="secondary" type="button" @click="emit('cancel')">
        Annuler
      </Button>
      <Button variant="primary" type="submit">
        Enregistrer
      </Button>
    </div>
  </form>
</template>
