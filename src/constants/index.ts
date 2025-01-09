export const MEAL_TYPES = {
    BREAKFAST: { value: 'breakfast', label: 'Petit déjeuner' },
    LUNCH: { value: 'lunch', label: 'Déjeuner' },
    DINNER: { value: 'dinner', label: 'Dîner' },
    SNACK: { value: 'snack', label: 'Collation' }
  } as const
  
  export const HEALTH_RECORD_TYPES = {
    CHECKUP: { value: 'checkup', label: 'Visite de contrôle', color: 'green' },
    INCIDENT: { value: 'incident', label: 'Incident', color: 'yellow' },
    ILLNESS: { value: 'illness', label: 'Maladie', color: 'red' }
  } as const
  
  export const WEIGHT_UNITS = {
    GRAMS: { value: 'g', label: 'Grammes' },
    KILOGRAMS: { value: 'kg', label: 'Kilogrammes' },
    PORTION: { value: 'portion', label: 'Portion' }
  } as const

  export const STORAGE_KEYS = {
    WEIGHTS: 'pet_weights',
    PETS: 'pets'
  } as const