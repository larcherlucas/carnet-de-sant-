<script setup lang="ts">
import { computed } from 'vue'
import type { FoodLog } from '@/types'
import Button from '@/components/ui/Button.vue'
import dayjs from 'dayjs'

const props = defineProps<{
  logs: FoodLog[]
}>()

const emit = defineEmits<{
  (e: 'edit', log: FoodLog): void
  (e: 'delete', id: string): void
}>()

const sortedLogs = computed(() => {
  return [...props.logs].sort((a, b) => 
    dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  )
})

const getMealLabel = (type: string) => {
  const types = {
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    dinner: 'Dîner',
    snack: 'Collation'
  }
  return types[type as keyof typeof types]
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="log in sortedLogs" :key="log.id" 
         class="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ getMealLabel(log.type) }}</span>
            <span class="text-sm text-gray-600">
              {{ dayjs(log.date).format('DD/MM/YYYY') }}
            </span>
          </div>
          <p>
            {{ log.food }} - {{ log.quantity }} {{ log.unit }}
          </p>
          <p v-if="log.notes" class="text-sm text-gray-600">
            {{ log.notes }}
          </p>
        </div>
        <div class="space-x-2">
          <Button variant="secondary" size="sm" @click="emit('edit', log)">
            Modifier
          </Button>
          <Button variant="danger" size="sm" @click="emit('delete', log.id)">
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>