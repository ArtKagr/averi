<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <div class="d-flex justify-content-between w-100">
      <div class="d-flex align-items-center">
        <b-icon-arrow-clockwise
          v-if="source === 'contracts-manage'"
          class="text-align-center h4 mb-0 mr-4 pointer"
        ></b-icon-arrow-clockwise>
        <div class="mr-4">
          <b-input-group class="filter">
            <datepicker
              v-model="signDate.from"
              placeholder="Начало интервала"
              type="date"
              value-type="timestamp"
              format="DD.MM.YYYY"
              class="w-50"
            ></datepicker>
            <datepicker
              v-model="signDate.to"
              placeholder="Конец интервала"
              type="date"
              value-type="timestamp"
              format="DD.MM.YYYY"
              class="w-50"
            ></datepicker>
          </b-input-group>
        </div>
        <div class="mr-4">
          <b-input-group class="filter mr-2">
            <b-form-input v-model="objects.from" type="number" placeholder="Объектов закупки от"></b-form-input>
            <b-form-input v-model="objects.to" type="number" placeholder="Объектов закупки до"></b-form-input>
          </b-input-group>
        </div>
        <div class="mr-4">
          <b-input-group class="filter mr-2">
            <b-form-input v-model="price.from" type="number" placeholder="Цена от"></b-form-input>
            <b-form-input v-model="price.to" type="number" placeholder="Цена до"></b-form-input>
          </b-input-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractFilter',
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      signDate: {
        from: null,
        to: null,
      },
      objects: {
        from: null,
        to: null,
      },
      price: {
        from: null,
        to: null,
      },
    }
  },
  computed: {
    contractsFilter() {
      let result = {}
      switch (this.source) {
        case 'contracts-manage':
          result = this.$store.getters['contracts/getContractsFilter']
          break
        case 'procur-table':
          result = this.$store.getters['contracts/getContractsKtruFilter']
          break
      }
      return result
    },
  },
  watch: {
    contractsFilter: {
      handler() {
        switch (this.source) {
          case 'contracts-manage':
            this.$store.dispatch('contracts/fetchContracts')
            break
          case 'procur-table':
            this.$store.dispatch('contracts/fetchContractsByKtru')
            break
        }
      },
      deep: true,
    },
    signDate: {
      handler(newValue) {
        switch (this.source) {
          case 'contracts-manage':
            this.$store.commit('contracts/UPDATE_DATES_CONTRACTS_FILTER', newValue)
            break
          case 'procur-table':
            this.$store.commit('contracts/UPDATE_DATES_CONTRACTS_KTRU_FILTER', newValue)
            break
        }
      },
      deep: true,
    },
    objects: {
      handler(newValue) {
        switch (this.source) {
          case 'contracts-manage':
            this.$store.commit('contracts/UPDATE_OBJECTS_CONTRACTS_FILTER', newValue)
            break
          case 'procur-table':
            this.$store.commit('contracts/UPDATE_OBJECTS_CONTRACTS_KTRU_FILTER', newValue)
            break
        }
      },
      deep: true,
    },
    price: {
      handler(newValue) {
        switch (this.source) {
          case 'contracts-manage':
            this.$store.commit('contracts/UPDATE_PRICE_CONTRACTS_FILTER', newValue)
            break
          case 'procur-table':
            this.$store.commit('contracts/UPDATE_PRICE_CONTRACTS_KTRU_FILTER', newValue)
            break
        }
      },
      deep: true,
    },
  },
  created() {
    this.signDate = { from: null, to: null }
    this.objects = { from: null, to: null }
    this.price = { from: null, to: null }
  },
}
</script>
