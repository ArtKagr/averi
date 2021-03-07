<template>
  <b-modal
    id="offersModal"
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
        <offers-control />
        <b-overlay :show="false" opacity="0.5" class="align-self-start w-100 overflow-auto" :class="`h-25`">
          <offers-modal-organizations></offers-modal-organizations>
        </b-overlay>

        <div class="d-flex align-self-end flex-column w-100 overflow-hidden" :class="`h-75`">
          <div class="align-self-start w-100">
            <offers-modal-filter></offers-modal-filter>
          </div>

          <b-overlay :show="false" opacity="0.5" class="h-100 overflow-auto">
            <offers-price-table></offers-price-table>
          </b-overlay>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import OffersControl from './offersControl'
import OffersModalFilter from './offersModalFilter'
import OffersModalOrganizations from './offersModalOrganizations'
import OffersPriceTable from './offersPriceTable'
export default {
  name: 'OffersModal',
  components: { OffersPriceTable, OffersModalOrganizations, OffersModalFilter, OffersControl },
  computed: {
    blockHeight() {
      return this.$store.getters['purchaseObject/getBlockHeight']
    },
    currentOffer() {
      return this.$store.getters['offers/getCurrentOffer']
    },
  },
  created() {
    this.$store.dispatch('offers/fetchOrganizations')
  },
  destroyed() {
    this.$store.dispatch('offers/saveCurrentOffer')
  },
}
</script>
