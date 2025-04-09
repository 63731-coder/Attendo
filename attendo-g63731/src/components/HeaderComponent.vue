<template>
  <header class="bg-sky-600 text-white p-4 shadow-md flex justify-between items-center">
    <h1 class="text-xl font-bold">Attendo</h1>
    <nav class="flex gap-4">
      <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
      <RouterLink to="/sessions" class="hover:underline">Sessions</RouterLink>
      <RouterLink to="/apropos" class="hover:underline">À propos</RouterLink>
    </nav>
    <button class="bg-white text-sky-600 px-4 py-2 rounded hover:bg-sky-100 transition">
      Connexion avec Google
    </button>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
