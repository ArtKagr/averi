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
  async fetchDosageForms({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$get(`/api/synonym`)
      commit('SET_STATUS', 'dosage_forms-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
