<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-xl font-bold text-sky-700 mb-6">
      Liste des épreuves pour l'UE {{ ueId }}
    </h2>

    <div class="flex gap-4 flex-wrap mb-6">
      <CardComponent v-for="ev in events" :key="ev.id" :label="ev.label" />
    </div>

    <p v-if="events.length === 0" class="text-gray-600 mb-6 ml-20">
      Aucune épreuve pour ce UE.
    </p>

    <AddFormComponent
      class="mt-10"
      :titre="'Ajouter une épreuve'"
      :type="'input'"
      :options="[]"
      :placeholder="'bilan, projet, examen..'"
      :prefixLabel="'Intitulé'"
      :messageDoublon="'Cette épreuve existe déjà.'"
      :existants="events"
      :identifiant="'label'"
      @ajout="addEvent"
    />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import CardComponent from '@/components/CardComponent.vue'

import {
  addEventToCompo,
  getEventsBySessionCompo,
  getSessionCompoId
} from '../services/ueService'

export default {
  components: {
    BreadcrumbComponent,
    AddFormComponent,
    CardComponent
  },
  data() {
    return {
      ueId: this.$route.params.id,
      sessionId: Number(this.$route.params.sessionId),
      events: [],
      compoId: null
    }
  },
  async mounted() {
    this.compoId = await getSessionCompoId(this.sessionId, this.ueId)
    if (!this.compoId) return

    await this.loadEvents()
  },
  methods: {
    async loadEvents() {
      if (!this.compoId) return
      this.events = await getEventsBySessionCompo(this.compoId)
    },

    async addEvent(label) {
      try {
        await addEventToCompo(label, this.compoId)
        await this.loadEvents()
      } catch (error) {
        console.error("Erreur addEvent from UE:", error.message)
      }
    }
  }
}
</script>
