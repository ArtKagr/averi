<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 4vh;'">
    <div class="d-flex mr-3">
      <b-icon-chevron-up class="pointer h4 m-0" @click="heightControl('down')"> </b-icon-chevron-up>
      <b-icon-chevron-down class="pointer h4 m-0" @click="heightControl('up')"> </b-icon-chevron-down>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseSearchFilterControl',
  methods: {
    heightControl(flag) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_SEARCH_MODAL_BLOCK_HEIGHT', flag)
    },
  },
}
</script>
