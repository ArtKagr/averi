<template>
  <b-table
    :fields="fields"
    :items="currentOffer && currentOffer.prices ? currentOffer.prices : []"
    striped
    sticky-header="100%"
    class="w-100 m-0"
  >
    <template v-slot:cell(npp)="row"> {{ row.index + 1 }}</template>
    <template v-slot:cell(remove)="row">
      <b-icon-trash class="m-0 h4 pointer" @click="removeCurrentPrice(row.item)"></b-icon-trash>
    </template>
    <template v-slot:cell(gnvls)="row">
      <b-icon-heart-fill v-if="row.item.gnvls" variant="danger" class="h5 m-0 mr-2 mb-3"></b-icon-heart-fill>
      <b-icon-heart v-else class="h5 m-0 mr-2 mb-3"></b-icon-heart>
    </template>
    <template v-slot:cell(price_surcharge)="row">
      {{ Math.trunc(purchaseCostSurcharge(row.item.price_gnvls) * 100) / 100 }}
    </template>
    <template v-slot:cell(price_gnvls)="row">
      <b-input
        v-model.number="row.item.price_gnvls"
        class="custom_input"
        placeholder="Укажите цену"
        @change="updateCurrentPriceGnvls(row.item)"
      />
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'OffersPriceTable',
  data() {
    return {
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'klp.mnn_norm_name',
          label: 'МНН по ГРЛС',
          class: 'align-middle',
        },
        {
          key: 'klp.name_teh',
          label: 'Тех. характеристики',
          class: 'align-middle',
        },
        {
          key: 'klp.trade_name',
          label: 'Торг. наим.',
          class: 'align-middle',
        },
        {
          key: 'qnt',
          label: 'Остаток',
          class: 'align-middle',
        },
        {
          key: 'cntr',
          label: 'Страна',
          class: 'align-middle',
        },
        {
          key: 'firm',
          label: 'Производитель',
          class: 'align-middle',
        },
        {
          key: 'price',
          label: 'Цена за упаковку',
          class: 'align-middle',
        },
        {
          key: 'price_gnvls',
          label: 'Цена производителя',
          class: 'align-middle',
        },
        {
          key: 'price_surcharge',
          label: 'Наша макс. цена за упак.',
          class: 'align-middle',
        },
        {
          key: 'gnvls',
          label: 'ЖВЛС',
          class: 'align-middle',
        },
        {
          key: 'remove',
          label: '',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    regions() {
      return this.$store.getters['surcharge/getRegions']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    currentOffer() {
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getCurrentOffer']))
    },
    offerPrices() {
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getOfferPrices']))
    },
  },
  methods: {
    removeCurrentPrice(currentPrice) {
      this.$store.commit('offers/REMOVE_CURRENT_OFFER_PRICE', currentPrice)
    },
    purchaseCostSurcharge(price) {
      let surcharge = 1
      if (this.currentOffer) {
        if (price <= 50) {
          surcharge =
            this.currentOffer.surcharge && this.currentOffer.surcharge.addition1
              ? this.currentOffer.surcharge.addition1 / 100 + 1.1
              : null
        } else if (price <= 500) {
          surcharge =
            this.currentOffer.surcharge && this.currentOffer.surcharge.addition2
              ? this.currentOffer.surcharge.addition2 / 100 + 1.1
              : null
        } else {
          surcharge =
            this.currentOffer.surcharge && this.currentOffer.surcharge.addition3
              ? this.currentOffer.surcharge.addition3 / 100 + 1.1
              : null
        }
        return price * surcharge
      } else return price
    },
    updateCurrentPriceGnvls(priceGnvls) {
      this.$store.commit('offers/UPDATE_CURRENT_OFFER', priceGnvls)
    },
  },
}
</script>
