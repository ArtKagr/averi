<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <b-icon-arrow-clockwise
      class="h4 m-0"
      :class="surchargeStatus === 'fetching' ? '-loader' : ''"
      @click="updateRegions"
    ></b-icon-arrow-clockwise>
    <b-input-group class="filter -small">
      <b-form-input v-model="selectedRegion" placeholder="Наименование региона"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="selectedRegion ? 'info' : 'secondary'" @click="clearRegionsFilter">X</b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: 'SurchargeFilter',
  data() {
    return {
      selectedRegion: '',
    }
  },
  computed: {
    surchargeStatus() {
      return this.$store.state.surcharge.status
    },
  },
  watch: {
    selectedRegion(newRegion) {
      this.$store.dispatch('surcharge/updateRegions', newRegion || '')
    },
  },
  methods: {
    clearRegionsFilter() {
      this.selectedRegion = ''
    },
    updateRegions() {
      if (this.surchargeStatus !== 'fetching') this.$store.dispatch('surcharge/fetchSurcharge')
    },
  },
}
</script>
