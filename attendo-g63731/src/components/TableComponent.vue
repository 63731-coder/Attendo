<template>
  <table class="min-w-full border-collapse border border-gray-300 shadow-sm">
    <thead class="bg-gray-100 text-left">
      <tr>
        <th v-for="(header, index) in headers" :key="index" class="border p-2">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, rowIndex) in items" :key="rowIndex" class="hover:bg-gray-50">
        <td v-for="(field, colIndex) in fields" :key="colIndex" class="border p-2">
          {{ item[field] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  headers: Array,
  items: Array,
  fields: Array
})
</script>
