<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <div class="d-flex justify-content-between w-100">
      <div class="d-flex align-items-center justify-content-between w-100">
        <b-icon-arrow-clockwise class="text-align-center h4 mb-0 mr-4 pointer"></b-icon-arrow-clockwise>
        <div class="d-flex align-items-center w-20">
          <b-input-group class="filter mr-2">
            <b-form-input v-model="ktruCode" placeholder="Код КТРУ"></b-form-input>
          </b-input-group>
          <b-icon-zoom-in v-if="ktruCode" variant="info" class="m-0 mr-2 h5 pointer" @click="searchKtruCode" />
          <b-icon-zoom-in v-else variant="secondary" class="m-0 mr-2 h5 pointer" />
          <b-icon-x v-if="ktruCode" variant="info" class="m-0 h4 pointer" @click="clearKtruCode" />
          <b-icon-x v-else variant="secondary" class="m-0 h4 pointer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcurFilter',
  data() {
    return {
      ktruCode: null,
    }
  },
  computed: {
    procurementsFilter() {
      return this.$store.getters['procurements/getProcurementsFilter']
    },
  },
  methods: {
    searchKtruCode() {
      this.$store.commit('procurements/SAVE_CURRENT_KTRU_KODE', this.ktruCode)
    },
    clearKtruCode() {
      this.ktruCode = null
      this.$store.commit('procurements/SAVE_CURRENT_KTRU_KODE', null)
    },
  },
}
</script>
