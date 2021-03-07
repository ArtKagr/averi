export const state = () => ({
  status: '',
  dosageForms: [],
  currentDosageForm: {},
})

export const getters = {
  getStatus: (state) => state.status,
  getDosageForms: (state) => state.dosageForms,
  getCurrentDosageForm(state) {
    const result = []
    result.push(JSON.parse(JSON.stringify(state.currentDosageForm)))
    return result
  },
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_DOSAGE_FORMS(state, dosageForms) {
    state.dosageForms = dosageForms
  },
  SAVE_CURRENT_DOSAGE_FORM(state, currentDosageForm) {
    state.currentDosageForm = currentDosageForm
  },
  REMOVE_CURRENT_SYNONYM(state, key) {
    state.currentDosageForm.synonym_map = state.currentDosageForm.synonym_map.filter((item, index) => index !== key)
  },
  ADD_CURRENT_SYNONYM(state, lfNameValue) {
    state.currentDosageForm.synonym_map.push(lfNameValue)
  },
  ADD_CURRENT_LF_NAME(state, lfName) {
    state.currentDosageForm.lf_name = lfName
  },
}

export const actions = {
  async fetchDosageForms({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/synonym`)
      commit('SAVE_DOSAGE_FORMS', data)
      commit('SET_STATUS', 'dosage_forms-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createDosageForm({ commit, getters, dispatch }) {
    commit('SET_STATUS', 'creating')
    try {
      await this.$axios.$post(`/api/synonym`, getters.getCurrentDosageForm[0])
      commit('SET_STATUS', 'dosage_form-created')
      dispatch('fetchDosageForms')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editCurrentDosageForm({ commit, dispatch }, dosageForm) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/synonym/${dosageForm.id}`, dosageForm)
      commit('SET_STATUS', 'dosage_form-is-edited')
      dispatch('fetchDosageForms')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async removeCurrentDosageForm({ commit, dispatch }, dosageFormId) {
    commit('SET_STATUS', 'removing')
    try {
      await this.$axios.$delete(`/api/synonym/${dosageFormId}`)
      commit('SET_STATUS', 'dosage_form-is-removed')
      dispatch('fetchDosageForms')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
