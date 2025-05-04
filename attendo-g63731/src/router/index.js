import PresenceView from '@/components/PresenceView.vue'
import { supabase } from '@/supabase'
import AccueilView from '@/views/AccueilView.vue'
import AProposView from '@/views/AProposView.vue'
import ExaminationRoomView from '@/views/ExaminationRoomView.vue'
import SessionsView from '@/views/SessionsView.vue'
import SessionView from '@/views/SessionView.vue'
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
    component: () => import('@/views/UEView.vue'),
    meta: { requiresAuth: true, breadcrumb: 'UE' }
  },
  {
    path: '/sessions/:sessionId/:ueId/:id',
    name: 'ExaminationRoom',
    component: ExaminationRoomView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Epreuve',
      breadcrumbParent: 'UE'
    }
  },
  {
    path: '/sessions/:sessionId/:ueId/:eventId/:id',
    name: 'Presence',
    component: PresenceView,
    meta: {
      breadcrumb: 'Local',
      breadcrumbParent: 'ExaminationRoom'
    }
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
    next('/') // Redirige vers l'accueil si pas connecté
  } else {
    next() // Autorise la navigation
  }
})

export default router
