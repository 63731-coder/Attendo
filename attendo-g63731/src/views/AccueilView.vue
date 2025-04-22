<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'


const user = ref(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
})
</script>

<template>
  <div class="px-6 pt-6"> <!-- padding entre breadcrumb et ^ -->
    <template v-if="user">
      <BreadcrumbComponent />
      <h2 class="text-xl font-semibold mb-2">Bonjour, {{ user.email }}</h2>
    </template>
    <template v-else>
      <p class="text-gray-600">Veuillez vous connecter pour utiliser l'application.</p>
    </template>
  </div>
</template>
