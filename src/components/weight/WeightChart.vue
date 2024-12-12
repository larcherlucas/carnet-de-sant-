<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { WeightRecord } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
dayjs.locale('fr')

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  records: WeightRecord[]
}>()

const chartData = computed(() => {
  const sortedRecords = [...props.records].sort((a, b) => 
    dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
  )

  return {
    labels: sortedRecords.map(r => dayjs(r.date).format('DD MMM')),
    datasets: [{
      label: 'Poids (kg)',
      data: sortedRecords.map(r => r.weight),
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#4F46E5',
      pointHoverRadius: 8
    }]
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Poids (kg)'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `${context.parsed.y} kg`
      }
    }
  }
}

const hasEnoughData = computed(() => props.records.length > 1)
</script>

<template>
  <div class="h-[400px] w-full">
    <template v-if="hasEnoughData">
      <Line :data="chartData" :options="options" />
    </template>
    <div 
      v-else 
      class="flex h-full items-center justify-center text-gray-500"
    >
      Pas assez de données pour afficher un graphique
    </div>
  </div>
</template>