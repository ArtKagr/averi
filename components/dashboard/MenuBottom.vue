<template>
  <div class="d-flex w-100 bg-gray-200 px-3">
    <div class="d-flex flex-grow-1 align-items-center justify-content-center">
      <b-pagination
        v-model="filter.current_page"
        :total-rows="getPagination && getPagination.total ? getPagination.total : 0"
        :per-page="getPagination && getPagination.per_page ? getPagination.per_page : 0"
        pills
        size="sm"
        class="m-0 my-1"
        align="center"
        first-number
        last-number
        limit="15"
      />
    </div>
    <div class="d-flex align-items-center h-100">
      <b-dd id="dropdown-status" toggle-class="py-0 text-center custom_button" variant="link" boundary="window">
        <template v-slot:button-content>
          {{ getPagination && getPagination.per_page ? getPagination.per_page : '' }}
        </template>
        <template v-for="(item, key) in limits">
          <b-dd-item-btn
            v-if="!(item.id === 0 && filter.limit === 0)"
            :key="key"
            button-class="d-flex flex-row custom_dropdown_item"
            :active="item.id === filter.limit"
            @click="filter.limit = item.id"
          >
            {{ item && item.text ? item.text : '' }}
          </b-dd-item-btn>
        </template>
      </b-dd>
    </div>
    <div class="d-flex align-items-center h-100">
      <span class="btn badge-light text-truncate bg-gray-200">
        {{ getPagination && getPagination.total ? getPagination.total : '0' }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuBottom',
  props: {
    model: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      filter: {
        limit: null,
        current_page: null,
      },

      limits: [
        { id: 1, text: '1' },
        { id: 5, text: '5' },
        { id: 10, text: '10' },
        { id: 15, text: '15' },
        { id: 20, text: '20' },
        { id: 30, text: '30' },
        { id: 50, text: '50' },
        { id: 75, text: '75' },
        { id: 100, text: '100' },
        { id: 150, text: '150' },
        { id: 200, text: '200' },
        { id: 250, text: '250' },
        { id: 300, text: '300' },
      ],

      pagination: {
        current_page: 1,
        from: null,
        last_page: null,
        path: null,
        per_page: null,
        to: null,
        total: null,
      },
    }
  },
  computed: {
    getPagination() {
      let pagination
      switch (this.model) {
        case 'purchases':
          pagination = this.$store.state.purchase.pagination.purchases
          break
        case 'prices':
          pagination = this.$store.state.price.pagination.prices
          break
        case 'expanded-prices':
          pagination = this.$store.state.price.pagination.expandedPrices
          break
        case 'statistic':
          pagination = this.$store.state.statistic.pagination.statistic
          break
        case 'contracts':
          pagination = this.$store.getters['contracts/getPagination']
          break
        case 'procur-table':
          pagination = this.$store.getters['contracts/getPaginationKtru']
          break
        case 'procurements':
          pagination = this.$store.getters['procurements/getPagination']
          break
        case 'offers':
          pagination = this.$store.getters['offers/getPagination']
          break
      }
      return pagination
    },
  },
  watch: {
    getPagination(pagination) {
      this.filter.current_page = pagination.current_page
    },
    'filter.current_page'(currentPage) {
      switch (this.model) {
        case 'purchases':
          this.$store.commit('purchase/SET_CURRENT_PAGE_PURCHASES', currentPage)
          break
        case 'prices':
          this.$store.commit('price/SET_CURRENT_PAGE_PRICES', currentPage)
          break
        case 'expanded-prices':
          this.$store.commit('price/SET_CURRENT_PAGE_EXPANDED_PRICES', currentPage)
          break
        case 'statistic':
          this.$store.commit('statistic/SET_CURRENT_PAGE_STATISTIC', currentPage)
          break
        case 'contracts':
          this.$store.commit('contracts/SET_CURRENT_PAGE_CONTRACTS', currentPage)
          break
        case 'procur-table':
          this.$store.commit('contracts/SET_CURRENT_PAGE_CONTRACTS_KTRU', currentPage)
          break
        case 'procurements':
          this.$store.commit('procurements/SET_CURRENT_PAGE_PROCUREMENTS', currentPage)
          break
        case 'offers':
          this.$store.commit('offers/SET_CURRENT_PAGE_OFFERS', currentPage)
          break
      }
      this.filter.current_page = currentPage
    },
    'filter.limit'(limit) {
      switch (this.model) {
        case 'purchases':
          this.$store.commit('purchase/SET_LIMIT_PURCHASES', limit)
          break
        case 'prices':
          this.$store.commit('price/SET_LIMIT_PRICES', limit)
          break
        case 'expanded-prices':
          this.$store.commit('price/SET_LIMIT_EXPANDED_PRICES', limit)
          break
        case 'statistic':
          this.$store.commit('statistic/SET_LIMIT_STATISTIC', limit)
          break
        case 'contracts':
          this.$store.commit('contracts/SET_LIMIT_CONTRACTS', limit)
          break
        case 'procur-table':
          this.$store.commit('contracts/SET_LIMIT_CONTRACTS_KTRU', limit)
          break
        case 'procurements':
          this.$store.commit('procurements/SET_LIMIT_PROCUREMENTS', limit)
          break
        case 'offers':
          this.$store.commit('offers/SET_LIMIT_OFFERS', limit)
          break
      }
    },
  },
  created() {
    this.filter.limit = this.limit()
  },
  methods: {
    limit() {
      let limit
      switch (this.model) {
        case 'purchases':
          limit = this.$store.state.purchase.purchasePaginationFilter.limit
          break
        case 'prices':
          limit = this.$store.state.price.priceFilter.limit
          break
        case 'expanded-prices':
          limit = this.$store.state.price.expandedPriceFilter.limit
          break
        case 'statistic':
          limit = this.$store.state.statistic.statisticPaginationFilter.limit
          break
        case 'contracts':
          limit = this.$store.state.contracts.contractsPaginationFilter.limit
          break
        case 'procur-table':
          limit = this.$store.state.contracts.contractsKtruPaginationFilter.limit
          break
        case 'procurements':
          limit = this.$store.state.procurements.procurementPaginationFilter.limit
          break
        case 'offers':
          limit = this.$store.state.offers.offersPaginationFilter.limit
          break
      }
      return limit
    },
  },
}
</script>
