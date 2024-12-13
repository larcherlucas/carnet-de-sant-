import { defineStore } from 'pinia'
import type { Pet, Vaccine, WeightRecord, HealthRecord, FoodLog } from '@/types'

interface PetState {
  pets: Pet[]
  currentPetId: string | null
  vaccines: Vaccine[]
  weightHistory: WeightRecord[]
  healthRecords: HealthRecord[]
  foodLogs: FoodLog[]
}

export const usePetStore = defineStore('pet', {
  state: (): PetState => ({
    pets: [],
    currentPetId: null,
    vaccines: [],
    weightHistory: [],
    healthRecords: [],
    foodLogs: []
  }),
  
  getters: {
    currentPet(): Pet | null {
      return this.currentPetId 
        ? this.pets.find(pet => pet.id === this.currentPetId) || null 
        : null
    },
    // Getter pour obtenir les vaccins à venir
    upcomingVaccines(): Vaccine[] {
      const today = new Date()
      return this.vaccines
        .filter(vaccine => new Date(vaccine.nextDate) > today)
        .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
    },

    // Getter pour obtenir l'historique de poids trié et formaté
    sortedWeightHistory(): WeightRecord[] {
      return this.weightHistory
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    // Getter pour obtenir le premier et le dernier poids
    weightRange(): { min: number, max: number } {
      if (this.weightHistory.length === 0) return { min: 0, max: 0 }
      
      const weights = this.weightHistory.map(record => record.weight)
      return {
        min: Math.min(...weights),
        max: Math.max(...weights)
      }
    }
  },
  
  actions: {
    // Add pet to the list
    addPet(pet: Pet) {
      // Check if pet already exists
      const existingPetIndex = this.pets.findIndex(p => p.id === pet.id)
      
      if (existingPetIndex === -1) {
        this.pets.push(pet)
        // Automatically set as current pet
        this.currentPetId = pet.id
      } else {
        // Update existing pet
        this.pets[existingPetIndex] = pet
      }
    },

    // Set current pet by ID
    setCurrentPet(petId: string) {
      const pet = this.pets.find(p => p.id === petId)
      if (pet) {
        this.currentPetId = petId
        // Reset context-specific data for the new pet
        this.resetPetContextData()
      }
    },

    // Reset data specific to the current pet context
    resetPetContextData() {
      this.vaccines = []
      this.weightHistory = []
      this.healthRecords = []
      this.foodLogs = []
    },

    // Actions pour les vaccins
    addVaccine(vaccine: Vaccine) {
      // Only add vaccine if there's a current pet
      if (this.currentPetId) {
        const existingVaccine = this.vaccines.find(v => 
          v.name === vaccine.name && v.date === vaccine.date
        )

        if (!existingVaccine) {
          this.vaccines.push(vaccine)
          this.vaccines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        } else {
          console.warn('Ce vaccin existe déjà')
        }
      }
    },

    updateVaccine(id: string, vaccine: Vaccine) {
      const index = this.vaccines.findIndex(v => v.id === id)
      if (index !== -1) {
        this.vaccines[index] = vaccine
      }
    },

    deleteVaccine(id: string) {
      this.vaccines = this.vaccines.filter(v => v.id !== id)
    },

    // Actions pour l'historique de poids
    addWeightRecord(record: WeightRecord) {
      const existingRecord = this.weightHistory.find(r => 
        new Date(r.date).toDateString() === new Date(record.date).toDateString()
      )

      if (!existingRecord) {
        this.weightHistory.push(record)
        this.weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        // Mettre à jour le poids du pet si c'est le dernier enregistrement
        if (this.currentPet) {
          const latestRecord = this.weightHistory[this.weightHistory.length - 1]
          this.currentPet.weight = latestRecord.weight
        }
      } else {
        console.warn('Un enregistrement de poids existe déjà pour cette date')
      }
    },

    updateWeightRecord(id: string, record: WeightRecord) {
      const index = this.weightHistory.findIndex(r => r.id === id)
      if (index !== -1) {
        this.weightHistory[index] = record
        
        // Trier après la mise à jour
        this.weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        // Mettre à jour le poids du pet si c'est le dernier enregistrement
        if (this.currentPet && index === this.weightHistory.length - 1) {
          this.currentPet.weight = record.weight
        }
      }
    },

    deleteWeightRecord(id: string) {
      const initialLength = this.weightHistory.length
      this.weightHistory = this.weightHistory.filter(r => r.id !== id)
      
      // Si le dernier poids a été supprimé, réinitialiser le poids du pet
      if (this.currentPet && initialLength !== this.weightHistory.length && this.weightHistory.length > 0) {
        const latestRecord = this.weightHistory[this.weightHistory.length - 1]
        this.currentPet.weight = latestRecord.weight
      } else if (this.currentPet && this.weightHistory.length === 0) {
        this.currentPet.weight = 0
      }
    },

    // Actions pour les dossiers de santé
    addHealthRecord(record: HealthRecord) {
      this.healthRecords.push(record)
      this.healthRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    updateHealthRecord(id: string, record: HealthRecord) {
      const index = this.healthRecords.findIndex(r => r.id === id)
      if (index !== -1) {
        this.healthRecords[index] = record
        this.healthRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
    },

    deleteHealthRecord(id: string) {
      this.healthRecords = this.healthRecords.filter(r => r.id !== id)
    },

    // Actions pour les journaux alimentaires
    addFoodLog(log: FoodLog) {
      this.foodLogs.push(log)
      this.foodLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },

    updateFoodLog(id: string, log: FoodLog) {
      const index = this.foodLogs.findIndex(l => l.id === id)
      if (index !== -1) {
        this.foodLogs[index] = log
        this.foodLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
    },

    deleteFoodLog(id: string) {
      this.foodLogs = this.foodLogs.filter(l => l.id !== id)
    },

    // Méthodes utilitaires
    getLatestWeight(): number | null {
      if (this.weightHistory.length === 0) return null
      
      const sortedWeights = [...this.weightHistory].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      return sortedWeights[0].weight
    },

    calculateWeightProgression(): number | null {
      if (this.weightHistory.length < 2) return null

      const sortedWeights = [...this.weightHistory].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      const firstWeight = sortedWeights[0].weight
      const lastWeight = sortedWeights[sortedWeights.length - 1].weight

      return ((lastWeight - firstWeight) / firstWeight) * 100
    },

    // Utility method to get pet emoji based on type
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