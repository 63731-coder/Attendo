<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />
    <h2 class="text-xl font-bold text-sky-700 mb-6">
      Liste des épreuves pour la session_compo #{{ compoId }}
    </h2>

    <!-- Liste des épreuves -->
    <div class="flex gap-4 flex-wrap mb-6">
      <div
        v-for="ev in events"
        :key="ev.id"
        class="bg-white p-6 rounded-lg shadow text-center font-semibold w-40"
      >
        {{ ev.label }}
      </div>
    </div>

    <!-- Formulaire ajout épreuve -->
    <div class="bg-white rounded-xl shadow-md p-5 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-3">Ajouter une épreuve</h3>
      <form @submit.prevent="addEvent" class="flex gap-2">
        <input
          v-model="newLabel"
          type="text"
          placeholder="Intitulé : bilan, projet, examen..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded"
        />
        <button class="border px-4 py-2 rounded text-sky-600 border-sky-600 hover:bg-sky-50">
          Créer
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import { supabase } from '@/supabase'

export default {
  components: { BreadcrumbComponent },
  data() {
    return {
      compoId: this.$route.params.id,
      events: [],
      newLabel: ''
    }
  },
  async mounted() {
    await this.loadEvents()
  },
  methods: {
    async loadEvents() {
      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('session_compo', this.compoId)

      if (!error) this.events = data
    },
    async addEvent() {
      if (this.newLabel.trim() === '') return

      const { error } = await supabase.from('event').insert([
        {
          label: this.newLabel,
          session_compo: this.compoId,
          completed: false // valeur par défaut
        }
      ])

      if (!error) {
        this.newLabel = ''
        await this.loadEvents()
      }
    }
  }
}
</script>
