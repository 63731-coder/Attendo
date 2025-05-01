<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <BreadcrumbComponent />

    <h2 class="text-xl font-bold text-sky-700 mb-6">
      Liste des locaux pour <span class="font-semibold">Examen - {{ eventCode }}</span>
    </h2>

    <div class="flex gap-4 flex-wrap mb-6 ml-20">
      <div
        v-for="room in rooms"
        :key="room.room"
        class="border rounded-xl px-6 py-4 bg-white shadow-sm text-center"
      >
        <div class="text-xl font-bold">{{ room.room }}</div>
        <div class="mt-2 text-sm">
          <span class="font-semibold">Surveillant</span> {{ room.supervisor || '-' }}
        </div>
      </div>
    </div>

    <p v-if="rooms.length === 0" class="text-gray-600 mb-6 ml-20">
      Aucun local pour cette épreuve.
    </p>

    <AddFormComponent
      class="mt-8"
      :titre="'Ajouter un local'"
      :type="'select'"
      :options="availableRooms"
      :existants="rooms"
      :identifiant="'room'"
      :placeholder="'Choisissez un local'"
      :prefixLabel="'Local'"
      :messageDoublon="'Ce local est déjà assigné.'"
      @ajout="handleAddRoom"
    />
  </div>
</template>

<script>
import {
  addRoomToEvent,
  getAvailableRooms,
  getRoomsForEvent
} from '@/services/examinationRoomService.js'

import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'

export default {
  components: {
    AddFormComponent,
    BreadcrumbComponent
  },
  data() {
    return {
      eventId: this.$route.params.id,
      eventCode: 'exemple', // à améliorer via API plus tard
      rooms: [],
      availableRooms: [],
      capacities: {}
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.rooms = await getRoomsForEvent(this.eventId)
        this.availableRooms = await getAvailableRooms(this.eventId)
      } catch (e) {
        console.error('Erreur chargement locaux:', e.message)
      }
    },
    async handleAddRoom(roomLabel) {
      try {
        await addRoomToEvent(this.eventId, roomLabel)
        await this.loadData()
      } catch (e) {
        console.error('Erreur ajout local:', e.message)
      }
    }
  }
}
</script>
