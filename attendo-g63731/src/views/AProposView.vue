<template>
  <div class="px-6 pt-6 space-y-6">
    <BreadcrumbComponent :items="breadcrumbItems" />

    <h2 class="text-2xl font-semibold mb-2 text-sky-800">À propos</h2>
    <p>Auteur : Nicoleta</p>
    <p>Année scolaire : 2025-2026</p>
    <p>Technologies : Vue 3, TailwindCSS, Supabase</p>
  </div>
</template>

<script>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';

export default {
  name: 'AProposView',
  components: {
    BreadcrumbComponent
  },
  data() {
    return {
      breadcrumbItems: [
        { label: 'Accueil', to: '/' },
        { label: 'À propos' }
      ]
    }
  }
}
</script>
