<template>
  <div class="d-flex p-4 flex-column">
    <div class="d-flex justify-content-end align-items-center mb-4 w-100">
      <b-icon-folder-check class="m-0 h4 pointer" @click="savePurchase"></b-icon-folder-check>
    </div>
    <div class="d-flex justify-content-between align-items-center w-100">
      <div class="mr-3">
        <purchase-delivery-drop-down :source="'purchase-multiply-delivery'"></purchase-delivery-drop-down>
      </div>
      <div class="d-flex flex-column w-85">
        <div v-for="(place, key) in deliveryPlaces" :key="key" class="d-flex w-100 align-items-center">
          <div
            class="d-flex align-items-center justify-content-between purchase_comment_class pb-2 mt-2 align-items-center w-100"
          >
            <div class="d-flex align-items-center w-90">
              <div v-if="place.cdek" class="font-weight-bold mr-3">СДЭК</div>
              <div :id="`delivery_place_${key}`" class="h5 hide-text mr-3 w-90">
                {{ place.name }}
              </div>
              <b-tooltip :target="`delivery_place_${key}`" placement="top">
                {{ place.name }}
              </b-tooltip>
            </div>
            <div class="d-flex">
              <b-icon-trash class="m-0 h5 pointer" @click="removeDeliveryPlace(place.id)"></b-icon-trash>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseDeliveryDropDown from './PurchaseDeliveryDropDown'
export default {
  name: 'PurchaseMultiplyDelivery',
  components: { PurchaseDeliveryDropDown },
  computed: {
    multiplyDelivery() {
      return this.$store.getters['purchaseObject/getMultiplyDelivery']
    },
    deliveryPlaces() {
      return this.$store.getters['purchaseObject/getDeliveryObjects']
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    kladrIds() {
      return this.$store.getters['purchaseObject/getKladrIds']
    },
  },
  methods: {
    removeDeliveryPlace(placeId) {
      this.$store.commit('purchaseObject/REMOVE_CURRENT_DELIVERY_PLACE', placeId)
    },
    savePurchase() {
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
    },
  },
}
</script>
