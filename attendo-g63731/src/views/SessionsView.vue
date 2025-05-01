<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-2xl font-bold text-sky-700 mb-6">Toutes les sessions</h2>

    <!-- TABLEAU DES SESSIONS -->
    <TableComponent v-if="sessions.length > 0" :headers="['Session']" :data="sessions" :columns="['label']"
      @row-click="goToSession" />
    <p v-else class="text-gray-600 mb-6 ml-20">
      Aucune session disponible.
    </p>

    <!-- FORMULAIRE AJOUT SESSION -->
    <AddFormComponent class="mt-10" :titre="'Ajouter une session'" :type="'input'" :options="[]"
      :placeholder="'Nom de la session'" :prefixLabel="'Créer'" :messageDoublon="'Cette session existe déjà.'"
      :existants="sessions" :identifiant="'label'" @ajout="handleAddSession" />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

import {
  addSession,
  getSessions
} from '@/services/sessionsService.js'

export default {
  components: {
    BreadcrumbComponent,
    TableComponent,
    AddFormComponent
  },
  data() {
    return {
      sessions: []
    }
  },
  async mounted() {
    await this.loadSessions()
  },
  methods: {
    async loadSessions() {
      try {
        this.sessions = await getSessions()
      } catch (error) {
        console.error('Erreur chargement sessions:', error.message)
      }
    },
    async handleAddSession(label) {
      try {
        await addSession(label)
        await this.loadSessions()
      } catch (error) {
        console.error('Erreur ajout session:', error.message)
      }
    },
    goToSession(session) {
      this.$router.push(`/sessions/${session.id}`)
    }
  }
}
</script>
