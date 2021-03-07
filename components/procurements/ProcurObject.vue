<template>
  <div class="р-100 overflow-auto">
    <b-table :fields="fields" :items="currentProcurement" striped sticky-header="100%" class="w-100 m-0">
      <template v-slot:cell(npp)="row">{{ row.index + 1 }}</template>
      <template v-slot:cell(price_all)="row">{{ (row.item.price_of_one * row.item.count).toFixed(2) }}</template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'ProcurObject',
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
          class: 'align-middle',
        },
        {
          key: 'count',
          label: 'Количество',
          class: 'align-middle',
        },
        {
          key: 'price_of_one',
          label: 'Цена за ед.',
          class: 'align-middle',
        },
        {
          key: 'price_all',
          label: 'Цена общая',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    currentProcurement() {
      return this.$store.getters['procurements/getCurrentProcurement']
    },
  },
}
</script>
