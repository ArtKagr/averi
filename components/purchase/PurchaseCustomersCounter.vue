<template>
  <div class="d-flex flex-column">
    <span class="font-weight-bold px-4 pt-4 h5">Информация о поставщиках</span>
    <div class="d-flex flex-column p-4 ml-3">
      <div class="d-flex justify-content-between mb-4">
        <p class="m-0 h-5 font-weight-bold w-40">Поставщик</p>
        <p class="m-0 h-5 font-weight-bold w-10">Кол-во коробок</p>
        <p class="m-0 h-5 font-weight-bold w-10">в т.ч. термо</p>
        <p class="m-0 h-5 font-weight-bold w-10">в т.ч. без термо</p>
        <p class="m-0 h-5 font-weight-bold w-10">Стоимость</p>
        <p class="m-0 h-5 font-weight-bold w-10">в т.ч. термо</p>
        <p class="m-0 h-5 font-weight-bold w-10">в т.ч. без термо</p>
      </div>
      <div v-for="(customer, key) in customersList" :key="key" class="d-flex justify-content-between mb-3">
        <p class="m-0 h-5 w-40">{{ customer[0] }}</p>
        <p class="m-0 h-5 w-10">{{ customer[1] }}</p>
        <p class="m-0 h-5 w-10">{{ customer[2] }}</p>
        <p class="m-0 h-5 w-10">{{ customer[3] }}</p>
        <p class="m-0 h-5 w-10">{{ customer[4] }}</p>
        <p class="m-0 h-5 w-10">{{ customer[5] }}</p>
        <p class="m-0 h-5 w-10">{{ customer[6] }}</p>
      </div>
    </div>
    <span class="font-weight-bold px-4 pt-4 h5 mb-4">Информация о доставке</span>
    <div class="d-flex flex-column px-4 ml-3">
      <!--      {{ currentPurchase.purchase_custom.delivery_count.manual }}-->
      <div
        v-for="(points, key) in currentPurchase.purchase_custom.delivery_price.city_points"
        :key="key"
        class="d-flex flex-column"
      >
        <div class="d-flex w-100 align-items-center p-2 bg-white">
          <div class="d-flex justify-content-between w-100">
            <div class="d-flex">
              <span class="font-weight-bold mr-3">Адрес доставки: </span>
              <span>{{ currentKladrRegion(key) ? currentKladrRegion(key).name : null }}</span>
            </div>
            <div class="d-flex justify-content-between">
              <span class="font-weight-bold mr-3">Общая цена:</span>
              <span>{{ pointsPriceAll(points) }} ₽</span>
            </div>
          </div>
        </div>
        <b-table :items="Object.values(points)" :fields="fields">
          <template v-slot:cell(seller_id)="row">
            {{ currentSeller(row.item.seller_id) }}
          </template>
          <template v-slot:cell(cost_one_send)="row">
            <span
              >{{
                (
                  getCurrentSeller(row.item.seller_id) /
                  currentPurchase.purchase_custom.delivery_count.manual /
                  Object.keys(currentPurchase.purchase_custom.delivery_price.city_points).length
                ).toFixed(2)
              }}
              ₽</span
            >
          </template>
          <template v-slot:cell(one_weight)="row">
            <span
              >{{
                (
                  row.item.weight_all /
                  Object.values(currentPurchase.purchase_custom.delivery_price.city_points).length /
                  currentPurchase.purchase_custom.delivery_count.manual
                ).toFixed(2)
              }}
              кг</span
            >
          </template>
          <template v-slot:cell(box_count_one_send)="row">
            <span
              >{{
                (
                  row.item.count_box /
                  Object.values(currentPurchase.purchase_custom.delivery_price.city_points).length /
                  currentPurchase.purchase_custom.delivery_count.manual
                ).toFixed(2)
              }}
              шт</span
            >
          </template>
          <template v-slot:cell(one_send_cost)="row">
            <span>{{ (row.item.price / currentPurchase.purchase_custom.delivery_count.manual).toFixed(2) }} ₽</span>
          </template>
          <template v-slot:cell(weight_send)="row">
            <span
              >{{
                (
                  row.item.weight_all / Object.values(currentPurchase.purchase_custom.delivery_price.city_points).length
                ).toFixed(2)
              }}
              кг</span
            >
          </template>
          <template v-slot:cell(count_box_all)="row">
            <span
              >{{
                (
                  row.item.count_box / Object.values(currentPurchase.purchase_custom.delivery_price.city_points).length
                ).toFixed(2)
              }}
              шт</span
            >
          </template>
          <template v-slot:cell(count_send_price_all)="row">
            <span>{{ row.item.price }} ₽</span>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseCustomersCounter',
  data() {
    return {
      customersList: [],
      fields: [
        {
          key: 'seller_id',
          label: 'Поставщик',
          class: 'align-middle',
        },
        {
          key: 'cost_one_send',
          label: 'Ст-ть тов. в 1 пост.',
          class: 'align-middle',
        },
        {
          key: 'one_weight',
          label: 'Вес 1 дост.',
          class: 'align-middle',
        },
        {
          key: 'box_count_one_send',
          label: 'Кол-во кор. в 1 пост.',
          class: 'align-middle',
        },
        {
          key: 'one_send_cost',
          label: 'Стоимость 1 дост.',
          class: 'align-middle',
        },
        {
          key: 'weight_send',
          label: 'Вес доставки',
          class: 'align-middle',
        },
        {
          key: 'count_box_all',
          label: 'Кол-во кор. общ.',
          class: 'align-middle',
        },
        {
          key: 'count_send_price_all',
          label: 'Сумма дост. общ.',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    sellers() {
      return this.$store.getters['dictionaries/getSellers']
    },
    deliveryPlaces() {
      return this.$store.getters['purchaseObject/getDeliveryObjects']
    },
    kladrIds() {
      return this.$store.getters['purchaseObject/getKladrIds']
    },
    purchaseObjectsPrice() {
      return this.$store.getters['purchaseObject/getPurchaseObjectsPrice'].filter((purchase, index) => index !== 0)
    },
  },
  created() {
    this.customersList = this.$store.getters['purchaseObject/getCustomersCounter']
    if (this.kladrIds.length) this.$store.dispatch('purchaseObject/fetchKladrObjects')
  },
  methods: {
    pointsPriceAll(points) {
      return Object.values(points).reduce(function (preVal, point) {
        return preVal + point.price
      }, 0)
    },
    currentSeller(sellerId) {
      const currentSeller = this.sellers.find((seller) => seller.id === sellerId)
      return currentSeller.seller_name ? currentSeller.seller_name : null
    },
    currentKladrRegion(kladrId) {
      return this.deliveryPlaces.find((kladr) => kladr.id === Number(kladrId))
    },
    getCurrentSeller(sellerId) {
      const currentSeller = this.sellers.find((seller) => seller.id === sellerId) || { seller_name: null }
      const result = this.customersList.find(
        (seller) => seller[0].toUpperCase() === currentSeller.seller_name.toUpperCase()
      )
      return result && result.length ? result[4] : null
    },
  },
}
</script>
