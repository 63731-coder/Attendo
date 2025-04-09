import AccueilView from '@/views/AccueilView.vue'
import AProposView from '@/views/AProposView.vue'
import SessionView from '@/views/SessionView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Accueil', component: AccueilView },
  { path: '/sessions', name: 'Sessions', component: SessionView },
  { path: '/apropos', name: 'APropos', component: AProposView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
