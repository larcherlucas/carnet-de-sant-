<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePetStore } from '@/stores/pet'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ShieldCheck, Heart, Weight, PawPrint } from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const petStore = usePetStore()
const selectedPetId = ref(petStore.currentPetId || '')

// Récupérer les poids du localStorage lors du chargement de la page
const storedWeights = ref(JSON.parse(localStorage.getItem('weights') || '[]'))
watch(storedWeights, (newWeights) => {
  newWeights.forEach((weight: WeightRecord) => {
    petStore.addWeightRecord(weight)
  })
}, { immediate: true })

watch(selectedPetId, (newPetId) => {
  petStore.setCurrentPet(newPetId)
})

const weightData = computed(() => {
  if (petStore.currentWeightHistory.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: 'Poids (kg)',
        data: [],
        borderColor: 'rgba(93, 83, 243, 0.8)',
        backgroundColor: 'rgba(93, 83, 243, 0.1)',
        tension: 0.4
      }]
    }
  }

  const sortedWeights = [...petStore.currentWeightHistory].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return {
    labels: sortedWeights.map(record => format(new Date(record.date), 'dd MMM', { locale: fr })),
    datasets: [{
      label: 'Poids (kg)',
      data: sortedWeights.map(record => record.weight),
      borderColor: 'rgba(93, 83, 243, 0.9)',
      backgroundColor: 'rgba(93, 83, 243, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(93, 83, 243, 1)',
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'rgba(93, 83, 243, 1)',
      tension: 0.4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(93, 83, 243, 0.9)',
      bodyColor: 'white',
      titleColor: 'white'
    },
    title: { display: false }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(93, 83, 243, 0.05)',
        borderDash: [5, 5]
      },
      border: {
        dash: [5, 5]
      }
    },
    x: {
      grid: { display: false },
      border: { display: false }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Pet Header -->
      <div v-if="petStore.currentPet" class="bg-white shadow-medium rounded-2xl p-6 flex items-center space-x-6 border-l-4 border-primary animate-slide-up">
        <div class="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center hover:rotate-12 transition-transform duration-300">
          <PawPrint :size="48" class="text-primary" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-primary-700">{{ petStore.currentPet.name }}</h1>
          <p class="text-secondary">{{ petStore.currentPet.breed }} • {{ formatDate(petStore.currentPet.birthDate) }}</p>
        </div>
      </div>

      <!-- Pet Selector -->
      <div class="mb-6">
        <label for="pet-select" class="block text-sm font-medium text-gray-700">Sélectionnez un animal :</label>
        <select id="pet-select" v-model="selectedPetId" class="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
          <option v-for="pet in petStore.pets" :key="pet.id" :value="pet.id">{{ pet.name }}</option>
        </select>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Vaccinations Section -->
        <div class="md:col-span-2 bg-white rounded-2xl shadow-soft p-6 animate-bounce-in">
          <div class="flex items-center mb-6 space-x-3">
            <ShieldCheck class="text-accent" />
            <h2 class="text-xl font-semibold text-primary-700">Vaccinations</h2>
          </div>

          <div class="space-y-4">
            <div v-if="petStore.currentVaccines.length === 0" class="text-secondary text-center py-6 bg-secondary-50 rounded-xl">
              Aucun historique de vaccinations
            </div>
            <div v-else v-for="vaccine in petStore.currentVaccines" :key="vaccine.id" class="bg-secondary-50 rounded-xl p-4 hover:bg-primary-50 transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-soft">
              <div class="flex justify-between items-center">
                <span class="font-medium text-primary-700">{{ vaccine.name }}</span>
                <span class="text-sm text-secondary">{{ formatDate(vaccine.date) }}</span>
              </div>
              <div class="text-sm text-accent-600 mt-1">
                À refaire le : {{ formatDate(vaccine.nextDate) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-2xl shadow-soft p-6 animate-bounce-in delay-200">
          <div class="flex items-center mb-6 space-x-3">
            <Heart class="text-accent" />
            <h2 class="text-xl font-semibold text-primary-700">Santé</h2>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-3">
                <Weight class="text-primary" />
                <span class="text-secondary">Poids actuel</span>
              </div>
              <span class="font-semibold text-primary-700">
                {{ petStore.currentPet?.weight ? `${petStore.currentPet.weight} kg` : '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Weight Tracking Section -->
        <div class="md:col-span-3 bg-white rounded-2xl shadow-soft p-6 animate-bounce-in delay-300">
          <div class="flex items-center mb-6 space-x-3">
            <Weight class="text-accent" />
            <h2 class="text-xl font-semibold text-primary-700">Suivi du poids</h2>
          </div>

          <div class="h-96">
            <Line v-if="petStore.currentWeightHistory.length > 0" :data="weightData" :options="chartOptions" />
            <div v-else class="h-full flex items-center justify-center bg-secondary-50 rounded-xl text-secondary">
              Aucune donnée de poids disponible
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
