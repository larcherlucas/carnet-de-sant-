<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { HealthRecord } from '@/types'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  records: HealthRecord[]
}>()

const emit = defineEmits<{
  (e: 'edit', record: HealthRecord): void
  (e: 'delete', id: string): void
}>()

const TYPE_LABELS = {
  checkup: 'Visite de contrôle',
  incident: 'Incident',
  illness: 'Maladie'
} as const

const TYPE_COLORS = {
  checkup: 'bg-green-100 text-green-800',
  incident: 'bg-yellow-100 text-yellow-800',
  illness: 'bg-red-100 text-red-800'
} as const

const sortedRecords = computed(() => 
  [...props.records].sort((a, b) => 
    dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  )
)

const getTypeLabel = (type: keyof typeof TYPE_LABELS) => TYPE_LABELS[type]
const getTypeColor = (type: keyof typeof TYPE_COLORS) => TYPE_COLORS[type]
</script>

<template>
  <div class="space-y-4">
    <div 
      v-for="record in sortedRecords" 
      :key="record.id" 
      class="border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div class="flex justify-between items-start">
        <div class="space-y-2 flex-grow">
          <div class="flex items-center gap-2">
            <span 
              :class="['px-2 py-1 rounded-full text-xs font-medium', getTypeColor(record.type)]"
            >
              {{ getTypeLabel(record.type) }}
            </span>
            <span class="text-sm text-gray-600">
              {{ dayjs(record.date).format('DD/MM/YYYY') }}
            </span>
          </div>
          <h3 class="font-semibold">{{ record.title }}</h3>
          <p class="text-gray-600">{{ record.description }}</p>
          
          <template v-if="record.treatment || record.veterinarian">
            <div v-if="record.treatment" class="text-sm">
              <span class="font-medium">Traitement :</span> {{ record.treatment }}
            </div>
            <div v-if="record.veterinarian" class="text-sm text-gray-600">
              Vétérinaire : {{ record.veterinarian }}
            </div>
          </template>
        </div>
        
        <div class="flex flex-col space-y-2 ml-4">
          <Button variant="secondary" size="sm" @click="emit('edit', record)">
            Modifier
          </Button>
          <Button variant="danger" size="sm" @click="emit('delete', record.id)">
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>