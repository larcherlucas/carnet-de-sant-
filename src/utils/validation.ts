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
  
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push('Ce champ est requis')
    }
  
    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`Doit contenir au moins ${rules.minLength} caractères`)
    }
  
    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors.push(`Ne doit pas dépasser ${rules.maxLength} caractères`)
    }
  
    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push('Format invalide')
    }
  
    // Custom validator
    if (rules.validator) {
      const customValidation = rules.validator(value)
      if (typeof customValidation === 'string') {
        errors.push(customValidation)
      } else if (customValidation === false) {
        errors.push('Validation personnalisée échouée')
      }
    }
  
    return errors
  }
  
  export function validateForm(formData: any, validationSchema: Record<string, ValidationRule>): ValidationErrors {
    const errors: ValidationErrors = {}
  
    Object.keys(validationSchema).forEach(key => {
      const value = formData[key]
      const rules = validationSchema[key]
      errors[key] = validateField(value, rules)
    })
  
    return errors
  }