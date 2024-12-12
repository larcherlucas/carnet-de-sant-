<script setup lang="ts">
import { computed } from 'vue'
import type { FoodLog } from '@/types'
import { useForm } from '@/composables/useForm'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const props = defineProps<{
  initialData?: FoodLog
}>()

// Définition des règles de validation
const validationSchema = {
  date: { required: true },
  type: { required: true },
  food: { 
    required: true, 
    minLength: 2, 
    maxLength: 100 
  },
  quantity: { 
    required: true, 
    validator: (value: number) => value > 0 || 'La quantité doit être supérieure à 0'
  },
  unit: { required: true },
  notes: { 
    maxLength: 500,
    validator: (value: string) => !value || value.length <= 500 || 'Les notes ne doivent pas dépasser 500 caractères'
  }
}

// Données initiales par défaut
const initialFormData: FoodLog = {
  id: '',
  date: new Date().toISOString().split('T')[0],
  type: 'breakfast',
  food: '',
  quantity: 0,
  unit: 'g',
  notes: ''
}

// Utilisation du hook useForm
const { 
  formData, 
  errors, 
  validate, 
  reset 
} = useForm<FoodLog>(
  props.initialData 
    ? { ...props.initialData } 
    : { ...initialFormData, id: crypto.randomUUID() }, 
  validationSchema
)

const emit = defineEmits<{
  (e: 'submit', log: FoodLog): void
  (e: 'cancel'): void
}>()

const handleSubmit = () => {
  if (validate()) {
    emit('submit', formData.value)
    reset()
  }
}

const mealTypes = [
  { value: 'breakfast', label: 'Petit déjeuner' },
  { value: 'lunch', label: 'Déjeuner' },
  { value: 'dinner', label: 'Dîner' },
  { value: 'snack', label: 'Collation' }
]

const unitTypes = [
  { value: 'g', label: 'Grammes' },
  { value: 'kg', label: 'Kilogrammes' },
  { value: 'portion', label: 'Portion' }
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
        <label class="block text-sm font-medium text-gray-700">Repas</label>
        <select
          v-model="formData.type"
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          :class="{ 'border-red-500': errors.type?.length }"
        >
          <option 
            v-for="type in mealTypes" 
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
        v-model="formData.food"
        label="Aliment"
        placeholder="Type d'aliment"
        :error="errors.food?.[0]"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <Input
          v-model="formData.quantity"
          label="Quantité"
          type="number"
          step="0.1"
          :error="errors.quantity?.[0]"
        />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Unité</label>
        <select
          v-model="formData.unit"
          class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          :class="{ 'border-red-500': errors.unit?.length }"
        >
          <option 
            v-for="unit in unitTypes" 
            :key="unit.value" 
            :value="unit.value"
          >
            {{ unit.label }}
          </option>
        </select>
        <p v-if="errors.unit?.length" class="text-red-500 text-xs mt-1">
          {{ errors.unit[0] }}
        </p>
      </div>
    </div>

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Notes</label>
      <textarea
        v-model="formData.notes"
        rows="2"
        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Notes additionnelles"
        :class="{ 'border-red-500': errors.notes?.length }"
      ></textarea>
      <p v-if="errors.notes?.length" class="text-red-500 text-xs mt-1">
        {{ errors.notes[0] }}
      </p>
    </div>

    <div class="flex justify-end space-x-4">
      <Button variant="secondary" type="button" @click="$emit('cancel')">
        Annuler
      </Button>
      <Button variant="primary" type="submit">
        Enregistrer
      </Button>
    </div>
  </form>
</template>