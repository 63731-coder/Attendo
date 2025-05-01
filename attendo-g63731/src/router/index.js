import { supabase } from '@/supabase'
import AccueilView from '@/views/AccueilView.vue'
import AProposView from '@/views/AProposView.vue'
import SessionView from '@/views/SessionsView.vue'
import SessionDetailView from '@/views/SessionView.vue'
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
    component: SessionView,
    meta: { requiresAuth: true, breadcrumb: 'Sessions' }
  },
  {
    path: '/apropos',
    name: 'APropos',
    component: AProposView,
  },
  {
    path: '/sessions/:id',
    name: 'Session',
    component: SessionDetailView,
    meta: {
      requiresAuth: true,
      breadcrumb: 'Session',
      breadcrumbParent: 'Sessions'
    }
  },
  {
    path: '/sessions/:sessionId/:id',
    name: 'UE',
    component: () => import('@/views/UE.vue'),
    meta: {
      requiresAuth: true,
      breadcrumb: 'UE',
      breadcrumbParent: 'Session'
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
