<template>
  <div class="d-flex flex-column px-3">
    <div v-if="sellerPriceStatus !== 'seller-price-created'" class="d-flex justify-content-between my-4">
      <div class="d-flex">
        <b-icon-plus-circle
          v-if="currentMergedResultFilled"
          class="m-0 h4 pointer mr-4"
          variant="info"
          @click="setMergedResult"
        ></b-icon-plus-circle>
        <b-icon-plus-circle v-else class="m-0 h4 mr-4" variant="secondary"></b-icon-plus-circle>
        <b-icon-caret-left-fill
          v-if="priceFields.length && step === 2"
          class="m-0 h4 pointer mr-4"
          variant="info"
          @click="setStep(1)"
        ></b-icon-caret-left-fill>
        <b-icon-caret-left-fill
          v-else-if="!priceFields.length && step === 2"
          class="m-0 h4 mr-4"
          variant="secondary"
        ></b-icon-caret-left-fill>
        <b-icon-caret-left-fill
          v-else-if="priceHashUnique.length && step === 3"
          class="m-0 h4 pointer mr-4"
          variant="info"
          @click="setStep(2)"
        ></b-icon-caret-left-fill>
        <b-icon-caret-left-fill
          v-else-if="!priceHashUnique.length && step === 3"
          class="m-0 h4 mr-4"
          variant="secondary"
        ></b-icon-caret-left-fill>
      </div>
      <div class="d-flex align-items-center">
        <div class="d-flex flex-column">
          <div v-if="accessRight && accessRight.role === 'administrators'" class="d-flex align-items-center w-100">
            <span class="h4 mr-2 w-40">Загрузка шаблона</span>
            <upload-files source="seller_current_price" class="mr-4 w-60"></upload-files>
          </div>
          <div v-if="currentSellerPriceTemplate.length" class="d-flex align-items-center">
            <span class="h4 mr-2 w-40">Импорт прайса</span>
            <upload-files source="seller_current_price_import" class="mr-4 w-60"></upload-files>
          </div>
        </div>
        <!--        <span class="h4 m-0" :class="step === 1 ? 'ml-4' : ''">Шаг {{ step }}</span>-->
        <b-icon-info-circle
          v-if="accessRight && accessRight.role === 'administrators'"
          :id="`merged-info-${step}`"
          class="m-0 h5 ml-3"
          :variant="step !== 1 ? 'info' : 'secondary'"
        ></b-icon-info-circle>
        <b-tooltip v-if="step === 2 || step === 3" :target="`merged-info-${step}`" placement="down">
          <div v-if="step === 2" class="d-flex flex-column">
            <span class="text-left">Рекомендуемые колонки и порядок:</span>
            <span class="text-left">1. Колонка: firm / Имя: Производитель</span>
            <span class="text-left">2. Колонка: name / Имя: торговое наименование (технические характеристики)</span>
            <span class="text-left">3. Колонка: cntr / Имя: Страна происхождения</span>
          </div>
          <div v-if="step === 3" class="d-flex flex-column">
            <span class="text-left">Рекомендуемые колонки и порядок:</span>
            <span class="text-left">1. Колонка: seller_outside_id / Имя: старый id поставщика</span>
            <span class="text-left">2. Колонка: ean13 / Имя: Штрих-код</span>
            <span class="text-left">3. Колонка: mnn / Имя: МНН</span>
            <span class="text-left">4. Колонка: name / Имя: торговое наименование (технические характеристики)</span>
            <span class="text-left">5. Колонка: gdate / Имя: Срок годности</span>
            <span class="text-left">6. Колонка: packing / Имя: Упаковка</span>
            <span class="text-left">7. Колонка: codepst / Имя: codepst</span>
          </div>
        </b-tooltip>
      </div>
      <div class="d-flex">
        <b-icon-caret-right-fill
          v-if="priceFields.length && step === 1"
          class="m-0 h4 pointer mr-4"
          variant="info"
          @click="setStep(2)"
        ></b-icon-caret-right-fill>
        <b-icon-caret-right-fill
          v-else-if="!priceFields.length && step === 1"
          class="m-0 h4 mr-4"
          variant="secondary"
        ></b-icon-caret-right-fill>
        <b-icon-caret-right-fill
          v-else-if="priceHashUnique.length && step === 2"
          class="m-0 h4 pointer mr-4"
          variant="info"
          @click="setStep(3)"
        ></b-icon-caret-right-fill>
        <b-icon-caret-right-fill
          v-else-if="!priceHashUnique.length && step === 2"
          class="m-0 h4 mr-4"
          variant="secondary"
        ></b-icon-caret-right-fill>
        <b-icon-folder-check
          v-else-if="
            priceFields.length &&
            priceHashUnique.length &&
            priceHashDef.length &&
            accessRight &&
            accessRight.role === 'administrators'
          "
          class="m-0 h4 pointer mr-4"
          variant="success"
          @click="savePriceTemplate"
        ></b-icon-folder-check>
        <b-icon-folder-check v-else class="m-0 h4 pointer mr-4" variant="secondary"></b-icon-folder-check>
        <b-icon-trash
          v-if="stepColumns.length && accessRight && accessRight.role === 'administrators'"
          class="m-0 h4 pointer"
          variant="info"
          @click="clearStepColumns"
        ></b-icon-trash>
        <b-icon-trash v-else class="m-0 h4" variant="secondary"></b-icon-trash>
      </div>
    </div>
    <div v-if="sellerPriceStatus !== 'seller-price-created'" class="d-flex justify-content-between mt-4">
      <div class="d-flex flex-column">
        <div
          v-for="(column, key) in sellerTableColumns"
          :key="key"
          class="d-flex px-3 py-2 seller_table_column align-items-center"
          :class="[sellerColumnMerged(column.column_name) ? 'bg-success' : column.is_select ? 'bg-cyan' : '']"
        >
          <span class="font-weight-bold w-45"
            >Колонка: <span class="font-weight-normal">{{ column.column_name }}</span></span
          >
          <span class="font-weight-bold w-45"
            >Имя: <span class="font-weight-normal">{{ column.column_word }}</span></span
          >
          <template v-if="!sellerColumnMerged(column.column_name)">
            <b-icon-square
              v-if="!someSellerTableColumnSelected && !column.is_select"
              class="m-0 h5 w-5"
              @click="setSellerTableColumn(true, key, column)"
            ></b-icon-square>
            <b-icon-check-square
              v-else-if="someSellerTableColumnSelected && column.is_select"
              class="m-0 h5 w-5"
              @click="setSellerTableColumn(false, key, column)"
            ></b-icon-check-square>
            <b-icon-square
              v-else-if="someSellerTableColumnSelected && !column.is_select"
              class="m-0 h5 w-5"
              variant="secondary"
            ></b-icon-square>
          </template>
          <div v-else class="d-flex align-items-center w-5">
            <b-icon-trash
              v-if="accessRight && accessRight.role === 'administrators'"
              class="m-0 h5 pointer"
              @click="clearSellerColumn(column.column_name)"
            ></b-icon-trash>
            <b-icon-check-square v-else class="m-0 h5"></b-icon-check-square>
          </div>
          <span class="w-5 text-right">{{ key + 1 }}</span>
        </div>
      </div>
      <div class="d-flex flex-column mt-3">
        <div v-for="(result, key) in stepColumns" :key="key" class="d-flex mb-3">
          <span class="mr-1 h5">{{ result.key }}</span>
          <span class="h5">-</span>
          <span class="ml-1 h5">{{ result.merge_column }}</span>
        </div>
      </div>
      <div class="d-flex flex-column">
        <div
          v-for="(column, key) in currentSellerTablePrice"
          :key="key"
          class="d-flex px-3 py-2 seller_table_column align-items-center"
          :class="[
            column.column_word !== 'Mock'
              ? currentSellerColumnMerged(column.column_word)
                ? 'bg-success'
                : column.is_select
                ? 'bg-cyan'
                : ''
              : '',
          ]"
        >
          <span class="w-5 text-left">{{ column.column_name }}</span>
          <div v-if="!currentSellerColumnMerged(column.column_word)" class="w-5 mr-4">
            <b-icon-square v-if="!someSellerTableColumnSelected" class="m-0 h5" variant="secondary"></b-icon-square>
            <b-icon-square
              v-else-if="someSellerTableColumnSelected && someCurrentSellerTablePriceSelected && !column.is_select"
              class="m-0 h5"
              variant="secondary"
            ></b-icon-square>
            <b-icon-square
              v-else-if="someSellerTableColumnSelected && !column.is_select"
              class="m-0 h5"
              @click="setCurrentSellerPriceColumn(true, key, column)"
            ></b-icon-square>
            <b-icon-check-square
              v-else-if="someSellerTableColumnSelected && column.is_select"
              class="m-0 h5"
              @click="setCurrentSellerPriceColumn(false, key, column)"
            ></b-icon-check-square>
          </div>
          <div v-else-if="column.column_name !== '?'" class="w-5 mr-4">
            <b-icon-trash class="m-0 h5 pointer" @click="clearSellerPriceColumn(column.column_word)"></b-icon-trash>
          </div>
          <b-icon-square
            v-else-if="!column.is_select"
            class="m-0 h5 mr-4"
            @click="setCurrentSellerPriceColumn(true, key, column)"
          ></b-icon-square>
          <b-icon-check-square
            v-else-if="column.is_select"
            class="m-0 h5 mr-4"
            @click="setCurrentSellerPriceColumn(false, key, column)"
          ></b-icon-check-square>
          <span class="font-weight-bold w-50"
            >Колонка: <span class="font-weight-normal">{{ column.column_word }}</span></span
          >
        </div>
      </div>
    </div>
    <div v-else class="h3 my-4 mx-2">Шаблон прайса поставщика успешно создан</div>
  </div>
</template>

<script>
import UploadFiles from '../UploadFiles'
export default {
  name: 'SellerAddPrice',
  components: { UploadFiles },
  props: {
    currentSeller: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      step: 1,
      priceFields: [],
      priceHashUnique: [],
      priceHashDef: [],
      currentMergedResult: { origin_column: null, replace_column: null, merge_column: null, key: null },
    }
  },
  computed: {
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    currentSellerPriceTemplate() {
      return this.$store.getters['dictionaries/getCurrentSellerPriceTemplate']
    },
    sellerPriceStatus() {
      return this.$store.getters['dictionaries/getStatus']
    },
    stepColumns() {
      let columns = []
      switch (this.step) {
        case 1:
          columns = JSON.parse(JSON.stringify(this.priceFields))
          break
        case 2:
          columns = JSON.parse(JSON.stringify(this.priceHashUnique))
          break
        case 3:
          columns = JSON.parse(JSON.stringify(this.priceHashDef))
          break
      }
      return columns
    },
    sellerTableColumns() {
      return this.$store.getters['dictionaries/getSellerTableColumns'] || []
    },
    currentSellerTablePrice() {
      return this.$store.getters['file/getSellerTableColumns'] || []
    },
    someSellerTableColumnSelected() {
      return this.sellerTableColumns && this.sellerTableColumns.length
        ? this.sellerTableColumns.some((column) => column.is_select)
        : false
    },
    someCurrentSellerTablePriceSelected() {
      return this.currentSellerTablePrice && this.currentSellerTablePrice.length
        ? this.currentSellerTablePrice.some((column) => column.is_select)
        : false
    },
    currentMergedResultFilled() {
      return (
        this.currentMergedResult.origin_column &&
        this.currentMergedResult.replace_column &&
        this.currentMergedResult.merge_column
      )
    },
  },
  watch: {
    currentSellerPriceTemplate(newValue) {
      if (newValue.length) {
        this.priceFields = newValue[0].price_fields
        this.priceHashUnique = newValue[0].price_hash_unique
        this.priceHashDef = newValue[0].price_hash_def
      }
    },
  },
  created() {
    this.$store.dispatch('dictionaries/fetchSellerColumns')
    this.$store.dispatch('dictionaries/fetchCurrentSellerPriceTemplate', this.currentSeller.id)
    this.$store.commit('file/SAVE_CURRENT_SELLER', this.currentSeller)
  },
  destroyed() {
    this.$store.commit('file/CLEAR_CURRENT_PRICE')
  },
  methods: {
    setSellerTableColumn(flag, key, column) {
      this.$store.commit('dictionaries/UPDATE_CURRENT_SELLER_COLUMN', { column: key, flag })
      this.currentMergedResult.origin_column = flag ? column.column_name : null
      this.currentMergedResult.key = flag ? key + 1 : null
    },
    setCurrentSellerPriceColumn(flag, key, column) {
      this.$store.commit('file/UPDATE_CURRENT_PRICE_SELLER_COLUMN', { column: key, flag })
      this.currentMergedResult.replace_column = flag ? column.column_word : null
      this.currentMergedResult.merge_column = flag ? column.column_name : null
    },
    setMergedResult() {
      switch (this.step) {
        case 1:
          this.priceFields.push(this.currentMergedResult)
          break
        case 2:
          this.priceHashUnique.push(this.currentMergedResult)
          break
        case 3:
          this.priceHashDef.push(this.currentMergedResult)
          break
      }
      this.currentMergedResult = { origin_column: null, replace_column: null, merge_column: null }
      this.$store.commit('dictionaries/CLEAR_SELLER_COLUMNS')
      this.$store.commit('file/CLEAR_CURRENT_PRICE_SELLER_COLUMNS')
    },
    clearSellerColumn(columnName) {
      switch (this.step) {
        case 1:
          this.priceFields = this.priceFields.filter((columns) => columns.origin_column !== columnName)
          break
        case 2:
          this.priceHashUnique = this.priceHashUnique.filter((columns) => columns.origin_column !== columnName)
          break
        case 3:
          this.priceHashDef = this.priceHashDef.filter((columns) => columns.origin_column !== columnName)
          break
      }
    },
    clearSellerPriceColumn(columnName) {
      switch (this.step) {
        case 1:
          this.priceFields = this.priceFields.filter((columns) => columns.replace_column !== columnName)
          break
        case 2:
          this.priceHashUnique = this.priceHashUnique.filter((columns) => columns.replace_column !== columnName)
          break
        case 3:
          this.priceHashDef = this.priceHashDef.filter((columns) => columns.replace_column !== columnName)
          break
      }
    },
    sellerColumnMerged(columnName) {
      switch (this.step) {
        case 1:
          return this.priceFields && this.priceFields.length
            ? !!this.priceFields.find((columns) => columns.origin_column === columnName)
            : false
        case 2:
          return this.priceHashUnique && this.priceHashUnique.length
            ? !!this.priceHashUnique.find((columns) => columns.origin_column === columnName)
            : false
        case 3:
          return this.priceHashDef && this.priceHashDef.length
            ? !!this.priceHashDef.find((columns) => columns.origin_column === columnName)
            : false
      }
    },
    currentSellerColumnMerged(columnName) {
      switch (this.step) {
        case 1:
          return this.priceFields && this.priceFields.length
            ? !!this.priceFields.find((columns) => columns.replace_column === columnName)
            : false
        case 2:
          return this.priceHashUnique && this.priceHashUnique.length
            ? !!this.priceHashUnique.find((columns) => columns.replace_column === columnName)
            : false
        case 3:
          return this.priceHashDef && this.priceHashDef.length
            ? !!this.priceHashDef.find((columns) => columns.replace_column === columnName)
            : false
      }
    },
    clearStepColumns() {
      switch (this.step) {
        case 1:
          this.priceFields = []
          break
        case 2:
          this.priceHashUnique = []
          break
        case 3:
          this.priceHashDef = []
          break
      }
    },
    setStep(currentStep) {
      this.step = currentStep
    },
    savePriceTemplate() {
      const result = {
        seller_id: this.currentSeller.id,
        price_fields: JSON.parse(JSON.stringify(this.priceFields)).map(function (item) {
          delete item.key
          if (item.merge_column === '?') {
            item.replace_column = null
            item.merge_column = null
          }
          return item
        }),
        price_hash_unique: JSON.parse(JSON.stringify(this.priceHashUnique)).map(function (item) {
          delete item.key
          if (item.merge_column === '?') {
            item.replace_column = null
            item.merge_column = null
          }
          return item
        }),
        price_hash_def: JSON.parse(JSON.stringify(this.priceHashDef)).map(function (item) {
          delete item.key
          if (item.merge_column === '?') {
            item.replace_column = null
            item.merge_column = null
          }
          return item
        }),
      }
      this.$store.dispatch('dictionaries/setSellerPriceTemplate', result)
    },
  },
}
</script>
