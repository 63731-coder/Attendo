<template>
  <div class="ml-10 space-y-10">
    <BreadcrumbComponent :items="breadcrumbItems" />

    <h2 class="text-2xl font-semibold text-sky-800">
      Liste des locaux pour <span class="font-bold">{{ eventLabel }}</span> - {{ ue }}
    </h2>

    <!-- Cartes de locaux -->
    <div class="flex gap-4 flex-wrap">
      <div
        v-for="(item, index) in rooms"
        :key="index"
        class="border p-4 rounded shadow w-40 text-center"
      >
        <div class="text-lg font-bold">{{ item.room }}</div>
        <div class="text-sm text-gray-600">{{ item.nbStudents }} / {{ item.capacity }}</div>
        <div class="text-sm font-semibold mt-2 capitalize">
          {{ item.supervisor || 'Surveillant' }}
        </div>
      </div>
    </div>

    <!-- Formulaire ajout local -->
    <AddFormComponent
      titre="Ajouter un local"
      :options="availableRooms"
      :existants="rooms"
      bouton-label="Ajouter"
      prefix-label="Local"
      placeholder="Choisissez un local"
      message-doublon="Ce local est déjà ajouté."
      identifiant="room"
      type="select"
      @ajout="ajouterSalle"
    />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import EventService from '@/services/eventService'

export default {
  name: 'EventView',
  components: { BreadcrumbComponent, AddFormComponent },
  data() {
    return {
      sessionLabel: this.$route.params.sessionLabel,
      ue: this.$route.params.ue,
      eventLabel: this.$route.params.eventLabel,
      breadcrumbItems: [
        { label: 'Accueil', to: '/' },
        { label: 'sessions', to: '/sessions' },
        { label: 'session', to: `/sessions/${this.$route.params.sessionLabel}` },
        { label: 'ue', to: `/sessions/${this.$route.params.sessionLabel}/ue/${this.$route.params.ue}` },
        { label: 'épreuve' }
      ],
      rooms: [],
      availableRooms: [],
      eventId: null
    }
  },
  methods: {
    async charger() {
      try {
        const sessionCompoId = await EventService.getSessionCompoId(this.sessionLabel, this.ue)
        this.eventId = await EventService.getEventId(sessionCompoId, this.eventLabel)
        const rawRooms = await EventService.getRooms(this.eventId)
        const studentCounts = await EventService.getNbStudentsByRoom()
        const capacities = await EventService.getRoomCapacities()
        const allRooms = await EventService.getAllRoomLabels()

        this.rooms = rawRooms.map(r => ({
          room: r.room,
          supervisor: r.supervisor,
          nbStudents: studentCounts[r.id] || 0,
          capacity: capacities[r.room] || 0
        }))

        this.availableRooms = allRooms.filter(r => !this.rooms.find(er => er.room === r))
      } catch (err) {
        console.error(err.message)
      }
    },
    async ajouterSalle(roomLabel) {
      try {
        await EventService.addRoomToEvent(this.eventId, roomLabel)
        this.charger()
      } catch (err) {
        console.error('Erreur ajout local :', err.message)
      }
    }
  },
  mounted() {
    this.charger()
  }
}
</script>
