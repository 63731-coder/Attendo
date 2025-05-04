<template>
  <div class="ml-10 space-y-10">
    <BreadcrumbComponent :items="breadcrumbItems" />

    <h2 class="text-2xl font-semibold text-sky-800">
      Session {{ sessionLabel }}
    </h2>

    <div>
      <TableComponent v-if="ueList.length > 0" :headers="['Code UE']" :data="ueList" :columns="['ue']"
        @row-click="goToUE" />

      <p v-else class="italic text-gray-600 ml-15">
        Aucune UE n’a encore été ajoutée à cette session.
      </p>
    </div>

    <AddFormComponent titre="Ajouter une UE à cette session" :options="ueDisponibles" :existants="ueList"
      bouton-label="Ajouter" prefix-label="UE" placeholder="Choisissez une UE"
      message-doublon="Cette UE est déjà ajoutée." identifiant="ue" type="select" @ajout="ajouterUE" />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import SessionService from '@/services/sessionService'

export default {
  name: 'SessionView',
  components: {
    BreadcrumbComponent,
    TableComponent,
    AddFormComponent
  },
  data() {
    return {
      sessionLabel: '',
      sessionId: null,
      ueList: [],       // UEs déjà ajoutées à cette session
      ueOptions: [],    // Toutes les UEs possibles
      breadcrumbItems: [
        { label: 'Accueil', to: '/' },
        { label: 'Sessions', to: '/sessions' },
        { label: 'Session' }
      ]
    }
  },
  computed: {
    // exclure ue déjà ajoutées
    ueDisponibles() {
      const existantes = this.ueList.map(ue => ue.ue)
      return this.ueOptions.filter(ue => !existantes.includes(ue))
    }
  },
  methods: {
    async charger() {
      try {
        const session = await SessionService.getSessionByLabel(this.sessionLabel)
        this.sessionId = session.id

        this.ueList = await SessionService.getUEsForSession(this.sessionId)
        this.ueOptions = await SessionService.getAllUEs()
      } catch (err) {
        console.error('Erreur lors du chargement :', err.message)
      }
    },
    async ajouterUE(nouvelleUE) {
      try {
        await SessionService.addUEToSession(this.sessionId, nouvelleUE)
        this.ueList = await SessionService.getUEsForSession(this.sessionId)
      } catch (err) {
        console.error("Erreur lors de l'ajout :", err.message)
      }
    },
    goToUE(row) {
      this.$router.push({
        name: 'UEView',
        params: {
          sessionLabel: this.sessionLabel,
          ue: row.ue
        }
      })
    }

  },
  async mounted() {
    this.sessionLabel = this.$route.params.label
    this.charger()
  }
}
</script>
