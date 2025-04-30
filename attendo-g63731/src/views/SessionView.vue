<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

import { addSession, getSessions } from '@/services/listSessionsService'

export default {
  name: 'SessionsView',
  components: {
    BreadcrumbComponent,
    TableComponent,
    AddFormComponent
  },
  data() {
    return {
      sessions: [],
    }
  },
  methods: {
    async fetchSessions() {
      try {
        this.sessions = await getSessions()
      } catch (error) {
        console.error('Erreur récupération sessions', error.message)
      }
    },
    async handleAddSession(sessionLabel) {
      try {
        await addSession(sessionLabel)
        await this.fetchSessions()
      } catch (error) {
        console.error('Erreur ajout session', error.message)
      }
    },
    goToSession(row) {
      this.$router.push(`/sessions/${row.id}`)
    }
  },
  mounted() {
    this.fetchSessions()
  }
}
</script>


<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-3xl font-bold text-sky-700 mb-8">Sessions</h2>

    <!-- TABLE DES SESSIONS -->
    <div class="flex justify-center mb-12">
      <TableComponent
        :headers="['Sessions']"
        :data="sessions"
        :columns="['label']"
        @row-click="goToSession"
      />
    </div>

    <!-- FORMULAIRE AJOUT -->
    <AddFormComponent
      :titre="'Ajouter une session'"
      :options="[]"
      :existants="sessions"
      :identifiant="'label'"
      :type="'input'"
      :placeholder="'Nom de la session'"
      :prefixLabel="'Ajouter'"
      :boutonLabel="'Ajouter'"
      :messageDoublon="'Cette session existe déjà.'"
      @ajout="handleAddSession"
    />
  </div>
</template>

