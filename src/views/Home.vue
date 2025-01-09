<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { usePetStore } from '@/stores/pet'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ShieldCheck, Heart, Weight, PawPrint } from 'lucide-vue-next'
import type { Pet } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const petStore = usePetStore()
const selectedPetId = ref(petStore.currentPetId || '')
const loading = ref(true)

// Initialize data on component mount
onMounted(async () => {
  try {
    if (selectedPetId.value) {
      await loadPetData(selectedPetId.value)
    } else if (petStore.pets.length > 0) {
      selectedPetId.value = petStore.pets[0].id
      await loadPetData(petStore.pets[0].id)
    }
  } finally {
    loading.value = false
  }
})

// Load all data for a specific pet
async function loadPetData(petId: string) {
  petStore.setCurrentPet(petId)
  // The store will automatically load data from localStorage due to the 'persist: true' option
}

// Watch for pet changes
watch(selectedPetId, async (newPetId) => {
  if (newPetId) {
    loading.value = true
    try {
      await loadPetData(newPetId)
    } finally {
      loading.value = false
    }
  }
})

const weightData = computed(() => {
  if (!petStore.currentWeightHistory.length) {
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

  return {
    labels: petStore.sortedWeightHistory.map(record => 
      format(new Date(record.date), 'dd MMM', { locale: fr })
    ),
    datasets: [{
      label: 'Poids (kg)',
      data: petStore.sortedWeightHistory.map(record => record.weight),
      borderColor: 'rgba(93, 83, 243, 0.9)',
      backgroundColor: 'rgba(93, 83, 243, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(93, 83, 243, 1)',
      pointRadius: 6,
      tension: 0.4
    }]
  }
})

const weightProgression = computed(() => {
  return petStore.calculateWeightProgression()
})

const upcomingVaccines = computed(() => {
  return petStore.upcomingVaccines.slice(0, 3) // Get only the next 3 upcoming vaccines
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
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(93, 83, 243, 0.05)',
        borderDash: [5, 5]
      }
    },
    x: {
      grid: { display: false }
    }
  }
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy', { locale: fr })
}

const getPetTypeIcon = (type: Pet['type']) => {
  return petStore.getPetEmoji(type)
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="max-w-6xl mx-auto space-y-6">
      <!-- Pet Selection -->
      <div class="mb-6">
        <label for="pet-select" class="block text-sm font-medium text-gray-700">Sélectionnez un animal :</label>
        <select
          id="pet-select"
          v-model="selectedPetId"
          class="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option v-for="pet in petStore.pets" :key="pet.id" :value="pet.id">
            {{ getPetTypeIcon(pet.type) }} {{ pet.name }}
          </option>
        </select>
      </div>

      <!-- Pet Info -->
      <div v-if="petStore.currentPet" class="bg-white shadow-medium rounded-2xl p-6 flex items-center space-x-6 border-l-4 border-primary animate-slide-up">
        <div class="w-24 h-24 rounded-full overflow-hidden">
          <img
            v-if="petStore.currentPet.photo"
            :src="petStore.currentPet.photo"
            :alt="petStore.currentPet.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full bg-primary-50 flex items-center justify-center">
            <PawPrint :size="48" class="text-primary" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-primary-700">
            {{ getPetTypeIcon(petStore.currentPet.type) }} {{ petStore.currentPet.name }}
          </h1>
          <p class="text-secondary">{{ petStore.currentPet.breed }} • {{ formatDate(petStore.currentPet.birthDate) }}</p>
          <p class="text-sm text-accent-600 mt-1">
            Propriétaire : {{ petStore.currentPet.owner.name }}
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <!-- Vaccinations -->
        <div class="md:col-span-2 bg-white rounded-2xl shadow-soft p-6">
          <div class="flex items-center mb-6 space-x-3">
            <ShieldCheck class="text-accent" />
            <h2 class="text-xl font-semibold text-primary-700">Prochains vaccins</h2>
          </div>

          <div class="space-y-4">
            <div v-if="!upcomingVaccines.length" class="text-secondary text-center py-6 bg-secondary-50 rounded-xl">
              Aucun vaccin à venir
            </div>
            <div
              v-else
              v-for="vaccine in upcomingVaccines"
              :key="vaccine.id"
              class="bg-secondary-50 rounded-xl p-4 hover:bg-primary-50 transition-colors duration-300"
            >
              <div class="flex justify-between items-center">
                <span class="font-medium text-primary-700">{{ vaccine.name }}</span>
                <span class="text-sm text-secondary">{{ formatDate(vaccine.nextDate) }}</span>
              </div>
              <div class="text-sm text-accent-600 mt-1">
                Vétérinaire : {{ vaccine.veterinarian }}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-2xl shadow-soft p-6">
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
            <div v-if="weightProgression !== null" class="text-sm">
              <span :class="weightProgression > 0 ? 'text-green-600' : 'text-red-600'">
                {{ weightProgression > 0 ? '+' : '' }}{{ weightProgression.toFixed(1) }}% depuis le début du suivi
              </span>
            </div>
          </div>
        </div>

        <!-- Weight Chart -->
        <div class="md:col-span-3 bg-white rounded-2xl shadow-soft p-6">
          <div class="flex items-center mb-6 space-x-3">
            <Weight class="text-accent" />
            <h2 class="text-xl font-semibold text-primary-700">Suivi du poids</h2>
          </div>

          <div class="h-96">
            <Line
              v-if="petStore.currentWeightHistory.length > 0"
              :data="weightData"
              :options="chartOptions"
            />
            <div
              v-else
              class="h-full flex items-center justify-center bg-secondary-50 rounded-xl text-secondary"
            >
              Aucune donnée de poids disponible
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>