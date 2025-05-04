import { supabase } from '@/supabase'
import AccueilView from '@/views/AccueilView.vue'
import AProposView from '@/views/AProposView.vue'
import EventView from '@/views/EventView.vue'
import RoomView from '@/views/RoomView.vue'
import SessionsView from '@/views/SessionsView.vue'
import SessionView from '@/views/SessionView.vue'
import UEView from '@/views/UEView.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: AccueilView
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: SessionsView,
    meta: { requiresAuth: true, breadcrumb: 'Sessions' }
  },
  {
    path: '/apropos',
    name: 'APropos',
    component: AProposView,
  },
  {
    path: '/sessions/:label',
    name: 'Session',
    component: SessionView,
    meta: { requiresAuth: true, breadcrumb: 'Session' }
  },
  {
    path: '/sessions/:sessionLabel/ue/:ue',
    name: 'UEView',
    component: UEView,
    meta: { requiresAuth: true, breadcrumb: 'UE' }
  },
  {
    path: '/sessions/:sessionLabel/ue/:ue/event/:eventLabel',
    name: 'EventView',
    component: EventView,
    meta: { requiresAuth: true, breadcrumb: 'Épreuve' }
  },
  {
    path: '/sessions/:sessionLabel/ue/:ue/event/:eventLabel/room/:roomLabel',
    name: 'RoomView',
    component: RoomView,
    meta: { requiresAuth: true, breadcrumb: 'Local' }
  }


]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getUser()
  const user = data.user

  if (to.meta.requiresAuth && !user) {
    next('/') // redirige vers l'accueil si pas connecté
  } else {
    next() // autorise la navigation
  }
})

export default router
