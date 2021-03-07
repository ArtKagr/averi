<template>
  <b-modal
    id="purchaseModal"
    size="full"
    no-close-on-backdrop
    hide-header
    hide-footer
    body-class="p-0 h-100 overflow-hidden"
    content-class="h-100"
    footer-bg-variant="info"
  >
    <template v-slot:default>
      <div class="d-flex flex-column h-100 w-100">
        <purchase-control source="purchase_modal" />
        <div class="d-flex align-self-end flex-column w-100 overflow-hidden" :class="`h-100`">
          <b-overlay :show="purchaseObjectStatus === 'fetching'" opacity="0.5" class="h-100 overflow-auto">
            <purchase-table source="purchase_main" />
          </b-overlay>
        </div>
        <purchase-filter-control />
        <purchase-search-filter />
      </div>
    </template>
  </b-modal>
</template>

<script>
import PurchaseControl from './PurchaseControl'
import PurchaseTable from './PurchaseTable'
import PurchaseSearchFilter from './PurchaseSearchFilter'
import PurchaseFilterControl from './PurchaseFilterControl'
export default {
  name: 'PurchaseModal',
  components: { PurchaseFilterControl, PurchaseSearchFilter, PurchaseTable, PurchaseControl },
  computed: {
    purchaseObjectStatus() {
      return this.$store.getters['purchaseObject/getPurchaseObjectStatus']
    },
    blockHeight() {
      return this.$store.getters['purchaseObject/getBlockHeight']
    },
  },
}
</script>
