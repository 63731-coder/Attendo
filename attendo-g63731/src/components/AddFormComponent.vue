<template>
  <div class="bg-white rounded-xl shadow-md p-5 w-full max-w-md mt-10">
    <h3 class="text-lg font-semibold mb-3">{{ titre }}</h3>
    <form @submit.prevent="handleSubmit" class="flex gap-0 shadow rounded overflow-hidden max-w-md">
      <span class="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-r-0 flex items-center">
        {{ prefixLabel }}
      </span>

      <!-- input ou select selon type -->
      <input v-if="type === 'input'" v-model="selectedValue" type="text" :placeholder="placeholder"
        class="flex-1 px-4 py-2 border-t border-b border-gray-300 focus:outline-none bg-gray-50 text-gray-800" />

      <select v-else v-model="selectedValue"
        class="flex-1 px-4 py-2 border-t border-b border-gray-300 focus:outline-none bg-gray-50 text-gray-800">
        <option disabled value="">-- {{ placeholder }} --</option>
        <option v-for="(item, i) in options" :key="i" :value="item">
          {{ item }}
        </option>
      </select>


      <button type="submit"
        class="px-4 py-2 border border-gray-300 text-sky-700 font-medium hover:bg-sky-50 transition rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedValue || isDuplicate">
        {{ boutonLabel }}
      </button>
    </form>

    <p v-if="isDuplicate" class="text-red-500 text-sm mt-2">
      {{ messageDoublon }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'FormulaireAjout',
  props: {
    titre: { type: String, default: 'Ajouter un élément' },
    options: { type: Array, required: true },
    existants: { type: Array, default: () => [] },
    boutonLabel: { type: String, default: "Ajouter" },
    prefixLabel: { type: String, default: "Ajouter" },
    placeholder: { type: String, default: "Choisissez une valeur" },
    messageDoublon: { type: String, default: "Cet élément existe déjà." },
    identifiant: { type: String, default: 'ue' }, // clé de comparaison (ex : 'ue', 'id', etc.)
    type: { type: String, default: 'select' }
  },
  emits: ['ajout'],
  data() {
    return {
      selectedValue: ''
    }
  },
  computed: {
    isDuplicate() {
      return this.existants.some(item => {
        const val = typeof item === 'object' ? item[this.identifiant] : item
        return val === this.selectedValue
      })
    }
  },
  methods: {
    handleSubmit() {
      if (!this.isDuplicate && this.selectedValue) {
        this.$emit('ajout', this.selectedValue)
        this.selectedValue = ''
      }
    }
  }
}
</script>
