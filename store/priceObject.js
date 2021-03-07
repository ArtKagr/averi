export const state = () => ({
  status: null,
  priceObjects: [],
  selectedRows: [],
  selectedPurchaseObject: [],
  currentPriceObject: {},
  selectedPriceObject: null,
  replacedPriceObject: null,
  matchingModalSource: 'price_table',
  matchingButton: 'price_filter',
})

export const getters = {
  getStatus: (state) => state.status,
  getMatchingButton: (state) => state.matchingButton,
  getMatchingModalSource: (state) => state.matchingModalSource,
  getSelectedPriceObject: (state) => state.selectedPriceObject,
  getPriceObjectStatus: (state) => state.status,
  getPriceObjects: (state) => JSON.parse(JSON.stringify(state.priceObjects)),
  getSelectedPurchaseObject: (state) => state.selectedPurchaseObject,
  getPurchaseObjectId(state, getters, rootState, rootGetters) {
    return state.selectedPurchaseObject.length ? state.selectedPurchaseObject[0].id : null
  },
  getPriceIds: (state, second, rootState) =>
    rootState.price.selectedRows
      // .filter((price) => price.price_status === 'warning' || price.price_status === 'success')
      .map(function (price) {
        return { id: price.id, drug_quantity_require: price.drug_quantity_require }
      }) || [],
  getReplacedPriceId(state) {
    const result = []
    state.replacedPriceObject
      ? result.push({ id: state.replacedPriceObject.id, drug_quantity_require: 1 })
      : result.push({ id: null, drug_quantity_require: null })
    return result
  },
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_PRICE_OBJECTS(state, priceObjects) {
    state.priceObjects = priceObjects
  },
  SAVE_SELECTED_PURCHASE_OBJECT(state, data) {
    const result = []
    result.push(data)
    state.selectedPurchaseObject = result
  },
  SAVE_SELECTED_PURCHASE_OBJECT_HEAD(state, data) {
    const dataCopy = JSON.parse(JSON.stringify(data))
    dataCopy[0]._showDetails = false
    state.selectedPurchaseObject = dataCopy
  },
  UPDATE_PURCHASE_PRICE_OBJECTS(state, priceObjectId) {
    state.priceObjects = state.priceObjects.filter((priceObject) => priceObject.id !== priceObjectId)
  },
  ADD_PRICE_OBJECT_IN_LIST(state, addedPriceObject) {
    state.priceObjects.push(addedPriceObject)
  },
  SAVE_CURRENT_PRICE_OBJECT(state, currentPriceObject) {
    state.currentPriceObject = currentPriceObject
  },
  SAVE_SELECTED_PRICE_OBJECT(state, selectedPriceObject) {
    state.selectedPriceObject = selectedPriceObject
  },
  SAVE_REPLACED_PRICE_OBJECT(state, replacedPriceObject) {
    state.replacedPriceObject = replacedPriceObject
  },
  UPDATE_MATCHING_MODAL_SOURCE(state, flag) {
    state.matchingModalSource = flag
  },
  UPDATE_MATCHING_BUTTON(state, matchingButton) {
    state.matchingButton = matchingButton
  },
}

export const actions = {
  async fetchPriceObjects({ state, commit, getters }, uuid) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/purchase/object/price`, {
        params: { purchase_uuid: uuid, is_active: true },
      })
      commit('SAVE_PRICE_OBJECTS', data)
      commit('purchaseObject/ADD_PRICES_IN_PURCHASE_OBJECTS', data, { root: true })
      commit('SET_STATUS', 'price_objects-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async addPriceObjects({ commit, getters }) {
    commit('SET_STATUS', 'adding')
    try {
      const { data } = await this.$axios.$post(`/api/purchase/object/price`, {
        purchase_object_id: getters.getPurchaseObjectId,
        prices: getters.getMatchingButton === 'replace_button' ? getters.getReplacedPriceId : getters.getPriceIds,
      })
      getters.getMatchingButton === 'replace_button'
        ? commit('SET_STATUS', 'replaced_price-is-added')
        : commit('SET_STATUS', 'price_objects-is-added')
      commit('SAVE_CURRENT_PRICE_OBJECT', data)
      // commit('purchaseObject/ADD_PRICES_IN_PURCHASE_OBJECTS', data, { root: true })
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async removePriceObject({ commit, state }, id) {
    commit('SET_STATUS', 'removing')
    try {
      await this.$axios.$delete(`/api/purchase/object/price/${id}`)
      commit('UPDATE_PURCHASE_PRICE_OBJECTS', id)
      commit('SET_STATUS', 'price_objects-is-removed')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editPriceObjects({ commit, state, dispatch }, query) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/purchase/object/price/${query.id}`, {
        is_current: !query.is_current,
      })
      commit('SET_STATUS', 'price_object-is-edited')
      dispatch('purchaseObject/updatePurchase', null, { root: true })
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editPriceObjectsReplace({ commit, state, dispatch }, query) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/purchase/object/price/${query.id}`, {
        is_replace: !query.is_replace,
      })
      commit('SET_STATUS', 'price_object-is-edited')
      dispatch('purchaseObject/updatePurchase', null, { root: true })
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editPriceObjectsZnvlp({ commit, state, dispatch }, query) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/purchase/object/price/${query.id}`, {
        is_znvlp: !query.is_znvlp,
      })
      commit('SET_STATUS', 'price_object-is-edited')
      dispatch('purchaseObject/updatePurchase', null, { root: true })
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
