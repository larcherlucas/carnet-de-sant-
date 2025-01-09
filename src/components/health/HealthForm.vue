<script setup lang="ts">
import { computed } from 'vue'
import type { HealthRecord } from '@/types'
import { useForm } from '@/composables/useForm'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { usePetStore } from '@/stores/pet'

const petStore = usePetStore()
const props = defineProps<{
  initialData?: HealthRecord
}>()

// Définition des règles de validation
const validationSchema = {
  date: { required: true },
  type: { required: true },
  title: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500
  },
  treatment: {
    maxLength: 200,
    validator: (value: string) => !value || value.length <= 200 || 'Le traitement ne doit pas dépasser 200 caractères'
  },
  veterinarian: {
    maxLength: 100,
    validator: (value: string) => !value || value.length <= 100 || 'Le nom du vétérinaire ne doit pas dépasser 100 caractères'
  }
}

// Données initiales par défaut
const initialFormData: HealthRecord = {
  id: '',
  date: new Date().toISOString().split('T')[0],
  type: 'checkup',
  title: '',
  description: '',
  treatment: '',
  veterinarian: '',
  petId: petStore.currentPetId || '' // Ajoutez l'ID de l'animal sélectionné
}

// Utilisation du hook useForm
const {
  formData,
  errors,
  validate,
  reset
} = useForm<HealthRecord>(
  props.initialData
    ? { ...props.initialData, petId: petStore.currentPetId || '' } // Assurez-vous que l'ID de l'animal est inclus
    : { ...initialFormData, id: crypto.randomUUID() },
  validationSchema
)

const emit = defineEmits<{
  (e: 'submit', record: HealthRecord): void
  (e: 'cancel'): void
}>()

const handleSubmit = () => {
  if (validate()) {
    emit('submit', formData.value)
    reset()
  }
}

const healthTypes = [
  { value: 'checkup', label: 'Visite de contrôle' },
  { value: 'incident', label: 'Incident' },
  { value: 'illness', label: 'Maladie' }
]
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Input
          v-model="formData.date"
          label="Date"
          type="date"
          :error="errors.date?.[0]"
        />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Type</label>
        <select
          v-model="formData.type"
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          :class="{ 'border-red-500': errors.type?.length }"
        >
          <option
            v-for="type in healthTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
        <p v-if="errors.type?.length" class="text-red-500 text-xs mt-1">
          {{ errors.type[0] }}
        </p>
      </div>
    </div>

    <div>
      <Input
        v-model="formData.title"
        label="Titre"
        placeholder="Titre de l'événement"
        :error="errors.title?.[0]"
      />
    </div>

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="formData.description"
        rows="3"
        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Description détaillée"
        :class="{ 'border-red-500': errors.description?.length }"
      ></textarea>
      <p v-if="errors.description?.length" class="text-red-500 text-xs mt-1">
        {{ errors.description[0] }}
      </p>
    </div>

    <div>
      <Input
        v-model="formData.treatment"
        label="Traitement"
        placeholder="Traitement prescrit"
        :error="errors.treatment?.[0]"
      />
    </div>

    <div>
      <Input
        v-model="formData.veterinarian"
        label="Vétérinaire"
        placeholder="Nom du vétérinaire"
        :error="errors.veterinarian?.[0]"
      />
    </div>

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
