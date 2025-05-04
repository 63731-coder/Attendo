<template>
  <div class="ml-10 mt-6">
    <h1 class="text-xl font-bold text-purple-700">
      Détail de la salle {{ room }} ({{ eventLabel }} - {{ ue }})
    </h1>
  </div>
</template>

<script>
export default {
  name: 'RoomView',
  computed: {
    sessionLabel() {
      return this.$route.params.sessionLabel
    },
    ue() {
      return this.$route.params.ue
    },
    eventLabel() {
      return this.$route.params.eventLabel
    },
    room() {
      return this.$route.params.room
    }
  }
}
</script>
