<script setup>
import { supabase } from '@/supabase'
import { ref, onMounted } from 'vue'

const user = ref(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user
})

const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}

const signOut = async () => {
  await supabase.auth.signOut()
  window.location.reload()
}
</script>

<template>
  <header class="bg-sky-600 text-white p-4 shadow-md flex justify-between items-center">
    <h1 class="text-xl font-bold">Attendo</h1>

    <nav class="flex gap-4">
      <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
      <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
      <RouterLink to="/apropos" class="hover:underline">À propos</RouterLink>
    </nav>

    <div>
      <template v-if="user">
        <span class="mr-2">👋 {{ user.email }}</span>
        <button @click="signOut" class="bg-white text-sky-600 px-3 py-1 rounded">Déconnexion</button>
      </template>
      <template v-else>
        <button @click="signInWithGoogle" class="bg-white text-sky-600 px-3 py-1 rounded">
          Connexion avec Google
        </button>
      </template>
    </div>
  </header>
</template>
