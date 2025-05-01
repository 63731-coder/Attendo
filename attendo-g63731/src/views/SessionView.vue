<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-2xl font-bold text-sky-700 mb-6">
      UE évaluées dans la session {{ sessionLabel }}
    </h2>

    <!-- TABLEAU DES UEs -->
    <TableComponent v-if="ues.length > 0" :headers="['UE']" :data="ues" :columns="['ue']" @row-click="goToUE" />
    <p v-else class="text-gray-600 mb-6 ml-20">
      Aucune ue pour cette session
    </p>

    <!-- FORMULAIRE AJOUT UE -->
    <AddFormComponent class="mt-10" :titre="'Ajouter une UE dans la session'" :options="allUEs" :existants="ues"
      :identifiant="'id'" :prefixLabel="'Ajouter'" :placeholder="'Choisissez une UE'"
      :messageDoublon="'Cette UE est déjà ajoutée à la session.'" @ajout="handleAddUE" />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

import {
  addUEToSession,
  getAllUEs,
  getSessionById,
  getSessionUEs
} from '@/services/sessionService.js'

export default {
  components: {
    BreadcrumbComponent,
    TableComponent,
    AddFormComponent
  },
  data() {
    return {
      sessionId: this.$route.params.id,
      sessionLabel: '',
      allUEs: [],
      ues: []
    }
  },
  async mounted() {
    await this.loadSessionLabel()
    await this.loadAllUEs()
    await this.loadSessionUEs()
  },
  methods: {
    async loadSessionLabel() {
      try {
        const session = await getSessionById(this.sessionId)
        this.sessionLabel = session.label
      } catch (error) {
        console.error('Erreur récupération label session:', error.message)
      }
    },
    async loadAllUEs() {
      try {
        this.allUEs = await getAllUEs()
      } catch (error) {
        console.error('Erreur récupération toutes les UEs:', error.message)
      }
    },
    async loadSessionUEs() {
      try {
        this.ues = await getSessionUEs(this.sessionId)
      } catch (error) {
        console.error('Erreur récupération UEs session:', error.message)
      }
    },
    async handleAddUE(ueLabel) {
      try {
        await addUEToSession(this.sessionId, ueLabel)
        await this.loadSessionUEs()
      } catch (error) {
        console.error('Erreur ajout UE:', error.message)
      }
    },
    goToUE(ueRow) {
      this.$router.push(`/sessions/${this.sessionId}/${ueRow.id}`)
    }
  }
}
</script>
