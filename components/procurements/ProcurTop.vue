<template>
  <b-table :fields="fields" :items="topProcurements" striped sticky-header="100%" class="w-100 m-0">
    <template v-slot:cell(npp)="row">{{ row.index + 1 }}</template>
  </b-table>
</template>

<script>
export default {
  name: 'ProcurTop',
  data() {
    return {
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'ktru_code',
          label: 'КТРУ',
          class: 'align-middle',
        },
        {
          key: 'name',
          label: 'Наименование',
          class: 'align-middle w-50',
        },
        {
          key: 'count_top',
          label: 'Количество',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    topProcurements() {
      return this.$store.getters['procurements/getTopProcurements']
    },
  },
}
</script>
