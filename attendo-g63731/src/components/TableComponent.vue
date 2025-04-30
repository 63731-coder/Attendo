<template>
  <div class="overflow-hidden rounded-xl shadow bg-white w-[90%] mx-auto ">

    <table class="min-w-full table-fixed">
      <thead class="bg-gray-100 text-left">
        <tr class="bg-black text-white">
          <th v-for="(header, index) in headers" :key="index" class="text-left px-4 py-2 font-semibold">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="hover:bg-gray-300 cursor-pointer transition"
          @click="$emit('row-click', row)">
          <td v-for="(col, colIndex) in columns" :key="colIndex" class="px-4 py-2 text-blue-600">
            {{ row.label }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
export default {
  name: 'DataTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleRowClick(row) {
      this.$emit('row-click', row);
    }
  }
};
</script>
