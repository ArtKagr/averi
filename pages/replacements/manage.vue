<template>
  <div class="d-flex flex-column h-100">
    <repl-filter></repl-filter>
    <repl-table class="overflow-auto h-100"></repl-table>
  </div>
</template>

<script>
import ReplFilter from '../../components/replacement/ReplFilter'
import ReplTable from '../../components/replacement/ReplTable'
export default {
  name: 'Settings',
  components: { ReplTable, ReplFilter },
}
</script>
