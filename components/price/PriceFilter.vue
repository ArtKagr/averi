<template>
  <div class="w-100 d-flex align-items-center py-2 px-3 bg-gray-200 justify-content-between">
    <div class="d-flex justify-content-between">
      <div class="d-flex mr-4 align-items-center">
        <b-icon-arrow-clockwise
          class="text-align-center h4 mb-0 mr-4 pointer"
          :class="priceStatus === 'fetching' ? '-loader' : ''"
          @click="updatePrice"
        ></b-icon-arrow-clockwise>
        <div
          v-if="
            source === 'price-manage' &&
            (accessRight.role === 'administrators' || accessRight.role === 'general_operators' || false) &&
            !offers
          "
          class="mr-4"
        >
          <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none p-0" no-caret>
            <template v-slot:button-content>
              <b-icon-file-earmark-plus class="h4 mb-0" variant="dark"></b-icon-file-earmark-plus>
            </template>
            <upload-files source="price" />
          </b-dropdown>
        </div>
        <template v-if="!offers">
          <b-icon-bezier
            v-if="!accessRight.match && notMatch"
            class="text-align-center h4 mb-0 mr-4 pointer"
            variant="danger"
            @click="
              showNotification(
                'Ошибка сопоставления',
                'У двух и более выбранных сопоставленных позиций прайса разные реквизиты',
                'danger'
              )
            "
          />
          <b-icon-bezier
            v-else
            :variant="selectedRows.length ? 'info' : 'dark'"
            :class="['mr-4', selectedRows.length ? 'pointer' : '']"
            class="text-align-center h4 mb-0"
            @click="openMultipleMathing"
          />
        </template>
        <div v-if="offers" class="d-flex align-items-center">
          <b-icon-star-fill class="h4 m-0 mr-2" variant="success" @click="openFavoritePrices"></b-icon-star-fill>
          <span>{{ selectedOfferPrices.length }}</span>
        </div>
      </div>
      <div v-if="qntFlag" class="d-flex align-items-center">
        <b-input-group class="filter">
          <b-form-input v-model="calc.dividend" type="number" placeholder="Делимое"></b-form-input>
          <b-form-input v-model="calc.divisor" type="number" placeholder="Делитель"></b-form-input>
          <b-form-input
            v-model="calcResult"
            type="number"
            placeholder="Частное"
            class="bg-disabled-white"
            disabled
          ></b-form-input>
        </b-input-group>
      </div>
    </div>
    <div class="d-flex">
      <div class="d-flex align-items-center" :class="offers ? 'mr-4' : 'mr-2'">
        <b-icon-eye
          v-if="filter.is_active === 'all'"
          class="h4 m-0 mr-2 pointer"
          @click="filteringPriceByVisible('hide')"
        ></b-icon-eye>
        <b-icon-eye-slash v-else class="h4 m-0 mr-2 pointer" @click="filteringPriceByVisible('all')"></b-icon-eye-slash>
      </div>
      <div v-if="accessRight.match && !offers" class="d-flex align-items-center mr-4">
        <b-icon-bookmark v-if="!selectedRows.length" class="text-align-center h4 mb-0 mr-4"></b-icon-bookmark>
        <b-icon-bookmark-plus
          v-else-if="hideShowPrices"
          :class="['mr-4', selectedRows.length ? 'pointer' : '']"
          class="text-align-center h4 mb-0"
          variant="info"
          @click="showPrices"
        ></b-icon-bookmark-plus>
        <b-icon-bookmark-dash
          v-else
          :class="['mr-4', selectedRows.length ? 'pointer' : '']"
          class="text-align-center h4 mb-0"
          variant="warning"
          @click="hidePrices"
        ></b-icon-bookmark-dash>
      </div>
      <div class="d-flex text-center">
        <b-dd
          id="dropdown-status"
          :lazy="true"
          toggle-class="p-0 text-center mb-0 mr-4 custom_button"
          variant="link"
          boundary="viewport"
        >
          <template v-slot:button-content>
            {{ statusName }}
          </template>
          <template v-for="(status, key) in statusesList">
            <b-dd-item-btn
              :key="key"
              :active="statusName === status.title"
              button-class="d-flex flex-row custom_dropdown_item"
              @click="filteringPriceByStatus(status.id)"
            >
              <div class="flex-fill text-left mr-2">
                <span :class="status.padding ? status.padding : ''">{{ status.title }}</span>
              </div>
              <div v-if="status.variant" :class="'text-' + status.variant" class="pl-2 px-2 border-left">
                <b-icon-check-square :varint="status.variant"></b-icon-check-square>
              </div>
            </b-dd-item-btn>
          </template>
        </b-dd>
      </div>
      <div class="d-flex text-center">
        <b-dd
          id="dropdown-seller"
          :lazy="true"
          toggle-class="p-0 text-center mb-0 mr-4 custom_button"
          variant="link"
          boundary="viewport"
        >
          <template v-slot:button-content>
            {{ sellerName }}
          </template>
          <template v-for="filter in sellerFiltersList">
            <b-dd-item-btn
              :key="filter.filter_name"
              :disabled="
                (filter.filter_name === 'Региональные поставщики' ||
                  filter.filter_name === 'Основные + региональные поставщики') &&
                !regionalSellers.length
              "
              button-class="d-flex flex-row custom_dropdown_item"
              @click="filteringPriceBySeller(filter.id === null ? filter.id : filter.slug)"
            >
              <div class="d-flex flex-fill text-left" :class="filter.slug === 'regional' ? 'mb-3' : ''">
                <div class="mr-2">
                  <b-icon-toggle-on v-if="filter.filter_name === sellerName" class="m-0 h4 mr-4"></b-icon-toggle-on>
                  <b-icon-toggle-off v-else class="m-0 h4 mr-4"></b-icon-toggle-off>
                </div>
                <span>{{ filter.filter_name }}</span>
              </div>
            </b-dd-item-btn>
          </template>
          <template v-for="(seller, key) in sellersList">
            <b-dd-item-btn
              :key="key"
              button-class="d-flex flex-row custom_dropdown_item"
              @click="filteringPriceBySeller(seller.id)"
            >
              <div class="d-flex flex-fill text-left">
                <div class="mr-2">
                  <b-icon-square
                    v-if="!seller.filter && sellerName !== seller.seller_name"
                    class="m-0 h4 mr-4"
                  ></b-icon-square>
                  <b-icon-check-square
                    v-else-if="!seller.filter && sellerName === seller.seller_name"
                    class="m-0 h4 mr-4"
                  ></b-icon-check-square>
                </div>
                <span>{{ seller.seller_name }}</span>
              </div>
            </b-dd-item-btn>
          </template>
        </b-dd>
      </div>
      <div class="filter mr-4" :style="qntFlag ? 'width: 500px;' : 'width: 200px;'">
        <b-input-group>
          <b-form-input v-model="mnn" placeholder="МНН или наименование" @keyup.enter="fetchMnnList"></b-form-input>
          <b-input-group-append>
            <b-button size="sm" :variant="mnn ? 'info' : 'secondary'" @click="clearFilter('mnn')">X</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <div class="filter" :style="qntFlag ? 'width: 500px;' : 'width: 200px;'">
        <b-input-group>
          <b-form-input v-model="search" placeholder="Поиск" @keyup.enter="fetchAnotherQuery"></b-form-input>
          <b-input-group-append>
            <b-button size="sm" :variant="search ? 'info' : 'secondary'" @click="clearFilter('search')">X</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <div v-if="source !== 'price-manage'" class="d-flex align-items-center ml-4">
        <b-icon-folder-check
          v-if="selectedPriceIds.length"
          variant="success"
          class="h5 m-0 mr-4 pointer"
          @click="addPriceObjects"
        >
        </b-icon-folder-check>
        <b-icon-folder-check v-else variant="secondary" class="h5 m-0 mr-4"> </b-icon-folder-check>
        <b-icon-x class="h5 m-0 pointer" @click="closePurchaseModal"> </b-icon-x>
      </div>
      <div v-if="offers" class="d-flex align-items-center ml-4">
        <b-icon-folder-check class="h4 m-0 pointer" variant="success" @click="saveCurrentOffer"></b-icon-folder-check>
      </div>
    </div>
    <b-modal ref="hide-prices-modal" title="Скрытие позиции прайса" @ok="hidePricesAccept">
      <p class="my-4">Вы уверены, что хотите скрыть {{ selectedRows.length > 1 ? 'позиции' : 'позицию' }} прайса?</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PriceFilter',
  props: {
    source: {
      type: String,
      default: null,
    },
    qntFlag: {
      type: Boolean,
      default: false,
    },
    offers: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      calc: {
        dividend: null,
        divisor: null,
      },
      list: null,
      provider: null,
      regionsName: 'Все регионы',
      mnn: null,
      search: null,
    }
  },
  computed: {
    selectedOfferPrices() {
      return this.$store.getters['price/getSelectedOfferPrices'] || []
    },
    mnnCopy() {
      return this.$store.getters['dictionaries/getMnnPriceFilter']
    },
    searchCopy() {
      return this.$store.getters['dictionaries/getSearchPriceFilter']
    },
    selectedRows() {
      return JSON.parse(JSON.stringify(this.$store.getters['price/getSelectedRows']))
    },
    notMatch() {
      const result = this.selectedRows
        .filter(function (price) {
          return !(typeof price.klp && price.klp.length === 0)
        })
        .reduce(function (preVal, price) {
          if (!preVal.includes(price.klp.uuid)) preVal.push(price.klp.uuid)
          return preVal
        }, [])
      return result.length > 1
    },
    priceStatus() {
      return this.$store.getters['price/getPriceStatus']
    },
    priceObjectStatus() {
      return this.$store.getters['priceObject/getPriceObjectStatus']
    },
    filter() {
      return JSON.parse(JSON.stringify(this.$store.getters['price/getPriceFilter']))
    },
    sellersList() {
      return this.$store.state.dictionaries.sellers
    },
    sellerFiltersList() {
      if (!this.qntFlag) {
        return [
          { id: null, filter_name: 'Все поставщики' },
          { slug: 'main', filter_name: 'Основные поставщики' },
        ]
      } else
        return [
          { id: null, filter_name: 'Все поставщики' },
          { slug: 'main_regional', filter_name: 'Основные + региональные поставщики' },
          { slug: 'main', filter_name: 'Основные поставщики' },
          { slug: 'regional', filter_name: 'Региональные поставщики' },
        ]
    },
    sellerName() {
      return this.$store.getters['dictionaries/getSellerName']
    },
    statusesList() {
      return this.$store.state.dictionaries.statusesList
    },
    statusName() {
      return this.$store.getters['dictionaries/getStatusName']
    },
    surcharge() {
      return JSON.parse(JSON.stringify(this.$store.getters['surcharge/filteredRegions']))
    },
    calcResult() {
      if (this.calc.dividend && this.calc.divisor) return parseInt((this.calc.dividend / this.calc.divisor) * 100) / 100
      else return null
    },
    selectedPriceIds() {
      return this.$store.getters['priceObject/getPriceIds']
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    hideShowPrices() {
      return this.selectedRows.every((price) => price.price_status === 'secondary')
    },
    mainSellers() {
      return this.$store.getters['dictionaries/getMainSellers']
    },
    regionalSellers() {
      return this.$store.getters['dictionaries/getRegionalSellers']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
  },
  watch: {
    priceObjectStatus(newValue) {
      if (newValue === 'price_objects-is-added') {
        this.$bvModal.hide('purchaseSearchModal')
        this.$store.commit('price/CLEAR_SELECTED_ROWS')
        this.$store.commit('price/CLEAR_PRICE_FILTER')
        this.$store.commit('dictionaries/CLEAR_FILTER_NAMES')
        this.$store.dispatch('priceObject/fetchPriceObjects', this.currentPurchase.uuid)
      }
    },
    mnnCopy(newValue) {
      this.mnn = newValue
    },
    searchCopy(newValue) {
      this.search = newValue
    },
    // mnn(newMnn) {
    //   this.$store.commit('dictionaries/UPDATE_MNN_FILTER_NAME', newMnn)
    //   this.$store.commit('price/UPDATE_PRICE_FILTER', {
    //     field_name: 'mnn',
    //     new_value: newMnn,
    //   })
    // },
    filter() {
      this.$store.dispatch('price/fetchPrice')
    },
  },
  created() {
    if (
      this.$store.getters['priceObject/getSelectedPurchaseObject'][0] &&
      this.$store.getters['priceObject/getSelectedPurchaseObject'][0].mnn
    ) {
      this.mnn = JSON.parse(JSON.stringify(this.$store.getters['priceObject/getSelectedPurchaseObject']))[0].mnn
    } else this.mnn = this.$store.getters['dictionaries/getMnnPriceFilter']
    if (
      this.$store.getters['priceObject/getSelectedPurchaseObject'][0] &&
      this.$store.getters['priceObject/getSelectedPurchaseObject'][0].drug_quantity
    ) {
      this.calc.dividend = JSON.parse(
        JSON.stringify(this.$store.getters['priceObject/getSelectedPurchaseObject'])
      )[0].drug_quantity
    }
    if (this.qntFlag) this.fetchMnnList()
  },
  methods: {
    showNotification(title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant,
        appendToast: false,
      })
    },
    saveCurrentOffer() {
      this.$store.dispatch('offers/saveCurrentOffer')
    },
    clearFilter(field) {
      if (field === 'mnn') this.$store.commit('dictionaries/UPDATE_MNN_FILTER_NAME', null)
      else if (field === 'search') this.$store.commit('dictionaries/UPDATE_SEARCH_FILTER_NAME', null)
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: field,
        new_value: null,
      })
    },
    updatePrice() {
      this.$store.commit('price/CLEAR_SELECTED_ROWS')
      if (this.priceStatus !== 'fetching') this.$store.dispatch('price/fetchPrice')
    },
    filteringPriceByStatus(statusId) {
      this.$store.commit('dictionaries/UPDATE_STATUS_NAME', statusId)
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'assign_status',
        new_value: statusId,
      })
    },
    filteringPriceBySeller(sellerId) {
      this.$store.commit('dictionaries/UPDATE_SELLER_NAME', sellerId)
      if (sellerId === 'main') {
        this.$store.commit('price/UPDATE_PRICE_FILTER', {
          field_name: 'seller_ids',
          new_value: this.mainSellers,
        })
      } else if (sellerId === 'regional') {
        this.$store.commit('price/UPDATE_PRICE_FILTER', {
          field_name: 'seller_ids',
          new_value: this.regionalSellers,
        })
      } else if (sellerId === 'main_regional') {
        const mainRegionalSellers = []
        this.mainSellers.map((seller) => mainRegionalSellers.push(seller))
        this.regionalSellers.map((seller) => mainRegionalSellers.push(seller))
        this.$store.commit('price/UPDATE_PRICE_FILTER', {
          field_name: 'seller_ids',
          new_value: mainRegionalSellers,
        })
      } else {
        this.$store.commit('price/UPDATE_PRICE_FILTER', {
          field_name: 'seller_id',
          new_value: sellerId,
        })
      }
    },
    filteringPriceByVisible(visibleFlag) {
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'is_active',
        new_value: visibleFlag,
      })
    },
    openMultipleMathing() {
      if (this.selectedRows.length) {
        this.$store.commit('priceObject/UPDATE_MATCHING_MODAL_SOURCE', 'price_table')
        this.$bvModal.show('esklpPriceMatchingModal')
        if (this.selectedRows.some((price) => price.esklp_klp_uuid)) {
          this.$store.dispatch(
            'price/fetchCurrentKlp',
            this.selectedRows.find((price) => price.esklp_klp_uuid).esklp_klp_uuid
          )
        }
        this.$store.dispatch('price/getMatchedPrices')
      }
    },
    openFavoritePrices() {
      this.$store.commit('price/TOGGLE_FAVORITE_PRICES')
    },
    setRegion(region) {
      this.regionsName = region.region_name
    },
    closePurchaseModal() {
      this.$store.commit('price/CLEAR_SELECTED_ROWS')
      this.$store.commit('price/CLEAR_PRICE_FILTER')
      this.$store.commit('dictionaries/CLEAR_FILTER_NAMES')
      this.$bvModal.hide('purchaseSearchModal')
    },
    addPriceObjects() {
      this.$store.commit('priceObject/UPDATE_MATCHING_BUTTON', 'price_filter')
      this.$store.dispatch('priceObject/addPriceObjects')
    },
    hidePrices() {
      this.$refs['hide-prices-modal'].show()
    },
    hidePricesAccept() {
      this.$store.dispatch('price/tooglePrice', false)
      this.$store.commit('price/CLEAR_GLOBAL_SWITCHERS')
    },
    showPrices() {
      this.$store.dispatch('price/tooglePrice', true)
      this.$store.commit('price/CLEAR_GLOBAL_SWITCHERS')
    },
    filterSwitcher(seller) {
      if (!seller.filter) return false
    },
    fetchMnnList() {
      this.$store.commit('dictionaries/UPDATE_MNN_FILTER_NAME', this.mnn)
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'mnn',
        new_value: this.mnn,
      })
    },
    fetchAnotherQuery() {
      this.$store.commit('dictionaries/UPDATE_SEARCH_FILTER_NAME', this.search)
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'search',
        new_value: this.search,
      })
    },
  },
}
</script>
+
