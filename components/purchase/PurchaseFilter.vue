<template>
  <div
    :class="
      source === 'filter'
        ? 'w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between'
        : 'w-100 px-4'
    "
  >
    <div class="d-flex" :class="source === 'filter' ? 'justify-content-between w-100' : 'flex-column'">
      <div :class="['d-flex', source === 'filter' ? 'align-items-center mr-4' : 'pb-4 align-items-center']">
        <b-icon-arrow-clockwise
          v-if="source === 'filter'"
          class="text-align-center h4 mb-0 mr-4 pointer"
          :class="purchaseStatus === 'fetching' ? '-loader' : ''"
          @click="updatePurchase"
        ></b-icon-arrow-clockwise>
        <b-icon-justify
          v-if="source === 'filter'"
          v-b-toggle.sidebar-backdrop
          class="text-align-center h4 mb-0 mr-4 custom_button pointer"
        ></b-icon-justify>
        <b-icon-file-earmark-zip
          v-if="purchase.length"
          class="h4 m-0 mr-4 pointer"
          @click="$root.$emit('downloadFile', `${API_URL}purchase/export?${filterUrl}`)"
        ></b-icon-file-earmark-zip>
        <b-icon-file-earmark-zip v-else class="h4 m-0 mr-4" variant="secondary"></b-icon-file-earmark-zip>
        <b-icon-plus-circle
          v-if="
            source === 'filter' &&
            (accessRight.role === 'administrators' ||
              accessRight.role === 'general_operators' ||
              accessRight.role === 'purchasing_operators' ||
              false)
          "
          v-b-toggle.add-purchase
          class="text-align-center h5 mb-0 pointer mr-4 custom_button"
        ></b-icon-plus-circle>
        <div class="d-flex align-items-center" :class="source === 'sidebar' ? 'flex-column mt-2' : 'flex-row'">
          <div
            v-if="accessRight.role === 'administrators' || accessRight.role === 'general_operators' || false"
            class="d-flex"
          >
            <b-icon-person-fill
              v-if="userControl"
              variant="dark"
              class="h4 mb-0 pointer"
              @click="toogleUserControl"
            ></b-icon-person-fill>
            <b-icon-person-fill
              v-else
              variant="info"
              class="h4 mb-0 pointer"
              @click="toogleUserControl"
            ></b-icon-person-fill>
          </div>
          <div
            v-if="accessRight.role === 'administrators' || accessRight.role === 'general_operators' || false"
            class="d-flex"
            :class="source === 'sidebar' ? 'mb-3' : ''"
          >
            <b-dropdown size="md" variant="link" toggle-class="text-decoration-none p-0 custom_button" no-caret>
              <template v-slot:button-content>
                <span class="ml-2 mr-4">{{ userSet.title ? userSet.title : 'Сотрудник не выбран' }}</span>
              </template>
              <template v-for="(user, key) in userSet.users">
                <b-dd-item-btn
                  :key="key"
                  :active="userId === user.user_id"
                  button-class="d-flex flex-row custom_dropdown_item"
                  @click="setCurrentUser(user)"
                >
                  <div class="flex-fill text-left mr-2">
                    {{ user.title }}
                  </div>
                </b-dd-item-btn>
              </template>
            </b-dropdown>
          </div>
          <div>
            <b-dropdown size="md" variant="link" toggle-class="text-decoration-none p-0 custom_button" no-caret>
              <template v-slot:button-content>
                <b-icon-sliders class="text-align-center h4 mb-0 pointer"></b-icon-sliders>
              </template>
              <div class="d-flex flex-column">
                <div
                  v-if="accessRight.role === 'administrators' || accessRight.role === 'general_operators' || false"
                  class="d-flex justify-content-end align-items-center px-2 mb-2 justify-content-between"
                >
                  <template v-if="filterAdding">
                    <b-input-group class="filter w-70 mr-3">
                      <b-form-input v-model="newFilterName" placeholder="Введите название"></b-form-input>
                    </b-input-group>
                    <div class="d-flex align-items center">
                      <b-icon-folder-check
                        v-if="newFilterName"
                        class="text-align-center h5 mb-0 custom_button mr-3 pointer"
                        variant="success"
                        @click="saveNewFilter"
                      ></b-icon-folder-check>
                      <b-icon-folder-check
                        v-else
                        class="text-align-center h5 mb-0 custom_button mr-3"
                        variant="secondary"
                      ></b-icon-folder-check>
                      <b-icon-x
                        class="text-align-center h5 mb-0 custom_button pointer"
                        @click="resetFilterAdding"
                      ></b-icon-x>
                    </div>
                  </template>
                  <template v-else>
                    <b-icon-trash
                      v-if="filterSet.title === 'Фильтры отключены' || addFilterPossibility"
                      class="text-align-center h5 mb-0"
                      variant="secondary"
                    ></b-icon-trash>
                    <b-icon-trash
                      v-else
                      class="text-align-center h5 mb-0 pointer"
                      variant="info"
                      @click="removeFilterModal"
                    ></b-icon-trash>
                    <b-icon-clipboard-plus
                      v-if="addFilterPossibility"
                      class="text-align-center h5 mb-0 pointer"
                      variant="success"
                      @click="addNewFilter"
                    ></b-icon-clipboard-plus>
                    <b-icon-clipboard-plus
                      v-else
                      class="text-align-center h5 mb-0"
                      variant="secondary"
                      @click="showNotification('Действие заблокировано', 'Информация', 'warning')"
                    ></b-icon-clipboard-plus>
                  </template>
                  <!--              <b-icon-folder-check class="text-align-center h5 mb-0 pointer"></b-icon-folder-check>-->
                </div>
                <div class="d-flex flex-column">
                  <div v-for="(filter, key) in filterSet.filters" :key="key">
                    <b-dd-item-btn
                      :active="filter.title === filterSet.title && !addFilterPossibility"
                      button-class="d-flex flex-row custom_dropdown_item"
                      @click="choiceFilterSet(filter)"
                    >
                      <div class="flex-fill text-left mr-2">
                        {{ filter.title }}
                      </div>
                    </b-dd-item-btn>
                  </div>
                </div>
              </div>
            </b-dropdown>
            <span class="ml-2">{{ addFilterPossibility ? 'Пользовательский' : filterSet.title }}</span>
          </div>
        </div>
      </div>
      <div :class="source === 'filter' ? 'd-flex justify-content-between w-70' : 'flex-column mt-2'">
        <div :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-purchase_status"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.purchase_status.title }}
            </template>
            <template v-for="(filter, key) in filters.purchase_status">
              <b-dd-item-btn
                :key="key"
                :active="filter.status === filterName.purchase_status.status"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'purchase_status')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-matches_mnn"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.match_mnn.title }}
            </template>
            <template v-for="(filter, key) in filters.match_mnn">
              <b-dd-item-btn
                :key="key"
                :active="filter.match_mnn === filterName.match_mnn.match_mnn"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'match_mnn')"
              >
                <div class="flex-fill text-left mr-2">
                  <span>{{ filter.title }}</span>
                </div>
                <div v-if="filter.match_mnn !== 'all'" :class="'text-' + filter.variant" class="pl-2 px-2 border-left">
                  <b-icon-circle-fill v-if="filter.match_mnn === 'complete'"></b-icon-circle-fill>
                  <b-icon-circle-half v-else-if="filter.match_mnn === 'partial'"></b-icon-circle-half>
                  <b-icon-circle v-else-if="filter.match_mnn === 'not_found'"></b-icon-circle>
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-matches_mnn"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.matches_mnn.title }}
            </template>
            <template v-for="(filter, key) in filters.matches_mnn">
              <b-dd-item-btn
                :key="key"
                :active="filter.match === filterName.matches_mnn.match"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'matches_mnn')"
              >
                <div class="flex-fill text-left mr-2">
                  <span>{{ filter.title }}</span>
                </div>
                <div v-if="filter.match !== 'all'" :class="'text-' + filter.variant" class="pl-2 px-2 border-left">
                  <b-icon-circle-fill v-if="filter.match === 'complete'"></b-icon-circle-fill>
                  <b-icon-circle-half v-else-if="filter.match === 'partial'"></b-icon-circle-half>
                  <b-icon-circle v-else-if="filter.match === 'not_found'"></b-icon-circle>
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-medications"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.medications.title }}
            </template>
            <template v-for="(filter, key) in filters.medications">
              <b-dd-item-btn
                :key="key"
                :active="filter.is_znvlp === filterName.medications.is_znvlp"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'medications')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div v-if="source === 'sidebar'" :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-trading_places"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.trading_places.title }}
            </template>
            <template v-for="(filter, key) in filters.trading_places">
              <b-dd-item-btn
                :key="key"
                :active="filter.etp_code === filterName.trading_places.etp_code"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'trading_places')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-purchase_types"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.purchase_types.title }}
            </template>
            <template v-for="(filter, key) in filters.purchase_types">
              <b-dd-item-btn
                :key="key"
                :active="filter.fcs_type === filterName.purchase_types.fcs_type"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'purchase_types')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div v-if="source !== 'filter'" :class="['d-flex text-center', source === 'filter' ? '' : 'mb-2']">
          <b-dd
            id="dropdown-purchase_types"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ filterName.rts_statuses.title }}
            </template>
            <template v-for="(filter, key) in filters.rts_statuses">
              <b-dd-item-btn
                :key="key"
                :active="filter.has_applications === filterName.rts_statuses.has_applications"
                button-class="d-flex flex-row custom_dropdown_item"
                @click="updatePurchaseFilter(filter, 'rts_statuses')"
              >
                <div class="flex-fill text-left mr-2">
                  {{ filter.title }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <div :class="['d-flex align-items-center', source === 'filter' ? '-small' : 'mb-3 pt-3 flex-column']">
          <div v-if="source !== 'filter'" class="d-flex flex-column w-100 mb-1">
            <p class="m-0 font-weight-bold" style="font-size: 13px">Дата и время обновления РТС</p>
            <span class="mt-1">{{
              hasApplicationsAt ? $moment(hasApplicationsAt).format('DD.MM.YYYY HH:mm') : 'не установлена'
            }}</span>
          </div>
        </div>
        <div :class="['d-flex align-items-center', source === 'filter' ? '-small' : 'mb-3 pt-3 flex-column']">
          <div v-if="source !== 'filter'" class="d-flex w-100 mb-1">
            <p class="m-0 font-weight-bold" style="font-size: 13px">Количество объектов закупки в закупке</p>
          </div>
          <b-input-group class="filter mr-2">
            <b-form-input v-model="purchaseFilter.count_objects.min" type="number" placeholder="от"></b-form-input>
            <b-form-input v-model="purchaseFilter.count_objects.max" type="number" placeholder="до"></b-form-input>
          </b-input-group>
        </div>
        <div :class="['d-flex align-items-center', source === 'filter' ? '-small' : 'mb-3 flex-column']">
          <div v-if="source !== 'filter'" class="d-flex w-100 mb-1">
            <p class="m-0 font-weight-bold" style="font-size: 13px">Начальная максимальная цена контракта</p>
          </div>
          <b-input-group class="filter mr-2">
            <b-form-input v-model="purchaseFilter.max_price.min" type="number" placeholder="от"></b-form-input>
            <b-form-input v-model="purchaseFilter.max_price.max" type="number" placeholder="до"></b-form-input>
          </b-input-group>
        </div>
        <template v-if="source === 'sidebar'">
          <div
            v-for="(picker, key) in pickerFilters"
            :key="key"
            class="d-flex align-items-center justify-content-between mb-3"
          >
            <div class="d-flex flex-column w-100">
              <div class="d-flex w-100 mb-1">
                <p class="m-0 font-weight-bold" style="font-size: 13px">{{ picker.title }}</p>
              </div>
              <div class="d-flex flex-column">
                <datepicker
                  v-model="purchaseFilter[picker.type].from"
                  placeholder="от"
                  type="datetime"
                  value-type="format"
                  class="w-100"
                ></datepicker>
                <datepicker
                  v-model="purchaseFilter[picker.type].to"
                  placeholder="до"
                  type="datetime"
                  value-type="format"
                  class="w-100"
                ></datepicker>
              </div>
            </div>
          </div>
        </template>
        <b-input-group v-if="source === 'filter'" class="d-flex align-items-center filter -small">
          <b-form-input v-model="purchaseFilter.purchase_number" placeholder="№ аукциона"></b-form-input>
          <b-input-group-append>
            <b-button
              size="sm"
              :variant="purchaseFilter.purchase_number ? 'info' : 'secondary'"
              @click="clearPurchaseNumber"
              >X</b-button
            >
          </b-input-group-append>
        </b-input-group>
        <div v-else-if="source === 'sidebar'" class="d-flex align-items-center pt-3">
          <b-input-group class="filter mr-2">
            <b-form-input v-model="purchaseFilter.purchase_number" placeholder="Номер аукциона"></b-form-input>
          </b-input-group>
          <b-icon-x
            :variant="purchaseFilter.purchase_number ? 'info' : 'secondary'"
            class="pointer"
            @click="clearPurchaseNumber"
          >
          </b-icon-x>
        </div>
      </div>
    </div>
    <b-modal ref="filter-removing" title="Удаление фильтра" @ok="removeFilter">
      <p class="my-4">Удалить фильтр? Действие необратимо.</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PurchaseFilter',
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      filters: {},
      purchaseFilter: {},
      filterName: {},
      filterSet: {},
      filterAdding: false,
      newFilterName: null,
      selectedUser: null,
      pickerFilters: [
        { type: 'processing_date', title: 'Дата обработкаи аукциона' },
        { type: 'start_application', title: 'Дата и время начала подачи заявок' },
        { type: 'end_application', title: 'Дата и время окончания подачи заявок' },
        { type: 'bidding_date', title: 'Дата и время проведения аукциона' },
      ],
      userControl: false,
      API_URL: null,
    }
  },
  computed: {
    hasApplicationsAt() {
      return this.$store.getters['purchase/getHasPurchaseApplicationsAt'] || null
    },
    filterUrl() {
      const params = new URLSearchParams()

      for (const key in this.purchaseFilter) {
        if (
          (typeof this.purchaseFilter[key] === 'object' || typeof this.purchaseFilter[key] === 'function') &&
          this.purchaseFilter[key] !== null
        ) {
          params.append(key, JSON.stringify(this.purchaseFilter[key]))
        } else if (this.purchaseFilter[key] === null) {
          //
        } else {
          params.append(key, this.purchaseFilter[key])
        }
      }
      return params
    },
    purchase() {
      return this.$store.getters['purchase/getPurchase']
    },
    purchaseFilterCopy() {
      return this.$store.getters['purchase/getPurchaseFilterPagination']
    },
    userSet() {
      return this.$store.getters['purchase/getUserSet']
    },
    userId() {
      return this.$store.getters['purchase/getCurrentUserId']
        ? this.$store.getters['purchase/getCurrentUserId']
        : this.$store.getters['purchase/getUserId']
    },
    currentUserId() {
      return this.$store.getters['purchase/getCurrentUserId']
    },
    purchaseStatus() {
      return this.$store.state.purchase.status
    },
    staticFiltersData() {
      return this.$store.getters['purchase/getFilters']
    },
    filtersName() {
      return this.$store.getters['purchase/getFilterName']
    },
    dynamicFiltersData() {
      return this.$store.getters['purchase/getPurchaseFilter']
    },
    filterSetData() {
      return this.$store.getters['purchase/getFilterSet']
    },
    addFilterPossibility() {
      return !this.$store.getters['purchase/getAddFilterPossibility']
    },
    purchaseFullFilter() {
      return this.$store.getters['purchase/getFullPurchaseFilter']
    },
    userControlCopy() {
      return this.$store.getters['purchase/getUserControl']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
  },
  watch: {
    'filterSetData.title'(newTitle) {
      if (newTitle === this.newFilterName) {
        this.filterAdding = false
        this.newFilterName = null
      }
    },
    'purchaseFilter.count_objects.min'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'count_objects',
        sub_field: 'min',
        value,
      })
    },
    'purchaseFilter.count_objects.max'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'count_objects',
        sub_field: 'max',
        value,
      })
    },
    'purchaseFilter.max_price.min'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'max_price',
        sub_field: 'min',
        value,
      })
    },
    'purchaseFilter.max_price.max'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'max_price',
        sub_field: 'max',
        value,
      })
    },
    'purchaseFilter.processing_date.to'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'processing_date',
        sub_field: 'to',
        value,
      })
    },
    'purchaseFilter.processing_date.from'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'processing_date',
        sub_field: 'from',
        value,
      })
    },
    'purchaseFilter.start_application.to'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'start_application',
        sub_field: 'to',
        value,
      })
    },
    'purchaseFilter.start_application.from'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'start_application',
        sub_field: 'from',
        value,
      })
    },
    'purchaseFilter.end_application.to'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'end_application',
        sub_field: 'to',
        value,
      })
    },
    'purchaseFilter.end_application.from'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'end_application',
        sub_field: 'from',
        value,
      })
    },
    'purchaseFilter.bidding_date.to'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'bidding_date',
        sub_field: 'to',
        value,
      })
    },
    'purchaseFilter.bidding_date.from'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'bidding_date',
        sub_field: 'from',
        value,
      })
    },
    'purchaseFilter.purchase_number'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'purchase_number',
        value,
      })
    },
    'purchaseFilter.has_applications'(value) {
      this.$store.commit('purchase/UPDATE_PURCHASE_INPUTS', {
        field: 'has_applications',
        value,
      })
    },
    purchaseFullFilter: {
      handler() {
        this.$store.dispatch('purchase/fetchPurchase')
      },
      deep: true,
    },
    staticFiltersData(newFilters) {
      this.filters = JSON.parse(JSON.stringify(newFilters))
      if (this.accessRight.role === 'purchasing_operators') {
        let purchaseStatus = JSON.parse(JSON.stringify(newFilters.purchase_status))
        purchaseStatus = purchaseStatus.filter(function (statusItem) {
          if (
            statusItem.status === 'ready' ||
            statusItem.status === 'sent' ||
            statusItem.status === 'rejected' ||
            statusItem.status === 'admitted' ||
            statusItem.status === 'sole' ||
            statusItem.status === 'won' ||
            statusItem.status === 'check_archive' ||
            statusItem.status === 'lost' ||
            statusItem.status === 'archive'
          )
            return false
          else return true
        })
        this.filters.purchase_status = purchaseStatus
      }
    },
    filtersName(newFilters) {
      this.filterName = JSON.parse(JSON.stringify(newFilters))
    },
    dynamicFiltersData(newFilters) {
      this.purchaseFilter = JSON.parse(JSON.stringify(newFilters))
    },
    filterSetData(newFilters) {
      this.filterSet = JSON.parse(JSON.stringify(newFilters))
    },
    currentUserId() {
      this.$store.dispatch('purchase/fetchCurrentUser')
    },
    purchaseStatus(newStatus) {
      switch (newStatus) {
        case 'error':
          this.showNotification('Произошла ошибка', 'Ошибка', 'danger')
          break
        case 'filter-removed':
          this.showNotification('Фильтр удалён', 'Удаление фильтра', 'info')
          break
        case 'purchase-added':
          this.showNotification('Закуака успешно добавлена', 'Добавление закупки', 'success')
          break
      }
    },
    userControlCopy(newValue) {
      this.userControl = newValue
    },
  },
  created() {
    this.API_URL = process.env.API_URL
    this.filterSet = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilterSet']))
    this.filterName = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilterName']))
    this.purchaseFilter = JSON.parse(JSON.stringify(this.$store.getters['purchase/getPurchaseFilter']))
    this.filters = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilters']))
    this.userControl = this.$store.getters['purchase/getUserControl']
  },
  methods: {
    updatePurchase() {
      if (this.purchaseStatus !== 'fetching') this.$store.dispatch('purchase/fetchPurchase')
    },
    updatePurchaseFilter(filter, field) {
      this.$store.commit('purchase/UPDATE_PURCHASE_FILTER', {
        filter_object: [{ [Object.keys(filter)[1]]: Object.values(filter)[1] }],
        filter_name_field: field,
        filter_name_title: filter,
      })
    },
    choiceFilterSet(filter) {
      this.filterAdding = false
      this.newFilterName = null
      this.$store.commit('purchase/UPDATE_FILTER_SET', filter)
    },
    addNewFilter(e) {
      e.stopPropagation()
      this.filterAdding = true
    },
    resetFilterAdding(e) {
      e.stopPropagation()
      this.filterAdding = false
      this.newFilterName = null
    },
    saveNewFilter(e) {
      e.stopPropagation()
      this.$store.dispatch('purchase/addNewFilter', this.newFilterName)
    },
    removeFilter() {
      this.$store.dispatch('purchase/removeFilter')
    },
    removeFilterModal() {
      this.$refs['filter-removing'].show()
    },
    setCurrentUser(user) {
      this.$store.commit('purchase/SET_CURRENT_USER_ID', user)
    },
    showNotification(message, title, variant) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant,
        appendToast: false,
      })
    },
    openRegionsList(e) {
      e.stopPropagation()
    },
    clearPurchaseNumber() {
      this.$store.commit('purchase/CLEAR_PURCHASE_NUMBER')
    },
    toogleUserControl() {
      this.$store.commit('purchase/USER_CONTROL_TOOGLE')
    },
  },
}
</script>
