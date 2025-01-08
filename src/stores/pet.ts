import { defineStore } from 'pinia'
import type { Pet, Vaccine, WeightRecord, HealthRecord, FoodLog } from '@/types'

interface PetState {
  pets: Pet[]
  currentPetId: string | null
  vaccines: Record<string, Vaccine[]>
  weightHistory: Record<string, WeightRecord[]>
  healthRecords: Record<string, HealthRecord[]>
  foodLogs: Record<string, FoodLog[]>
}

export const usePetStore = defineStore('pet', {
  state: (): PetState => ({
    pets: [],
    currentPetId: null,
    vaccines: {},
    weightHistory: {},
    healthRecords: {},
    foodLogs: {}
  }),

  getters: {
    currentPet(): Pet | null {
      return this.currentPetId
        ? this.pets.find(pet => pet.id === this.currentPetId) || null
        : null
    },
    currentVaccines(): Vaccine[] {
      return this.vaccines[this.currentPetId || ''] || []
    },
    currentWeightHistory(): WeightRecord[] {
      return this.weightHistory[this.currentPetId || ''] || []
    },
    currentHealthRecords(): HealthRecord[] {
      return this.healthRecords[this.currentPetId || ''] || []
    },
    currentFoodLogs(): FoodLog[] {
      return this.foodLogs[this.currentPetId || ''] || []
    },
    upcomingVaccines(): Vaccine[] {
      const today = new Date()
      return this.currentVaccines
        .filter(vaccine => new Date(vaccine.nextDate) > today)
        .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
    },
    sortedWeightHistory(): WeightRecord[] {
      return this.currentWeightHistory
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },
    weightRange(): { min: number, max: number } {
      if (this.currentWeightHistory.length === 0) return { min: 0, max: 0 }

      const weights = this.currentWeightHistory.map(record => record.weight)
      return {
        min: Math.min(...weights),
        max: Math.max(...weights)
      }
    }
  },

  actions: {
    setCurrentPet(petId: string) {
      const pet = this.pets.find(p => p.id === petId)
      if (pet) {
        this.currentPetId = petId
        // Initialisation du tableau weightHistory si nécessaire
        if (!this.weightHistory[petId]) {
          this.weightHistory[petId] = []
        }
      }
    },

    addWeightRecord(record: WeightRecord) {
      if (!this.currentPetId) return

      if (!this.weightHistory[this.currentPetId]) {
        this.weightHistory[this.currentPetId] = []
      }

      const existingRecord = this.weightHistory[this.currentPetId].find(r =>
        new Date(r.date).toDateString() === new Date(record.date).toDateString()
      )

      if (!existingRecord) {
        this.weightHistory[this.currentPetId].push(record)
        this.weightHistory[this.currentPetId].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        if (this.currentPet) {
          const latestRecord = this.weightHistory[this.currentPetId][this.weightHistory[this.currentPetId].length - 1]
          this.currentPet.weight = latestRecord.weight
        }
      } else {
        console.warn('Un enregistrement de poids existe déjà pour cette date')
      }
    },

    updateWeightRecord(id: string, record: WeightRecord) {
      const index = this.weightHistory[this.currentPetId || ''].findIndex(r => r.id === id)
      if (index !== -1) {
        this.weightHistory[this.currentPetId || ''][index] = record
        this.weightHistory[this.currentPetId || ''].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        if (this.currentPet && index === this.weightHistory[this.currentPetId || ''].length - 1) {
          this.currentPet.weight = record.weight
        }
      }
    },

    deleteWeightRecord(id: string) {
      const initialLength = this.weightHistory[this.currentPetId || ''].length
      this.weightHistory[this.currentPetId || ''] = this.weightHistory[this.currentPetId || ''].filter(r => r.id !== id)

      if (this.currentPet && initialLength !== this.weightHistory[this.currentPetId || ''].length && this.weightHistory[this.currentPetId || ''].length > 0) {
        const latestRecord = this.weightHistory[this.currentPetId || ''][this.weightHistory[this.currentPetId || ''].length - 1]
        this.currentPet.weight = latestRecord.weight
      } else if (this.currentPet && this.weightHistory[this.currentPetId || ''].length === 0) {
        this.currentPet.weight = 0
      }
    },

    addHealthRecord(record: HealthRecord) {
      this.healthRecords[this.currentPetId || ''].push(record)
      this.healthRecords[this.currentPetId || ''].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    updateHealthRecord(id: string, record: HealthRecord) {
      const index = this.healthRecords[this.currentPetId || ''].findIndex(r => r.id === id)
      if (index !== -1) {
        this.healthRecords[this.currentPetId || ''][index] = record
        this.healthRecords[this.currentPetId || ''].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
    },

    deleteHealthRecord(id: string) {
      this.healthRecords[this.currentPetId || ''] = this.healthRecords[this.currentPetId || ''].filter(r => r.id !== id)
    },

    addFoodLog(log: FoodLog) {
      this.foodLogs[this.currentPetId || ''].push(log)
      this.foodLogs[this.currentPetId || ''].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    updateFoodLog(id: string, log: FoodLog) {
      const index = this.foodLogs[this.currentPetId || ''].findIndex(l => l.id === id)
      if (index !== -1) {
        this.foodLogs[this.currentPetId || ''][index] = log
        this.foodLogs[this.currentPetId || ''].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
    },

    deleteFoodLog(id: string) {
      this.foodLogs[this.currentPetId || ''] = this.foodLogs[this.currentPetId || ''].filter(l => l.id !== id)
    },

    getLatestWeight(): number | null {
      if (this.currentWeightHistory.length === 0) return null

      const sortedWeights = [...this.currentWeightHistory].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      return sortedWeights[0].weight
    },

    calculateWeightProgression(): number | null {
      if (this.currentWeightHistory.length < 2) return null

      const sortedWeights = [...this.currentWeightHistory].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      const firstWeight = sortedWeights[0].weight
      const lastWeight = sortedWeights[sortedWeights.length - 1].weight

      return ((lastWeight - firstWeight) / firstWeight) * 100
    },

    getPetEmoji(type: Pet['type']): string {
      const emojiMap: Record<Pet['type'], string> = {
        'dog': '🐶',
        'cat': '🐱',
        'bird': '🐦',
        'fish': '🐠'
      }
      return emojiMap[type]
    }
  },

  persist: true
})
