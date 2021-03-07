export const state = () => ({
  status: '',
})

export const getters = {
  getStatus: (state) => state.status,
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
}

export const actions = {
  // async fetchStatistic({ commit, getters }) {
  //   commit('SET_STATUS', 'fetching')
  //   try {
  //     const { data, meta } = await this.$axios.$get(`/api/purchase/statistic`, { params: getters.getStatisticFilter })
  //     commit('SAVE_STATISTIC', data)
  //     commit('SAVE_STATISTIC_PAGINATION', meta)
  //     commit('SET_STATUS', 'statistic-is-fetched')
  //   } catch {
  //     commit('SET_STATUS', 'error')
  //   }
  // },
}
