<template>
  <div class="footer">
    <template v-if="pageName === 'price-manage'" class="footer-price">
      <b-pagination
        v-model="currentPage"
        class="footer-price-pagination"
        align="center"
        :total-rows="pricePagination.total"
        :per-page="pricePagination.per_page"
        limit="15"
        last-number
      />
      <custom-select
        v-model="perPage"
        class="footer-price-per_page"
        default-text="0"
        :options="[1, 5, 10, 15, 20, 30, 50, 75, 100, 150, 200, 250, 300]"
      />
      <p class="footer-price-total_rows">{{ pricePagination.total }}</p>
    </template>
  </div>
</template>

<script>
import CustomSelect from './Common/Select/Select'
export default {
  name: 'Footer',
  components: { CustomSelect },
  data() {
    return {
      currentPage: 1,
      perPage: 0,
    }
  },
  computed: {
    pageName() {
      return this.$route.name
    },
    pricePagination() {
      return JSON.parse(JSON.stringify(this.$store.state.price.pricePagination))
    },
  },
  watch: {
    pricePagination(newPagination) {
      this.perPage = newPagination.per_page
      this.currentPage = newPagination.current_page
    },
    perPage(newPage) {
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'limit',
        new_value: newPage,
      })
    },
    currentPage(newPage) {
      this.$store.commit('price/UPDATE_PRICE_FILTER', {
        field_name: 'page',
        new_value: newPage,
      })
    },
  },
}
</script>
