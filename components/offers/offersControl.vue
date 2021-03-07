<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 5vh;'">
    <div class="d-flex w-100 justify-content-between">
      <b-icon-arrow-clockwise class="text-align-center h4 mb-0 mr-4 pointer"></b-icon-arrow-clockwise>
      <div class="d-flex align-items-start">
        <b-icon-folder-check
          class="text-align-center h4 mb-0 pointer mr-4"
          variant="success"
          @click="saveCurrentOffer"
        ></b-icon-folder-check>
        <b-icon-x class="text-align-center h4 mb-0 pointer" @click="hideOffersModal"></b-icon-x>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OffersControl',
  data() {
    return {}
  },
  methods: {
    hideOffersModal() {
      this.$bvModal.hide('offersModal')
    },
    saveCurrentOffer() {
      this.$store.dispatch('offers/saveOffer')
    },
  },
}
</script>
