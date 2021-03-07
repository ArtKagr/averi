<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <div class="d-flex justify-content-between w-100">
      <div class="d-flex align-items-center">
        <b-icon-arrow-clockwise
          class="text-align-center h4 mb-0 mr-4 pointer"
          :class="statisticStatus === 'fetching' ? '-loader' : ''"
          @click="updateStatistic"
        ></b-icon-arrow-clockwise>
        <b-icon-file-earmark-zip
          v-if="statistic.length"
          class="h4 m-0 mr-4 pointer"
          @click="$root.$emit('downloadFile', `${API_URL}purchase_statistic/export?${filterUrl}`)"
        ></b-icon-file-earmark-zip>
        <b-icon-file-earmark-zip v-else class="h4 m-0 mr-4" variant="secondary"></b-icon-file-earmark-zip>
        <b-icon-nut v-b-toggle.sidebar_search_price_stat class="custom_button h4 m-0" />
        <b-sidebar
          id="sidebar_search_price_stat"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          backdrop
          width="35%"
          right
          shadow=""
          lazy
        >
          <stat-price-result></stat-price-result>
        </b-sidebar>
      </div>
      <div class="d-flex">
        <div>
          <b-dd
            id="dropdown-purchase_status"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ userName.name }}
            </template>
            <template v-for="(user, key) in users">
              <b-dd-item-btn
                :key="key"
                button-class="d-flex flex-row custom_dropdown_item"
                :active="user.id === userName.id"
                @click="updateStatisticFilter(user, 'user_id')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ user.name }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div>
          <b-dd
            id="dropdown-purchase_status"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ purchaseStatus.title }}
            </template>
            <template v-for="(filter, key) in filters.purchase_status">
              <b-dd-item-btn
                :key="key"
                button-class="d-flex flex-row custom_dropdown_item"
                :active="filter.status === purchaseStatus.status"
                @click="updateStatisticFilter(filter, 'status_slug')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div>
          <b-dd
            id="dropdown-purchase_status"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ confirmedStatus.title }}
            </template>
            <template v-for="(filter, key) in filters.confirmed">
              <b-dd-item-btn
                :key="key"
                button-class="d-flex flex-row custom_dropdown_item"
                :active="filter.slug === confirmedStatus.slug"
                @click="updateStatisticFilter(filter, 'confirmed')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div class="mr-4">
          <b-input-group class="filter">
            <datepicker
              v-model="createdAt.from"
              placeholder="Начало интервала"
              type="datetime"
              value-type="timestamp"
              format="DD.MM.YYYY HH:mm"
              class="w-50"
            ></datepicker>
            <datepicker
              v-model="createdAt.to"
              placeholder="Конец интервала"
              type="datetime"
              value-type="timestamp"
              format="DD.MM.YYYY HH:mm"
              class="w-50"
            ></datepicker>
          </b-input-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatPriceResult from './StatPriceResult'
export default {
  name: 'StatFilter',
  components: { StatPriceResult },
  data() {
    return {
      API_URL: null,
      purchaseStatus: { title: 'Все папки', status: null },
      userName: { name: 'Все сотрудники', id: null },
      confirmedStatus: { title: 'Все закупки', slug: null },
      createdAt: {
        from: null,
        to: null,
      },
      confirmed: false,
    }
  },
  computed: {
    statisticPagination() {
      return this.$store.getters['statistic/getStatisticPagination']
    },
    statistic() {
      return this.$store.getters['statistic/getStatistic']
    },
    statFilter() {
      return this.$store.getters['statistic/getStatisticFilter']
    },
    filters() {
      return this.$store.getters['purchase/getFilters']
    },
    users() {
      return [{ name: 'Все сотрудники', id: null }].concat(this.$store.getters['dictionaries/getAllUsersList'])
    },
    statisticFilter() {
      return this.$store.getters['statistic/getStatisticFilter']
    },
    statisticStatus() {
      return this.$store.getters['statistic/getStatus']
    },
    filterUrl() {
      const params = new URLSearchParams()

      for (const key in this.statFilter) {
        if (key === 'limit') {
          params.append('limit', this.statisticPagination.total)
        } else if (
          (typeof this.statFilter[key] === 'object' || typeof this.statFilter[key] === 'function') &&
          this.statFilter[key] !== null
        ) {
          params.append(key, JSON.stringify(this.statFilter[key]))
        } else if (this.statFilter[key] === null) {
          //
        } else {
          params.append(key, this.statFilter[key])
        }
      }
      return params
    },
  },
  watch: {
    statisticFilter: {
      handler() {
        this.$store.dispatch('statistic/fetchStatistic')
      },
      deep: true,
    },
    createdAt: {
      handler(newValue) {
        this.$store.commit('statistic/UPDATE_DATES_STATISTIC_FILTER', newValue)
      },
      deep: true,
    },
  },
  created() {
    this.API_URL = process.env.API_URL
  },
  methods: {
    updateStatisticFilter(query, field) {
      let value
      switch (field) {
        case 'status_slug':
          this.purchaseStatus = query
          value = query.status
          break
        case 'user_id':
          this.userName = query
          value = query.id
          break
        case 'confirmed':
          this.confirmedStatus = query
          value = query.slug
          break
      }
      this.$store.commit('statistic/UPDATE_STATISTIC_FILTER', { value, field })
    },
    updateStatistic() {
      if (this.statisticStatus !== 'fetching') this.$store.dispatch('statistic/fetchStatistic')
    },
  },
}
</script>
