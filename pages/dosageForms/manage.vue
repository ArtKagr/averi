<template>
  <div class="d-flex flex-column h-100">
    <dosage-form-filter></dosage-form-filter>
    <dosage-form-table class="overflow-auto h-100"></dosage-form-table>
  </div>
</template>

<script>
import DosageFormTable from '../../components/dosageForms/DosageFormTable'
import DosageFormFilter from '../../components/dosageForms/DosageFormFilter'
export default {
  name: 'DosageForms',
  components: { DosageFormFilter, DosageFormTable },
  created() {
    this.$store.dispatch('dosageForm/fetchDosageForms')
  },
}
</script>
