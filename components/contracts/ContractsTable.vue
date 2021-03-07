<template>
  <div>
    <b-table
      :fields="fields"
      :items="currentItems"
      striped
      sticky-header="100%"
      class="w-100 m-0"
      @row-dblclicked="doubleClick"
    >
      <template v-slot:cell(npp)="row">{{ row.index + 1 }}</template>
      <template v-slot:cell(sign_date)="row"> {{ $moment(row.item.sign_date).format('DD.MM.YYYY') }}</template>
      <template v-slot:cell(download_url)="row">
        <a v-if="row.item && row.item.download_url" :href="row.item.download_url" download>
          <b-icon-download class="m-0 h4 pointer"></b-icon-download>
        </a>
      </template>
    </b-table>
    <b-sidebar
      id="procurement-object"
      bg-variant="gray-200"
      backdrop-variant="secondary"
      width="50%"
      backdrop
      right
      shadow=""
      lazy
    >
      <ProcurObject></ProcurObject>
    </b-sidebar>
  </div>
</template>

<script>
import ProcurObject from '../procurements/ProcurObject'
export default {
  name: 'ContractsTable',
  components: { ProcurObject },
  props: {
    source: {
      type: String,
      default: null,
    },
    propContracts: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'sign_date',
          label: 'Дата подписания',
          class: 'align-middle',
        },
        {
          key: 'reg_num',
          label: '№ контракта',
          class: 'align-middle',
        },
        {
          key: 'customer_inn',
          label: 'ИНН',
          class: 'align-middle',
        },
        {
          key: 'customer_name',
          label: 'Заказчик',
          class: 'align-middle',
        },
        {
          key: 'price',
          label: 'Цена',
          class: 'align-middle',
        },
        {
          key: 'count_procurement_objects',
          label: 'Кол-во объектов закупки с КТРУ',
          class: 'align-middle',
        },
        {
          key: 'download_url',
          label: '',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    selectedContract() {
      return this.$store.getters['procurements/getContractId']
    },
    currentProcurement() {
      return this.$store.getters['procurements/getCurrentProcurement']
    },
    currentItems() {
      let items = []
      switch (this.source) {
        case 'contracts-manage':
          items = JSON.parse(JSON.stringify(this.$store.getters['contracts/getContracts']))
          break
        case 'procur-table':
          items = JSON.parse(JSON.stringify(this.$store.getters['contracts/getContractsByKtru']))
          break
      }
      return items
    },
  },
  watch: {
    selectedContract() {
      this.$store.dispatch('procurements/fetchCurrentProcurement')
    },
  },
  methods: {
    doubleClick(contract) {
      this.$store.commit('procurements/SAVE_CURRENT_PROCUREMENT_CONTRACT_ID', contract.id)
      this.$root.$emit('bv::toggle::collapse', 'procurement-object')
    },
  },
}
</script>
