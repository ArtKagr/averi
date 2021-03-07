export const state = () => ({
  status: '',
  price: [],
  expandedPrice: [],
  pricePagination: {},
  rowsIsSelected: 0,
  priceFilter: {
    assign_status: null,
    mnn: null,
    search: null,
    is_active: 'hide',
    seller_id: null,
    seller_ids: [],
    limit: 300,
    order_by: null,
    asc_desc: 'asc',
    page: 1,
  },
  expandedPriceFilter: {
    has_ru_file: null,
    mnn: null,
    lf_norm_name: null,
    dosage_norm_name: null,
    trade_name: null,
    manufacturer_country_name: null,
    pack_sum: null,
    assign_status: 'actual',
    limit: 300,
    order_by: null,
    asc_desc: 'asc',
    page: 1,
  },
  pagination: {
    prices: {
      current_page: 1,
      from: null,
      last_page: null,
      path: null,
      per_page: null,
      to: null,
      total: null,
    },
    expandedPrices: {
      current_page: 1,
      from: null,
      last_page: null,
      path: null,
      per_page: null,
      to: null,
      total: null,
    },
  },
  editKlpFields: {
    custom_mnn: null,
    name_teh: null,
    expiration_date: null,
    temperature_min: null,
    temperature_max: null,
    dimensions_length: null,
    dimensions_width: null,
    dimensions_height: null,
    weight: null,
    pre_packing: null,
  },
  matchedPriceFilter: {
    mnn: null,
    lf_name: null,
    dosage_name: null,
    trade_name: null,
    num_reg: null,
    manufacturer_name: null,
    manufacturer_country_name: null,
    pack_sum: null,
    is_active: true,
  },
  priceIsSelect: false,
  selectedRows: [],
  selectedPrices: [],
  matchedPrices: [],
  matchedSmnnTable: [],
  matchedKlpTable: [],
  updetedMatchedKlpTable: [],
  matchedStep: 1,
  currentKlp: {},
  selectedKlp: {},
  blockHeight: 30,
  allMatchedPriceIsSelected: true,
  ruFile: { fu_file: null, num_reg: null },
  globalSwitcher: false,
  globalSwitcherIndeterminate: false,
  expandedRu: {
    mnn: null,
    lf_norm_name: null,
    dosage_norm_name: null,
    trade_name: null,
    manufacturer_country_name: null,
    pack_sum: null,
  },
  addonKlp: { price_id: null, klp_uuid_links: [], purchase_object_id: null, price_klp_uuid: null },
  selectedOfferPrices: [],
})

export const getters = {
  getExpandedRu: (state) => JSON.parse(JSON.stringify(state.expandedRu)),
  getAddonKlp(state) {
    const addonKlpLinks =
      state.addonKlp.klp_uuid_links && state.addonKlp.klp_uuid_links.length
        ? JSON.parse(JSON.stringify(state.addonKlp.klp_uuid_links)).reduce(function (preVal, link) {
            if (!preVal.includes(link)) preVal.push(link)
            return preVal
          }, [])
        : []
    return {
      price_id: state.addonKlp.price_id,
      klp_uuid_links: addonKlpLinks,
      purchase_object_id: state.addonKlp.purchase_object_id,
      price_klp_uuid: state.addonKlp.price_klp_uuid,
    }
  },
  getGlobalSwitcher: (state) => state.globalSwitcher,
  getGlobalSwitcherIndeterminate: (state) => state.globalSwitcherIndeterminate,
  getSelectedPriceHashes: (state) => state.selectedRows.map((price) => price.hash),
  getCurrentKlp: (state) => JSON.parse(JSON.stringify(state.currentKlp)),
  getPrice: (state) => JSON.parse(JSON.stringify(state.price)),
  getSelectedOfferPrices: (state) => JSON.parse(JSON.stringify(state.selectedOfferPrices)),
  getPriceOffers(state, getters) {
    return JSON.parse(JSON.stringify(state.price)).map(function (price) {
      if (getters.getSelectedOfferPrices.includes(price.id)) {
        price.is_select = !price.is_select
        if (price.is_select) price._rowVariant = 'success'
        else if (price._rowVariant) delete price._rowVariant
      }
      return price
    })
  },
  getExpandedPrice(state, getters) {
    return JSON.parse(JSON.stringify(state.expandedPrice)).map(function (item) {
      if (getters.getAddonKlp.klp_uuid_links.includes(item.klp.uuid)) {
        item.klp.is_select = !item.klp.is_select
        if (item.klp.is_select) item._rowVariant = 'success'
        else if (item._rowVariant) delete item._rowVariant
      }
      return item
    })
  },
  getManufacturerNames(state, getters) {
    const result = []
    JSON.parse(JSON.stringify(getters.getExpandedPrice)).map(function (item) {
      if (item.klp.is_select) result.push(item.klp.manufacturer_name)
      return item
    })
    return result.reduce(function (preVal, link) {
      if (!preVal.includes(link)) preVal.push(link)
      return preVal
    }, [])
  },
  getMatchedPricesData: (state) => JSON.parse(JSON.stringify(state.matchedPrices)),
  getMatchedSmnnTable: (state) => JSON.parse(JSON.stringify(state.matchedSmnnTable)),
  getMatchedKlpTable: (state) => JSON.parse(JSON.stringify(state.matchedKlpTable)),
  getSelectedRows: (state) => state.selectedRows,
  getPriceStatus: (state) => state.status,
  getPriceFilter: (state) => state.priceFilter,
  getExpandedPriceFilter: (state) => state.expandedPriceFilter,
  getMatchedPriceFilter: (state) => JSON.parse(JSON.stringify(state.matchedPriceFilter)),
  getMatchedPrices: (state) => state.selectedRows.map((price) => price.id),
  getMatchedTableWithCurrentKlp(state) {
    const result = []
    const currentKlpCopy = JSON.parse(JSON.stringify(state.currentKlp))
    let matchedKlpTableCopy = JSON.parse(JSON.stringify(state.matchedKlpTable))
    matchedKlpTableCopy = matchedKlpTableCopy.filter((klpItem) => klpItem.uuid !== currentKlpCopy.uuid)
    if (Object.keys(currentKlpCopy).length) {
      result.push(currentKlpCopy)
      return result.concat(matchedKlpTableCopy).map(function (klpItem) {
        if (klpItem.num_reg === state.ruFile.num_reg) {
          klpItem.ru_file = state.ruFile.ru_file
        }
        return klpItem
      })
    } else
      return matchedKlpTableCopy.map(function (klpItem) {
        if (klpItem.num_reg === state.ruFile.num_reg) {
          klpItem.ru_file = state.ruFile.ru_file
        }
        return klpItem
      })
  },
  getPriceIds(state) {
    return { price_ids: state.matchedPrices.filter((price) => price.is_select).map((price) => price.id) }
  },
  getSelectedKlp(state) {
    return JSON.parse(JSON.stringify(state.selectedKlp))
  },
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_PRICE(state, price) {
    price = price.map(function (currentPrice) {
      currentPrice.drug_quantity_require = null
      if (currentPrice.klp.dimensions_length && currentPrice.klp.dimensions_width && currentPrice.klp.dimensions_height)
        currentPrice.dimension = `${currentPrice.klp.dimensions_length}x${currentPrice.klp.dimensions_width}x${currentPrice.klp.dimensions_height}`
      else currentPrice.dimension = '— x — x —'

      if (!currentPrice.price_klp.is_active) currentPrice.price_status = 'secondary'
      else if (!currentPrice.price_klp.esklp_klp_uuid) currentPrice.price_status = 'danger'
      else if (!currentPrice.price_klp.author_id) currentPrice.price_status = 'dark'
      else if (!currentPrice.price_klp.is_confirmed) currentPrice.price_status = 'warning'
      else currentPrice.price_status = 'success'
      return currentPrice
    })
    state.price = price
  },
  SAVE_EXPANDED_PRICE(state, price) {
    price = price.map(function (currentPrice) {
      currentPrice.drug_quantity_require = null
      if (currentPrice.klp.dimensions_length && currentPrice.klp.dimensions_width && currentPrice.klp.dimensions_height)
        currentPrice.dimension = `${currentPrice.klp.dimensions_length}x${currentPrice.klp.dimensions_width}x${currentPrice.klp.dimensions_height}`
      else currentPrice.dimension = '— x — x —'

      if (!currentPrice.price_klp.is_active) currentPrice.price_status = 'secondary'
      else if (!currentPrice.price_klp.esklp_klp_uuid) currentPrice.price_status = 'danger'
      else if (!currentPrice.price_klp.author_id) currentPrice.price_status = 'dark'
      else if (!currentPrice.price_klp.is_confirmed) currentPrice.price_status = 'warning'
      else currentPrice.price_status = 'success'
      return currentPrice
    })
    state.expandedPrice = price
  },
  SAVE_PRICE_PAGINATION(state, pricePagination) {
    state.pagination.prices = pricePagination
  },
  SAVE_EXPANDED_PRICE_PAGINATION(state, pricePagination) {
    state.pagination.expandedPrices = pricePagination
  },
  ROW_IS_SELECTED(state, seletedPrice) {
    state.price = state.price.map(function (price) {
      if (price.id === seletedPrice.id) {
        price.is_select = !price.is_select
        state.priceIsSelect = price.is_select
        price.drug_quantity_require = seletedPrice.drug_quantity_require
      }
      return price
    })
    if (state.priceIsSelect) state.selectedRows.push(seletedPrice)
    else state.selectedRows = state.selectedRows.filter((price) => price.id !== seletedPrice.id)

    if (state.price.every((price) => price.is_select)) {
      state.globalSwitcher = true
      state.globalSwitcherIndeterminate = false
    } else if (state.price.every((price) => !price.is_select)) {
      state.globalSwitcher = false
      state.globalSwitcherIndeterminate = false
    } else if (state.price.some((price) => price.is_select)) {
      state.globalSwitcher = false
      state.globalSwitcherIndeterminate = true
    }
  },
  UPDATE_PRICE_FILTER(state, data) {
    if (data.field_name === 'seller_ids') {
      state.priceFilter.seller_id = null
    }
    if (data.field_name === 'seller_id') {
      state.priceFilter.seller_ids = []
    }
    state.priceFilter[data.field_name] = data.new_value
  },
  UPDATE_MATCHED_PRICE_FILTER(state, filter) {
    state.matchedPriceFilter[filter.field_name] = filter.new_value ? filter.new_value : null
  },
  UPDATE_EXPANDED_PRICE_FILTER(state, filter) {
    state.expandedPriceFilter[filter.field_name] = filter.new_value ? filter.new_value : null
  },
  UPDATE_MATCHED_PRICE_FILTER_MULTIPLE(state, fields) {
    fields.map(function (filed) {
      state.matchedPriceFilter[Object.keys(filed)[0]] = Object.values(filed)[0]
    })
  },
  SAVE_MATCHED_PRICES(state, matchedPrices) {
    matchedPrices = matchedPrices.map(function (currentPrice) {
      if (!currentPrice.price_klp.is_active) currentPrice.price_status = 'secondary'
      else if (!currentPrice.price_klp.esklp_klp_uuid) currentPrice.price_status = 'danger'
      else if (!currentPrice.price_klp.author_id) currentPrice.price_status = 'dark'
      else if (!currentPrice.price_klp.is_confirmed) currentPrice.price_status = 'warning'
      else currentPrice.price_status = 'success'
      return currentPrice
    })
    state.matchedPrices = matchedPrices
    if (state.matchedPrices.length && !Object.keys(state.currentKlp)) {
      state.matchedPriceFilter.mnn = state.matchedPrices.find((price) => price.mnn).mnn
    }
  },
  SAVE_MATCHED_SMNN_TABLE(state, matchedSmnnTable) {
    state.matchedSmnnTable = matchedSmnnTable
  },
  SET_MATCHED_STEP(state, matchedStep) {
    state.matchedStep = matchedStep
  },
  SAVE_MATCHED_KLP_TABLE(state, matchedKlpTable) {
    state.matchedKlpTable = matchedKlpTable
  },
  UPDATE_MATCHED_KLP_TABLE(state, newKlpItem) {
    if (Object.keys(state.currentKlp).length) {
      if (state.currentKlp.uuid === newKlpItem.uuid) state.currentKlp.variant = 'success'
      else state.currentKlp.variant = 'warning'
    }

    state.matchedKlpTable = state.matchedKlpTable.map(function (klpItem) {
      if (klpItem.uuid !== newKlpItem.uuid) {
        klpItem.variant = ''
        klpItem.is_select = false
      } else {
        klpItem.variant = 'success'
        klpItem.is_select = true
      }
      return klpItem
    })
  },
  UPDATE_MATCHED_PRICE(state) {
    state.allMatchedPriceIsSelected = state.matchedPrices.every((price) => price.is_select)
    state.matchedPrices = state.matchedPrices.map(function (price) {
      price.is_select = !state.allMatchedPriceIsSelected
      return price
    })
  },
  ALL_PRICES_SELECTED(state, flag) {
    state.price = state.price.map(function (price) {
      price.is_select = flag
      return price
    })
    if (flag) {
      state.selectedPrices = state.price
      state.selectedRows = state.price
    } else {
      state.selectedPrices = []
      state.selectedRows = []
    }

    if (state.price.every((price) => price.is_select)) {
      state.globalSwitcher = true
      state.globalSwitcherIndeterminate = false
    } else if (state.price.every((price) => !price.is_select)) {
      state.globalSwitcher = false
      state.globalSwitcherIndeterminate = false
    } else if (state.price.some((price) => price.is_select)) {
      state.globalSwitcher = false
      state.globalSwitcherIndeterminate = true
    }
  },
  UPDATE_ROW_IN_MATCHED_PRICE(state, selectedPriceId) {
    state.matchedPrices = state.matchedPrices.map(function (price) {
      if (price.id === selectedPriceId) price.is_select = !price.is_select
      return price
    })
  },
  CLEAR_GLOBAL_SWITCHERS(state) {
    state.globalSwitcher = false
    state.globalSwitcherIndeterminate = false
  },
  UPDATE_EDITING_KLP_FIELDS(state, query) {
    const selectedKlpCopy = { ...state.selectedKlp }
    selectedKlpCopy[query.field] = query.value
    state.selectedKlp = selectedKlpCopy
  },
  SAVE_CURRENT_KLP(state, currentKlp) {
    if (!currentKlp.dimensions_height) currentKlp.dimensions_height = 0.3
    if (!currentKlp.dimensions_length) currentKlp.dimensions_length = 0.4
    if (!currentKlp.dimensions_width) currentKlp.dimensions_width = 0.3
    if (!currentKlp.weight) currentKlp.weight = 7
    currentKlp.is_select = true
    currentKlp.variant = 'warning'
    currentKlp.flag = 'current'
    state.currentKlp = currentKlp
    if (state.currentKlp.num_reg) state.matchedPriceFilter.num_reg = state.currentKlp.num_reg
  },
  SAVE_SELECTED_KLP(state, selectedKlp) {
    if (!selectedKlp.dimensions_height) selectedKlp.dimensions_height = 0.3
    if (!selectedKlp.dimensions_length) selectedKlp.dimensions_length = 0.4
    if (!selectedKlp.dimensions_width) selectedKlp.dimensions_width = 0.3
    if (!selectedKlp.weight) selectedKlp.weight = 7
    state.selectedKlp = selectedKlp
  },
  SET_CURRENT_PAGE_PRICES(state, currentPage) {
    if (state.pagination.prices.current_page === currentPage) return
    state.pagination.prices.current_page = currentPage
    state.priceFilter.page = currentPage
  },
  SET_CURRENT_PAGE_EXPANDED_PRICES(state, currentPage) {
    if (state.pagination.expandedPrices.current_page === currentPage) return
    state.pagination.expandedPrices.current_page = currentPage
    state.expandedPriceFilter.page = currentPage
  },
  SET_LIMIT_PRICES(state, limit) {
    if (state.priceFilter.limit === limit) return
    state.priceFilter.limit = limit
    state.pagination.prices.current_page = 1
    state.priceFilter.page = 1
  },
  SET_LIMIT_EXPANDED_PRICES(state, limit) {
    if (state.expandedPriceFilter.limit === limit) return
    state.expandedPriceFilter.limit = limit
    state.pagination.expandedPrices.current_page = 1
    state.expandedPriceFilter.page = 1
  },
  RESET_MATCHING(state) {
    state.selectedKlp = {}
    state.matchedPrices = []
    state.matchedSmnnTable = []
    state.matchedKlpTable = []
    state.matchedStep = 1
    state.matchedPriceFilter = {
      mnn: null,
      lf_name: null,
      dosage_name: null,
      num_reg: null,
      manufacturer_name: null,
      is_active: true,
    }
  },
  CLEAR_SELECTED_ROWS(state) {
    state.selectedRows = []
    state.price = state.price.map(function (price) {
      price.is_select = false
      price.drug_quantity_require = null
      return price
    })
  },
  UPDATE_MODAL_BLOCK_HEIGHT(state, flag) {
    if (flag === 'down' && state.blockHeight <= 60) state.blockHeight = state.blockHeight + 10
    else if (flag === 'up' && state.blockHeight >= 30) state.blockHeight = state.blockHeight - 10
  },
  SAVE_RU_FILE_LINK(state, ruFile) {
    state.ruFile = ruFile
    state.selectedKlp.ru_file = ruFile.ru_file
  },
  SET_SELECTED_KLP(state) {
    state.matchedKlpTable = state.matchedKlpTable.map(function (klpItem) {
      if (klpItem.uuid === state.selectedKlp.uuid) {
        klpItem.variant = 'success'
        klpItem.is_select = true
      }
      return klpItem
    })
  },
  REMOVE_RU_FILE(state) {
    state.selectedKlp.ru_file = null
    state.ruFile = { fu_file: null, num_reg: null }
  },
  UPDATE_PRICE(state, currentPrice) {
    state.price = state.price.map(function (price) {
      if (price.id === currentPrice.id) return currentPrice
      else return price
    })
  },
  CLEAR_PRICE_FILTER(state) {
    state.priceFilter.mnn = null
    state.priceFilter.seller_id = null
    state.priceFilter.assign_status = null
  },
  SAVE_MAIN_SELLERS_IN_FILTER(state, mainSellers) {
    state.priceFilter.seller_ids = mainSellers
  },
  KLP_ITEM_SELECTED(state, priceObject) {
    state.expandedPrice = state.expandedPrice.map(function (item) {
      if (item.klp.uuid === priceObject.klp.uuid && state.addonKlp.klp_uuid_links)
        state.addonKlp.klp_uuid_links.push(item.klp.uuid)
      return item
    })
  },
  KLP_ITEM_NOT_SELECTED(state, priceObject) {
    state.addonKlp.klp_uuid_links = state.addonKlp.klp_uuid_links.filter((uuid) => uuid !== priceObject.klp.uuid)
  },
  SET_KLP_ITEM(state, priceObject) {
    const expandedRuCopy = {
      mnn: null,
      lf_norm_name: null,
      dosage_norm_name: null,
      trade_name: null,
      manufacturer_country_name: null,
      pack_sum: null,
    }
    expandedRuCopy.mnn = priceObject.klp.mnn
    expandedRuCopy.lf_norm_name = priceObject.klp.lf_norm_name
    expandedRuCopy.dosage_norm_name = priceObject.klp.dosage_norm_name
    expandedRuCopy.trade_name = priceObject.klp.trade_name
    expandedRuCopy.manufacturer_country_name = priceObject.klp.manufacturer_country_name
    expandedRuCopy.pack_sum = priceObject.klp.pack_sum
    state.expandedRu = JSON.parse(JSON.stringify(expandedRuCopy))
    state.addonKlp.price_id = priceObject.id
    state.addonKlp.purchase_object_id = priceObject.purchase_object_id
  },
  CLEAR_EXPANDED_FILE(state) {
    state.expandedRu = {
      mnn: null,
      lf_norm_name: null,
      dosage_norm_name: null,
      trade_name: null,
      manufacturer_country_name: null,
      pack_sum: null,
    }

    state.expandedPriceFilter = {
      has_ru_file: null,
      mnn: null,
      lf_norm_name: null,
      dosage_norm_name: null,
      trade_name: null,
      manufacturer_country_name: null,
      pack_sum: null,
      assign_status: 'actual',
      limit: 300,
      order_by: null,
      asc_desc: 'asc',
      page: 1,
    }

    state.expandedPrice = []
    state.addonKlp = { price_id: null, klp_uuid_links: [], purchase_object_id: null, price_klp_uuid: null }
    state.matchedKlpTable.map((item) => (item.is_select = false))
  },
  UPDATE_HAS_RU_FILE_FIELD(state, ruFileFlag) {
    if (ruFileFlag === 'Копия РУ') state.expandedPriceFilter.has_ru_file = 'yes'
    else if (ruFileFlag === 'Реквизиты РУ') state.expandedPriceFilter.has_ru_file = null
  },
  SET_ADDON_KLP(state, priceObject) {
    state.addonKlp = {
      price_id: priceObject.id,
      klp_uuid_links: priceObject.klp_uuid_links,
      purchase_object_id: priceObject.purchase_object_id,
      price_klp_uuid: priceObject.klp.uuid,
    }
  },
  ADD_SELECTED_OFFER_PRICE(state, priceId) {
    if (!state.selectedOfferPrices.includes(priceId)) state.selectedOfferPrices.push(priceId)
    else state.selectedOfferPrices = state.selectedOfferPrices.filter((id) => id !== priceId)
  },
  SET_OFFER_PRICES(state, offerPrices) {
    state.selectedOfferPrices = offerPrices
  },
  UPDATE_SORTING(state, query) {
    state.priceFilter.order_by = query.order_by
    state.priceFilter.asc_desc = query.asc_desc
  },
}

export const actions = {
  saveRuFile({ state, commit }, ruFile) {
    commit('SAVE_RU_FILE_LINK', ruFile)
  },
  async fetchPrice({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`api/price`, {
        params: getters.getPriceFilter,
      })
      commit('SAVE_PRICE', data)
      commit('SAVE_PRICE_PAGINATION', meta)
      commit('SET_STATUS', 'price-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async tooglePrice({ commit, getters, dispatch }, status) {
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$post(`api/price/edit_field`, {
        hashes: getters.getSelectedPriceHashes,
        is_active: status,
      })
      commit('CLEAR_SELECTED_ROWS')
      dispatch('fetchPrice')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async getMatchedPrices({ commit, getters }, priceId) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get('/api/price/matched', {
        params: { ids: priceId ? [priceId] : getters.getMatchedPrices, limit: 300 },
      })
      commit('SAVE_MATCHED_PRICES', data)
      commit('SET_STATUS', 'matched_prices-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchMatchedSmnnTable({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get('/api/esklp/smnn', {
        params: getters.getMatchedPriceFilter,
      })
      commit('SAVE_MATCHED_SMNN_TABLE', data)
      commit('SET_STATUS', 'matched_smnn_table-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchMatchedKlpTable({ state, commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get('/api/esklp/klp', {
        params: getters.getMatchedPriceFilter,
      })
      commit('SAVE_MATCHED_KLP_TABLE', data)
      if (Object.keys(state.selectedKlp).length) commit('SET_SELECTED_KLP')
      commit('SET_STATUS', 'matched_klp_table-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchCurrentKlp({ commit, getters }, uuid) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/esklp/klp/${uuid}`)
      commit('SAVE_CURRENT_KLP', data)
      commit('SET_STATUS', 'current_klp-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchSelectedKlp({ commit, getters }, uuid) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/esklp/klp/${uuid}`)
      commit('SAVE_SELECTED_KLP', data)
      commit('SET_STATUS', 'selected_klp-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editKlp({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$put(`/api/esklp/klp/${getters.getSelectedKlp.uuid}`, {
        ...getters.getSelectedKlp,
        ...getters.getPriceIds,
      })
      commit('SET_STATUS', 'matching-success')
    } catch {
      commit('SET_STATUS', 'matching-error')
    }
  },
  // async expandRuFiles({ getters }) {
  //   try {
  //     await this.$axios.$put(`/api/esklp/klp/${getters.getAddonKlp.uuid}`, {
  //       klp_uuid_links: getters.getAddonKlp.klp_uuid_links,
  //     })
  //   } catch {}
  // },
  async fetchExpandedPriceKlp({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`api/price_esklp`, { params: getters.getExpandedPriceFilter })
      commit('SAVE_EXPANDED_PRICE', data)
      commit('SAVE_EXPANDED_PRICE_PAGINATION', meta)
      commit('SET_STATUS', 'expanded-price-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async getTest({ commit }) {
    try {
      const { data } = await this.$axios.$get(`api/test`)
      console.warn('data', data)
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  addAddonKlp({ commit, getters }) {
    commit('purchaseObject/SET_EXPANDED_RU_SELECTED_PURCHASE', getters.getAddonKlp, { root: true })
  },
}
