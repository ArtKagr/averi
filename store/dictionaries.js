export const state = () => ({
  status: '',
  sellers: [],
  phrases: [],
  users: [],
  roles: [],
  mnnList: [],
  mnnListCuted: [],
  lfListCuted: [],
  lfList: [],
  customers: [],
  mainSellers: [],
  regionalSellers: [],
  statusesList: [
    {
      id: null,
      title: 'Все статусы',
      padding: null,
      variant: null,
    },
    {
      id: 'not_assigned',
      title: 'Не присвоено',
      padding: 'pl-2',
      variant: 'danger',
    },
    {
      id: 'auto_selection',
      title: 'Автоподбор',
      padding: 'pl-4',
      variant: 'dark',
    },
    {
      id: 'actual',
      title: 'Актуально',
      padding: 'pl-2',
      variant: '',
    },
    {
      id: 'moderation',
      title: 'На модерации',
      padding: 'pl-4',
      variant: 'warning',
    },
    {
      id: 'confirmed',
      title: 'Подтверждено',
      padding: 'pl-4',
      variant: 'success',
    },
    // {
    //   id: 'hide',
    //   title: 'Скрыто',
    //   padding: 'pl-2',
    //   variant: 'secondary',
    // },
  ],
  statusName: 'Все статусы',
  sellerName: 'Основные поставщики',
  filterName: 'Основные поставщики',
  mnn: null,
  search: null,
  currentCustomer: { full_name: null, reg_number: null },
  customersFilter: {
    name: null,
    inn: null,
    page: 1,
    limit: 15,
  },
  okeiList: [],
  usersListStatus: true,
  sellerTableColumns: [],
  currentSellerPriceTemplate: [],
})

export const getters = {
  getStatus: (state) => state.status,
  getCurrentSellerPriceTemplate: (state) => state.currentSellerPriceTemplate,
  getCurrentOkei: (state) => (okeiCode) => state.okeiList.find((okeiItem) => okeiItem.okei_code === okeiCode),
  getOkeiList: (state) => state.okeiList,
  getCurrentCustomer: (state) => state.currentCustomer,
  getCustomersFilter: (state) => state.customersFilter,
  getMnnPriceFilter: (state) => state.mnn,
  getSearchPriceFilter: (state) => state.search,
  getStatusName: (state) => state.statusName,
  getSellerName: (state) => state.sellerName,
  getAuthUserName: (state, second, rootState) => rootState.auth.user.data.name,
  getAuthUser: (state, second, rootState) => rootState.auth.user.data,
  getMnnList: (state) => state.mnnListCuted,
  getLfList: (state) => state.lfListCuted,
  getCustomers: (state) => state.customers,
  getRoles: (state) => state.roles,
  getUsersListStatus: (state) => state.usersListStatus,
  getUsers: (state, getters) =>
    state.users.filter(function (user) {
      if (user.is_active === getters.getUsersListStatus) return user
    }),
  getPhrases: (state) => state.phrases,
  getCurrentPhrase: (state) => (phraseId) => state.phrases.find((phrase) => phrase.id === phraseId).short_name,
  getSellers: (state) => JSON.parse(JSON.stringify(state.sellers)),
  getMainSellers: (state) => state.mainSellers,
  getRegionalSellers: (state) => state.regionalSellers,
  getAllUsersList: (state) => state.users,
  getSellerTableColumns: (state) => state.sellerTableColumns,
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_SELLERS(state, sellers) {
    state.sellers = sellers
  },
  SAVE_MAIN_SELLERS(state, mainSellers) {
    state.mainSellers = mainSellers
  },
  SAVE_REGIONAL_SELLERS(state, regionalSellers) {
    state.regionalSellers = regionalSellers
  },
  SAVE_ROLES(state, roles) {
    state.roles = roles
  },
  SAVE_USERS(state, users) {
    state.users = users
  },
  SAVE_MNN_LIST(state, mnnList) {
    state.mnnList = mnnList
    state.mnnListCuted = mnnList.slice(1, 50)
  },
  SAVE_LF_LIST(state, lfList) {
    state.lfList = lfList
    state.lfListCuted = lfList.slice(1, 50)
  },
  SAVE_CUSTOMERS(state, customers) {
    state.customers = customers
  },
  UPDATE_MNN_LIST(state, newMnn) {
    let counter = 0
    if (newMnn)
      state.mnnListCuted = state.mnnList.filter(function (mnn) {
        if (counter === 50) return
        if (mnn.mnn.match('^' + newMnn.toUpperCase())) {
          counter++
          return mnn
        }
      })
    else state.mnnListCuted = state.mnnList.slice(1, 50)
  },
  UPDATE_LF_LIST(state, newLfName) {
    let counter = 0
    if (newLfName)
      state.lfListCuted = state.lfList.filter(function (lfName) {
        if (counter === 50) return
        if (lfName.form.match('^' + newLfName.toUpperCase())) {
          counter++
          return lfName
        }
      })
    else state.lfListCuted = state.lfList.slice(1, 50)
  },
  UPDATE_STATUS_NAME(state, statusId) {
    state.statusName = state.statusesList.find((status) => status.id === statusId).title
  },
  UPDATE_SELLER_NAME(state, sellerId) {
    state.sellerName = [
      { id: null, seller_name: 'Все поставщики' },
      { id: 'main', seller_name: 'Основные поставщики' },
      { id: 'regional', seller_name: 'Региональные поставщики' },
      { id: 'main_regional', seller_name: 'Основные + региональные поставщики' },
    ]
      .concat(state.sellers)
      .find((seller) => seller.id === sellerId).seller_name
  },
  UPDATE_MNN_FILTER_NAME(state, newValue) {
    state.mnn = newValue
  },
  UPDATE_SEARCH_FILTER_NAME(state, newValue) {
    state.search = newValue
  },
  CLEAR_FILTER_NAMES(state) {
    state.statusName = 'Все статусы'
    state.sellerName = 'Основные поставщики'
    state.mnn = null
  },
  UPDATE_CUSTOMERS_FILTER(state, query) {
    const customersFilterCopy = { ...state.customersFilter }
    customersFilterCopy[query.field] = query.value
    state.customersFilter = customersFilterCopy
  },
  SET_CURRENT_CUSTOMER(state, newValue) {
    if (newValue) state.currentCustomer = newValue
    else state.currentCustomer = { full_name: null, reg_number: null }
  },
  UPDATE_CURRENT_CUSTOMER(state, newValue) {
    state.currentCustomer = newValue
  },
  SAVE_OKEI_LIST(state, okeiList) {
    state.okeiList = okeiList
  },
  CHANGE_USERS(state, query) {
    const array = []
    array.push(query.role)
    state.users = state.users.map(function (currentUser) {
      if (currentUser.id === query.user.id) {
        currentUser.roles = array
        currentUser.edit = true
      }
      return currentUser
    })
  },
  CHANGE_USERS_LIST_FLAG(state, status) {
    state.usersListStatus = status
  },
  SAVE_PHRASES(state, phrases) {
    state.phrases = phrases
  },
  SAVE_SELLER_TABLE_COLUMNS(state, sellerTableColumns) {
    state.sellerTableColumns = sellerTableColumns.map(function (column) {
      column.is_select = false
      return column
    })
  },
  UPDATE_CURRENT_SELLER_COLUMN(state, query) {
    state.sellerTableColumns[query.column].is_select = query.flag
  },
  CLEAR_SELLER_COLUMNS(state) {
    state.sellerTableColumns = state.sellerTableColumns.map(function (column) {
      column.is_select = false
      return column
    })
  },
  SAVE_CURRENT_SELLER_TEMPLATE(state, currentSellerPriceTemplate) {
    state.currentSellerPriceTemplate = currentSellerPriceTemplate
  },
}

export const actions = {
  async fetchSellers({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/seller`, { params: { asc_desc: 'asc' } })
      commit('SAVE_SELLERS', data)
      commit('SET_STATUS', 'seller-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async updateCurrentSeller({ commit, dispatch }, query) {
    commit('SET_STATUS', 'updating')
    try {
      await this.$axios.$put(`/api/seller/${query.id}`, {
        kladr_id: query.kladr_id,
        is_main: query.is_main,
        seller_outside_id: query.seller_outside_id,
      })
      commit('SET_STATUS', 'seller-is-updated')
      dispatch('fetchSellers')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchMainSellers({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/seller/main`)
      commit('SAVE_MAIN_SELLERS', data)
      // commit('price/SAVE_MAIN_SELLERS_IN_FILTER', data, { root: true })
      commit('SET_STATUS', 'main-sellers-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchRegionalSellers({ commit }, locality) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/seller/regional`, { params: { kladr_id: locality } })
      commit('SAVE_REGIONAL_SELLERS', data)
      commit('SET_STATUS', 'regional-sellers-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchRoles({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/role`)
      commit('SAVE_ROLES', data)
      commit('SET_STATUS', 'roles-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async changeUserRole({ commit, dispatch }, query) {
    commit('SET_STATUS', 'fetching')
    try {
      await this.$axios.$put(`/api/user/${query.user.id}`, { role_ids: [query.role.id] })
      dispatch('fetchRoles')
      commit('SET_STATUS', 'role-is-changed')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchUsers({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/user`)
      commit('SAVE_USERS', data)
      commit('purchase/SAVE_USERS_IN_FILTER', data, { root: true })
      commit('SET_STATUS', 'users-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createUser({ commit, dispatch }, query) {
    commit('SET_STATUS', 'creating')
    try {
      await this.$axios.$post(`/api/user`, query)
      dispatch('fetchUsers')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async editUser({ commit, dispatch }, query) {
    commit('SET_STATUS', 'editing')
    try {
      await this.$axios.$put(`/api/user/${query.id}`, query)
      dispatch('fetchUsers')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchMnnList({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/esklp/smnn/mnn`)
      commit('SAVE_MNN_LIST', data)
      commit('SET_STATUS', 'mnn_list-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchLfList({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/esklp/smnn/lk_form_name`)
      commit('SAVE_LF_LIST', data)
      commit('SET_STATUS', 'lf_list-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchCustomers({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/responsible`, { params: getters.getCustomersFilter })
      commit('SAVE_CUSTOMERS', data)
      commit('SET_STATUS', 'customers-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchOkeiList({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/okei`)
      commit('SAVE_OKEI_LIST', data)
      commit('SET_STATUS', 'okei_list-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchPhrases({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/phrase`)
      commit('SAVE_PHRASES', data)
      commit('SET_STATUS', 'phrases-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchSellerColumns({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/seller/get_table_columns`)
      commit('SAVE_SELLER_TABLE_COLUMNS', data)
      commit('SET_STATUS', 'seller_table_columns-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchCurrentSellerPriceTemplate({ commit }, sellerId) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/seller_price_pattern`, {
        params: { seller_id: sellerId, is_active: true },
      })
      commit('SET_STATUS', 'current-seller-price-template-is-fetched')
      commit('SAVE_CURRENT_SELLER_TEMPLATE', data)
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async setSellerPriceTemplate({ commit }, query) {
    commit('SET_STATUS', 'creation')
    try {
      await this.$axios.$post(`/api/seller_price_pattern`, query)
      commit('SET_STATUS', 'seller-price-created')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
