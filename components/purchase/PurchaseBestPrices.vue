<template>
  <div>
    <b-table :fields="fields" :items="items" style="font-size: 12px">
      <template v-slot:cell(price_control)="row">
        <b-icon-check-square
          v-if="row.item.is_current"
          class="h4 m-0 pointer"
          :variant="row.item.price_status"
          @click="togglePriceObject(row.item)"
        ></b-icon-check-square>
        <b-icon-square
          v-else
          class="h4 m-0 pointer"
          :variant="row.item.price_status"
          @click="togglePriceObject(row.item)"
        ></b-icon-square>
      </template>
      <template v-slot:cell(klp.mnn_norm_name)="row">
        <span v-if="row.item.mnn_name">{{ row.item.mnn_name }}</span>
        <span v-else-if="row.item.klp && row.item.klp.mnn_norm_name">{{ row.item.klp.mnn_norm_name }}</span>
        <span v-else>{{ row.item.price.mnn }}</span>
      </template>
      <template v-slot:cell(klp.lf_norm_name)="row">
        <span v-if="row.item.lf_name">{{ row.item.lf_name }}</span>
        <span v-else-if="row.item.klp && row.item.klp.name_teh">{{ row.item.klp.name_teh }}</span>
        <span v-else-if="row.item.klp && row.item.klp.lf_norm_name">{{ row.item.klp.lf_norm_name }}</span>
        <span v-else>{{ row.item && row.item.price.name ? row.item.price.name : '' }}</span>
      </template>
      <template v-slot:cell(price.price_require_gnvlp)="row">
        <div>
          {{
            $formatMoney(
              (row.item.drug_quantity_require * Math.trunc(purchaseCostSurcharge(row.item.price_price_znvlp) * 100)) /
                100
            )
          }}
        </div>
      </template>
      <template v-slot:cell(count_box)="row">
        <div>
          {{
            row.item.klp
              ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2) !== 'Infinity'
                ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2)
                : 0
              : (row.item.drug_quantity_require / row.item.price.packing).toFixed(2) !== 'Infinity'
              ? (row.item.drug_quantity_require / row.item.price.packing).toFixed(2)
              : 0
          }}
        </div>
      </template>
      <template v-slot:cell(is_narcotic)="row">
        <div>
          <b-icon-exclamation-triangle
            class="h5 m-0"
            :variant="
              row.item.klp && row.item.klp.is_narcotic
                ? 'danger'
                : row.item.klp && !row.item.klp.is_narcotic
                ? 'success'
                : 'secondary'
            "
          ></b-icon-exclamation-triangle>
        </div>
      </template>
      <template v-slot:cell(price.gnvls)="row">
        <div class="d-flex align-items-center">
          <b-icon-heart-fill v-if="row.item.price.gnvls" variant="danger" class="h5 m-0"></b-icon-heart-fill>
          <b-icon-heart v-else class="h5 m-0"></b-icon-heart>
        </div>
      </template>
      <template v-slot:cell(temperature_mode)="row">
        <div class="d-flex justify-content-end align-items-center">
          <span>{{
            thermoMode(
              row.item.klp && row.item.klp.temperature_min === 0
                ? 0
                : row.item.klp
                ? row.item.klp.temperature_min
                : null,
              row.item.klp && row.item.klp.temperature_max === 0
                ? 0
                : row.item.klp
                ? row.item.klp.temperature_max
                : null
            ) === 'danger'
              ? row.item.klp
                ? `${
                    row.item.klp.temperature_min || row.item.klp.temperature_min === 0
                      ? row.item.klp.temperature_min
                      : "''"
                  } - ${
                    row.item.klp.temperature_max || row.item.klp.temperature_max === 0
                      ? row.item.klp.temperature_max
                      : "''"
                  }`
                : ''
              : ''
          }}</span>
          <span>
            <b-icon-thermometer
              class="h5 m-0"
              :variant="
                thermoMode(
                  row.item.klp && row.item.klp.temperature_min === 0
                    ? 0
                    : row.item.klp
                    ? row.item.klp.temperature_min
                    : null,
                  row.item.klp && row.item.klp.temperature_max === 0
                    ? 0
                    : row.item.klp
                    ? row.item.klp.temperature_max
                    : null
                )
              "
            ></b-icon-thermometer>
          </span>
        </div>
      </template>
      <template v-slot:cell(price.gdate)="row">
        <div>
          {{ $moment(row.item.price.gdate).format('DD.MM.YYYY') }}
        </div>
      </template>
      <template v-slot:cell(price_require_current)="row">
        <span class="font-weight-bold">{{ (row.item.drug_quantity_require * row.item.price_price).toFixed(2) }}</span>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'PurchaseBestPrices',
  props: {
    purchaseObject: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      items: [],
      fields: [
        {
          key: 'price_control',
          label: '',
          class: 'align-middle w-2',
        },
        {
          key: 'klp.mnn_norm_name',
          label: 'МНН',
          class: 'align-middle w-10',
        },
        {
          key: 'klp.lf_norm_name',
          label: 'Лек. форма',
          class: 'align-middle w-15',
        },
        {
          key: 'klp.trade_name',
          label: 'Торг. наим.',
          class: 'align-middle w-8',
        },
        {
          key: 'drug_quantity_require',
          label: 'Требуется',
          class: 'align-middle w-5',
        },
        {
          key: 'price.qnt',
          label: 'Остаток',
          class: 'align-middle w-3',
        },
        {
          key: 'price.seller',
          label: 'Поставщик',
          class: 'align-middle w-5',
        },
        {
          key: 'klp.manufacturer_name',
          label: 'Страна / Производитель',
          class: 'align-middle w-7',
        },
        // {
        //   key: 'klp.manufacturer_country_name',
        //   label: 'Страна происх.',
        //   class: 'align-middle w-5',
        // },
        {
          key: 'price.gdate',
          label: 'Срок годности',
          class: 'align-middle w-4',
        },
        {
          key: 'price_price',
          label: 'Закуп. цена',
          class: 'align-middle w-3',
        },
        {
          key: 'price_require_current',
          label: 'Стоимость',
          class: 'align-middle w-4',
        },
        {
          key: 'price_price_znvlp',
          label: 'Цена произв.',
          class: 'align-middle w-3',
        },
        {
          key: 'price.price_require_gnvlp',
          label: 'Наша ц. контр.',
          class: 'align-middle w-4',
        },
        {
          key: 'count_box',
          label: 'Кол-во коробок',
          class: 'align-middle w-2',
        },
        {
          key: 'is_narcotic',
          label: 'Сильнодействующий препарат / Наркотик',
          class: 'align-middle w-2',
        },
        {
          key: 'price.gnvls',
          label: 'ЖНВЛП',
          class: 'align-middle w-2',
        },
        {
          key: 'temperature_mode',
          label: 'Терморежим',
          class: 'align-middle w-4',
        },
        {
          key: 'klp.num_reg',
          label: '№ РУ',
          class: 'align-middle w-1',
        },
        {
          key: 'remove',
          label: '',
          class: 'align-middle field_width_30',
        },
      ],
    }
  },
  computed: {
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
  },
  created() {
    this.fetchPriceObjects()
  },
  destroyed() {
    this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
  },
  methods: {
    thermoMode(min, max) {
      if (min === null && max === null) return 'secondary'
      else if (!min && min !== 0 && max >= 25) return 'success'
      else if ((min === 0 && max >= 25) || (min === 0 && !max)) return 'info'
      else if ((min === 0 && max < 25) || (min > 0 && !max) || (min > 0 && max) || (!min && max < 25)) return 'danger'
    },
    showNotification(title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant,
        appendToast: false,
      })
    },
    purchaseCostSurcharge(price) {
      let surcharge = 1
      if (this.currentPurchase) {
        if (price <= 50) {
          surcharge = this.currentPurchase.surcharge.addition1 / 100 + 1.1
        } else if (price <= 500) {
          surcharge = this.currentPurchase.surcharge.addition2 / 100 + 1.1
        } else {
          surcharge = this.currentPurchase.surcharge.addition3 / 100 + 1.1
        }
        return price * surcharge
      } else return price
    },
    async fetchPriceObjects() {
      try {
        let { data } = await this.$axios.$get(`/api/purchase/object/price`, {
          params: { purchase_object_id: this.purchaseObject.id },
        })
        data = data.map(function (currentPrice) {
          if (!currentPrice.price_klp.is_active) currentPrice.price_status = 'secondary'
          else if (!currentPrice.price_klp.esklp_klp_uuid) currentPrice.price_status = 'danger'
          else if (!currentPrice.price_klp.author_id) currentPrice.price_status = 'dark'
          else if (!currentPrice.price_klp.is_confirmed) currentPrice.price_status = 'warning'
          else currentPrice.price_status = 'success'
          return currentPrice
        })
        this.items = data
      } catch {
        this.showNotification('Ошибка', 'Ошибка загрузки данных', 'danger')
      }
    },
    async togglePriceObject(priceObject) {
      try {
        await this.$axios
          .$put(`/api/purchase/object/price/${priceObject.id}`, {
            is_current: !priceObject.is_current,
          })
          .then(() => {
            this.fetchPriceObjects()
          })
      } catch {
        this.showNotification('Ошибка', 'Ошибка загрузки данных', 'danger')
      }
    },
  },
}
</script>
