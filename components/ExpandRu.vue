<template>
  <div class="d-flex flex-column w-100 h-90">
    <div class="d-flex flex-column">
      <matching-filter class="w-100 mb-4" :expanded-ru="priceObject" source="expanded-ru"></matching-filter>
      <div class="d-flex pb-2 px-3 flex-wrap">
        <span v-if="selectedManufacturers.length" class="pr-2 font-weight-bold">Выбранные производители:</span>
        <div v-for="(manufacturer, key) in selectedManufacturers" :key="key" class="d-flex flex-wrap">
          <span class="pr-2">{{ manufacturer }}<span v-if="key !== selectedManufacturers.length - 1">,</span></span>
        </div>
      </div>
    </div>
    <div class="w-100 h-100">
      <b-overlay opacity="0.5" class="h-100 overflow-auto">
        <price-table :expanded-ru="priceObject" source="expanded-ru" />
      </b-overlay>
    </div>
    <menu-bottom model="expanded-prices" />
  </div>
</template>
<script>
import PriceTable from './price/PriceTable'
import MatchingFilter from './price/MatchingFilter'
import MenuBottom from './dashboard/MenuBottom'
export default {
  name: 'ExpandRu',
  components: { MenuBottom, MatchingFilter, PriceTable },
  props: {
    priceObject: {
      type: Object,
      default: null,
    },
  },
  computed: {
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    selectedManufacturers() {
      return this.$store.getters['price/getManufacturerNames'] || []
    },
  },
  destroyed() {
    this.$store.commit('price/CLEAR_EXPANDED_FILE')
    this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
  },
}
</script>
