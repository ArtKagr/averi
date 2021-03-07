<template>
  <div class="d-flex flex-column h-100">
    <seller-filter></seller-filter>
    <seller-table class="overflow-auto h-100"></seller-table>
  </div>
</template>

<script>
import SellerFilter from '../../components/sellers/SellerFilter'
import SellerTable from '../../components/sellers/SellerTable'
export default {
  name: 'Sellers',
  components: { SellerTable, SellerFilter },
}
</script>
