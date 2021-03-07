export const state = () => ({
  purchase: [],
  status: '',
  tradingPlaces: [],
  userSet: {
    title: null,
    user_id: null,
    users: [],
  },
  purchaseDictionary: {
    match_mnn: 'match_mnn',
    status: 'purchase_status',
    is_znvlp: 'medications',
    etp_code: 'trading_places',
    match: 'matches_mnn',
    user_id: 'users',
    fcs_type: 'purchase_types',
  },
  filterSet: {
    title: 'Фильтры отключены',
    id: null,
    filters: [
      {
        title: 'Фильтры отключены',
        id: null,
        options: {
          status: null,
          is_znvlp: null,
          etp_code: null,
          match: null,
          fcs_type: null,
          count_objects: { min: null, max: null },
          max_price: { min: null, max: null },
          processing_date: { to: null, from: null },
          start_application: { to: null, from: null },
          end_application: { to: null, from: null },
          bidding_date: { to: null, from: null },
          purchase_number: null,
        },
      },
    ],
  },
  filters: {
    match_mnn: [
      { title: 'Все закупки', match_mnn: null },
      { title: 'Полное совпадение по МНН', match_mnn: 'complete' },
      { title: 'Частичное совпадение по МНН', match_mnn: 'partial' },
      { title: 'Нет совпадений по МНН', match_mnn: 'not_found' },
    ],
    purchase_status: [
      { title: 'Все папки', status: null },

      { title: 'Новые', status: 'new' },

      { title: 'Обработаны', status: 'processed' },
      { title: 'На контроль', status: 'control' },
      { title: 'В проверку', status: 'check' },
      { title: 'Проверены', status: 'verified' },
      { title: 'Оформлены', status: 'formalized' },
      { title: 'Готовы к подаче', status: 'ready' },

      { title: 'Поданы', status: 'sent' },
      { title: 'Отклонены', status: 'rejected' },
      { title: 'Допущены', status: 'admitted' },

      { title: 'Единственный', status: 'sole' },
      { title: 'Выиграны', status: 'won' },
      { title: 'Проиграны', status: 'lost' },

      { title: 'Не участвуем', status: 'not_play' },
      { title: 'Проверка архива', status: 'check_archive' },
      { title: 'Архив', status: 'archive' },
    ],
    medications: [
      { title: 'Все лек. препараты', is_znvlp: null },
      { title: 'ЖНВЛП', is_znvlp: true },
      { title: 'не ЖНВЛП', is_znvlp: false },
    ],
    confirmed: [
      { title: 'Все закупки', slug: null },
      { title: 'Не подтверждённые', slug: false },
      { title: 'Подтверждённые', slug: true },
    ],
    trading_places: [{ title: 'Все площадки', etp_code: null }],
    matches_mnn: [
      { title: 'Все совпадения', match: null },
      { title: 'Полное совпадение', match: 'complete', variant: 'success' },
      { title: 'Частичное совпадение', match: 'partial', variant: 'warning' },
      { title: 'Совпадений не найдено', match: 'not_found', variant: 'danger' },
    ],
    purchase_types: [
      { title: 'Все закупки', fcs_type: null },
      { title: 'Аукционы 44-ФЗ', fcs_type: 'fcsNotificationEF' },
      { title: 'Котировка 44-ФЗ', fcs_type: 'epNotificationEZK' },
      { title: 'Запрос в эл. форме 44-ФЗ', fcs_type: 'epNotificationEZP' },
      { title: 'Ручные закупки 44-ФЗ', fcs_type: 'fcsNone' },
      { title: 'Остальные закупки 44-ФЗ', fcs_type: 'fcsOther' },
      { title: 'Закрытые аукционы 44-ФЗ (A)', fcs_type: 'fcsNotificationZakA' },
      { title: 'Закрытые аукционы 44-ФЗ (Р)', fcs_type: 'fcsNotification111' },
      { title: 'Прочие 223-ФЗ', fcs_type: 'purchaseNotice' },
      { title: 'Запрос предложений 223-ФЗ', fcs_type: 'purchaseNoticeZPESMBO' },
      { title: 'Запрос котировок 223-ФЗ', fcs_type: 'purchaseNoticeZKESMBO' },
      { title: 'Конкурс 223-ФЗ', fcs_type: 'purchaseNoticeKESMBO' },
      { title: 'Аукцион 223-ФЗ', fcs_type: 'purchaseNoticeAESMBO' },
    ],
    rts_statuses: [
      { title: 'Есть заявки', has_applications: true },
      { title: 'Нет заявок', has_applications: false },
      { title: 'Не применен', has_applications: null },
    ],
  },
  purchaseFilter: {
    status: null,
    is_znvlp: null,
    etp_code: null,
    match: null,
    fcs_type: null,
    count_objects: { min: null, max: null },
    max_price: { min: null, max: null },
    processing_date: { to: null, from: null },
    start_application: { to: null, from: null },
    end_application: { to: null, from: null },
    bidding_date: { to: null, from: null },
    purchase_number: null,
    has_applications: null,
  },
  filterName: {
    match_mnn: { title: 'Все закупки', match_mnn: null },
    purchase_status: { title: 'Все папки', status: null },
    matches_mnn: { title: 'Все совпадения', match: null },
    medications: { title: 'Все лек. препараты', is_znvlp: null },
    purchase_types: { title: 'Все закупки', user_id: null },
    trading_places: { title: 'Все площадки', etp_code: null },
    rts_statuses: { title: 'Не применен', has_applications: null },
  },
  selectedUserId: null,
  purchasePaginationFilter: {
    assign_status: null,
    mnn: null,
    seller_id: null,
    limit: 50,
    order_by: null,
    asc_desc: 'asc',
    page: 1,
  },
  pagination: {
    purchases: {
      current_page: 1,
      from: null,
      last_page: null,
      path: null,
      per_page: null,
      to: null,
      total: null,
    },
  },
  userControl: true,
  archivedPurchaseArray: [],
  hasApplicationsAt: null,
  purchase223: [
    'purchaseNotice',
    'purchaseNoticeZPESMBO',
    'purchaseNoticeZKESMBO',
    'purchaseNoticeKESMBO',
    'purchaseNoticeAESMBO',
  ],
})

export const getters = {
  getPurchase223: (state) => state.purchase223,
  getHasPurchaseApplicationsAt: (state) => state.hasApplicationsAt,
  getUserControl: (state) => state.userControl,
  getArchivePurchaseArray: (state) => state.archivedPurchaseArray,
  getPurchase(state, getters) {
    return JSON.parse(JSON.stringify(state.purchase)).map(function (currentPurchase) {
      currentPurchase.archive_flag = getters.getArchivePurchaseArray.includes(currentPurchase.uuid)
      return currentPurchase
    })
  },
  getCurrentFcsType: (state) => state.currentFcsType,
  getTradingPlaces: (state) => JSON.parse(JSON.stringify(state.tradingPlaces)),
  getFilters: (state) => JSON.parse(JSON.stringify(state.filters)),
  getFilterName: (state) => JSON.parse(JSON.stringify(state.filterName)),
  getPurchaseFilter(state) {
    const object = JSON.parse(JSON.stringify(state.purchaseFilter))
    const secondObject = JSON.parse(JSON.stringify(state.purchasePaginationFilter))
    return Object.assign(object, secondObject)
  },
  getPurchaseFilterPagination: (state) =>
    JSON.parse(JSON.stringify({ ...state.purchaseFilter, ...state.purchasePaginationFilter })),
  getFilterSet: (state) => JSON.parse(JSON.stringify(state.filterSet)),
  getAddFilterPossibility: (state) =>
    state.filterSet.filters.length
      ? state.filterSet.filters.some(
          (filter) => JSON.stringify(filter.options) === JSON.stringify(state.purchaseFilter)
        )
      : true,
  getUserId: (state, second, rootState) => rootState.auth.user.data.id,
  getCurrentUserId: (state) => state.selectedUserId,
  getUserSet: (state) => JSON.parse(JSON.stringify(state.userSet)),
  getSelectedFilterId: (state) => state.filterSet.id,
  getFullPurchaseFilter(state, getters) {
    return {
      user_id: getters.getUserControl ? null : getters.getCurrentUserId ? getters.getCurrentUserId : getters.getUserId,
      ...getters.getPurchaseFilterPagination,
    }
  },
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_PURCHASE(state, purchase) {
    state.purchase = purchase.map(function (currentPurchase) {
      currentPurchase.archive_flag = false
      return currentPurchase
    })
  },
  SAVE_TRADING_PLACES(state, tradingPlaces) {
    state.tradingPlaces = tradingPlaces
  },
  SAVE_USERS_IN_FILTER(state, users) {
    state.userSet.users = users.map(function (user) {
      return { title: user.name, user_id: user.id }
    })
  },
  SAVE_TRADING_PLACES_IN_FILTER(state, tradingPlaces) {
    state.filters.trading_places = state.filters.trading_places.concat(
      tradingPlaces.map(function (tradingPlace) {
        return { title: tradingPlace.name, etp_code: tradingPlace.etp_code }
      })
    )
  },
  UPDATE_PURCHASE_FILTER(state, data) {
    const purchaseFilterCopy = { ...state.purchaseFilter }
    data.filter_object.map(function (filter) {
      purchaseFilterCopy[Object.keys(filter)[0]] = Object.values(filter)[0]
    })
    if (data.filter_name_field && data.filter_name_title)
      state.filterName[data.filter_name_field] = data.filter_name_title
    state.purchaseFilter = purchaseFilterCopy
  },
  UPDATE_PURCHASE_INPUTS(state, data) {
    if (data.sub_field) state.purchaseFilter[data.field][data.sub_field] = data.value
    else state.purchaseFilter[data.field] = data.value
  },
  UPDATE_FILTER_SET(state, filter) {
    state.filterSet.title = filter.title
    state.filterSet.id = filter.id
    const result = state.filterSet.filters.find((filterObject) => filterObject.id === filter.id).options
    Object.keys(result).map(function (field, index) {
      const currentFilter = state.filters[state.purchaseDictionary[field]]
      let currentResult = null
      if (currentFilter)
        currentResult = currentFilter.find(function (filterObject) {
          return filterObject[field] === Object.values(result)[index]
        })
      if (currentResult) state.filterName[state.purchaseDictionary[field]] = currentResult
      return field
    })
    state.purchaseFilter = result
  },
  ADD_NEW_FILTER(state, newFilterName) {
    const filterSetCopy = JSON.parse(JSON.stringify(state.filterSet))
    const randomData = Math.floor(Math.random() * (100 - 1) + 1)
    filterSetCopy.filters.push({
      title: newFilterName,
      id: randomData,
      options: JSON.parse(JSON.stringify(state.purchaseFilter)),
    })
    filterSetCopy.title = newFilterName
    state.filterSet = filterSetCopy
  },
  REMOVE_FILTER(state) {
    const filterSetCopy = JSON.parse(JSON.stringify(state.filterSet))
    filterSetCopy.filters = filterSetCopy.filters.filter((filterItem) => filterItem.title !== filterSetCopy.title)
    state.filterSet = filterSetCopy
  },
  SET_USER_FILTERS(state, user) {
    const userSetCopy = JSON.parse(JSON.stringify(state.userSet))
    const filterSetCopy = JSON.parse(JSON.stringify(state.filterSet))
    userSetCopy.title = user.name
    filterSetCopy.title = 'Фильтры отключены'
    filterSetCopy.filters = [
      {
        title: 'Фильтры отключены',
        id: null,
        options: {
          status: null,
          is_znvlp: null,
          etp_code: null,
          match: null,
          fcs_type: null,
          count_objects: { min: null, max: null },
          max_price: { min: null, max: null },
          processing_date: { to: null, from: null },
          start_application: { to: null, from: null },
          end_application: { to: null, from: null },
          bidding_date: { to: null, from: null },
          purchase_number: null,
        },
      },
    ]
    user.purchaseFilters.map(function (userFilter) {
      filterSetCopy.filters.push({ title: userFilter.title, id: userFilter.id, options: userFilter.data_filter })
    })
    state.filterSet = filterSetCopy
    state.userSet = userSetCopy
  },
  SET_CURRENT_USER_ID(state, user) {
    state.selectedUserId = user.user_id
  },
  SET_CURRENT_PAGE_PURCHASES(state, currentPage) {
    if (state.pagination.purchases.current_page === currentPage) return
    state.pagination.purchases.current_page = currentPage
    state.purchasePaginationFilter.page = currentPage
  },
  SET_LIMIT_PURCHASES(state, limit) {
    if (state.purchasePaginationFilter.limit === limit) return
    state.purchasePaginationFilter.limit = limit
    state.pagination.purchases.current_page = 1
    state.purchasePaginationFilter.page = 1
  },
  SAVE_PURCHASE_PAGINATION(state, pricePagination) {
    state.pagination.purchases = pricePagination
    state.hasApplicationsAt = pricePagination.has_applications_at || null
  },
  CLEAR_PURCHASE_NUMBER(state) {
    state.purchaseFilter.purchase_number = null
  },
  USER_CONTROL_TOOGLE(state) {
    state.userControl = !state.userControl
  },
  UPDATE_SORTING(state, query) {
    state.purchasePaginationFilter.order_by = query.order_by
    state.purchasePaginationFilter.asc_desc = query.asc_desc
  },
  SET_ARCHIVED_PURCHASES(state, purchaseUuid) {
    if (!state.archivedPurchaseArray.includes(purchaseUuid)) state.archivedPurchaseArray.push(purchaseUuid)
  },
  UNSET_ARCHIVED_PURCHASES(state, purchaseUuid) {
    state.archivedPurchaseArray = state.archivedPurchaseArray.filter(function (item) {
      return item !== purchaseUuid
    })
  },
  CLEAR_ARCHIVED_PURCHASE_ARRAY(state) {
    state.archivedPurchaseArray = []
  },
}

export const actions = {
  async fetchPurchase({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`/api/purchase`, {
        params: getters.getFullPurchaseFilter,
      })
      commit('SAVE_PURCHASE', data)
      commit('SAVE_PURCHASE_PAGINATION', meta)
      commit('SET_STATUS', 'purchase-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchTradingPlaces({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/etp`)
      commit('SAVE_TRADING_PLACES', data)
      commit('SAVE_TRADING_PLACES_IN_FILTER', data)
      commit('SET_STATUS', 'trading_places-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchCurrentUser({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(
        `/api/user/${getters.getCurrentUserId ? getters.getCurrentUserId : getters.getUserId}`
      )
      commit('SET_USER_FILTERS', data)
      commit('SET_STATUS', 'current-user-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async addNewFilter({ commit, dispatch, getters }, title) {
    commit('SET_STATUS', 'creating')
    try {
      await this.$axios.$post(`/api/purchase/filter`, {
        title,
        user_id: getters.getCurrentUserId,
        data_filter: getters.getPurchaseFilter,
      })
      dispatch('fetchCurrentUser')
      commit('SET_STATUS', 'filter-created')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async removeFilter({ commit, dispatch, getters }) {
    commit('SET_STATUS', 'removing')
    try {
      await this.$axios.$delete(`/api/purchase/filter/${getters.getSelectedFilterId}`)
      dispatch('fetchCurrentUser')
      commit('SET_STATUS', 'filter-removed')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async addPurchase({ commit, dispatch }, query) {
    commit('SET_STATUS', 'adding')
    try {
      await this.$axios.$post(`/api/purchase`, query)
      commit('SET_STATUS', 'purchase-added')
      dispatch('fetchPurchase')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async archivePurchaseArray({ commit, dispatch, getters }) {
    commit('SET_STATUS', 'archived')
    try {
      await this.$axios.$put(`/api/purchase/manyStatusSlug`, { uuids: getters.getArchivePurchaseArray })
      commit('SET_STATUS', 'purchase-archived')
      commit('CLEAR_ARCHIVED_PURCHASE_ARRAY')
      dispatch('fetchPurchase')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
