<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WeightRecord } from '@/types'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import dayjs from 'dayjs'

const formData = ref<Partial<WeightRecord>>({
  date: dayjs().format('YYYY-MM-DD'),
  weight: undefined,
  notes: ''
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
    emit('submit', {
      id: crypto.randomUUID(),
      ...formData.value
    } as WeightRecord)
    resetForm()
  }
}

const resetForm = () => {
  formData.value = {
    date: dayjs().format('YYYY-MM-DD'),
    weight: undefined,
    notes: ''
  }
}

const minDate = computed(() => dayjs().subtract(1, 'year').format('YYYY-MM-DD'))
const maxDate = computed(() => dayjs().format('YYYY-MM-DD'))
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