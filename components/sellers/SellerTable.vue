<template>
  <div>
    <b-table :fields="fields" :items="sellers" striped sticky-header="100%" class="w-100 m-0">
      <template v-slot:cell(npp)="row"> {{ row.index + 1 }}</template>
      <template v-slot:cell(is_main)="row">
        <template v-if="accessRight && accessRight.role === 'administrators'">
          <b-icon-check-square
            v-if="row.item.is_main"
            class="m-0 h4"
            @click="setMainSeller(row.item, false)"
          ></b-icon-check-square>
          <b-icon-square v-else class="m-0 h4" @click="setMainSeller(row.item, true)"></b-icon-square>
        </template>
        <template v-else>
          <b-icon-check-square v-if="row.item.is_main" class="m-0 h4"></b-icon-check-square>
          <b-icon-square v-else class="m-0 h4"></b-icon-square>
        </template>
      </template>
      <template v-slot:cell(kladr_id)="row">
        <div class="d-flex justify-content-between w-30">
          <span class="mr-2">{{
            `${row.item.kladr.socr ? row.item.kladr.socr : ''} ${row.item.kladr.name ? row.item.kladr.name : ''}, ${
              row.item.kladr.region.name ? row.item.kladr.region.name : ''
            } ${row.item.kladr.region.socr ? row.item.kladr.region.socr : ''}`
          }}</span>
          <purchase-delivery-drop-down
            v-if="accessRight && accessRight.role === 'administrators'"
            source="sellers-table"
            @selected-kladr="changeCurrentKladr($event, row.item)"
          ></purchase-delivery-drop-down>
        </div>
      </template>
      <template v-slot:cell(seller_code)="row">
        <b-input
          v-if="accessRight && accessRight.role === 'administrators'"
          v-model.number="row.item.seller_outside_id"
          class="custom_input"
          type="number"
          placeholder="0"
          @change="changeSellerCode(row.item)"
        />
        <span v-else>{{ row.item.seller_outside_id }}</span>
      </template>
      <template v-slot:cell(add_price)="row">
        <b-icon-plus-circle
          v-b-toggle="[`info_sidebar_add_price_${row.item.id}`]"
          class="m-0 h3 custom_button"
        ></b-icon-plus-circle>
        <b-sidebar
          :id="`info_sidebar_add_price_${row.item.id}`"
          bg-variant="gray-200"
          backdrop-variant="secondary"
          width="60%"
          backdrop
          right
          shadow=""
          lazy
        >
          <seller-add-price :current-seller="row.item"></seller-add-price>
        </b-sidebar>
      </template>
    </b-table>
  </div>
</template>

<script>
import PurchaseDeliveryDropDown from '../purchase/PurchaseDeliveryDropDown'
import SellerAddPrice from './SellerAddPrice'
export default {
  name: 'SellerTable',
  components: { SellerAddPrice, PurchaseDeliveryDropDown },
  data() {
    return {
      selectedKladr: {},
      selectedSeller: {},
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'seller_name',
          label: 'Наименование',
          class: 'align-middle',
        },
        {
          key: 'kladr_id',
          label: 'Месторасположение',
          class: 'align-middle',
        },
        {
          key: 'seller_code',
          label: 'Код поставщика',
          class: 'align-middle',
        },
        {
          key: 'is_main',
          label: 'Основной',
          class: 'align-middle',
        },
        {
          key: 'add_price',
          label: 'Добавить прайс',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    sellers() {
      return this.$store.getters['dictionaries/getSellers']
    },
    sellersKladr() {
      return this.$store.getters['purchaseObject/getKladrObjectsSellers']
    },
  },
  watch: {
    sellers(newValue) {
      if (newValue.length) {
        const sellerIds = newValue.map((seller) => seller.kladr_id)
        this.$store.dispatch('purchaseObject/fetchKladrObjectsSellers', sellerIds)
      }
    },
  },
  methods: {
    currentKladrRegion(kladrId) {
      const currentLocality = this.sellersKladr.find((kladr) => kladr.id === kladrId)
      return `${currentLocality.socr ? currentLocality.socr : ''} ${
        currentLocality.name ? currentLocality.name : ''
      }, ${currentLocality.region.name ? currentLocality.region.name : ''} ${
        currentLocality.region.socr ? currentLocality.region.socr : ''
      }`
    },
    changeCurrentKladr(selectedKladr, selectedSeller) {
      this.$store.dispatch('dictionaries/updateCurrentSeller', { id: selectedSeller.id, kladr_id: selectedKladr.id })
    },
    setMainSeller(selectedSeller, flag) {
      this.$store.dispatch('dictionaries/updateCurrentSeller', { id: selectedSeller.id, is_main: flag })
    },
    changeSellerCode(seller) {
      this.$store.dispatch('dictionaries/updateCurrentSeller', {
        id: seller.id,
        seller_outside_id: seller.seller_outside_id,
      })
    },
  },
}
</script>
