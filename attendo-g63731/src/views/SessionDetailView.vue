<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-2xl font-bold text-sky-700 mb-6">
      UE évaluées dans la session {{ sessionLabel }}
    </h2>

    <!-- TABLEAU DES UEs -->
    <div class="bg-white rounded-xl shadow-md mb-12 overflow-hidden max-w-md">
      <div class="bg-sky-700 text-white uppercase px-4 py-2 font-semibold tracking-wide">
        UE
      </div>
      <ul>
        <li
          v-for="item in ues"
          :key="item.id"
          class="px-4 py-2 hover:bg-gray-300 border-t border-gray-100 cursor-pointer text-sky-600 font-medium transition"
        >
          {{ item.id }}
        </li>
      </ul>
    </div>

    <!-- FORMULAIRE AJOUT UE -->
    <div class="bg-white rounded-xl shadow-md p-5 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-3">Ajouter une UE dans la session</h3>
      <form @submit.prevent="handleAddUE" class="flex gap-0 shadow rounded overflow-hidden max-w-md">
        <span class="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-r-0 flex items-center">
          Ajouter
        </span>

        <select v-model="selectedUE"
          class="flex-1 px-4 py-2 border-t border-b border-gray-300 focus:outline-none bg-gray-50 text-gray-800">
          <option disabled value="">Choisissez une UE</option>
          <option v-for="ue in allUEs" :key="ue" :value="ue">
            {{ ue }}
          </option>
        </select>

        <button
          type="submit"
          class="px-4 py-2 border border-gray-300 text-sky-700 font-medium hover:bg-sky-50 transition rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedUE || isDuplicateUE"
        >
          Ajouter l'UE
        </button>
      </form>

      <p v-if="isDuplicateUE" class="text-red-500 text-sm mt-2">
        Cette UE est déjà ajoutée à la session.
      </p>
    </div>
  </div>
</template>

<script>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import {
  addUEToSession,
  getAllUEs,
  getSessionById,
  getSessionUEs
} from '@/services/sessionDetailService'

export default {
  components: {
    BreadcrumbComponent
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
