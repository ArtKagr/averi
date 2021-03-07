<template>
  <div class="d-flex flex-column h-100">
    <contract-filter source="contracts-manage"></contract-filter>
    <contracts-table class="overflow-auto h-100" source="contracts-manage"></contracts-table>
    <menu-bottom model="contracts"></menu-bottom>
  </div>
</template>

<script>
import ContractFilter from '../../components/contracts/ContractFilter'
import ContractsTable from '../../components/contracts/ContractsTable'
import MenuBottom from '../../components/dashboard/MenuBottom'
export default {
  name: 'Contracts',
  components: { MenuBottom, ContractsTable, ContractFilter },
  computed: {
    currentContractsFilter() {
      return this.$store.getters['contracts/getContractsFilter']
    },
  },
  watch: {
    currentContractsFilter: {
      handler() {
        this.$store.dispatch('cosntracts/fetchContracts')
      },
      deep: true,
    },
  },
}
</script>
