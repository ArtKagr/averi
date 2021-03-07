export const state = () => ({
  status: '',
  offers: [],
  currentOffer: {},
  organizations: [],
  customerName: null,
  customerEmail: null,
  customerComment: null,
  offerOrganizations: [],
  surchargeId: 792,
  offersPaginationFilter: {
    limit: 300,
    order_by: null,
    asc_desc: 'desc',
    page: 1,
  },
  pagination: {
    current_page: 1,
    from: null,
    last_page: null,
    path: null,
    per_page: null,
    to: null,
    total: null,
  },
})

export const getters = {
  getStatus: (state) => state.status,
  getOffers: (state) => state.offers,
  getPagination: (state) => state.pagination,
  getOffersPaginationFilter: (state) => state.offersPaginationFilter,
  getCurrentOffer: (state) => state.currentOffer,
  getOrganizations: (state) => state.organizations,
  getOfferOrganizations: (state) => state.offerOrganizations,
  getOfferPrices(state, getters) {
    if (getters.getCurrentOffer && getters.getCurrentOffer.prices && getters.getCurrentOffer.prices.length)
      return getters.getCurrentOffer.prices.map((price) => price.id)
    else return []
  },
  getCustomerName: (state) => state.customerName,
  getCustomerEmail: (state) => state.customerEmail,
  getCustomerComment: (state) => state.customerComment,
  getSurchargeId: (state) => state.surchargeId,
  getOfferPriceIds(state, getters, rootState, rootGetters) {
    return rootGetters['price/getSelectedOfferPrices'].map(function (priceId) {
      return { id: priceId, price_gnvls: 0 }
    })
    // return getters.getCurrentOffer.prices && getters.getCurrentOffer.prices.length
    //   ? getters.getCurrentOffer.prices.map(function (price) {
    //     return { id: price.id, price_gnvls: price.price_gnvls }
    //   })
    //   : rootGetters['price/getSelectedOfferPrices'].map(function(priceId) {
    //     return { id: priceId, price_gnvls: 0 }
    //   })
  },
  getOffer(state, getters) {
    return {
      customer_name: getters.getCustomerName,
      customer_email: getters.getCustomerEmail,
      customer_comment: getters.getCustomerComment,
      surcharge_id: getters.getSurchargeId,
      settings: {
        organizations: getters.getOfferOrganizations,
      },
      prices:
        getters.getCurrentOffer.prices && getters.getCurrentOffer.prices.length
          ? getters.getCurrentOffer.prices.map(function (price) {
              return { id: price.id, price_gnvls: price.price_gnvls }
            })
          : [],
    }
  },
}

export const mutations = {
  SET_STATUS(state, status) {
    state.status = status
  },
  SAVE_OFFERS(state, offers) {
    state.offers = offers.filter((offer) => !offer.is_archive)
  },
  SAVE_CURRENT_OFFER(state, currentOffer) {
    state.currentOffer = currentOffer
    state.customerName = currentOffer.customer_name
    state.customerEmail = currentOffer.customer_email
    state.customerComment = currentOffer.customer_comment
    if (currentOffer.surcharge && currentOffer.surcharge.id) {
      state.surchargeId = currentOffer.surcharge.id
    } else state.surchargeId = 792
    state.offerPrices = currentOffer.prices
    if (
      currentOffer &&
      currentOffer.settings &&
      currentOffer.settings.organizations &&
      currentOffer.settings.organizations.length
    ) {
      state.offerOrganizations = state.currentOffer.settings.organizations
    } else {
      state.offerOrganizations = state.organizations
    }
  },
  SAVE_ORGANIZATIONS(state, organizations) {
    state.organizations = organizations
  },
  REMOVE_CURRENT_OFFER_PRICE(state, currentPrice) {
    let currentOfferPrices = JSON.parse(JSON.stringify(state.currentOffer.prices))
    currentOfferPrices = currentOfferPrices.filter((price) => price.id !== currentPrice.id)
    state.currentOffer.prices = currentOfferPrices
  },
  CHANGE_CUSTOMER_NAME(state, customerName) {
    state.customerName = customerName
  },
  CHANGE_CUSTOMER_EMAIL(state, customerEmail) {
    state.customerEmail = customerEmail
  },
  CHANGE_CUSTOMER_COMMENT(state, customerComment) {
    state.customerComment = customerComment
  },
  SAVE_SURCHARGE_ID(state, surchargeId) {
    state.surchargeId = surchargeId
  },
  UPDATE_CURRENT_ORGANIZATION(state, query) {
    state.offerOrganizations[query.index][`${query.field}`] = query.value
  },
  UPDATE_ORGANIZATIONS(state, organizations) {
    state.offerOrganizations = organizations
  },
  SAVE_PAGINATION(state, pagination) {
    state.pagination = pagination
  },
  SET_CURRENT_PAGE_OFFERS(state, currentPage) {
    if (state.pagination.current_page === currentPage) return
    state.pagination.current_page = currentPage
    state.offersPaginationFilter.page = currentPage
  },
  SET_LIMIT_OFFERS(state, limit) {
    if (state.offersPaginationFilter.limit === limit) return
    state.offersPaginationFilter.limit = limit
    state.pagination.current_page = 1
    state.offersPaginationFilter.page = 1
  },
  UPDATE_CURRENT_OFFER_PRICE(state, currentPrice) {
    state.currentOffer.prices = state.currentOffer.prices.map(function (price) {
      if (price.id === currentPrice.id) return currentPrice
      else return price
    })
  },
  UPDATE_CURRENT_OFFER(state, priceGnvls) {
    state.currentOffer.prices = state.currentOffer.prices.map(function (price) {
      if (price.id === priceGnvls.id) price = priceGnvls
      return price
    })
  },
}

export const actions = {
  setOfferPrices({ commit, getters }) {
    commit('price/SET_OFFER_PRICES', getters.getOfferPrices || [], { root: true })
  },
  async fetchOffers({ commit, getters }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data, meta } = await this.$axios.$get(`/api/offer`, {
        params: getters.getOffersPaginationFilter,
      })
      commit('SAVE_OFFERS', data)
      commit('SAVE_PAGINATION', meta)
      commit('SET_STATUS', 'offers-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchCurrentOffer({ commit }, id) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/offer/${id}`)
      commit('SAVE_CURRENT_OFFER', data)
      commit('SET_STATUS', 'current-offer-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createCurrentOffer({ commit }) {
    commit('SET_STATUS', 'creation')
    try {
      const { data } = await this.$axios.$post(`/api/offer`)
      commit('SAVE_CURRENT_OFFER', data)
      commit('SET_STATUS', 'current-offer-is-created')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async fetchOrganizations({ commit }) {
    commit('SET_STATUS', 'fetching')
    try {
      const { data } = await this.$axios.$get(`/api/offer_organization`)
      commit('SAVE_ORGANIZATIONS', data)
      commit('SET_STATUS', 'organizations-is-fetched')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async saveCurrentOffer({ commit, getters }) {
    commit('SET_STATUS', 'update')
    try {
      await this.$axios.$put(`/api/offer/${getters.getCurrentOffer.id}`, { prices: getters.getOfferPriceIds })
      commit('SET_STATUS', 'current-offer-updated')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async archiveCurrentOffer({ commit, dispatch }, offer) {
    commit('SET_STATUS', 'archiving')
    try {
      await this.$axios.$put(`/api/offer/${offer.id}`, { is_archive: true })
      commit('SET_STATUS', 'current-offer-archived')
      dispatch('fetchOffers')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async saveOffer({ commit, getters, dispatch }) {
    commit('SET_STATUS', 'update')
    try {
      await this.$axios.$put(`/api/offer/${getters.getCurrentOffer.id}`, getters.getOffer)
      commit('SET_STATUS', 'current-offer-updated')
      dispatch('fetchCurrentOffer', getters.getCurrentOffer.id)
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async createCurrentOrganization({ commit, dispatch }, query) {
    commit('SET_STATUS', 'creation')
    try {
      await this.$axios.$post(`/api/offer_organization`, query)
      commit('SET_STATUS', 'current-organization-created')
      dispatch('fetchOrganizations')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async updateCurrentOrganization({ commit, dispatch }, organization) {
    commit('SET_STATUS', 'updating')
    try {
      await this.$axios.$put(`/api/offer_organization/${organization.id}`, organization)
      commit('SET_STATUS', 'current-organization-updated')
      dispatch('fetchOrganizations')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
  async setOfferMailing({ commit, dispatch }, offerId) {
    commit('SET_STATUS', 'setting')
    try {
      await this.$axios.$put(`/api/offer/send/${offerId}`)
      commit('SET_STATUS', 'offer-mail-set')
      dispatch('fetchOffers')
    } catch {
      commit('SET_STATUS', 'error')
    }
  },
}
