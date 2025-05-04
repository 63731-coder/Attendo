<template>
  <div class="ml-10 space-y-8">
    <BreadcrumbComponent :items="breadcrumbItems" />

    <h2 class="text-2xl font-semibold text-sky-800">
      Prise de présence du local {{ roomLabel }}
      <span v-if="currentSupervisor" class="text-black">par {{ currentSupervisor }}</span>
    </h2>

    <!-- Formulaire choix surveillant -->
    <AddFormComponent
      :titre="'Définir un surveillant'"
      :options="availableSupervisors"
      :existants="[]"
      bouton-label="Valider"
      prefix-label="Surveillant"
      placeholder="Choisir/Modifier un surveillant"
      identifiant=""
      type="select"
      @ajout="validerSurveillant"
    />

    <!-- Tableau étudiants avec clic ligne -->
    <TableComponent
      :headers="['Matricule', 'Groupe', 'Nom', 'Prénom']"
      :data="students"
      :columns="['student_id', 'group', 'lastname', 'firstname']"
      :rowClass="getRowClass"
      @row-click="togglePresence"
    />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import TableComponent from '@/components/TableComponent.vue'
import RoomService from '@/services/roomService'

export default {
  name: 'RoomView',
  components: {
    BreadcrumbComponent,
    TableComponent,
    AddFormComponent
  },
  data() {
    return {
      sessionLabel: this.$route.params.sessionLabel,
      ue: this.$route.params.ue,
      eventLabel: this.$route.params.eventLabel,
      roomLabel: this.$route.params.roomLabel,
      students: [],
      currentSupervisor: null,
      availableSupervisors: [],
      roomId: null,
      breadcrumbItems: [
        { label: 'Accueil', to: '/' },
        { label: 'sessions', to: '/sessions' },
        { label: 'session', to: `/sessions/${this.sessionLabel}` },
        { label: 'ue', to: `/sessions/${this.sessionLabel}/ue/${this.ue}` },
        { label: 'épreuve', to: `/sessions/${this.sessionLabel}/ue/${this.ue}/event/${this.eventLabel}` },
        { label: 'local' }
      ]
    }
  },
  methods: {
    async chargerEtudiantsEtSurveillant() {
      try {
        const { students, supervisor, availableSupervisors } =
          await RoomService.getRoomStudentsAndSupervisor(
            this.sessionLabel,
            this.ue,
            this.eventLabel,
            this.roomLabel
          )

        this.students = students
        this.currentSupervisor = supervisor
        this.availableSupervisors = availableSupervisors

        const sessionCompoId = await RoomService.getSessionCompoId(this.sessionLabel, this.ue)
        const eventId = await RoomService.getEventId(sessionCompoId, this.eventLabel)
        const examRoom = await RoomService.getExaminationRoom(eventId, this.roomLabel)
        this.roomId = examRoom.id
      } catch (err) {
        console.error('Erreur chargement salle :', err.message)
      }
    },

    async validerSurveillant(nouveauSupervisor) {
      try {
        await RoomService.setSupervisor(
          this.sessionLabel,
          this.ue,
          this.eventLabel,
          this.roomLabel,
          nouveauSupervisor
        )
        this.currentSupervisor = nouveauSupervisor
        this.chargerEtudiantsEtSurveillant()
      } catch (err) {
        console.error('Erreur définition surveillant :', err.message)
      }
    },

    async togglePresence(student) {
      try {
        await RoomService.toggleStudentPresence(this.roomId, student.student_id, student.isPresent)
        student.isPresent = !student.isPresent
      } catch (error) {
        console.error("Erreur lors du changement de présence :", error)
      }
    },

    getRowClass(student) {
      return student.isPresent ? 'bg-blue-200' : 'bg-white'
    }
  },
  mounted() {
    this.chargerEtudiantsEtSurveillant()
  }
}
</script>
