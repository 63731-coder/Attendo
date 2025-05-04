<template>
  <div class="ml-10 space-y-8">
    <BreadcrumbComponent :items="breadcrumbItems" />

    <h2 class="text-2xl font-semibold text-sky-800">
      Liste des épreuves de {{ ue }} (session : {{ sessionLabel }})
    </h2>

    <!-- Cards des épreuves -->
    <div class="flex gap-4 flex-wrap">
      <CardComponent
        v-for="(epreuve, index) in events"
        :key="index"
        :label="epreuve"
      />
    </div>

    <!-- Formulaire d’ajout -->
    <AddFormComponent
      titre="Ajouter une épreuve"
      :options="[]"
      :existants="events"
      bouton-label="Créer"
      prefix-label="Intitulé :"
      placeholder="bilan, projet, examen..."
      message-doublon="Cette épreuve existe déjà."
      identifiant=""
      type="input"
      @ajout="ajouterEpreuve"
    />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import CardComponent from '@/components/CardComponent.vue'
import UEService from '@/services/ueService'

export default {
  name: 'UEView',
  components: {
    BreadcrumbComponent,
    AddFormComponent,
    CardComponent
  },
  data() {
    return {
      sessionLabel: this.$route.params.sessionLabel,
      ue: this.$route.params.ue,
      sessionCompoId: null,
      events: [],
      breadcrumbItems: [
        { label: 'Accueil', to: '/' },
        { label: 'sessions', to: '/sessions' },
        { label: 'session', to: `/sessions/${this.$route.params.sessionLabel}` },
        { label: 'ue' }
      ]
    }
  },
  methods: {
    async charger() {
      try {
        this.sessionCompoId = await UEService.getSessionCompo(this.sessionLabel, this.ue)
        this.events = await UEService.getEvents(this.sessionCompoId)
      } catch (err) {
        console.error(err.message)
      }
    },
    async ajouterEpreuve(nouveauLabel) {
      try {
        await UEService.addEvent(this.sessionCompoId, nouveauLabel)
        this.events = await UEService.getEvents(this.sessionCompoId)
      } catch (err) {
        console.error('Erreur ajout épreuve :', err.message)
      }
    }
  },
  mounted() {
    this.charger()
  }
}
</script>
