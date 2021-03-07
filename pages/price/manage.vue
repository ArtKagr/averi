<template>
  <div class="d-flex flex-column h-100">
    <price-filter source="price-manage" />
    <b-overlay :show="priceStatus === 'fetching'" opacity="0.5" class="flex-fill align-self-stretch overflow-hidden">
      <div class="overflow-auto h-100">
        <price-table source="price-manage" />
      </div>
    </b-overlay>
    <menu-bottom model="prices" />
    <matching-modal />
  </div>
</template>

<script>
import MatchingModal from '../../components/price/MatchingModal'
import PriceTable from '../../components/price/PriceTable'
import PriceFilter from '../../components/price/PriceFilter'
import MenuBottom from '../../components/dashboard/MenuBottom'
export default {
  name: 'PriceManage',
  components: { MenuBottom, PriceFilter, PriceTable, MatchingModal },
  computed: {
    priceStatus() {
      return this.$store.state.price.status
    },
    currentPriceFilter() {
      return this.$store.state.price.priceFilter
    },
  },
  watch: {
    priceStatus(newStatus) {
      switch (newStatus) {
        // case 'matching-success':
        //   this.addSuccessNotification('Сопоставление', 'Данные успешно сопоставлены', 'success')
        //   break
        case 'matching-error':
          this.addSuccessNotification('Сопоставление', 'Ошибка сопоставления данных', 'warning')
          break
      }
    },
    currentPriceFilter: {},
  },
  methods: {
    addSuccessNotification(title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant,
        appendToast: false,
      })
    },
  },
}
</script>
