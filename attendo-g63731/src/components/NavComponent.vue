<template>
  <nav class="bg-gray-100 px-6 py-2 flex justify-between items-center shadow">
    <!-- Liens de navigation -->
    <div class="flex gap-6 items-center">
      <router-link to="/" class="text-sm hover:underline">Accueil</router-link>
      <router-link to="/sessions" class="text-sm hover:underline">Sessions</router-link>
      <router-link to="/apropos" class="text-sm hover:underline">À propos</router-link>
    </div>

    <!-- Connexion / Deconnexion -->
    <div>
      <template v-if="user">
        <span class="mr-2 text-sm">👋 {{ user.email }}</span>
        <button @click="signOut" class="bg-white text-sky-600 px-3 py-1 rounded text-sm border border-black">
          Déconnexion
        </button>
      </template>
      <template v-else>
        <button @click="signInWithGoogle" class="bg-white text-sky-600 px-3 py-1 rounded text-sm  border border-black">
          Connexion avec Google
        </button>
      </template>
    </div>
  </nav>
</template>

<script>
import { supabase } from '@/supabase'

export default {
  name: 'NavComponent',
  data() {
    return {
      user: null
    }
  },
  async created() {
    const { data } = await supabase.auth.getUser()
    this.user = data.user
  },
  methods: {
    async signInWithGoogle() {
      await supabase.auth.signInWithOAuth({
        provider: 'google'
      })
    },
    async signOut() {
      await supabase.auth.signOut()
      window.location.href = '/'
    }
  }
}
</script>

<style>
nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
