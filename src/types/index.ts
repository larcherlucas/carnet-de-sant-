export interface Pet {
  id: string
  type: 'dog' | 'cat' | 'bird' | 'fish'
  name: string
  photo: string
  breed: string
  birthDate: string
  weight?: number
  owner: {
    name: string
    phone: string
    address?: string
  }
  color: string
  size: string
}

export interface Vaccine {
  id: string
  name: string
  date: string
  nextDate: string
  description: string
  veterinarian: string
  category: string // 'core' | 'non-core'
}

export interface WeightRecord {
  id: string
  petId: string
  date: string
  weight: number
  notes?: string
}

export interface HealthRecord {
  id: string
  date: string
  type: 'incident' | 'illness' | 'checkup'
  title: string
  description: string
  treatment?: string
  veterinarian?: string
}

export interface FoodLog {
  id: string
  date: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  food: string
  quantity: number
  unit: 'g' | 'kg' | 'portion'
  notes?: string
}