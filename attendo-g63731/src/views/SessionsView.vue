<template>
  <div class="ml-10 space-y-10">

    <BreadcrumbComponent :items="breadcrumbItems" />

    <TableComponent :headers="['Session']" :data="sessions" :columns="['label']" @row-click="goToDetail" />

    <!-- Formulaire d'ajout -->
    <AddFormComponent titre="Ajouter une session" :options="[]" :existants="sessions" bouton-label="Ajouter"
      prefix-label="Session" placeholder="Nom de la session (ex: janvier)" message-doublon="Cette session existe déjà."
      identifiant="label" type="input" @ajout="ajouterSession" />

  </div>
</template>

<script>
import AddFormComponent from "@/components/AddFormComponent.vue"
import BreadcrumbComponent from "@/components/BreadcrumbComponent.vue"
import TableComponent from "@/components/TableComponent.vue"
import { addSession, getSessions } from "@/services/sessionsService"

export default {
  name: "SessionsView",
  components: {
    TableComponent,
    AddFormComponent,
    BreadcrumbComponent

  },
  data() {
    return {
      sessions: [],
      breadcrumbItems: [
        { label: "Accueil", to: "/" },
        { label: "Sessions" }
      ]
    }
  },
  methods: {
    async chargerSessions() {
      try {
        this.sessions = await getSessions()
      } catch (error) {
        console.error("Erreur lors du chargement des sessions :", error)
      }
    },
    async ajouterSession(nouveauLabel) {
      try {
        await addSession(nouveauLabel)
        await this.chargerSessions() // Recharge la liste
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error)
      }
    },
    goToDetail(session) {
      this.$router.push({ name: 'Session', params: { label: session.label } })
    }


  },
  mounted() {
    this.chargerSessions()
  }
}
</script>
