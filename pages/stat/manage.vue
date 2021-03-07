<template>
  <div class="d-flex flex-column h-100">
    <stat-filter></stat-filter>
    <stat-table class="overflow-auto h-100"></stat-table>
    <menu-bottom model="statistic" />
  </div>
</template>

<script>
import StatTable from '../../components/statistic/StatTable'
import StatFilter from '../../components/statistic/StatFilter'
export default {
  name: 'Stat',
  components: { StatFilter, StatTable },
}
</script>
