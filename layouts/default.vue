<template>
  <div class="d-flex flex-column vh-100 vw-100 overflow-hidden">
    <ws-pusher></ws-pusher>
    <Header class="w-100 align-self-start" />
    <Nuxt class="align-self-stretch w-100 h-100 overflow-hidden" />
  </div>
</template>
<script>
import Header from '../components/Header'
import WsPusher from '../components/websocket/pusher'
export default {
  name: 'LayoutDefault',
  components: { WsPusher, Header },
  computed: {
    dictionariesStatus() {
      return this.$store.getters['dictionaries/getStatus']
    },
  },
  watch: {
    dictionariesStatus(newValue) {
      if (newValue === 'main-sellers-is-fetched') {
        this.$store.commit('price/UPDATE_PRICE_FILTER', {
          field_name: 'seller_ids',
          new_value: this.$store.getters['dictionaries/getMainSellers'],
        })
        this.$store.dispatch('price/fetchPrice')
      }
    },
  },
  created() {
    this.$store.dispatch('replacements/fetchReplacements')
    this.$store.dispatch('dictionaries/fetchMainSellers')
    this.$store.dispatch('purchase/fetchCurrentUser')
    this.$store.dispatch('purchase/fetchPurchase')
    this.$store.dispatch('purchase/fetchTradingPlaces')
    this.$store.dispatch('surcharge/fetchSurcharge')
    this.$store.dispatch('dictionaries/fetchSellers')
    this.$store.dispatch('dictionaries/fetchUsers')
    this.$store.dispatch('dictionaries/fetchMnnList')
    this.$store.dispatch('dictionaries/fetchLfList')
    this.$store.dispatch('dictionaries/fetchCustomers')
    this.$store.dispatch('dictionaries/fetchOkeiList')
    this.$store.dispatch('dictionaries/fetchRoles')
    this.$store.dispatch('dictionaries/fetchPhrases')
    this.$store.dispatch('statistic/fetchStatistic')
    this.$store.dispatch('contracts/fetchContracts')
    this.$store.dispatch('procurements/fetchTopProcurements')
  },
  mounted() {
    this.$root.$on('downloadFile', (linkString) => {
      this.downloadFile(linkString)
    })
  },
  methods: {
    downloadFile(linkString) {
      const link = document.createElement('a')
      link.setAttribute('href', linkString)
      link.setAttribute('download', 'download')
      onload = link.click()
    },
  },
}
</script>

<style lang="scss">
@import '../assets/scss/app.scss';
</style>
