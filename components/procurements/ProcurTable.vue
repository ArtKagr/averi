<template>
  <div>
    <b-table
      :fields="fields"
      :items="procurements"
      striped
      sticky-header="100%"
      class="w-100 m-0"
      @row-dblclicked="doubleClick"
    >
      <template v-slot:cell(npp)="row">{{ row.index + 1 }}</template>
    </b-table>
    <b-sidebar
      id="ktru-table-contracts"
      bg-variant="gray-200"
      backdrop-variant="secondary"
      width="90%"
      backdrop
      right
      no-header
      shadow=""
      lazy
    >
      <div class="d-flex flex-column h-100">
        <contract-filter source="procur-table"></contract-filter>
        <contracts-table class="overflow-auto h-100" source="procur-table"></contracts-table>
        <menu-bottom model="procur-table"></menu-bottom>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import ContractsTable from '../contracts/ContractsTable'
import ContractFilter from '../contracts/ContractFilter'
import MenuBottom from '../dashboard/MenuBottom'
export default {
  name: 'ProcurTable',
  components: { MenuBottom, ContractFilter, ContractsTable },
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
    procurements() {
      return this.$store.getters['procurements/getTopProcurements']
    },
    currentKtru() {
      return this.$store.getters['contracts/getCurrentKtru']
    },
  },
  watch: {
    currentKtru() {
      this.$store.dispatch('contracts/fetchContractsByKtru')
    },
  },
  methods: {
    doubleClick(procurement) {
      this.$store.commit('contracts/SAVE_CURRENT_PROCUREMENT_KTRU', procurement.ktru_code)
      this.$root.$emit('bv::toggle::collapse', 'ktru-table-contracts')
    },
  },
}
</script>
