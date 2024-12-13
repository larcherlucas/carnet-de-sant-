<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePetStore } from '@/stores/pet'
import { 
  UserIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  XIcon,
  DogIcon
} from 'lucide-vue-next'
import PetForm from '@/components/forms/PetForm.vue'
import SuccessModal from '@/components/succes/SuccesModal.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import type { Pet } from '@/types'

const petStore = usePetStore()
const successModalRef = ref<InstanceType<typeof SuccessModal> | null>(null)
const showPetForm = ref(false)
const editingPet = ref<Pet | null>(null)
const confirmDeletePetId = ref<string | null>(null)

// Computed property to check if user has no pets
const hasNoPets = computed(() => petStore.pets.length === 0)

const handleSubmit = (pet: Pet) => {
  // If editing an existing pet
  if (editingPet.value) {
    // Find the index of the pet in the store
    const petIndex = petStore.pets.findIndex(p => p.id === editingPet.value?.id)
    
    if (petIndex !== -1) {
      // Update the existing pet
      petStore.pets[petIndex] = { ...pet, id: editingPet.value.id }
    }
  } else {
    // Generate a unique ID for the new pet
    pet.id = `pet_${Date.now()}` 
    
    // Add optional fields with default values if not provided 
    if (!pet.photo) pet.photo = '' // Default empty photo 
    
    // Add the pet to the store 
    petStore.addPet(pet) 
  }
  
  // Open the success modal 
  successModalRef.value?.openModal() 
  
  // Reset form and editing state
  showPetForm.value = false
  editingPet.value = null
}

const startEditPet = (pet: Pet) => {
  editingPet.value = { ...pet }
  showPetForm.value = true
}

const deletePet = (petId: string) => {
  petStore.pets = petStore.pets.filter(p => p.id !== petId)
  
  // If the deleted pet was the current pet, reset current pet
  if (petStore.currentPetId === petId) {
    petStore.currentPetId = petStore.pets.length > 0 
      ? petStore.pets[0].id 
      : null
  }
  
  // Close confirmation
  confirmDeletePetId.value = null
}

const togglePet = (petId: string) => { 
  petStore.setCurrentPet(petId) 
}

const openPetForm = () => {
  editingPet.value = null
  showPetForm.value = true
}
</script>

<template>
  <div class="bg-secondary-50 min-h-screen p-6 animate-fade-in">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-3">
          <UserIcon class="text-primary-600" :size="28" />
          <h1 class="text-2xl font-bold text-primary-700">Mon profil animal</h1>
        </div>
      </div>

      <!-- No Pets State -->
      <div v-if="hasNoPets" class="text-center bg-white shadow-md rounded-lg p-8">
        <DogIcon class="mx-auto mb-4 text-primary-600" :size="64" />
        <h2 class="text-xl font-semibold mb-2">Commencez votre aventure avec un animal</h2>
        <p class="text-secondary-600 mb-6">
          Ajoutez votre premier compagnon à quatre pattes et gardez une trace de ses informations.
        </p>
        <Button 
          variant="primary" 
          @click="openPetForm"
          class="mx-auto"
        >
          <PlusIcon class="mr-2" :size="20" />
          Créer mon animal
        </Button>
      </div>

      <!-- Pet Management State -->
      <template v-else>
        <div class="flex justify-end mb-4">
          <Button 
            variant="primary" 
            @click="openPetForm"
          >
            <PlusIcon class="mr-2" :size="20" /> 
            Ajouter un animal
          </Button>
        </div>

        <!-- Pet List --> 
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div 
            v-for="pet in petStore.pets"  
            :key="pet.id" 
            class="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
          >
            <div 
              @click="togglePet(pet.id)"
              class="flex items-center space-x-4 cursor-pointer flex-grow"
              :class="petStore.currentPetId === pet.id ? 'text-primary-600' : 'text-secondary-700'"
            >
              <span class="text-3xl">{{ petStore.getPetEmoji(pet.type) }}</span>
              <div>
                <h2 class="font-semibold">{{ pet.name }}</h2>
                <p class="text-sm text-secondary-500">{{ pet.breed }} • {{ pet.type }}</p>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="startEditPet(pet)"
                class="text-secondary-600 hover:text-primary-600 transition-colors"
              >
                <EditIcon :size="20" />
              </button>
              <button 
                @click="confirmDeletePetId = pet.id"
                class="text-secondary-600 hover:text-red-600 transition-colors"
              >
                <TrashIcon :size="20" />
              </button>
            </div>
          </div>
        </div>
      </template>
       
      <!-- Pet Form --> 
      <Card  
        v-if="showPetForm"  
        class="animate-bounce-in transform hover:scale-[1.01] transition-transform duration-300" 
      > 
        <PetForm  
          :initial-pet="editingPet"
          @submit="handleSubmit"  
          @cancel="() => { showPetForm = false; editingPet = null }" 
          class="space-y-6" 
        /> 
      </Card>

      <!-- Delete Confirmation Modal -->
      <div 
        v-if="confirmDeletePetId" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Confirmer la suppression</h2>
            <button 
              @click="confirmDeletePetId = null"
              class="text-secondary-600 hover:text-secondary-800"
            >
              <XIcon :size="24" />
            </button>
          </div>
          <p class="mb-6 text-secondary-700">
            Êtes-vous sûr de vouloir supprimer cet animal ? 
            Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-2">
            <Button 
              variant="secondary"
              @click="confirmDeletePetId = null"
            >
              Annuler
            </Button>
            <Button 
              variant="danger"
              @click="deletePet(confirmDeletePetId!)"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </div>

    <SuccessModal ref="successModalRef" />
  </div>
</template>