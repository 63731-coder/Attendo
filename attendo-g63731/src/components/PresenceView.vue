<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <BreadcrumbComponent />

    <h2 class="text-xl font-bold text-sky-700 mb-4">
      Prise de présence du local {{ roomLabel }} par {{ supervisor || '—' }}
    </h2>

    <!-- Choix du surveillant -->
    <AddFormComponent class="mb-6" :titre="'Choisir/modifier le surveillant'" :type="'select'" :options="supervisors"
      :existants="[{ acro: supervisor }]" :identifiant="'acro'" :prefixLabel="'Surveillant'"
      :placeholder="'Choisissez un nom'" :boutonLabel="'Définir'" :messageDoublon="'Ce surveillant est déjà défini.'"
      @ajout="updateSupervisorHandler" />



    <!-- Table des étudiants -->
    <table class="w-full bg-white shadow rounded">
      <thead class="bg-gray-200 text-left">
        <tr>
          <th class="p-2">MATRICULE</th>
          <th class="p-2">GROUP</th>
          <th class="p-2">NOM</th>
          <th class="p-2">PRÉNOM</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id" @click="togglePresence(student.id)"
          :class="presentIds.includes(student.id) ? 'bg-blue-100 cursor-pointer' : 'cursor-pointer'">
          <td class="p-2">{{ student.id }}</td>
          <td class="p-2">{{ student.group }}</td>
          <td class="p-2">{{ student.last_name }}</td>
          <td class="p-2">{{ student.first_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import {
  getAllSupervisors,
  getExaminationRoom,
  getPresentStudentIds,
  getStudentsForUE,
  toggleStudentPresence,
  updateRoomSupervisor
} from '@/services/presenceService'
import AddFormComponent from './AddFormComponent.vue'

export default {
  components: { BreadcrumbComponent, AddFormComponent },
  data() {
    return {
      sessionId: this.$route.params.sessionId,
      ueId: this.$route.params.ueId,
      eventId: this.$route.params.eventId,
      roomLabel: this.$route.params.id,

      roomId: null,
      students: [],
      presentIds: [],
      supervisor: '',
      selectedSupervisor: '',
      supervisors: []
    }
  },
  async mounted() {
    console.log('eventId:', this.eventId)
    console.log('roomLabel:', this.roomLabel)
    console.log('supervisors: ',this.supervisors)

    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        //const compoId = await getSessionCompoId(this.sessionId, this.ueId)
        this.students = await getStudentsForUE(this.ueId)

        const room = await getExaminationRoom(this.eventId, this.roomLabel)
        this.roomId = room.id
        this.supervisor = room.supervisor
        this.selectedSupervisor = room.supervisor

        this.presentIds = await getPresentStudentIds(this.roomId)
        this.supervisors = (await getAllSupervisors()).map(t => t.acro)

      } catch (e) {
        console.error('Erreur chargement données présence :', e.message)
      }
    },

    async togglePresence(studentId) {
      try {
        const isPresent = this.presentIds.includes(studentId)
        await toggleStudentPresence(this.roomId, studentId, isPresent)
        this.presentIds = await getPresentStudentIds(this.roomId)
      } catch (e) {
        console.error('Erreur mise à jour présence :', e.message)
      }
    },

    async updateSupervisorHandler(supName) {
      try {
        await updateRoomSupervisor(this.roomId, supName)
        this.supervisor = supName
      } catch (e) {
        console.error('Erreur mise à jour surveillant :', e.message)
      }
    }

  }
}
</script>
