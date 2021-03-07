export const state = () => ({
  surcharge: [],
  currentSurcharge: {},
  selectedRegion: '', // Строка фильтрации регионов
  status: '',
})

export const getters = {
  getRegions: (state) =>
    JSON.parse(JSON.stringify(state.surcharge)).sort((a, b) => a.region_name.localeCompare(b.region_name)),
  filteredRegions: (state) =>
    state.surcharge.filter(function (item) {
      if (state.selectedRegion === '') return true
      else
        return (
          item.region_name.toLowerCase().includes(state.selectedRegion) ||
          item.region_name.includes(state.selectedRegion)
        )
    }),
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_SURCHARGE(state, surcharge) {
    state.surcharge = surcharge.filter((item) => item.id !== 0)
  },
  SAVE_CURRENT_SURCHARGE(state, currentSurcharge) {
    state.currentSurcharge = currentSurcharge
  },
  EDIT_SURCHARGE(state, currentSurcharge) {
    const surchargeCopyList = [...state.surcharge]
    const oldSurchargeIndex = surchargeCopyList.findIndex((oldSurcharge) => {
      return oldSurcharge.id === currentSurcharge.id
    })
    if (oldSurchargeIndex !== -1) surchargeCopyList[oldSurchargeIndex] = currentSurcharge
    else surchargeCopyList.push(currentSurcharge)
    state.surcharge = surchargeCopyList
  },
  SAVE_FILTERED_REGION(state, region) {
    state.selectedRegion = region
  },
}

export const actions = {
  updateRegions({ commit }, region) {
    commit('SAVE_FILTERED_REGION', region)
  },
  async fetchSurcharge({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/surcharge`)
      commit('SAVE_SURCHARGE', data)
      commit('SET_STATUS', 'surcharge-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editCurrentSurcharge({ commit }, query) {
    commit('SET_STATUS', 'editing')
    try {
      const data = await this.$axios.$put(`/api/surcharge/${query.id}`, query)
      commit('SAVE_CURRENT_SURCHARGE', data)
      commit('EDIT_SURCHARGE', data)
      commit('SET_STATUS', 'current-surcharge-is-edited')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
