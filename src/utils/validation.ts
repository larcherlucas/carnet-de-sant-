export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

export interface ValidationErrors {
  [key: string]: string[]
}

export function validateField(value: any, rules: ValidationRule = {}): string[] {
  const errors: string[] = []

  // Normalize value to handle undefined, null, and empty inputs
  const normalizedValue = value === undefined || value === null 
    ? '' 
    : (typeof value === 'string' ? value.trim() : value)

  // Required validation
  if (rules.required && (normalizedValue === '' || normalizedValue === null || normalizedValue === undefined)) {
    errors.push('Ce champ est requis')
  }

  // Only proceed with other validations if there's a value
  if (normalizedValue !== '') {
    // Min length validation
    if (rules.minLength && normalizedValue.length < rules.minLength) {
      errors.push(`Doit contenir au moins ${rules.minLength} caractères`)
    }

    // Max length validation
    if (rules.maxLength && normalizedValue.length > rules.maxLength) {
      errors.push(`Ne doit pas dépasser ${rules.maxLength} caractères`)
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(normalizedValue)) {
      errors.push('Format invalide')
    }

    // Custom validator
    if (rules.validator) {
      const customValidation = rules.validator(normalizedValue)
      if (typeof customValidation === 'string') {
        errors.push(customValidation)
      } else if (customValidation === false) {
        errors.push('Validation personnalisée échouée')
      }
    }
  }

  return errors
}

export function validateForm(formData: any, validationSchema: Record<string, ValidationRule>): ValidationErrors {
  const errors: ValidationErrors = {}

  // Handle nested object validation
  const validateNestedObject = (obj: any, prefix = '') => {
    Object.keys(validationSchema).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      const value = prefix 
        ? obj[prefix.split('.').pop() || '']?.[key] 
        : obj[key]
      const rules = validationSchema[key]
      
      if (!errors[fullKey]) {
        errors[fullKey] = validateField(value, rules)
      }
    })
  }

  // Validate main fields and nested objects
  Object.keys(validationSchema).forEach(key => {
    const value = key.includes('.') 
      ? key.split('.').reduce((acc, part) => acc?.[part], formData)
      : formData[key]
    const rules = validationSchema[key]
    
    errors[key] = validateField(value, rules)
  })

  return errors
}