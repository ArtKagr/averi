<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 4vh;'">
    <div class="mr-4">
      <b-icon-chevron-up class="pointer h4 m-0" @click="heightControl('up')"> </b-icon-chevron-up>
      <b-icon-chevron-down class="pointer h4 m-0" @click="heightControl('down')"> </b-icon-chevron-down>
    </div>
    <div class="d-flex w-80">
      <b-input-group class="filter -large mr-4">
        <b-form-input :placeholder="customerName || 'Наименование'" @change="changeCustomerName"></b-form-input>
        <b-input-group-append>
          <b-button size="sm">X</b-button>
        </b-input-group-append>
      </b-input-group>
      <b-input-group class="filter -large mr-4">
        <b-form-input :placeholder="customerEmail || 'E-mail'" @change="changeCustomerEmail"></b-form-input>
        <b-input-group-append>
          <b-button size="sm">X</b-button>
        </b-input-group-append>
      </b-input-group>
      <b-input-group class="filter -large">
        <b-form-input :placeholder="customerComment || 'Комментарий'" @change="changeCustomerComment"></b-form-input>
        <b-input-group-append>
          <b-button size="sm">X</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div class="mr-4">
      <b-dd
        id="dropdown-purchase_status"
        :lazy="true"
        toggle-class="p-0 text-center mb-0 mr-4 custom_button"
        variant="link"
        boundary="viewport"
      >
        <template v-slot:button-content>
          {{ currentRegion.region_name }}
        </template>
        <template v-for="(region, key) in regions">
          <b-dd-item-btn
            :key="key"
            button-class="d-flex flex-row custom_dropdown_item"
            :active="currentRegion.surcharge_id === region.id"
            @click="addRegion(region)"
          >
            <div class="flex-fill text-left mr-2">
              {{ region.region_name }}
            </div>
          </b-dd-item-btn>
        </template>
      </b-dd>
    </div>
    <div class="d-flex align-items-center">
      <b-icon-pencil
        v-b-toggle.sidebar-control-offers
        class="m-0 h5 custom_button mr-4"
        @click="setOfferPrices"
      ></b-icon-pencil>
      <b-sidebar
        id="sidebar-control-offers"
        bg-variant="gray-200"
        backdrop-variant="secondary"
        width="100%"
        backdrop
        right
        shadow=""
        lazy
        @hidden="updateCurrentOffer"
      >
        <div class="d-flex flex-column h-100">
          <price-filter source="price-manage" :offers="true" />
          <b-overlay :show="false" opacity="0.5" class="flex-fill align-self-stretch overflow-hidden">
            <div class="overflow-auto h-100">
              <price-table source="price-manage" :offers="true" />
            </div>
          </b-overlay>
          <menu-bottom model="prices" />
          <matching-modal />
        </div>
      </b-sidebar>
      <b-icon-file-earmark-zip
        class="h4 m-0 pointer"
        @click="$root.$emit('downloadFile', `${API_URL}api/offer/export/${currentOffer.id}`)"
      ></b-icon-file-earmark-zip>
    </div>
  </div>
</template>

<script>
import PriceTable from '../price/PriceTable'
import PriceFilter from '../price/PriceFilter'
import MenuBottom from '../dashboard/MenuBottom'
import MatchingModal from '../price/MatchingModal'
export default {
  name: 'OffersModalFilter',
  components: { MatchingModal, MenuBottom, PriceFilter, PriceTable },
  data() {
    return {
      currentRegion: { region_name: 'Калининградская обл', surcharge_id: 792 },
      customer: '',
      email: '',
      comment: '',
      API_URL: null,
    }
  },
  computed: {
    regions() {
      return this.$store.getters['surcharge/getRegions']
    },
    currentOffer() {
      return this.$store.getters['offers/getCurrentOffer']
    },
    customerName() {
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getCustomerName']))
    },
    customerEmail() {
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getCustomerEmail']))
    },
    customerComment() {
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getCustomerComment']))
    },
    surchargeId() {
      return this.$store.getters['offers/getSurchargeId']
    },
  },
  watch: {
    surchargeId(newValue) {
      this.currentRegion.region_name = this.regions.find((region) => region.id === newValue).region_name
      this.currentRegion.surcharge_id = newValue
    },
  },
  destroyed() {
    this.$store.dispatch('offers/fetchOffers')
    this.$store.commit('offers/SAVE_SURCHARGE_ID', 792)
  },
  mounted() {
    this.API_URL = process.env.API_URL
  },
  methods: {
    heightControl(flag) {
      this.$store.commit('price/UPDATE_MODAL_BLOCK_HEIGHT', flag)
    },
    setOfferPrices() {
      this.$store.dispatch('offers/setOfferPrices')
    },
    updateCurrentOffer() {
      this.$store.dispatch('offers/fetchCurrentOffer', this.currentOffer.id)
    },
    changeCustomerName(customerName) {
      this.$store.commit('offers/CHANGE_CUSTOMER_NAME', customerName)
    },
    changeCustomerEmail(customerEmail) {
      this.$store.commit('offers/CHANGE_CUSTOMER_EMAIL', customerEmail)
    },
    changeCustomerComment(customerComment) {
      this.$store.commit('offers/CHANGE_CUSTOMER_COMMENT', customerComment)
    },
    addRegion(region) {
      this.currentRegion.region_name = region.region_name
      this.currentRegion.surcharge_id = region.id
      this.$store.commit('offers/SAVE_SURCHARGE_ID', region.id)
      this.$store.dispatch('offers/saveOffer')
    },
  },
}
</script>
