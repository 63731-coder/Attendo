<template>
  <div
    @click="$emit('click')"
    class="bg-white text-center font-semibold px-6 py-4 rounded-xl shadow-xl w-40 h-40 capitalize cursor-pointer hover:bg-sky-300 transition"
  >
    {{ label }}
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    label: {
      type: String,
      required: true
    }
  },
  emits: ['click']
}
</script>
