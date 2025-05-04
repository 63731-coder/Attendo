<template>
  <nav class="w-[90%] pt-5 text-sm text-gray-600" aria-label="breadcrumb">
    <ol class="list-reset flex">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <!-- Si on a une route, on utilise <router-link> -->
        <router-link
          v-if="item.to"
          :to="item.to"
          class="text-blue-600 hover:underline"
        >
          {{ item.label }}
        </router-link>

        <!-- Sinon, c'est du texte simple -->
        <span v-else class="text-gray-700">{{ item.label }}</span>

        <!-- Séparateur sauf pour le dernier -->
        <span v-if="index < items.length - 1" class="mx-2">></span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: "BreadcrumbComponent",
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
