<template>
  <div class="d-flex flex-column h-100">
    <purchase-filter source="filter" />
    <b-sidebar id="sidebar-backdrop" bg-variant="gray-200" backdrop-variant="secondary" backdrop right shadow>
      <purchase-filter source="sidebar" />
    </b-sidebar>
    <b-sidebar id="add-purchase" bg-variant="gray-200" backdrop-variant="secondary" backdrop right shadow>
      <purchase-add source="purchase_manage" />
    </b-sidebar>
    <b-overlay
      :show="purchaseStatus === 'fetching' || priceObjectStatus === 'fetching'"
      opacity="0.5"
      class="flex-fill align-self-stretch overflow-hidden"
    >
      <div class="overflow-auto h-100">
        <purchase-table source="purchase_manage" />
      </div>
    </b-overlay>
    <menu-bottom model="purchases" />
    <purchase-modal />
    <matching-modal />
    <purchase-search-modal />
  </div>
</template>

<script>
import PurchaseFilter from '../../components/purchase/PurchaseFilter'
import PurchaseTable from '../../components/purchase/PurchaseTable'
import PurchaseModal from '../../components/purchase/PurchaseModal'
import PurchaseSearchModal from '../../components/purchase/PurchaseSearchModal'
import MatchingModal from '../../components/price/MatchingModal'
import MenuBottom from '../../components/dashboard/MenuBottom'
import PurchaseAdd from '../../components/purchase/PurchaseAdd'
export default {
  name: 'PurchaseManage',
  components: {
    PurchaseAdd,
    MenuBottom,
    MatchingModal,
    PurchaseSearchModal,
    PurchaseModal,
    PurchaseTable,
    PurchaseFilter,
  },
  computed: {
    purchaseStatus() {
      return this.$store.state.purchase.status
    },
    currentPriceFilter() {
      return this.$store.state.purchase.purchaseFilter
    },
    priceObjectStatus() {
      return this.$store.state.priceObject.status
    },
  },
}
</script>
