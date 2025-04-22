<script setup>
import { ref, onMounted } from 'vue'
import { getSessions, addSession } from '@/services/listSessionsService'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

const sessions = ref([])
const newSessionName = ref('')

const fetchSessions = async () => {
  try {
    sessions.value = await getSessions()
  } catch (error) {
    console.error('Erreur récupération sessions', error.message)
  }
}

const handleAddSession = async () => {
  if (newSessionName.value.trim() === '') return
  try {
    await addSession(newSessionName.value.trim())
    newSessionName.value = ''
    await fetchSessions()
  } catch (error) {
    console.error('Erreur ajout session', error.message)
  }
}

onMounted(fetchSessions)
</script>

<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <!-- BREADCRUMB -->
    <BreadcrumbComponent />

    <h2 class="text-3xl font-bold text-sky-700 mb-8">Sessions</h2>

    <!-- Liste des sessions -->
    <div class="bg-white rounded-xl shadow-md mb-12 overflow-hidden max-w-md">
      <div class="bg-gray-100 text-gray-700 px-4 py-2 font-semibold tracking-wide">SESSIONS</div>
      <ul>
        <li
          v-for="session in sessions"
          :key="session.id"
          class="px-4 py-2 hover:bg-gray-50 border-t border-gray-200 cursor-pointer text-sky-600 font-medium capitalize"
        >
          {{ session.label }}
        </li>
      </ul>
    </div>

    <!-- Ajouter une session -->
    <div class="bg-white rounded-xl shadow-md p-5 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-3">Ajouter une session</h3>
      <form @submit.prevent="handleAddSession" class="flex gap-2 items-center">
        <input
          v-model="newSessionName"
          type="text"
          placeholder="juin"
          class="flex-1 border border-gray-300 rounded px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button class="border border-sky-600 text-sky-600 px-4 py-2 rounded hover:bg-sky-50 transition">
          Ajouter
        </button>
      </form>
    </div>
  </div>
</template>
