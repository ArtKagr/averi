export const state = () => ({
  status: '',
  procurements: [],
  currentProcurement: [],
  contractId: null,
  procurementPaginationFilter: {
    ktru_code: null,
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
  topProcurements: [],
})

export const getters = {
  getStatus: (state) => state.status,
  getProcurements: (state) => state.procurements,
  getCurrentProcurement: (state) => state.currentProcurement,
  getContractId: (state) => state.contractId,
  getPagination: (state) => state.pagination,
  getProcurementsFilter: (state) => state.procurementPaginationFilter,
  getTopProcurements: (state) => state.topProcurements,
  getContractsFilter: (state) => state.contractsPaginationFilter,
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_PROCUREMENTS(state, procurements) {
    state.procurements = procurements
  },
  SAVE_CURRENT_PROCUREMENT_CONTRACT_ID(state, contractId) {
    state.contractId = contractId
  },
  SAVE_CURRENT_PROCUREMENT(state, currentProcurement) {
    state.currentProcurement = currentProcurement
  },
  SAVE_PROCUREMENTS_PAGINATION(state, pagination) {
    state.pagination = pagination
  },
  SET_CURRENT_PAGE_PROCUREMENTS(state, currentPage) {
    if (state.pagination.current_page === currentPage) return
    state.pagination.current_page = currentPage
    state.procurementPaginationFilter.page = currentPage
  },
  SET_LIMIT_PROCUREMENTS(state, limit) {
    if (state.procurementPaginationFilter.limit === limit) return
    state.procurementPaginationFilter.limit = limit
    state.pagination.current_page = 1
    state.procurementPaginationFilter.page = 1
  },
  SAVE_TOP_PROCUREMENTS(state, topProcurements) {
    state.topProcurements = topProcurements
  },
  SAVE_CURRENT_KTRU_KODE(state, ktruCode) {
    state.procurementPaginationFilter.ktru_code = ktruCode
  },
}

export const actions = {
  // async fetchProcurements({ commit, getters }) {
  //   commit('SET_STATUS', 'fetching')
  //   try {
  //     const { data } = await this.$axios.$get(`/api/fcs_procurement_object`, {
  //       params: getters.getProcurementsFilter,
  //     })
  //     commit('SAVE_PROCUREMENTS', data)
  //     commit('SET_STATUS', 'procurements-is-fetched')
  //   } catch {
  //     commit('SET_STATUS', 'error')
  //   }
  // },
  async fetchCurrentProcurement({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/fcs_procurement_object/byContract`, {
        params: { contract_id: getters.getContractId },
      })
      commit('SAVE_CURRENT_PROCUREMENT', data)
      commit('SET_STATUS', 'current-procurement-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchTopProcurements({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`/api/fcs_procurement_object/top`, {
        params: getters.getProcurementsFilter,
      })
      commit('SAVE_TOP_PROCUREMENTS', data)
      commit('SAVE_PROCUREMENTS_PAGINATION', meta)
      commit('SET_STATUS', 'procurement-top-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
