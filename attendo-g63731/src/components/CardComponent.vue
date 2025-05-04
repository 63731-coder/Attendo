<template>
  <div
    @click="$emit('click')"
    class="bg-white text-center font-semibold px-6 py-4 rounded-xl shadow w-40 h-40 capitalize cursor-pointer hover:bg-gray-200 transition"
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
