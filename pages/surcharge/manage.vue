<template>
  <div class="d-flex flex-column h-100">
    <surcharge-filter />
    <b-overlay
      :show="surchargeStatus === 'fetching'"
      opacity="0.5"
      class="flex-fill align-self-stretch overflow-hidden"
    >
      <div class="overflow-auto h-100">
        <surcharge-table />
      </div>
    </b-overlay>
  </div>
</template>

<script>
import SurchargeFilter from '../../components/surcharge/SurchargeFilter'
import SurchargeTable from '../../components/surcharge/SurchargeTable'
export default {
  name: 'SurchargeManage',
  components: { SurchargeTable, SurchargeFilter },
  computed: {
    surchargeStatus() {
      return this.$store.state.surcharge.status
    },
  },
}
</script>
