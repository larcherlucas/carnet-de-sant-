import { defineStore } from 'pinia'
import type { Pet, Vaccine, WeightRecord, HealthRecord, FoodLog } from '@/types'

interface PetState {
  pet: Pet | null
  vaccines: Vaccine[]
  weightHistory: WeightRecord[]
  healthRecords: HealthRecord[]
  foodLogs: FoodLog[]
}

export const usePetStore = defineStore('pet', {
  state: (): PetState => ({
    pet: null,
    vaccines: [],
    weightHistory: [],
    healthRecords: [],
    foodLogs: []
  }),
  
  getters: {
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
    // Méthode pour définir le pet
    setPet(pet: Pet) {
      this.pet = pet
    },

    // Actions pour les vaccins
    addVaccine(vaccine: Vaccine) {
      const existingVaccine = this.vaccines.find(v => 
        v.name === vaccine.name && v.date === vaccine.date
      )

      if (!existingVaccine) {
        this.vaccines.push(vaccine)
        this.vaccines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      } else {
        console.warn('Ce vaccin existe déjà')
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
        if (this.pet) {
          const latestRecord = this.weightHistory[this.weightHistory.length - 1]
          this.pet.weight = latestRecord.weight
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
        if (this.pet && index === this.weightHistory.length - 1) {
          this.pet.weight = record.weight
        }
      }
    },

    deleteWeightRecord(id: string) {
      const initialLength = this.weightHistory.length
      this.weightHistory = this.weightHistory.filter(r => r.id !== id)
      
      // Si le dernier poids a été supprimé, réinitialiser le poids du pet
      if (this.pet && initialLength !== this.weightHistory.length && this.weightHistory.length > 0) {
        const latestRecord = this.weightHistory[this.weightHistory.length - 1]
        this.pet.weight = latestRecord.weight
      } else if (this.pet && this.weightHistory.length === 0) {
        this.pet.weight = 0
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
    }
  },

  persist: true
}) 