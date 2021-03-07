export const state = () => ({
  status: '',
  contracts: [],
  contractsPaginationFilter: {
    'sign_date[from]': null,
    'sign_date[to]': null,
    'count_procurement_objects[from]': null,
    'count_procurement_objects[to]': null,
    'price[from]': null,
    'price[to]': null,
    limit: 300,
    order_by: null,
    asc_desc: 'desc',
    page: 1,
  },
  contractsKtruPaginationFilter: {
    'sign_date[from]': null,
    'sign_date[to]': null,
    'count_procurement_objects[from]': null,
    'count_procurement_objects[to]': null,
    'price[from]': null,
    'price[to]': null,
    limit: 50,
    order_by: null,
    asc_desc: 'desc',
    page: 1,
  },
  pagination: {
    current_page: 1,
    from: null,
    last_page: null,
    path: null,
    per_page: null,
    to: null,
    total: null,
  },
  paginationKtru: {
    current_page: 1,
    from: null,
    last_page: null,
    path: null,
    per_page: null,
    to: null,
    total: null,
  },
  currentKtru: null,
  contractsByKtru: [],
})

export const getters = {
  getStatus: (state) => state.status,
  getContracts: (state) => state.contracts,
  getPagination: (state) => state.pagination,
  getPaginationKtru: (state) => state.paginationKtru,
  getContractsFilter: (state) => state.contractsPaginationFilter,
  getContractsKtruFilter: (state) => state.contractsKtruPaginationFilter,
  getCurrentKtru: (state) => state.currentKtru,
  getContractsByKtru: (state) => state.contractsByKtru,
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_CONTRACTS(state, contracts) {
    state.contracts = contracts
  },
  SAVE_CONTRACTS_PAGINATION(state, pagination) {
    state.pagination = pagination
  },
  SAVE_CONTRACTS_KTRU_PAGINATION(state, pagination) {
    state.paginationKtru = pagination
  },
  SET_CURRENT_PAGE_CONTRACTS(state, currentPage) {
    if (state.pagination.current_page === currentPage) return
    state.pagination.current_page = currentPage
    state.contractsPaginationFilter.page = currentPage
  },
  SET_CURRENT_PAGE_CONTRACTS_KTRU(state, currentPage) {
    if (state.paginationKtru.current_page === currentPage) return
    state.paginationKtru.current_page = currentPage
    state.contractsKtruPaginationFilter.page = currentPage
  },
  SET_LIMIT_CONTRACTS(state, limit) {
    if (state.contractsKtruPaginationFilter.limit === limit) return
    state.contractsKtruPaginationFilter.limit = limit
    state.pagination.current_page = 1
    state.contractsKtruPaginationFilter.page = 1
  },
  SET_LIMIT_CONTRACTS_KTRU(state, limit) {
    if (state.contractsKtruPaginationFilter.limit === limit) return
    state.contractsKtruPaginationFilter.limit = limit
    state.paginationKtru.current_page = 1
    state.contractsKtruPaginationFilter.page = 1
  },
  UPDATE_DATES_CONTRACTS_FILTER(state, query) {
    state.contractsPaginationFilter[`sign_date[${Object.keys(query)[0]}]`] =
      Object.values(query)[0] === null
        ? Object.values(query)[0]
        : this.$moment(new Date(Object.values(query)[0])).format('YYYY-MM-DD')
    state.contractsPaginationFilter[`sign_date[${Object.keys(query)[1]}]`] =
      Object.values(query)[1] === null
        ? Object.values(query)[1]
        : this.$moment(new Date(Object.values(query)[1])).format('YYYY-MM-DD')
  },
  UPDATE_DATES_CONTRACTS_KTRU_FILTER(state, query) {
    state.contractsKtruPaginationFilter[`sign_date[${Object.keys(query)[0]}]`] =
      Object.values(query)[0] === null
        ? Object.values(query)[0]
        : this.$moment(new Date(Object.values(query)[0])).format('YYYY-MM-DD')
    state.contractsKtruPaginationFilter[`sign_date[${Object.keys(query)[1]}]`] =
      Object.values(query)[1] === null
        ? Object.values(query)[1]
        : this.$moment(new Date(Object.values(query)[1])).format('YYYY-MM-DD')
  },
  UPDATE_OBJECTS_CONTRACTS_FILTER(state, query) {
    state.contractsPaginationFilter[`count_procurement_objects[${Object.keys(query)[0]}]`] = !Object.values(query)[0]
      ? null
      : Object.values(query)[0]
    state.contractsPaginationFilter[`count_procurement_objects[${Object.keys(query)[1]}]`] = !Object.values(query)[1]
      ? null
      : Object.values(query)[1]
  },
  UPDATE_OBJECTS_CONTRACTS_KTRU_FILTER(state, query) {
    state.contractsKtruPaginationFilter[`count_procurement_objects[${Object.keys(query)[0]}]`] = !Object.values(
      query
    )[0]
      ? null
      : Object.values(query)[0]
    state.contractsKtruPaginationFilter[`count_procurement_objects[${Object.keys(query)[1]}]`] = !Object.values(
      query
    )[1]
      ? null
      : Object.values(query)[1]
  },
  UPDATE_PRICE_CONTRACTS_FILTER(state, query) {
    state.contractsPaginationFilter[`price[${Object.keys(query)[0]}]`] = !Object.values(query)[0]
      ? null
      : Object.values(query)[0]
    state.contractsPaginationFilter[`price[${Object.keys(query)[1]}]`] = !Object.values(query)[1]
      ? null
      : Object.values(query)[1]
  },
  UPDATE_PRICE_CONTRACTS_KTRU_FILTER(state, query) {
    state.contractsKtruPaginationFilter[`price[${Object.keys(query)[0]}]`] = !Object.values(query)[0]
      ? null
      : Object.values(query)[0]
    state.contractsKtruPaginationFilter[`price[${Object.keys(query)[1]}]`] = !Object.values(query)[1]
      ? null
      : Object.values(query)[1]
  },
  SAVE_CONTRACTS_BY_KTRU(state, contracts) {
    state.contractsByKtru = contracts
  },
  SAVE_CURRENT_PROCUREMENT_KTRU(state, currentKtru) {
    state.currentKtru = currentKtru
  },
}

export const actions = {
  async fetchContracts({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`/api/fcs_contract`, { params: getters.getContractsFilter })
      commit('SAVE_CONTRACTS', data)
      commit('SAVE_CONTRACTS_PAGINATION', meta)
      commit('SET_STATUS', 'contracts-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },

  async fetchContractsByKtru({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`/api/fcs_contract/byKtru`, {
        params: { ktru_code: getters.getCurrentKtru, ...getters.getContractsKtruFilter },
      })
      commit('SAVE_CONTRACTS_BY_KTRU', data)
      commit('SAVE_CONTRACTS_KTRU_PAGINATION', meta)
      commit('SET_STATUS', 'contracts-by-ktru-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
