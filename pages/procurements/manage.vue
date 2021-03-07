<template>
  <div class="d-flex flex-column h-100">
    <procur-filter></procur-filter>
    <procur-table class="overflow-auto h-100"></procur-table>
    <menu-bottom model="procurements"></menu-bottom>
  </div>
</template>

<script>
import ProcurTable from '../../components/procurements/ProcurTable'
import ProcurFilter from '../../components/procurements/ProcurFilter'
import MenuBottom from '../../components/dashboard/MenuBottom'
export default {
  name: 'Procurements',
  components: { MenuBottom, ProcurFilter, ProcurTable },
  computed: {
    currentProcurementFilter() {
      return this.$store.getters['procurements/getProcurementsFilter']
    },
  },
  watch: {
    currentProcurementFilter: {
      handler() {
        this.$store.dispatch('procurements/fetchTopProcurements')
      },
      deep: true,
    },
  },
}
</script>
