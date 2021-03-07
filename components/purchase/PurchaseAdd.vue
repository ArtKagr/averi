<template>
  <div class="p-3">
    <div class="d-flex text-center mb-3">
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
    <b-input-group class="d-flex align-items-center mb-3 filter">
      <b-form-input v-model="purchase_number_manual" max="20" placeholder="№ закупки"></b-form-input>
    </b-input-group>
    <b-input-group class="d-flex align-items-center mb-3 filter">
      <b-form-input v-model="max_price" placeholder="НМЦК"></b-form-input>
    </b-input-group>
    <template v-if="source === 'purchase_modal'">
      <b-input-group class="d-flex align-items-center mb-3 filter">
        <b-form-input v-model="contract_guarantee_amount" placeholder="Обеспечение контракта"></b-form-input>
      </b-input-group>
      <b-input-group class="d-flex align-items-center mb-3 filter">
        <b-form-input v-model="application_guarantee_amount" placeholder="Обеспечение заявки"></b-form-input>
      </b-input-group>
    </template>
    <datepicker
      v-if="source === 'purchase_manage'"
      v-model="end_date"
      placeholder="Окончание подачи заявки"
      type="datetime"
      value-type="format"
      class="w-100 mb-4"
    ></datepicker>
    <div
      class="d-flex w-100 px-2"
      :class="source === 'purchase_manage' ? 'justify-content-between' : 'justify-content-end'"
    >
      <template v-if="source === 'purchase_manage'">
        <b-icon-file-earmark-plus
          v-if="allDataFilled"
          variant="info"
          class="h4 pointer m-0"
          @click="addPurchase"
        ></b-icon-file-earmark-plus>
        <b-icon-file-earmark-plus v-else variant="secondary" class="h4 pointer m-0"></b-icon-file-earmark-plus>
        <b-icon-trash v-if="someDataFilled" variant="info" class="h4 pointer m-0" @click="clearData"></b-icon-trash>
        <b-icon-trash v-else variant="secondary" class="h4 pointer m-0"></b-icon-trash>
      </template>
      <!--      <template v-else>-->
      <!--        <b-icon-pencil class="h5 pointer"></b-icon-pencil>-->
      <!--      </template>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseAdd',
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentRegion: { region_name: 'Калининградская обл', surcharge_id: 792 },
      purchase_number_manual: null,
      max_price: null,
      contract_guarantee_amount: null,
      application_guarantee_amount: null,
      end_date: null,
      filters: {},
      filterName: {},
      currentPurchase: {},
    }
  },
  computed: {
    currentPurchaseCopy() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    regions() {
      return this.$store.getters['surcharge/getRegions']
    },
    allDataFilled() {
      return this.currentRegion.surcharge_id && this.purchase_number_manual && this.max_price && this.end_date
    },
    someDataFilled() {
      return this.currentRegion.surcharge_id || this.purchase_number_manual || this.max_price || this.end_date
    },
  },
  watch: {
    currentPurchaseCopy(newValue) {
      this.currentPurchase = newValue
    },
    currentPurchase(newValue) {
      if (this.source !== 'purchase_manage') {
        this.purchase_number_manual = newValue.purchase_number_manual
        this.max_price = newValue.max_price
        this.contract_guarantee_amount = newValue.contract_guarantee_amount
        this.application_guarantee_amount = newValue.application_guarantee_amount
      }
    },
  },
  created() {
    this.filterName = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilterName']))
    this.filters = JSON.parse(JSON.stringify(this.$store.getters['purchase/getFilters']))
    this.currentPurchase = this.$store.getters['purchaseObject/getCurrentPurchase']
  },
  methods: {
    addRegion(region) {
      this.currentRegion.region_name = region.region_name
      this.currentRegion.surcharge_id = region.id
    },
    clearData() {
      this.currentRegion.region_name = 'Выберите регион'
      this.currentRegion.surcharge_id = null
      this.purchase_number_manual = null
      this.max_price = null
      this.end_date = null
    },
    addPurchase() {
      this.$store.dispatch('purchase/addPurchase', {
        purchase_number_manual: this.purchase_number_manual,
        surcharge_id: this.currentRegion.surcharge_id,
        max_price: Number(this.max_price),
        end_date: this.end_date,
      })
    },
  },
}
</script>
