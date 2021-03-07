<template>
  <div class="d-flex flex-column h-100">
    <offers-filter></offers-filter>
    <offers-table class="overflow-auto h-100"></offers-table>
    <menu-bottom model="offers"></menu-bottom>
    <offers-modal></offers-modal>
  </div>
</template>

<script>
import OffersTable from '../../components/offers/offersTable'
import OffersModal from '../../components/offers/offersModal'
import OffersFilter from '../../components/offers/offersFilter'
import MenuBottom from '../../components/dashboard/MenuBottom'
export default {
  name: 'Offers',
  components: { MenuBottom, OffersFilter, OffersModal, OffersTable },
}
</script>
