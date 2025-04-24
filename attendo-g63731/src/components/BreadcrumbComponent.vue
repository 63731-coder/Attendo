<template>
  <nav class="text-sm text-gray-600 mb-4" aria-label="breadcrumb">
    <ol class="flex space-x-2">
      <li>
        <RouterLink to="/" class="text-blue-600 hover:underline">Accueil</RouterLink>
      </li>
      <li v-for="(crumb, index) in crumbs" :key="index" class="flex items-center">
        <span class="mx-2">/</span>
        <RouterLink :to="crumb.path" class="text-blue-600 hover:underline">
          {{ crumb.label }}
        </RouterLink>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()

const crumbs = route.matched
  .filter(r => r.path !== '/')
  .map(r => ({
    path: r.path,
    label: r.meta.breadcrumb || r.name || r.path.replace('/', '')
  }))
</script>
