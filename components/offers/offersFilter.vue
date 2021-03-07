<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <div class="d-flex justify-content-between w-100">
      <div class="d-flex align-items-center">
        <b-icon-arrow-clockwise class="text-align-center h4 mb-0 mr-4 pointer"></b-icon-arrow-clockwise>
        <b-icon-plus-circle class="text-align-center h5 mb-0 pointer" @click="createOffer"></b-icon-plus-circle>
      </div>
      <div class="d-flex align-items-center">
        <b-icon-tools v-b-toggle.sidebar-offers-settings class="h5 mb-0 custom_button"></b-icon-tools>
        <b-sidebar
          id="sidebar-offers-settings"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          width="50%"
          backdrop
          right
          shadow=""
          lazy
        >
          <offers-settings></offers-settings>
        </b-sidebar>
      </div>
    </div>
  </div>
</template>

<script>
import OffersSettings from './offersSettings'
export default {
  name: 'OffersFilter',
  components: { OffersSettings },
  computed: {
    offersStatus() {
      return this.$store.getters['offers/getStatus']
    },
  },
  watch: {
    offersStatus(newValue) {
      if (newValue === 'current-offer-is-created') this.$bvModal.show('offersModal')
    },
  },
  methods: {
    createOffer() {
      this.$store.dispatch('offers/fetchOrganizations')
      this.$store.dispatch('offers/createCurrentOffer')
    },
  },
}
</script>
