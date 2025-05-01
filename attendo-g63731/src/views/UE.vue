<template>
  <div class="bg-gray-100 min-h-screen px-6 pt-6">
    <BreadcrumbComponent />

    <h2 class="text-xl font-bold text-sky-700 mb-6">
      Liste des épreuves pour l'UE {{ ueId }}
    </h2>

    <!-- TABLEAU DES ÉPREUVES -->
    <div class="flex gap-4 flex-wrap mb-6">
      <CardComponent v-for="ev in events" :key="ev.id" :label="ev.label" />
    </div>

    <!-- FORMULAIRE AJOUT -->
    <AddFormComponent class="mt-10" :titre="'Ajouter une épreuve'" :type="'input'" :options="[]"
      :placeholder="'Nom de lépreuve'" :prefixLabel="'Créer'" :messageDoublon="'Cette épreuve existe déjà.'"
      :existants="events" :identifiant="'label'" @ajout="addEvent" />
  </div>
</template>

<script>
import AddFormComponent from '@/components/AddFormComponent.vue'
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue'
import CardComponent from '@/components/CardComponent.vue'
import { supabase } from '@/supabase'

export default {
  components: {
    BreadcrumbComponent,
    AddFormComponent,
    CardComponent
  },
  data() {
    return {
      ueId: null,
      sessionId: this.$route.params.sessionId,
      events: [],
      compoId: null // utilisé pour l'insertion
    }
  },
  computed: {
    ueLabel() {
      return this.ueId?.label || 'UE'
    }
  },
  async mounted() {
    const id = await this.getSessionCompoId()
    if (!id) return

    this.compoId = id
    this.ueId = this.$route.params.ueId
    console.log('this.compoId:', this.compoId)
    console.log('Route params:', this.$route.params)

    await this.loadEvents()
  },
  methods: {
    async loadEvents() {
      if (!this.compoId) {
        console.warn('compoId manquant – impossible de charger les événements')
        return
      }

      const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('session_compo', this.compoId)

      if (error) {
        console.error('Erreur chargement events:', error.message)
      } else {
        this.events = data
      }
    },

    async addEvent(label) {
      const { error } = await supabase.from('event').insert([
        {
          label,
          session_compo: this.compoId,
          completed: false
        }
      ])

      if (!error) {
        await this.loadEvents()
      } else {
        console.error('Erreur ajout event:', error.message)
      }
    },

    async getSessionCompoId() {
      console.log('ueId:', this.$route.params.id);
      console.log('sessionId:', this.$route.params.sessionId);
      const { data, error } = await supabase
        .from('session_compo')
        .select('id')
        .eq('ue', this.$route.params.id)
        .eq('session', this.$route.params.sessionId)
        .maybeSingle()
      if (error || !data) {
        console.error('Erreur récupération session_compo:', error?.message || 'Pas de résultat')
        return null
      }
      return data.id
    }
  }
}
</script>
