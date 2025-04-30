<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-2xl font-bold text-sky-700 mb-6">
      UE évaluées dans la session {{ sessionLabel }}
    </h2>

    <!-- TABLEAU DES UEs -->
    <TableComponent :headers="['UE']" :data="ues" :columns="['ue']" @row-click="goToUE" />


    <!-- FORMULAIRE AJOUT UE -->
    <AddFormComponent :titre="'Ajouter une UE dans la session'" :options="allUEs" :existants="ues" :identifiant="'ue'"
      :prefixLabel="'Ajouter'" :placeholder="'Choisissez une UE'"
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
} from '@/services/sessionDetailService'

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
      selectedUE: '',
      allUEs: [],
      ues: [] // UEs déjà liées à cette session
    }
  },
  methods: {
    async fetchSessionLabel() {
      try {
        const session = await getSessionById(this.sessionId)
        this.sessionLabel = session.label
      } catch (error) {
        console.error('Erreur récupération label session:', error.message)
      }
    },
    async fetchSessionUEs() {
      try {
        this.ues = await getSessionUEs(this.sessionId)
      } catch (error) {
        console.error('Erreur récupération UEs session:', error.message)
      }
    },
    async fetchAllUEs() {
      try {
        this.allUEs = await getAllUEs()
      } catch (error) {
        console.error('Erreur récupération toutes les UEs:', error.message)
      }
    },
    async handleAddUE() {
      if (!this.selectedUE || this.isDuplicateUE) return
      try {
        await addUEToSession(this.sessionId, this.selectedUE)
        this.selectedUE = ''
        await this.fetchSessionUEs()
      } catch (error) {
        console.error('Erreur ajout UE:', error.message)
      }
    },
    goToUE(ueRow) {
      this.$router.push(`/ue/${ueRow.ue}/session/${this.sessionId}`)
    }

  },
  async mounted() {
    await this.fetchSessionLabel()
    await this.fetchAllUEs()
    await this.fetchSessionUEs()
  },
  computed: {
    isDuplicateUE() {
      return this.ues.some(item => item.id === this.selectedUE)
    }
  }
}
</script>
