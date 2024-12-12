import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Vaccines from '../views/Vaccines.vue'
import Weight from '../views/Weight.vue'
import Health from '../views/Health.vue'
import Food from '../views/Food.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/profile', component: Profile },
    { path: '/vaccines', component: Vaccines },
    { path: '/weight', component: Weight },
    { path: '/health', component: Health },
    { path: '/food', component: Food },
  ]
})

export default router