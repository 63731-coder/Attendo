<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link :to="crumb.path">{{ crumb.label }}</router-link>
        <span v-if="index < breadcrumbs.length - 1"> > </span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const crumbs = []
  let currentRoute = route

  while (currentRoute) {
    const matchedRoute = router.getRoutes().find(r => r.name === currentRoute.name)

    if (matchedRoute && matchedRoute.meta.breadcrumb) {
      crumbs.unshift({
        label: matchedRoute.meta.breadcrumb,
        path: matchedRoute.path.includes(':') && currentRoute.params?.id
          ? matchedRoute.path.replace(':id', currentRoute.params.id)
          : matchedRoute.path
      })

      const parentName = matchedRoute.meta.breadcrumbParent
      if (parentName) {
        currentRoute = router.resolve({ name: parentName })
      } else {
        break
      }
    } else {
      break
    }
  }

  crumbs.unshift({ label: 'Accueil', path: '/' })

  return crumbs
})
</script>

<style scoped>
.breadcrumb {
  padding: 1rem;
  font-size: 14px;
}
.breadcrumb ul {
  list-style: none;
  display: flex;
  gap: 0.5rem;
}
</style>
