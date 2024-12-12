<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePetStore } from '../stores/pet'
import { 
  HomeIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  WeightIcon, 
  HeartIcon, 
  UtensilsIcon,
  ChevronRightIcon 
} from 'lucide-vue-next'

const route = useRoute()
const petStore = usePetStore()

const isActive = (path: string) => route.path.startsWith(path)

const menuItems = [
  { path: '/', label: 'Accueil', icon: HomeIcon },
  { path: '/profile', label: 'Profil', icon: UserIcon },
  { path: '/vaccines', label: 'Vaccins', icon: ShieldCheckIcon },
  { path: '/weight', label: 'Poids', icon: WeightIcon },
  { path: '/health', label: 'Santé', icon: HeartIcon },
  { path: '/food', label: 'Alimentation', icon: UtensilsIcon }
]
</script>

<template>
  <aside 
    class="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50 
           overflow-y-auto shadow-soft py-6 transition-all duration-300 
           animate-fade-in"
  >
    <div class="px-4">
      <div class="text-center mb-8">
        <div 
          class="w-36 h-36 mx-auto mb-4 rounded-full border-4 border-primary-100 
                 overflow-hidden shadow-medium transition-transform duration-300 
                 hover:scale-105 hover:rotate-3"
        >
          <img 
            v-if="petStore.pet?.photo"
            :src="petStore.pet.photo" 
            alt="Photo de l'animal"
            class="w-full h-full object-cover"
          >
          <div 
            v-else 
            class="w-full h-full bg-primary-50 flex items-center justify-center"
          >
            <span class="text-primary-600">Pas de photo</span>
          </div>
        </div>
        <h2 
          class="text-2xl font-bold text-primary-700 
                 transition-colors duration-300 
                 hover:text-primary-600"
        >
          {{ petStore.pet?.name || 'Mon Animal' }}
        </h2>
        <p class="text-secondary text-sm mt-1">{{ petStore.pet?.breed || 'Compagnon fidèle' }}</p>
      </div>
      
      <nav class="space-y-2 px-2">
        <router-link 
          v-for="link in menuItems" 
          :key="link.path"
          :to="link.path" 
          class="group block px-4 py-2.5 rounded-xl transition-all duration-300 
                 hover:bg-primary-50 hover:text-primary-700 
                 flex items-center justify-between 
                 hover:shadow-soft hover:translate-x-1"
          :class="{
            'bg-primary-100 text-primary-700 font-semibold': isActive(link.path),
            'text-secondary hover:text-primary-700': !isActive(link.path)
          }"
        >
          <div class="flex items-center space-x-3">
            <component 
              :is="link.icon" 
              class="w-5 h-5 text-primary-600 group-hover:text-primary-700" 
            />
            <span>{{ link.label }}</span>
          </div>
          <ChevronRightIcon 
            class="w-4 h-4 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300 text-primary-600" 
          />
        </router-link>
      </nav>
    </div>
  </aside>
</template>