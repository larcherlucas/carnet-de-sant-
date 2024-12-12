import { ref, type Ref } from 'vue'
import { validateForm, type ValidationRule, type ValidationErrors } from '@/utils/validation'

export function useForm<T extends object>(
  initialData: T, 
  validationSchema: Record<keyof T, ValidationRule>
) {
  const formData = ref(initialData) as Ref<T>
  const errors = ref<ValidationErrors>({})

  const validate = () => {
    errors.value = validateForm(formData.value, validationSchema)
    return Object.values(errors.value).every(arr => arr.length === 0)
  }

  const reset = () => {
    formData.value = { ...initialData }
    errors.value = {}
  }

  return {
    formData,
    errors,
    validate,
    reset
  }
}