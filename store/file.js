export const state = () => ({
  file: [],
  status: '',
  sellerTableColumns: [],
  currentPriceSeller: {
    id: null,
  },
})

export const getters = {
  getSellerTableColumns: (state) => state.sellerTableColumns,
  getCurrentPriceSeller: (state) => state.currentPriceSeller,
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_FILE(state, file) {
    state.file = file
  },
  SAVE_SELLER_TABLE_COLUMNS(state, sellerTableColumns) {
    state.sellerTableColumns = sellerTableColumns.map(function (column) {
      column.is_select = false
      return column
    })
    state.sellerTableColumns.push({ column_name: '?', column_word: 'Mock', is_select: false, mock: true })
  },
  UPDATE_CURRENT_PRICE_SELLER_COLUMN(state, query) {
    state.sellerTableColumns[query.column].is_select = query.flag
  },
  CLEAR_CURRENT_PRICE_SELLER_COLUMNS(state) {
    state.sellerTableColumns = state.sellerTableColumns.map(function (column) {
      column.is_select = false
      return column
    })
  },
  CLEAR_CURRENT_PRICE(state) {
    state.sellerTableColumns = []
  },
  SAVE_CURRENT_SELLER(state, currentSeller) {
    state.currentPriceSeller = currentSeller
  },
}

export const actions = {
  async uploadRuFile({ commit, dispatch }, query) {
    const uploadingFile = new FormData()
    uploadingFile.set('ru_file', query.file)
    uploadingFile.set('klp_uuid', query.uuid)
    commit('SET_STATUS', 'upload')
    try {
      const data = await this.$axios.$post(`/api/esklp/klp/ru_file/${query.uuid}`, uploadingFile)
      dispatch('price/saveRuFile', data, { root: true })
      commit('SET_STATUS', 'file-uploaded')
    } catch {
      commit('SET_STATUS', 'error-uploading')
    }
  },
  async uploadPriceFile({ commit }, file) {
    const uploadingFile = new FormData()
    uploadingFile.set('price_file', file)
    commit('SET_STATUS', 'upload')
    try {
      await this.$axios.$post(`/api/price`, uploadingFile)
      commit('SET_STATUS', 'file-uploaded')
    } catch {
      commit('SET_STATUS', 'error-uploading')
    }
  },
  async removeRuFile({ commit, dispatch }, selectedKlp) {
    commit('SET_STATUS', 'removing')
    try {
      await this.$axios.$delete(`/api/esklp/klp/ru_file/${selectedKlp.uuid}`)
      dispatch('price/saveRuFile', { ru_file: null, num_reg: selectedKlp.num_reg }, { root: true })
      commit('SET_STATUS', 'file-removed')
    } catch {
      commit('SET_STATUS', 'error-removing')
    }
  },
  async uploadCurrentSellerPrice({ commit }, file) {
    const uploadingFile = new FormData()
    uploadingFile.set('price_file', file)
    commit('SET_STATUS', 'upload')
    try {
      const { data } = await this.$axios.$post(`/api/seller/get_price_fields`, uploadingFile)
      commit('SAVE_SELLER_TABLE_COLUMNS', data)
      commit('SET_STATUS', 'file-uploaded')
    } catch {
      commit('SET_STATUS', 'error-uploading')
    }
  },
  async importCurrentSellerPrice({ commit, getters }, query) {
    const parameters = new FormData()
    parameters.set('price_file', query.price_file)
    parameters.set('seller_id', getters.getCurrentPriceSeller.id)
    parameters.set('seller_price_pattern_id', query.seller_price_pattern_id)
    commit('SET_STATUS', 'upload')
    try {
      await this.$axios.$post(`/api/price`, parameters)
      commit('SET_STATUS', 'price-imported')
    } catch {
      commit('SET_STATUS', 'error-importing')
    }
  },
}
