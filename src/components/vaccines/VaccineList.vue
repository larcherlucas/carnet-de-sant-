<script setup lang="ts">
import { computed } from 'vue'
import type { Vaccine } from '@/types'
import Button from '@/components/ui/Button.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')

const props = defineProps<{
  vaccines: Vaccine[]
}>()

const emit = defineEmits<{
  (e: 'edit', vaccine: Vaccine): void
  (e: 'delete', id: string): void
}>()

const sortedVaccines = computed(() => {
  return [...props.vaccines].sort((a, b) =>
    dayjs(a.nextDate).valueOf() - dayjs(b.nextDate).valueOf()
  )
})

const getVaccineStatus = (nextDate: string) => {
  const today = dayjs()
  const vaccineDate = dayjs(nextDate)

  if (vaccineDate.isBefore(today)) return 'En retard'
  if (vaccineDate.isSame(today, 'day')) return 'Aujourd\'hui'

  const daysUntilNextVaccine = vaccineDate.diff(today, 'day')
  return daysUntilNextVaccine <= 30 ? 'Bientôt' : 'À jour'
}

const getStatusColor = (status: string) => {
  const colors = {
    'En retard': 'text-red-600',
    'Aujourd\'hui': 'text-orange-600',
    'Bientôt': 'text-yellow-600',
    'À jour': 'text-green-600'
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="vaccine in sortedVaccines" :key="vaccine.id" class="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div class="space-y-2">
          <h3 class="font-semibold">{{ vaccine.name }}</h3>
          <p class="text-sm text-gray-600">
            Catégorie : {{ vaccine.category }}
          </p>
          <p class="text-sm text-gray-600">
            Fait le : {{ dayjs(vaccine.date).format('DD MMMM YYYY') }}
          </p>
          <p :class="['text-sm font-medium', getStatusColor(getVaccineStatus(vaccine.nextDate))]">
            À refaire le : {{ dayjs(vaccine.nextDate).format('DD MMMM YYYY') }}
            ({{ getVaccineStatus(vaccine.nextDate) }})
          </p>
        </div>
        <div class="space-x-2">
          <Button variant="secondary" size="sm" @click="emit('edit', vaccine)">
            Modifier
          </Button>
          <Button variant="danger" size="sm" @click="emit('delete', vaccine.id)">
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
