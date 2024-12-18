<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePetStore } from '@/stores/pet'
import type { Pet } from '@/types'
import { validateForm, ValidationRule } from '@/utils/validation'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const petStore = usePetStore()

const validationSchema: Record<string, ValidationRule> = {
  name: { 
    required: true, 
    minLength: 2, 
    maxLength: 50 
  },
  breed: { 
    required: true, 
    minLength: 2, 
    maxLength: 50 
  },
  birthDate: { required: true },
  weight: { 
    required: true,
    validator: (value: any) => {
      // Convert to number and check if it's greater than 0
      const numValue = Number(value)
      return !isNaN(numValue) && numValue > 0 || 'Le poids doit être supérieur à 0'
    }
  },
  color: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  size: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  'owner.name': { 
    required: true, 
    minLength: 2, 
    maxLength: 100 
  },
  'owner.phone': { 
    required: true,
    pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    validator: (value: any) => {
      // Ensure value is a string and not empty
      const strValue = value?.toString().trim() || ''
      return strValue !== '' || 'Numéro de téléphone invalide'
    }
  },
  'owner.address': { 
    required: false,  
    minLength: 5,     
    maxLength: 200 
  }
}

// Données initiales par défaut
const initialFormData: Pet = {
  id: '', 
  name: '',
  breed: '',
  birthDate: '',
  weight: 0,
  color: '',
  size: '',
  photo: '', 
  owner: {
    name: '',
    phone: '',
    address: '' 
  }
}

const formData = ref<Pet>(petStore.pet ? { ...petStore.pet } : { ...initialFormData })
const errors = ref<Record<string, string[]>>({})

const emit = defineEmits<{
  (e: 'submit', pet: Pet): void
  (e: 'cancel'): void
}>()

// Computed property to ensure address is always a string
const ownerAddress = computed({
  get: () => formData.value.owner.address || '',
  set: (value: string) => {
    formData.value.owner.address = value
  }
})

const validate = () => {
  errors.value = validateForm(formData.value, validationSchema)
  
  // Check if there are any errors
  const hasErrors = Object.values(errors.value).some(errorList => errorList.length > 0)
  return !hasErrors
}

const handleSubmit = () => {
  // Trim the address and set to undefined if empty
  if (formData.value.owner.address?.trim() === '') {
    formData.value.owner.address = undefined
  }

  if (validate()) {
    emit('submit', formData.value)
    reset()
  }
}

const handleCancel = () => {
  emit('cancel')
  reset()
}

const reset = () => {
  formData.value = { ...initialFormData }
  errors.value = {}
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Input
        v-model="formData.name"
        label="Nom du chien"
        placeholder="Entrez le nom du chien"
        :error="errors.name?.[0]"
      />
      <Input
        v-model="formData.breed"
        label="Race"
        placeholder="Entrez la race"
        :error="errors.breed?.[0]"
      />
      <div>
        <Input
          v-model="formData.birthDate"
          label="Date de naissance"
          type="date"
          :error="errors.birthDate?.[0]"
        />
      </div>
      <Input
        v-model="formData.weight"
        label="Poids (kg)"
        type="number"
        step="0.1"
        :error="errors.weight?.[0]"
      />
      <Input
        v-model="formData.color"
        label="Couleur"
        placeholder="Entrez la couleur"
        :error="errors.color?.[0]"
      />
      <Input
        v-model="formData.size"
        label="Taille"
        placeholder="Entrez la taille"
        :error="errors.size?.[0]"
      />
    </div>

    <div class="space-y-4">
      <h4 class="text-lg font-medium">Informations du propriétaire</h4>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          v-model="formData.owner.name"
          label="Nom du propriétaire"
          placeholder="Entrez le nom du propriétaire"
          :error="errors['owner.name']?.[0]"
        />
        <Input
          v-model="formData.owner.phone"
          label="Téléphone"
          placeholder="Entrez le numéro de téléphone"
          :error="errors['owner.phone']?.[0]"
        />
        <Input
          v-model="ownerAddress"
          label="Adresse (Optionnel)"
          placeholder="Entrez l'adresse (facultatif)"
          class="md:col-span-2"
          :error="errors['owner.address']?.[0]"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <Button 
        variant="secondary" 
        type="button"
        @click="handleCancel"
      >
        Annuler
      </Button>
      <Button 
        variant="primary" 
        type="submit"
      >
        Enregistrer
      </Button>
    </div>
  </form>
</template>