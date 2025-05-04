<template>
  <div>
    <div v-if="rooms.length > 0" class="flex gap-4 flex-wrap ml-15">
      <div v-for="(item, index) in rooms" :key="index"
        class="border p-4 rounded shadow w-40 text-center cursor-pointer hover:bg-gray-100 transition"
        @click="$emit('room-click', item.room)">
        <div class="text-lg font-bold">{{ item.room }}</div>

        <!-- Capacité utilisée -->
        <div class="text-sm text-gray-600">
          {{ item.nbStudents }} / {{ item.capacity }} étudiants
        </div>

        <!-- Capacité restante -->


        <!-- Surveillant -->
        <div class="text-sm font-semibold mt-2 capitalize">
          {{ item.supervisor || 'Surveillant' }}
        </div>
      </div>
    </div>

    <p v-else class="text-gray-600 italic ml-15">
      Aucun local n’a été prévu pour l’évaluation. Veuillez en ajouter !
    </p>
  </div>
</template>

<script>
export default {
  name: 'RoomComponent',
  props: {
    rooms: {
      type: Array,
      required: true
    }
  },
  emits: ['room-click']
}
</script>
