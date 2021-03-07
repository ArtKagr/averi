<template>
  <div class="d-flex flex-column bg-gray-200 align-items-center px-3 py-1">
    <div class="d-flex justify-content-between w-100 py-1">
      <div class="d-flex align-items-center -large">
        <b-input-group class="filter mr-2">
          <b-form-input v-model="purchaseCustom.delivery_term.text" placeholder="Срок дейст. контракта"></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="purchaseCustom.delivery_term.text"
          class="custom_button"
          @click="showNotification('Подсказка', 'Срок действия контракта', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="purchaseCustom.delivery_term.text" placement="top">
          {{ purchaseCustom.delivery_term.text ? purchaseCustom.delivery_term.text : 'Нет данных' }}
        </b-tooltip>
      </div>
      <div class="d-flex align-items-center -little">
        <b-input-group class="filter mr-2">
          <b-form-input v-model.number="purchaseCustom.delivery_count.manual"></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="purchaseCustom.delivery_count.manual"
          class="custom_button"
          @click="showNotification('Подсказка', 'Количество поставок', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="purchaseCustom.delivery_count.manual" placement="top">
          {{ purchaseCustom.delivery_count.manual ? purchaseCustom.delivery_count.manual : 'Нет данных' }}
        </b-tooltip>
      </div>
      <!--      <div class="d-flex align-items-center">-->
      <!--        <b-input-group class="filter mr-2">-->
      <!--          <b-form-input v-model.number="costOfOneDelivery" placeholder="Цена одной доставки" disabled></b-form-input>-->
      <!--        </b-input-group>-->
      <!--        <b-icon-info-circle-->
      <!--          class="pointer"-->
      <!--          @click="showNotification('Подсказка', 'Цена одной доставки', 'info')"-->
      <!--        ></b-icon-info-circle>-->
      <!--      </div>-->
      <div class="d-flex align-items-center -medium">
        <b-input-group class="filter mr-2">
          <b-form-input v-model="purchaseCustom.delivery_time.text" placeholder="Время испол. заявки"></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="purchaseCustom.delivery_time.text"
          class="custom_button"
          @click="showNotification('Подсказка', 'Время исполнения заявки', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="purchaseCustom.delivery_time.text" placement="top">
          {{ purchaseCustom.delivery_time.text ? purchaseCustom.delivery_time.text : 'Нет данных' }}
        </b-tooltip>
      </div>
      <!--      <div class="d-flex align-items-center">-->
      <!--        <b-input-group class="filter mr-2">-->
      <!--          <b-form-input v-model="purchaseCustom.shelf_life.text" placeholder="Требов. к сроку годн."></b-form-input>-->
      <!--        </b-input-group>-->
      <!--        <b-icon-info-circle-->
      <!--          class="pointer"-->
      <!--          @click="showNotification('Подсказка', 'Требования к сроку годности', 'info')"-->
      <!--        ></b-icon-info-circle>-->
      <!--      </div>-->
      <div class="d-flex align-items-center justify-content-center ml-2 mr-2">
        <b-icon-file-medical
          v-if="purchaseObjects.length > 1"
          v-b-toggle.sidebar-shelf_life
          class="h5 m-0 pointer mr-2 custom_button"
        ></b-icon-file-medical>
        <b-icon-file-medical
          v-else
          v-b-toggle.sidebar-shelf_life
          class="h5 m-0 pointer mr-2 custom_button"
          variant="secondary"
        ></b-icon-file-medical>
        <span class="text-truncate">{{
          !activeShelfField
            ? 'Условия не выбраны'
            : activeShelfField === 'date'
            ? inputShelfGroups.date
              ? $moment(inputShelfGroups.date).format('DD.MM.YYYY')
              : 'Дата не выбрана'
            : activeShelfField === 'input'
            ? `Кол-во мес: ${inputShelfGroups.months}`
            : activeShelfField === 'koef'
            ? `Процент: ${inputShelfGroups.koef}`
            : 'Диапазон'
        }}</span>
      </div>
      <div class="d-flex align-items-center">
        <div class="d-flex align-items-center mr-2">
          <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none p-0" no-caret>
            <template v-slot:button-content>
              <b-icon-file-earmark-plus
                v-if="!ruRulesCopy.select"
                class="h4 mb-0 priority_font_size_1_5_rem"
                variant="dark"
              ></b-icon-file-earmark-plus>
              <b-icon-file-earmark-break
                v-else-if="ruRulesCopy.select === 'Нет'"
                class="h4 m-0 pointer priority_font_size_1_5_rem"
                variant="info"
              ></b-icon-file-earmark-break>
              <b-icon-file-earmark-code
                v-else-if="ruRulesCopy.select === 'Копия РУ'"
                class="h4 m-0 pointer priority_font_size_1_5_rem"
                :variant="getCopyRuState()"
              ></b-icon-file-earmark-code>
              <b-icon-file-earmark-ruled
                v-else-if="ruRulesCopy.select === 'Реквизиты РУ'"
                class="h4 m-0 pointer priority_font_size_1_5_rem"
                variant="info"
              ></b-icon-file-earmark-ruled>
            </template>
            <div class="d-flex justify-content-center p-2">
              <div class="d-flex align-items-center mr-3">
                <b-icon-file-earmark-break
                  class="h3 m-0 pointer"
                  :variant="ruRulesCopy.select === 'Нет' ? 'info' : 'dark'"
                  @click="setRuRules('Нет')"
                ></b-icon-file-earmark-break>
                <span class="ml-2" style="font-size: 12px">Нет</span>
              </div>
              <div class="d-flex align-items-center mr-3">
                <b-icon-file-earmark-code
                  class="h3 m-0 pointer"
                  :variant="ruRulesCopy.select === 'Копия РУ' ? 'info' : 'dark'"
                  @click="setRuRules('Копия РУ')"
                ></b-icon-file-earmark-code>
                <span class="ml-2" style="font-size: 12px">Копия РУ</span>
              </div>
              <div class="d-flex align-items-center">
                <b-icon-file-earmark-ruled
                  class="h3 m-0 pointer"
                  :variant="ruRulesCopy.select === 'Реквизиты РУ' ? 'info' : 'dark'"
                  @click="setRuRules('Реквизиты РУ')"
                ></b-icon-file-earmark-ruled>
                <span class="ml-2" style="font-size: 12px">Реквизиты РУ</span>
              </div>
            </div>
          </b-dropdown>
        </div>
        <b-input-group class="filter mr-2">
          <b-form-input v-model="ruRules.text" placeholder="Требования к РУ"></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="ruRules.text"
          class="custom_button"
          @click="showNotification('Подсказка', 'Требования к РУ', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="ruRules.text" placement="top">
          {{ ruRulesCopy.text ? ruRulesCopy.text : 'Нет данных' }}
        </b-tooltip>
      </div>
      <div class="d-flex align-items-center">
        <div class="d-flex align-items-center mr-2">
          <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none p-0" no-caret>
            <template v-slot:button-content>
              <b-icon-clipboard-plus
                v-if="!st1Rules.select"
                class="h4 mb-0 priority_font_size_1_5_rem"
                variant="dark"
              ></b-icon-clipboard-plus>
              <b-icon-clipboard-minus
                v-else-if="st1Rules.select === 'Нет'"
                class="h4 m-0 pointer priority_font_size_1_5_rem"
                variant="info"
              ></b-icon-clipboard-minus>
              <b-icon-clipboard-check
                v-else-if="st1Rules.select === 'Есть'"
                class="h4 m-0 pointer priority_font_size_1_5_rem"
                variant="info"
              ></b-icon-clipboard-check>
              <b-icon-clipboard
                v-else-if="st1Rules.select === 'Не требуется'"
                class="h4 m-0 pointer priority_font_size_1_5_rem"
                variant="info"
              ></b-icon-clipboard>
            </template>
            <div class="d-flex justify-content-center p-2">
              <div class="d-flex align-items-center mr-3">
                <b-icon-clipboard-minus
                  class="h3 m-0 pointer"
                  :variant="st1Rules.select === 'Нет' ? 'info' : 'dark'"
                  @click="setSt1Rules('Нет')"
                ></b-icon-clipboard-minus>
                <span class="ml-2" style="font-size: 12px">Нет</span>
              </div>
              <div class="d-flex align-items-center mr-3">
                <b-icon-clipboard-check
                  class="h3 m-0 pointer"
                  :variant="st1Rules.select === 'Есть' ? 'info' : 'dark'"
                  @click="setSt1Rules('Есть')"
                ></b-icon-clipboard-check>
                <span class="ml-2" style="font-size: 12px">Есть</span>
              </div>
              <div class="d-flex align-items-center mr-3">
                <b-icon-clipboard
                  class="h3 m-0 pointer"
                  :variant="st1Rules.select === 'Не требуется' ? 'info' : 'dark'"
                  @click="setSt1Rules('Не требуется')"
                ></b-icon-clipboard>
                <span class="ml-2" style="font-size: 12px">Не требуется</span>
              </div>
            </div>
          </b-dropdown>
        </div>
        <b-input-group class="filter mr-2">
          <b-form-input
            v-model="purchaseCustom.delivery_st1.text"
            placeholder="Требования к СТ-1"
            disabled
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="purchaseCustom.delivery_st1.text"
          class="custom_button"
          @click="showNotification('Подсказка', 'Требования к СТ-1', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="purchaseCustom.delivery_st1.text" placement="top">
          {{ purchaseCustom.delivery_st1.text ? purchaseCustom.delivery_st1.text : 'Нет данных' }}
        </b-tooltip>
      </div>
      <div class="d-flex align-items-center">
        <b-input-group class="filter mr-2">
          <b-form-input v-model="purchaseCustom.thermal_mode.text" placeholder="Терморежим"></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="purchaseCustom.thermal_mode.text"
          class="custom_button"
          @click="showNotification('Подсказка', 'Терморежим', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="purchaseCustom.thermal_mode.text" placement="top">
          {{ purchaseCustom.thermal_mode.text ? purchaseCustom.thermal_mode.text : 'Нет данных' }}
        </b-tooltip>
      </div>
      <div class="d-flex align-items-center -medium">
        <b-input-group class="filter mr-2">
          <b-form-input v-model="purchaseCustom.comment" placeholder="Комментарий"></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          id="purchaseCustom.comment"
          class="custom_button"
          @click="showNotification('Подсказка', 'Комментарий', 'info')"
        ></b-icon-info-circle>
        <b-tooltip target="purchaseCustom.comment" placement="top">
          {{ purchaseCustom.comment ? purchaseCustom.comment : 'Нет данных' }}
        </b-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseFilterControl',
  data() {
    return {
      purchaseCustom: {
        delivery_term: { text: null },
        delivery_ru2: { text: null },
        delivery_time: { text: null },
        delivery_st1: { text: null },
        delivery_count: { manual: null },
        shelf_life: { text: null },
        thermal_mode: { text: '' },
        comment: '',
      },
      numberOfDeliveries: null,
      costOfOneDelivery: null,
      ruRules: { text: null, select: null },
      ruComment: null,
    }
  },
  computed: {
    copyRuState() {
      return this.$store.getters['purchaseObject/getCopyRuState'].every((result) => result)
    },
    inputShelfGroups() {
      return this.$store.getters['purchaseObject/getInputShelfGroups']
    },
    purchaseObjects() {
      return this.$store.getters['purchaseObject/getPurchaseObjects']
    },
    activeShelfField() {
      return this.$store.getters['purchaseObject/getActiveShelfField']
    },
    numberOfDeliveriesCopy() {
      return this.$store.getters['purchaseObject/getNumberOfDeliveries']
    },
    costOfOneDeliveryCopy() {
      return this.$store.getters['purchaseObject/getCostOfOneDelivery']
    },
    purchaseCustomCopy() {
      return this.$store.getters['purchaseObject/getCurrentPurchase'].purchase_custom
    },
    ruRulesCopy() {
      return this.$store.getters['purchaseObject/getRuRules']
    },
    st1Rules() {
      return this.$store.getters['purchaseObject/getSt1Rules'] || { text: null, select: null }
    },
  },
  watch: {
    'purchaseCustom.delivery_term.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'delivery_term',
        child: 'text',
        value: newValue,
      })
    },
    'purchaseCustom.delivery_ru2.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'delivery_ru2',
        child: 'text',
        value: newValue,
      })
    },
    'purchaseCustom.delivery_time.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'delivery_time',
        child: 'text',
        value: newValue,
      })
    },
    'purchaseCustom.delivery_st1.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'delivery_st1',
        child: 'text',
        value: newValue,
      })
    },
    'purchaseCustom.delivery_count.manual'(newValue) {
      this.numberOfDeliveries = newValue
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'delivery_count',
        child: 'manual',
        value: newValue,
      })
    },
    'purchaseCustom.shelf_life.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'shelf_life',
        child: 'text',
        value: newValue,
      })
    },
    'purchaseCustom.thermal_mode.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'thermal_mode',
        child: 'text',
        value: newValue,
      })
    },
    'purchaseCustom.comment'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_CUSTOM', {
        field: 'comment',
        child: null,
        value: newValue,
      })
    },
    'ruRules.text'(newValue) {
      this.$store.commit('purchaseObject/UPDATE_RU_RULES', { field: 'text', value: newValue })
    },
    numberOfDeliveries(newValue) {
      this.$store.commit('purchaseObject/UPDATE_NUMBER_OF_DELIVERIES', newValue)
    },
    costOfOneDelivery(newValue) {
      this.$store.commit('purchaseObject/UPDATE_COST_OF_ON_DELIVERY', newValue)
    },
    numberOfDeliveriesCopy(newValue) {
      this.numberOfDeliveries = newValue
    },
    costOfOneDeliveryCopy(newValue) {
      this.costOfOneDelivery = newValue
    },
    purchaseCustomCopy(newValue) {
      this.purchaseCustom = newValue
    },
    ruRulesCopy(newValue) {
      this.ruRules = newValue
    },
  },
  created() {
    this.numberOfDeliveries = this.$store.getters['purchaseObject/getNumberOfDeliveries']
    this.costOfOneDelivery = this.$store.getters['purchaseObject/getCostOfOneDelivery']
    this.ruRules = { ...this.$store.getters['purchaseObject/getRuRules'] }
  },
  methods: {
    setRuRules(newValue) {
      this.$store.commit('purchaseObject/UPDATE_RU_RULES', { field: 'select', value: newValue })
    },
    setSt1Rules(newValue) {
      this.$store.commit('purchaseObject/UPDATE_ST1_RULES', { field: 'select', value: newValue })
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
    getCopyRuState() {
      if (this.copyRuState && this.ruRulesCopy.select === 'Копия РУ') return 'info'
      else if (!this.copyRuState && this.ruRulesCopy.select === 'Копия РУ') return 'danger'
      else return 'dark'
    },
  },
}
</script>
