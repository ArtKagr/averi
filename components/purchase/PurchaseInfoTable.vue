<template>
  <div>
    <b-table
      :fields="fields"
      :items="currentItems"
      bordered
      style="font-size: 8px"
      table-variant="white"
      class="table_paddingless"
    >
      <template v-slot:cell(auction_number)>
        {{ currentPurchase.purchase_number }}
      </template>
      <template v-slot:cell(number)="row">
        {{ row.item.purchaseIndex }}
      </template>
      <template v-slot:cell(purchase_mnn)="row">
        {{ row.item.purchase_item.mnn }}
      </template>
      <template v-slot:cell(purchase_tech_parameters)="row">
        {{ row.item.purchase_item.form_name }}
      </template>
      <template v-slot:cell(purchase_dosage)="row">
        {{ row.item.purchase_item.dosage_grls_value }}
      </template>
      <template v-slot:cell(purchase_quantity)="row">
        {{ row.item.purchase_item.drug_quantity }}
      </template>
      <template v-slot:cell(purchase_unit)="row">
        {{
          row.item.purchase_item.okei && row.item.purchase_item.okei.local_name
            ? row.item.purchase_item.okei.local_name
            : ''
        }}
      </template>
      <template v-slot:cell(purchase_max_price)="row">
        {{ row.item.purchase_item.position_price }}
      </template>
      <template v-slot:cell(purchase_is_znvlp)="row">
        {{ row.item.purchase_item.is_znvlp ? 'да' : 'нет' }}
      </template>
      <template v-slot:cell(price_mnn)="row">
        {{ row.item.price.mnn }}
      </template>
      <template v-slot:cell(price_trading_name)="row">
        {{ row.item.klp && row.item.klp.trade_name ? row.item.klp.trade_name : '' }}
      </template>
      <template v-slot:cell(price_tech_parameters)="row">
        {{ row.item.klp && row.item.klp.name_teh ? row.item.klp.name_teh : '' }}
      </template>
      <template v-slot:cell(price_unit)> упак </template>
      <template v-slot:cell(price_quantity)="row">
        {{ row.item.drug_quantity_require }}
      </template>
      <template v-slot:cell(price_seller)="row">
        {{ row.item.price.seller }}
      </template>
      <template v-slot:cell(price_manufacturer)="row">
        {{ row.item.klp ? row.item.klp.manufacturer_name : row.item.price.firm }}
      </template>
      <template v-slot:cell(price_manufacturer_country)="row">
        {{ row.item.klp ? row.item.klp.manufacturer_country_name : row.item.price.cntr }}
      </template>
      <template v-slot:cell(price_shelf_life)="row">
        {{ $moment(row.item.price.gdate).format('DD.MM.YYYY') }}
      </template>
      <template v-slot:cell(price_purchase_price)="row">
        {{ $formatMoney(row.item.price_price, 2, ',', '') }}
      </template>
      <template v-slot:cell(price_purchase_amount)="row">
        {{ $formatMoney(row.item.drug_quantity_require * row.item.price_price, 2, ',', '') }}
      </template>
      <template v-slot:cell(comment)="row">
        <div>{{ row.item.comment }},</div>
        <div v-for="(phraseId, key) in row.item.phrase_ids" :key="key">{{ currentPhrase(phraseId) }},</div>
      </template>
      <template v-slot:cell(price_is_znvlp)="row">
        {{ row.item.price.gnvls ? 'да' : 'нет' }}
      </template>
      <template v-slot:cell(price_production_cost)="row">
        {{ $formatMoney(row.item.price_price_znvlp, 2, ',', '') }}
      </template>
      <template v-slot:cell(price_contract_price)="row">
        {{
          $formatMoney(
            row.item.drug_quantity_require * purchaseCostSurcharge(row.item.price_price_znvlp).toFixed(2),
            2,
            ',',
            ''
          )
        }}
      </template>
      <template v-slot:cell(price_packing)="row">
        {{ row.item.klp && row.item.klp.pre_packing ? row.item.klp.pre_packing : '' }}
      </template>
      <template v-slot:cell(price_storage_conditions)="row">
        {{
          row.item.klp
            ? `${
                row.item.klp.temperature_min || row.item.klp.temperature_min === 0
                  ? row.item.klp.temperature_min
                  : 'нет'
              } - ${
                row.item.klp.temperature_max || row.item.klp.temperature_max === 0
                  ? row.item.klp.temperature_max
                  : 'нет'
              }`
            : ''
        }}
      </template>
      <template v-slot:cell(price_box_count)="row">
        {{
          row.item.klp
            ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2) !== 'Infinity'
              ? (row.item.drug_quantity_require / row.item.klp.pre_packing).toFixed(2)
              : 0
            : (row.item.drug_quantity_require / row.item.price.packing).toFixed(2) !== 'Infinity'
            ? (row.item.drug_quantity_require / row.item.price.packing).toFixed(2)
            : 0
        }}
      </template>
      <template v-slot:cell(price_box_weight_all)="row">
        {{
          row.item.klp
            ? ((row.item.drug_quantity_require / row.item.klp.pre_packing) * 7).toFixed(2) !== 'Infinity'
              ? ((row.item.drug_quantity_require / row.item.klp.pre_packing) * 7).toFixed(2)
              : 0
            : ''
        }}
      </template>
      <template v-slot:cell(amount_unit)="row">
        {{ row.item.drug_quantity_require }}
      </template>
      <template v-slot:cell(price_shipping_price)>
        {{ $formatMoney(delivery ? delivery : deliveryAuto, 2, ',', '') }}
      </template>
      <template v-slot:cell(price_ru_link)="row">
        {{
          row.item.klp && row.item.klp.num_reg
            ? `https://grls.rosminzdrav.ru/GRLS.aspx?RegNumber=${row.item.klp.num_reg}`
            : ''
        }}
      </template>
    </b-table>
    <b-table :fields="fields_expansion" :items="[{}]" table-variant="white">
      <template v-slot:cell(delivery_address)>
        {{
          currentPurchase.purchase_custom &&
          currentPurchase.purchase_custom.kladr_ids &&
          currentPurchase.purchase_custom.kladr_ids.length
            ? 'Несколько пунктов доставки'
            : `${currentPurchase.kladr.socr ? currentPurchase.kladr.socr : ''} ${
                currentPurchase.kladr.name ? currentPurchase.kladr.name : ''
              }, ${currentPurchase.kladr.region.name ? currentPurchase.kladr.region.name : ''} ${
                currentPurchase.kladr.region.socr ? currentPurchase.kladr.region.socr : ''
              }`
        }}
      </template>
      <template v-slot:cell(contract_duration)>
        {{ currentPurchase.purchase_custom.delivery_term.text }}
      </template>
      <template v-slot:cell(number_deliveries)>
        {{ currentPurchase.purchase_custom.delivery_count.manual }}
      </template>
      <template v-slot:cell(time_execution)>
        {{ currentPurchase.purchase_custom.delivery_time.text }}
      </template>
      <template v-slot:cell(ru_requirements)>
        {{
          currentPurchase.purchase_custom && currentPurchase.purchase_custom.delivery_ru2
            ? currentPurchase.purchase_custom.delivery_ru2.select
            : ''
        }}
      </template>
      <template v-slot:cell(st1_requirements)>
        {{
          currentPurchase.purchase_custom && currentPurchase.purchase_custom.delivery_st1
            ? currentPurchase.purchase_custom.delivery_st1.text
            : ''
        }}
      </template>
      <template v-slot:cell(date_requirements)>
        {{
          currentPurchase.purchase_custom && currentPurchase.purchase_custom.shelf_life
            ? currentPurchase.purchase_custom.shelf_life.date
              ? $moment(new Date(currentPurchase.purchase_custom.shelf_life.date)).format('DD.MM.YYYY')
              : currentPurchase.purchase_custom.shelf_life.months
              ? `${currentPurchase.purchase_custom.shelf_life.months} мес.`
              : 'Диапазон'
            : ''
        }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'PurchaseInfoTable',
  data() {
    return {
      fields: [
        {
          key: 'auction_number',
          label: '№ аукциона',
          class: 'align-middle',
        },
        {
          key: 'number',
          label: '№',
          class: 'align-middle',
        },
        {
          key: 'purchase_mnn',
          label: 'МНН',
          class: 'align-middle',
        },
        {
          key: 'purchase_tech_parameters',
          label: 'Тех. характеристики',
          class: 'align-middle',
        },
        {
          key: 'purchase_dosage',
          label: 'Дозиров.',
          class: 'align-middle',
        },
        {
          key: 'purchase_quantity',
          label: 'Кол-во',
          class: 'align-middle',
        },
        {
          key: 'purchase_unit',
          label: 'Ед. изм.',
          class: 'align-middle',
        },
        {
          key: 'purchase_max_price',
          label: 'НМЦК',
          class: 'align-middle',
        },
        {
          key: 'purchase_is_znvlp',
          label: 'ЖНВ',
          class: 'align-middle',
        },
        {
          key: 'price_mnn',
          label: 'МНН',
          class: 'align-middle',
        },
        {
          key: 'price_trading_name',
          label: 'Торг. наименование',
          class: 'align-middle',
        },
        {
          key: 'price_tech_parameters',
          label: 'Тех. характеристики',
          class: 'align-middle',
        },
        {
          key: 'price_unit',
          label: 'Ед. изм.',
          class: 'align-middle',
        },
        {
          key: 'price_quantity',
          label: 'Кол-во',
          class: 'align-middle',
        },
        {
          key: 'price_seller',
          label: 'Поставщик',
          class: 'align-middle',
        },
        {
          key: 'price_manufacturer',
          label: 'производ.',
          class: 'align-middle',
        },
        {
          key: 'price_manufacturer_country',
          label: 'Страна происхожд.',
          class: 'align-middle',
        },
        {
          key: 'price_shelf_life',
          label: 'Срок годн.',
          class: 'align-middle',
        },
        {
          key: 'price_purchase_price',
          label: 'Закуп. цена',
          class: 'align-middle',
        },
        {
          key: 'price_purchase_amount',
          label: 'Сумма закупа',
          class: 'align-middle',
        },
        {
          key: 'comment',
          label: 'Коммент.',
          class: 'align-middle',
        },
        {
          key: 'price_is_znvlp',
          label: 'ЖНВ',
          class: 'align-middle',
        },
        {
          key: 'price_production_cost',
          label: 'Ц. произв.',
          class: 'align-middle',
        },
        {
          key: 'price_contract_price',
          label: 'Наша ц/контр',
          class: 'align-middle',
        },
        {
          key: 'price_packing',
          label: 'Фасовка',
          class: 'align-middle',
        },
        {
          key: 'price_storage_conditions',
          label: 'Усл. хран.',
          class: 'align-middle',
        },
        {
          key: 'price_box_count',
          label: 'Кол-во коробок',
          class: 'align-middle',
        },
        {
          key: 'price_box_weight',
          label: 'Вес кор.',
          class: 'align-middle',
        },
        {
          key: 'price_box_weight_all',
          label: 'Вес всех кор.',
          class: 'align-middle',
        },
        {
          key: 'price_shipping_price',
          label: 'Цена дост.',
          class: 'align-middle',
        },
        {
          key: 'price_ru_link',
          label: '',
          class: 'align-middle',
        },
        {
          key: 'unit_esklp',
          label: 'Единица измерения Товара в соответствии с ЕСКЛП',
          class: 'align-middle',
        },
        {
          key: 'quantity_unit',
          label: 'Кол-во в ед.изм',
          class: 'align-middle',
        },
        {
          key: 'cost_quantity_unit',
          label: 'Цена за единицу измерения Товара по ЕСКЛП',
          class: 'align-middle',
        },
        {
          key: 'amount_unit',
          label: 'Сумма в ед.изм',
          class: 'align-middle',
        },
        {
          key: 'quantity_amount_unit',
          label: 'Кол-во ед.изм. в уп',
          class: 'align-middle',
        },
        {
          key: 'cost_package',
          label: 'Цена за упаковку',
          class: 'align-middle',
        },
        {
          key: 'amount',
          label: 'Сумма',
          class: 'align-middle',
        },
      ],
      fields_expansion: [
        {
          key: 'additional_auction_options',
          label: 'Дополнительные параметры аукциона',
          class: 'align-middle',
        },
        {
          key: 'delivery_address',
          label: 'Место поставки',
          class: 'align-middle',
        },
        {
          key: 'contract_duration',
          label: 'Срок действия контракта',
          class: 'align-middle',
        },
        {
          key: 'number_deliveries',
          label: 'Кол-во поставок',
          class: 'align-middle',
        },
        {
          key: 'time_execution',
          label: 'Время исп. заявки',
          class: 'align-middle',
        },
        {
          key: 'date_requirements',
          label: 'Требования к сроку годн.',
          class: 'align-middle',
        },
        {
          key: 'ru_requirements',
          label: 'Требования РУ',
          class: 'align-middle',
        },
        {
          key: 'st1_requirements',
          label: 'Требования к СТ-1',
          class: 'align-middle',
        },
        {
          key: 'contract_price',
          label: 'Цена контракта',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    currentItems() {
      const priceItems = []
      JSON.parse(JSON.stringify(this.$store.getters['purchaseObject/getPurchaseObjectsPrice']))
        .filter((object, index) => index !== 0)
        .map(function (item, index) {
          item.price_objects.map(function (priceItem) {
            const itemCopy = JSON.parse(JSON.stringify(item))
            delete itemCopy.price_objects
            priceItems.push({ ...priceItem, purchase_item: itemCopy, purchaseIndex: index + 1 })
            return priceItem
          })
          return item
        })

      return priceItems
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    delivery() {
      return this.$store.getters['purchaseObject/getDelivery']
    },
    deliveryAuto() {
      return this.$store.getters['purchaseObject/getDeliveryAuto']
    },
  },
  methods: {
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
    currentPhrase(phraseId) {
      return this.$store.getters['dictionaries/getCurrentPhrase'](phraseId)
    },
  },
}
</script>
