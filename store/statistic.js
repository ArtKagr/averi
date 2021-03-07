export const state = () => ({
  status: '',
  statistic: [],
  statisticPaginationFilter: {
    user_id: null,
    status_slug: null,
    confirmed: null,
    'created_at[from]': null,
    'created_at[to]': null,
    limit: 50,
    order_by: null,
    asc_desc: 'desc',
    page: 1,
  },
  pagination: {
    statistic: {
      current_page: 1,
      from: null,
      last_page: null,
      path: null,
      per_page: null,
      to: null,
      total: null,
    },
  },
  matchConfirm: {
    author_id: null,
    from: null,
    to: null,
  },
  confirmResult: null,
})

export const getters = {
  getStatus: (state) => state.status,
  getStatistic: (state) => state.statistic,
  getStatisticFilter: (state) => state.statisticPaginationFilter,
  getStatisticPagination: (state) => state.pagination.statistic,
  getMatchConfirm: (state) => state.matchConfirm,
  getConfirmResult: (state) => state.confirmResult,
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_STATISTIC(state, statistic) {
    state.statistic = statistic
  },
  SET_CURRENT_PAGE_STATISTIC(state, currentPage) {
    if (state.pagination.statistic.current_page === currentPage) return
    state.pagination.statistic.current_page = currentPage
    state.statisticPaginationFilter.page = currentPage
  },
  SET_LIMIT_STATISTIC(state, limit) {
    if (state.statisticPaginationFilter.limit === limit) return
    state.statisticPaginationFilter.limit = limit
    state.pagination.statistic.current_page = 1
    state.statisticPaginationFilter.page = 1
  },
  SAVE_STATISTIC_PAGINATION(state, pricePagination) {
    state.pagination.statistic = pricePagination
  },
  UPDATE_STATISTIC_FILTER(state, query) {
    state.statisticPaginationFilter[query.field] = query.value
  },
  UPDATE_DATES_STATISTIC_FILTER(state, query) {
    state.statisticPaginationFilter[`created_at[${Object.keys(query)[0]}]`] =
      Object.values(query)[0] === null ? Object.values(query)[0] : new Date(Object.values(query)[0])
    state.statisticPaginationFilter[`created_at[${Object.keys(query)[1]}]`] =
      Object.values(query)[1] === null ? Object.values(query)[1] : new Date(Object.values(query)[1])
  },
  UPDATE_MATCH_CONFIRM_FILTER(state, query) {
    state.matchConfirm[`${Object.keys(query)[0]}`] =
      Object.values(query)[0] === null ? Object.values(query)[0] : new Date(Object.values(query)[0])
    state.matchConfirm[`${Object.keys(query)[1]}`] =
      Object.values(query)[1] === null ? Object.values(query)[1] : new Date(Object.values(query)[1])
  },
  SAVE_MATCH_CONFIRM_USER_ID(state, userId) {
    state.matchConfirm.author_id = userId
  },
  SAVE_MATCH_CONFIRM_RESULT(state, result) {
    state.confirmResult = result
  },
}

export const actions = {
  async fetchStatistic({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`/api/purchase/statistic`, { params: getters.getStatisticFilter })
      commit('SAVE_STATISTIC', data)
      commit('SAVE_STATISTIC_PAGINATION', meta)
      commit('SET_STATUS', 'statistic-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async confirmedSwitcher({ commit, dispatch }, query) {
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$put(`/api/purchase/statistic/${query.id}`, { confirmed: query.flag })
      commit('SET_STATUS', 'confirmed-is-changed')
      dispatch('fetchStatistic')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async getPriceMatchConfirm({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/esklp/match/confirm`, { params: getters.getMatchConfirm })
      commit('SAVE_MATCH_CONFIRM_RESULT', data)
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
