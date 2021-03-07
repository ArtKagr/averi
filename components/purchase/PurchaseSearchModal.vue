<template>
  <b-modal
    id="purchaseSearchModal"
    size="full"
    no-close-on-backdrop
    hide-header
    hide-footer
    content-class="h-100"
    footer-class="p-1"
    body-class="p-0 h-100 overflow-hidden"
    footer-bg-variant="info"
  >
    <div class="d-flex flex-column h-100">
      <price-filter :qnt-flag="true" />
      <div class="align-self-stretch overflow-hidden w-100" :class="`h-${100 - blockHeight}`">
        <price-table source="price-manage" :qnt-flag="true" />
      </div>
      <purchase-search-filter-control />
      <div class="align-self-start w-100"></div>
      <div class="align-self-stretch overflow-hidden w-100" :class="`h-${blockHeight}`">
        <purchase-table source="purchase_modal_search" />
      </div>
    </div>
  </b-modal>
</template>

<script>
import PriceFilter from '../price/PriceFilter'
import PriceTable from '../price/PriceTable'
import PurchaseSearchFilterControl from './PurchaseSearchFilterControl'
import PurchaseTable from './PurchaseTable'
export default {
  name: 'PurchaseSearchModal',
  components: { PurchaseTable, PriceTable, PriceFilter, PurchaseSearchFilterControl },
  computed: {
    blockHeight() {
      return this.$store.getters['purchaseObject/getBlockHeightSearchPurchase']
    },
  },
}
</script>
