<script setup>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import { getUEsBySession } from '@/services/sessionDetailService'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sessionId = route.params.id

const ues = ref([])

onMounted(async () => {
  try {
    ues.value = await getUEsBySession(sessionId)
  } catch (error) {
    console.error('Erreur chargement UEs', error.message)
  }
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-2xl font-bold text-sky-700 mb-6">
      Détail de la session #{{ sessionId }}
    </h2>

    <TableComponent
      :headers="['ID UE', 'Nom UE']"
      :items="ues"
      :fields="['id', 'label']"
    />
  </div>
</template>
