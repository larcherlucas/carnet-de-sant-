<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Vaccine } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import dayjs from 'dayjs'
import { usePetStore } from '@/stores/pet'

const petStore = usePetStore()
const props = defineProps<{
  initialData?: Vaccine
}>()

const formData = ref<Partial<Vaccine>>({
  name: props.initialData?.name || '',
  date: props.initialData?.date || dayjs().format('YYYY-MM-DD'),
  nextDate: props.initialData?.nextDate || '',
  description: props.initialData?.description || '',
  veterinarian: props.initialData?.veterinarian || '',
  petId: petStore.currentPetId || '' // Ajoutez l'ID de l'animal sélectionné
})

const emit = defineEmits<{
  (e: 'submit', vaccine: Vaccine): void
  (e: 'cancel'): void
}>()

const errors = ref({
  name: '',
  date: '',
  nextDate: '',
  veterinarian: ''
})

const validateForm = () => {
  errors.value = {
    name: !formData.value.name ? 'Le nom du vaccin est requis' : '',
    date: !formData.value.date ? 'La date est requise' : '',
    nextDate: !formData.value.nextDate ? 'La date du prochain rappel est requise' :
              dayjs(formData.value.nextDate).isBefore(formData.value.date) ? 'La date de rappel doit être postérieure à la date du vaccin' : '',
    veterinarian: !formData.value.veterinarian ? 'Le nom du vétérinaire est requis' : ''
  }

  return Object.values(errors.value).every(error => error === '')
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      id: props.initialData?.id || crypto.randomUUID(),
      ...formData.value
    } as Vaccine)
  }
}

const isEditMode = computed(() => !!props.initialData)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <Input
      v-model="formData.name"
      label="Nom du vaccin"
      placeholder="Entrez le nom du vaccin"
      :error="errors.name"
    />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        v-model="formData.date"
        label="Date du vaccin"
        type="date"
        :error="errors.date"
      />
      <Input
        v-model="formData.nextDate"
        label="Date du prochain rappel"
        type="date"
        :error="errors.nextDate"
      />
    </div>
    <Input
      v-model="formData.veterinarian"
      label="Vétérinaire"
      placeholder="Nom du vétérinaire"
      :error="errors.veterinarian"
    />
    <Input
      v-model="formData.description"
      label="Description"
      placeholder="Notes additionnelles"
    />
    <div class="flex justify-end space-x-4">
      <Button variant="secondary" type="button" @click="emit('cancel')">
        Annuler
      </Button>
      <Button
        :variant="isEditMode ? 'primary' : 'success'"
        type="submit"
      >
        {{ isEditMode ? 'Mettre à jour' : 'Enregistrer' }}
      </Button>
    </div>
  </form>
</template>
