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
  petId: petStore.currentPetId || '',
  category: props.initialData?.category || '' // Ajoutez cette ligne
})

const emit = defineEmits<{
  (e: 'submit', vaccine: Vaccine): void
  (e: 'cancel'): void
}>()

const errors = ref({
  name: '',
  date: '',
  nextDate: '',
  veterinarian: '',
  category: '' // Ajoutez cette ligne
})

const vaccineOptions = computed(() => {
  const petType = petStore.currentPet?.type
  switch (petType) {
    case 'dog':
      return [
        { name: 'Rage (Rabique) 🦠💉', category: 'dog' },
        { name: 'Carré (Distemper) 🐾', category: 'dog' },
        { name: 'Hépatite infectieuse 🩸', category: 'dog' },
        { name: 'Parvovirose 🧪', category: 'dog' },
        { name: 'Leptospirose 🌊', category: 'dog' },
        { name: 'Toux de chenil (Bordetella) 🐶🤧', category: 'dog' }
      ]
    case 'cat':
      return [
        { name: 'Rage 🦠💉', category: 'cat' },
        { name: 'Typhus (Panleucopénie féline) ⚡️', category: 'cat' },
        { name: 'Coryza 😿', category: 'cat' },
        { name: 'Leucose (FeLV) 🧬', category: 'cat' },
        { name: 'Chlamydiose 🧫', category: 'cat' }
      ]
    case 'rabbit':
      return [
        { name: 'Myxomatose 🌿', category: 'rabbit' },
        { name: 'Maladie virale hémorragique (VHD) 🩺', category: 'rabbit' }
      ]
    case 'horse':
      return [
        { name: 'Tétanos ⚔️', category: 'horse' },
        { name: 'Grippe équine 🤒', category: 'horse' },
        { name: 'Rhinopneumonie 🫁', category: 'horse' },
        { name: 'Rage 🦠💉', category: 'horse' },
        { name: 'Leptospirose 🌊', category: 'horse' }
      ]
    case 'cow':
      return [
        { name: 'Fièvre aphteuse 🔥', category: 'cow' },
        { name: 'Botulisme 💀', category: 'cow' },
        { name: 'Rage 🦠💉', category: 'cow' },
        { name: 'Colibacillose 🧫', category: 'cow' }
      ]
    case 'bird':
      return [
        { name: 'Maladie de Newcastle 💨', category: 'bird' },
        { name: 'Maladie de Marek 🧬', category: 'bird' },
        { name: 'Bronchite infectieuse 🫁', category: 'bird' },
        { name: 'Influenza aviaire 🦠', category: 'bird' }
      ]
    case 'pig':
      return [
        { name: 'Peste porcine 🐷💉', category: 'pig' },
        { name: 'Maladie d’Aujeszky 🧠', category: 'pig' },
        { name: 'Dysenterie porcine 💩', category: 'pig' },
        { name: 'Rouget du porc 🩸', category: 'pig' }
      ]
    case 'exotic':
      return [
        { name: 'Salmonellose 🧫', category: 'exotic' },
        { name: 'Herpesvirus 🦠', category: 'exotic' }
      ]
    default:
      return []
  }
})

const validateForm = () => {
  errors.value = {
    name: !formData.value.name ? 'Le nom du vaccin est requis' : '',
    date: !formData.value.date ? 'La date est requise' : '',
    nextDate: !formData.value.nextDate ? 'La date du prochain rappel est requise' :
              dayjs(formData.value.nextDate).isBefore(formData.value.date) ? 'La date de rappel doit être postérieure à la date du vaccin' : '',
    veterinarian: !formData.value.veterinarian ? 'Le nom du vétérinaire est requis' : '',
    category: !formData.value.category ? 'La catégorie est requise' : '' // Ajoutez cette ligne
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
    <Input
      v-model="formData.category"
      label="Catégorie"
      placeholder="Catégorie du vaccin"
      :error="errors.category"
    >
      <select v-model="formData.category" class="form-select">
        <option v-for="option in vaccineOptions" :key="option.name" :value="option.name">
          {{ option.name }}
        </option>
      </select>
    </Input>
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
