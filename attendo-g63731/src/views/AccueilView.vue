<template>
  <div class="px-6 pt-6">
    <template v-if="user">
      <BreadcrumbComponent :items="breadcrumbItems" />
      <h2 class="text-xl font-semibold mb-2">Bonjour, {{ user.email }}</h2>
    </template>
    <template v-else>
      <p class="text-gray-600">Veuillez vous connecter pour utiliser l'application.</p>
    </template>
  </div>
</template>

<script>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import { supabase } from '@/supabase'

export default {
  name: 'HomeView',
  components: {
    BreadcrumbComponent
  },
  data() {
    return {
      user: null,
      breadcrumbItems: [
        { label: 'Accueil' }
      ]
    }
  },
  async mounted() {
    const { data } = await supabase.auth.getUser()
    this.user = data.user
  }
}
</script>
