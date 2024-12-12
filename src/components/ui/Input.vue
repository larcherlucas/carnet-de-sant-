<script setup lang="ts">
import { computed } from 'vue'

type InputType = 'text' | 'number' | 'email' | 'password' | 'date'

const props = withDefaults(defineProps<{
  modelValue: string | number
  label?: string
  type?: InputType
  placeholder?: string
  error?: string
  disabled?: boolean
}>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputClasses = computed(() => [
  'w-full rounded-md border px-3 py-2 transition-colors duration-200',
  props.error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:border-primary focus:ring-primary',
  props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
])
</script>

<template>
  <div class="space-y-1">
    <label 
      v-if="label" 
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="inputClasses"
    />
    <p 
      v-if="error" 
      class="text-sm text-red-500 mt-1"
    >
      {{ error }}
    </p>
  </div>
</template>