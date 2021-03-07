export const state = () => ({
  status: '',
  replacements: [],
  currentReplacement: {},
})

export const getters = {
  getStatus: (state) => state.status,
  getReplacements: (state) => JSON.parse(JSON.stringify(state.replacements)),
  getCurrentReplacement(state) {
    const result = []
    result.push(JSON.parse(JSON.stringify(state.currentReplacement)))
    return result
  },
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_REPLACEMENTS(state, replacements) {
    state.replacements = replacements
  },
  SAVE_CURRENT_REPLACEMENT(state, replacement) {
    state.currentReplacement = replacement
  },
  ADD_CURRENT_MNN(state, mnnValue) {
    state.currentReplacement.mnn.push(mnnValue)
  },
  REMOVE_CURRENT_MNN(state, key) {
    state.currentReplacement.mnn = state.currentReplacement.mnn.filter((item, index) => index !== key)
  },
  ADD_CURRENT_LF_NAME(state, lfValue) {
    state.currentReplacement.lf_name.push(lfValue)
  },
  REMOVE_CURRENT_LF_NAME(state, key) {
    state.currentReplacement.lf_name = state.currentReplacement.lf_name.filter((item, index) => index !== key)
  },
}

export const actions = {
  async fetchReplacements({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/replacement`, { params: { asc_desc: 'asc' } })
      commit('SAVE_REPLACEMENTS', data)
      commit('SET_STATUS', 'replacements-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createReplacement({ commit, dispatch }, replacement) {
    commit('SET_STATUS', 'creating')
    try {
      await this.$axios.$post(`/api/replacement`, replacement)
      commit('SET_STATUS', 'replacement-is-created')
      dispatch('fetchReplacements')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async removeCurrentReplacement({ commit, dispatch }, replacementId) {
    commit('SET_STATUS', 'removing')
    try {
      await this.$axios.$delete(`/api/replacement/${replacementId}`)
      commit('SET_STATUS', 'replacement-is-removed')
      dispatch('fetchReplacements')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editCurrentResponsible({ commit, dispatch }, replacement) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/replacement/${replacement.id}`, replacement)
      commit('SET_STATUS', 'replacement-is-edited')
      dispatch('fetchReplacements')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
