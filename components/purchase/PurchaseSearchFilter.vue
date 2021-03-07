<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 5vh;'">
    <div class="d-flex w-100 justify-content-between align-items-center">
      <template v-if="source !== 'auto-selection'">
        <div class="d-flex align-items-center">
          <b-icon-bell-fill
            v-if="purchaseNotification && purchaseNotification.length"
            v-b-toggle.sidebar-purchase_notifications
            class="m-0 h5 mr-4 custom_button pointer"
            variant="info"
          ></b-icon-bell-fill>
          <b-icon-bell v-else class="m-0 h5 mr-4" variant="secondary"></b-icon-bell>
          <b-icon-arrow-down-circle
            v-if="fullnessPurchase"
            v-b-toggle.sidebar-auto-selection
            class="m-0 h5 mr-4 custom_button"
            variant="success"
          ></b-icon-arrow-down-circle>
          <b-icon-arrow-down-circle
            v-else
            class="m-0 h5 mr-4 custom_button"
            @click="
              addSuccessNotification(
                'Ошибка',
                'Заполните все объекты закупки, потребность товара в прайсах и подтвердите их автоподбор',
                'warning'
              )
            "
          ></b-icon-arrow-down-circle>
          <b-sidebar
            id="sidebar-auto-selection"
            bg-variant="gray-200"
            backdrop-variant="secondary"
            width="100%"
            backdrop
            right
            no-header
            shadow=""
            lazy
          >
            <template #default="{ hide }">
              <purchase-auto-selection :hide="hide" />
            </template>
          </b-sidebar>
          <b-icon-file-earmark-ruled
            v-b-toggle.sidebar-purchase_table-info
            class="m-0 h5 mr-4 custom_button pointer"
          ></b-icon-file-earmark-ruled>
          <b-icon-chat-left-text
            v-b-toggle.sidebar-purchase_messages
            class="m-0 h5 mr-4 custom_button pointer"
          ></b-icon-chat-left-text>
          <b-icon-menu-button-wide
            v-b-toggle.sidebar-customers_list
            class="m-0 h5 mr-4 custom_button pointer"
          ></b-icon-menu-button-wide>
          <b-dropdown
            v-if="currentPurchase.attachments && currentPurchase.attachments.attachment"
            size="md"
            variant="link"
            toggle-class="text-decoration-none p-0 custom_button"
            no-caret
          >
            <template v-slot:button-content>
              <b-icon-file-earmark-zip class="h5 m-0 pointer mr-4"></b-icon-file-earmark-zip>
            </template>
            <template>
              <div
                v-for="(link, key) in currentPurchase.attachments.attachment"
                :key="key"
                style="width: 180px"
                class="pointer d-flex flex-column px-2"
              >
                <a :href="link.url" target="_blank">{{ link.docDescription }}</a>
              </div>
            </template>
          </b-dropdown>
          <b-dropdown size="md" variant="link" toggle-class="text-decoration-none p-0 custom_button mr-4" no-caret>
            <template v-slot:button-content>
              <b-icon-file-earmark-arrow-down class="h5 m-0 pointer"></b-icon-file-earmark-arrow-down>
            </template>
            <template>
              <div class="d-flex flex-column px-2">
                <span
                  v-if="ruRules.select !== null"
                  class="pointer"
                  @click="
                    $root.$emit(
                      'downloadFile',
                      `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=application`
                    )
                  "
                  >Выгрузить заявку</span
                >
                <span
                  class="pointer"
                  @click="
                    $root.$emit(
                      'downloadFile',
                      `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=copy_ru`
                    )
                  "
                  >Выгрузить копии РУ</span
                >
                <span
                  class="pointer"
                  @click="
                    $root.$emit('downloadFile', `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=1`)
                  "
                  >Документ №1</span
                >
                <span
                  class="pointer"
                  @click="
                    $root.$emit('downloadFile', `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=2`)
                  "
                  >Документ №2</span
                >
                <span
                  class="pointer"
                  @click="
                    $root.$emit('downloadFile', `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=3`)
                  "
                  >Документ №3</span
                >
                <span
                  class="pointer"
                  @click="
                    $root.$emit('downloadFile', `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=4`)
                  "
                  >Документ №4</span
                >
                <span
                  class="pointer"
                  @click="
                    $root.$emit('downloadFile', `${API_URL}api/purchase/export_doc/${currentPurchase.uuid}?doc_num=all`)
                  "
                  >Выгрузить все документы</span
                >
              </div>
            </template>
          </b-dropdown>
          <b-icon-broadcast class="m-0 h4 pointer" @click="getBestOffers"></b-icon-broadcast>
        </div>
      </template>
      <div class="d-flex align-items-center">
        <div v-if="currentPurchase.is_manual" class="d-flex align-items-center mr-4">
          <b-icon-cash-stack
            id="max_price"
            class="pointer h4 m-0 mr-2"
            @click="changeMaxPriceControl"
          ></b-icon-cash-stack>
          <b-tooltip target="max_price" placement="left"> Начальная МЦК </b-tooltip>
          <span v-if="maxPriceControl" class="d-flex align-items-center">
            <b-input-group class="mr-1 filter">
              <b-form-input
                v-model="maxPrice"
                placeholder="Сумма"
                style="width: 80px"
                @blur="changeMaxPriceControl"
              ></b-form-input>
            </b-input-group>
            <span>₽</span>
          </span>
          <span v-else @click="changeMaxPriceControl">{{ $formatMoney(maxPrice) }} ₽</span>
        </div>
        <div v-else class="d-flex align-items-center mr-4">
          <b-icon-cash-stack id="max_price_2" class="h4 m-0 mr-2"></b-icon-cash-stack>
          <b-tooltip target="max_price_2" placement="left"> Начальная МЦК </b-tooltip>
          <span>{{ currentPurchase.max_price ? `${$formatMoney(currentPurchase.max_price)} ₽` : 'Укажите цену' }}</span>
        </div>
        <div class="d-flex align-items-center mr-4">
          <b-icon-credit-card id="purchase_value" class="h5 m-0 mr-2" variant="info"></b-icon-credit-card>
          <b-tooltip target="purchase_value" placement="left"> Закупочная цена </b-tooltip>
          <span>{{ $formatMoney(purchaseValue) }} ₽</span>
        </div>
        <div class="d-flex align-items-center mr-4">
          <b-icon-credit-card id="purchase_value_2" class="h5 m-0 mr-2" variant="danger"></b-icon-credit-card>
          <b-tooltip target="purchase_value_2" placement="left"> Рентабельная МЦК </b-tooltip>
          <span>{{ $formatMoney(purchaseValueZnvlp) }} ₽</span>
        </div>
        <div class="d-flex align-items-center mr-4">
          <b-icon-clipboard id="offer_position_value" class="h5 m-0 mr-2"></b-icon-clipboard>
          <b-tooltip target="offer_position_value" placement="left"> Цена нашего предложения </b-tooltip>
          <span>{{ $formatMoney(offerPositionValue) }} ₽</span>
        </div>
        <div
          v-if="
            purchaseType === 'fcsNotification111' ||
            (purchaseType === 'fcsNotificationZakA' && !contractGuaranteeAmount) ||
            purchase223.includes(purchaseType)
          "
          class="d-flex align-items-center mr-4"
        >
          <b-icon-briefcase class="h5 m-0 mr-2"></b-icon-briefcase>
          <span>н/д</span>
        </div>
        <div v-else-if="currentPurchase.is_manual" class="d-flex align-items-center mr-4">
          <b-icon-briefcase
            id="guarantee_amount"
            class="pointer h5 m-0 mr-2"
            @click="changeContractGuaranteeAmountControl"
          ></b-icon-briefcase>
          <b-tooltip target="guarantee_amount" placement="left">Обеспечение контракта </b-tooltip>
          <span v-if="contractGuaranteeAmountControl" class="d-flex align-items-center">
            <b-input-group class="mr-1 filter">
              <b-form-input
                v-model="contractGuaranteeAmount"
                placeholder="Сумма"
                style="width: 80px"
                @blur="changeContractGuaranteeAmountControl"
              ></b-form-input>
            </b-input-group>
            <span>₽</span>
          </span>
          <span v-else @click="changeContractGuaranteeAmountControl"
            >{{ $formatMoney(contractGuaranteeAmount) }} ₽</span
          >
        </div>
        <div v-else class="d-flex align-items-center mr-4">
          <b-icon-briefcase id="guarantee_amount_2" class="h5 m-0 mr-2"></b-icon-briefcase>
          <b-tooltip target="guarantee_amount_2" placement="left"> Обеспечение контракта </b-tooltip>
          <span
            >{{
              currentPurchase.contract_guarantee_amount
                ? `${$formatMoney(currentPurchase.contract_guarantee_amount)} ₽`
                : '0 ₽'
            }}
          </span>
        </div>
        <div
          v-if="purchaseType === 'fcsNotification111' || purchaseType === 'fcsNotificationZakA'"
          class="d-flex align-items-center mr-4"
        >
          <b-icon-wallet class="h5 m-0 mr-2"></b-icon-wallet>
          <span>н/д</span>
        </div>
        <div
          v-else-if="currentPurchase.is_manual || purchase223.includes(purchaseType)"
          class="d-flex align-items-center mr-4"
        >
          <b-icon-wallet
            id="guarantee_amount_app"
            class="pointer h5 m-0 mr-2"
            @click="changeApplicationGuaranteeAmountControl"
          ></b-icon-wallet>
          <b-tooltip target="guarantee_amount_app" placement="left"> Обеспечение заявки </b-tooltip>
          <span v-if="applicationGuaranteeAmountControl" class="d-flex align-items-center">
            <b-input-group class="mr-1 filter">
              <b-form-input
                v-model="applicationGuaranteeAmount"
                placeholder="Сумма"
                style="width: 80px"
                @blur="changeApplicationGuaranteeAmountControl"
              ></b-form-input>
            </b-input-group>
            <span>₽</span>
          </span>
          <span v-else @click="changeApplicationGuaranteeAmountControl"
            >{{ $formatMoney(applicationGuaranteeAmount) }} ₽</span
          >
        </div>
        <div v-else class="d-flex align-items-center mr-4">
          <b-icon-wallet id="guarantee_amount_app_2" class="h5 m-0 mr-2"></b-icon-wallet>
          <b-tooltip target="guarantee_amount_app_2" placement="left"> Обеспечение заявки </b-tooltip>
          <span>{{
            currentPurchase.application_guarantee_amount
              ? `${$formatMoney(currentPurchase.application_guarantee_amount)} ₽`
              : '0 ₽'
          }}</span>
        </div>
        <div class="d-flex align-items-center mr-4">
          <b-icon-droplet-half id="trading_place_comis" class="h5 m-0 mr-2"></b-icon-droplet-half>
          <b-tooltip target="trading_place_comis" placement="left"> Комиссия торговой площадки </b-tooltip>
          <span>{{ $formatMoney(tradingPlaceComis) }} ₽</span>
        </div>
        <div class="d-flex align-items-center mr-4">
          <b-icon-inboxes id="doc_delivery" class="h5 m-0 mr-2"></b-icon-inboxes>
          <b-tooltip target="doc_delivery" placement="left"> Доставка документов </b-tooltip>
          <span class="d-flex align-items-center">
            {{
              $formatMoney(
                numberOfDeliveries * costOfOneDelivery * (deliveryPointersCounter ? deliveryPointersCounter : 1)
              )
            }}
            ₽
          </span>
        </div>
        <div class="d-flex align-items-center mr-3">
          <b-icon-truck id="delivery" class="pointer h5 m-0 mr-2 custom_button" @click="setAutoDelivery">
          </b-icon-truck>
          <b-tooltip target="delivery" placement="left"> Доставка груза </b-tooltip>
          <span v-if="deliveryControl" class="d-flex align-items-center">
            <b-input-group class="mr-1 filter">
              <b-form-input
                v-model.number="delivery"
                placeholder="Сумма"
                style="width: 80px"
                @blur="changeDeliveryControl"
              ></b-form-input>
            </b-input-group>
            <span>₽</span>
          </span>
          <div v-else-if="delivery">
            <span style="color: green" @click="changeDeliveryControl">{{ $formatMoney(delivery) }}</span>
            <span>₽</span>
          </div>
          <span v-else @click="changeDeliveryControl">{{ $formatMoney(deliveryAuto) }} ₽</span>
        </div>
        <div class="d-flex align-items-center flex-row mr-2">
          <b-icon-credit-card2-front id="porog_price" class="h5 m-0" variant="info"></b-icon-credit-card2-front>
          <b-tooltip target="porog_price" placement="left"> Пороговая цена </b-tooltip>
          <span class="ml-2">{{ $formatMoney(porogPrice) }} ₽</span>
        </div>
      </div>
      <div class="d-flex align-items-center">
        <b-icon-people-fill
          v-if="currentPurchase.responsible_role === 'OCU' || currentPurchase.responsible_role === 'ORA'"
          class="h4 m-0 s mr-4"
          variant="info"
        ></b-icon-people-fill>
        <b-icon-exclamation-triangle
          class="h4 m-0 mr-4"
          :variant="
            narcoticModeDanger
              ? narcoticModeDanger
              : narcoticModeSecondary
              ? narcoticModeSecondary
              : narcoticModeSuccess
              ? narcoticModeSuccess
              : 'secondary'
          "
        ></b-icon-exclamation-triangle>
        <b-icon-heart-fill v-if="isZnvlpPurchase" variant="danger" class="h5 m-0 mr-4"></b-icon-heart-fill>
        <b-icon-heart v-else class="h5 m-0 mr-4"></b-icon-heart>
        <b-icon-thermometer id="thermo" class="h4 m-0 mr-4" :variant="thermoMode"></b-icon-thermometer>
        <b-tooltip target="thermo" placement="left">
          {{ thermoModeHint }}
        </b-tooltip>
        <b-icon-lightning-fill
          v-if="preferences"
          variant="info"
          class="h5 m-0 pointer mr-4"
          @click="tooglePreferences"
        ></b-icon-lightning-fill>
        <b-icon-lightning-fill
          v-else
          variant="warning"
          class="h5 m-0 pointer mr-4"
          @click="tooglePreferences"
        ></b-icon-lightning-fill>
        <div id="profit-icon" class="d-flex">
          <b-icon-graph-up v-if="isProfitability" variant="success" class="h4 m-0"></b-icon-graph-up>
          <b-icon-graph-up v-else-if="netProfitException" variant="indigo" class="h4 m-0"></b-icon-graph-up>
          <b-icon-graph-down v-else variant="danger" class="h4 m-0"></b-icon-graph-down>
        </div>
        <b-tooltip target="profit-icon" placement="left">
          <div class="d-flex flex-column">
            <div class="d-flex mb-2">
              <span class="mr-1">Чистая прибыль:</span>
              <span>{{ $formatMoney(netProfit) }} ₽</span>
            </div>
            <div class="d-flex">
              <span class="mr-1">% рентабельности:</span>
              <span>{{ $formatMoney(profitability) }} %</span>
            </div>
          </div>
        </b-tooltip>
      </div>
    </div>
    <b-sidebar
      id="sidebar-purchase_messages"
      bg-variant="gray-200"
      backdrop-variant="secondary"
      width="35%"
      backdrop
      right
      shadow=""
      lazy
      @shown="fetchPurchaseComments"
    >
      <purchase-messages></purchase-messages>
    </b-sidebar>
    <b-sidebar id="sidebar-shelf_life" bg-variant="gray-200" backdrop-variant="secondary" backdrop right shadow="" lazy>
      <purchase-shelf-life></purchase-shelf-life>
    </b-sidebar>
    <b-sidebar
      id="sidebar-customers_list"
      bg-variant="gray-200"
      backdrop-variant="secondary"
      width="70%"
      backdrop
      right
      shadow=""
      lazy
    >
      <purchase-customers-counter></purchase-customers-counter>
    </b-sidebar>
    <b-sidebar
      id="sidebar-purchase_table-info"
      bg-variant="gray-200"
      backdrop-variant="secondary"
      width="100%"
      backdrop
      right
      shadow=""
      lazy
    >
      <purchase-info-table></purchase-info-table>
    </b-sidebar>
    <b-sidebar
      id="sidebar-purchase_notifications"
      bg-variant="gray-200"
      backdrop-variant="secondary"
      width="35%"
      backdrop
      right
      shadow=""
      lazy
    >
      <purchase-notifications></purchase-notifications>
    </b-sidebar>
  </div>
</template>

<script>
import PurchaseShelfLife from './PurchaseShelfLife'
import PurchaseCustomersCounter from './PurchaseCustomersCounter'
import PurchaseMessages from './PurchaseMessages'
import PurchaseInfoTable from './PurchaseInfoTable'
import PurchaseNotifications from './PurchaseNotifications'
import PurchaseAutoSelection from './PurchaseAutoSelection'
export default {
  name: 'PurchaseSearchFilter',
  components: {
    PurchaseAutoSelection,
    PurchaseNotifications,
    PurchaseInfoTable,
    PurchaseMessages,
    PurchaseCustomersCounter,
    PurchaseShelfLife,
  },
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      deliveryControl: false,
      maxPriceControl: false,
      contractGuaranteeAmountControl: false,
      applicationGuaranteeAmountControl: false,
      delivery: null,
      maxPrice: null,
      contractGuaranteeAmount: null,
      applicationGuaranteeAmount: null,
      docsDelivery: 0,
      preferences: false,
      API_URL: null,
    }
  },
  computed: {
    purchase223() {
      return this.$store.getters['purchase/getPurchase223'] || []
    },
    fullnessPurchase() {
      return this.$store.getters['purchaseObject/getFullnessPurchaseInfo'] || false
    },
    netProfitException() {
      return (
        (this.currentPurchase.max_price >= 20000 &&
          this.currentPurchase.max_price <= 25000 &&
          this.netProfit >= 9000) ||
        (this.currentPurchase.max_price >= 15000 &&
          this.currentPurchase.max_price <= 20000 &&
          this.netProfit >= 7500) ||
        (this.currentPurchase.max_price >= 10000 &&
          this.currentPurchase.max_price <= 15000 &&
          this.netProfit >= 6000) ||
        (this.currentPurchase.max_price >= 7000 && this.currentPurchase.max_price <= 10000 && this.netProfit >= 5000)
      )
    },
    purchaseType() {
      return this.$store.getters['purchaseObject/getCurrentPurchase'].purchase_custom.fcs_type
    },
    deliveryPointersCounter() {
      const result = this.$store.getters['purchaseObject/getKladrIds']
      return result && result.length ? result.length : 0
    },
    purchaseNotification() {
      return this.$store.getters['purchaseObject/getCurrentPurchaseNotifications']
    },
    ruRules() {
      return this.$store.getters['purchaseObject/getRuRules']
    },
    narcoticModeDanger() {
      return this.$store.getters['purchaseObject/getNarcoticMode'].find((variant) => variant === 'danger')
    },
    narcoticModeSuccess() {
      return this.$store.getters['purchaseObject/getNarcoticMode'].find((variant) => variant === 'success')
    },
    narcoticModeSecondary() {
      return this.$store.getters['purchaseObject/getNarcoticMode'].find((variant) => variant === 'secondary')
    },
    thermoModeDanger() {
      return this.$store.getters['purchaseObject/getThermoMode'].find((variant) => variant === 'danger')
    },
    thermoModeInfo() {
      return this.$store.getters['purchaseObject/getThermoMode'].find((variant) => variant === 'info')
    },
    thermoModeSuccess() {
      return this.$store.getters['purchaseObject/getThermoMode'].find((variant) => variant === 'success')
    },
    thermoMode() {
      return this.thermoModeDanger
        ? this.thermoModeDanger
        : this.thermoModeInfo
        ? this.thermoModeInfo
        : this.thermoModeSuccess
        ? this.thermoModeSuccess
        : 'secondary'
    },
    thermoModeHint() {
      let hint = null
      switch (this.thermoMode) {
        case 'danger':
          hint = 'Термо есть'
          break
        case 'info':
          hint = 'Не замораживать'
          break
        case 'success':
          hint = 'Термо нет'
          break
        case 'secondary':
          hint = 'Терморежим отсутствует'
          break
      }
      return hint
    },
    inputShelfGroups() {
      return this.$store.getters['purchaseObject/getInputShelfGroups']
    },
    purchaseObjects() {
      return this.$store.getters['purchaseObject/getPurchaseObjects']
    },
    deliveryAuto() {
      return this.$store.getters['purchaseObject/getDeliveryAuto']
    },
    applicationGuaranteeAmountCopy() {
      return this.$store.getters['purchaseObject/getApplicationGuaranteeAmount']
    },
    contractGuaranteeAmountCopy() {
      return this.$store.getters['purchaseObject/getContractGearanteeAmount']
    },
    maxPriceCopy() {
      return this.$store.getters['purchaseObject/getMaxPrice']
    },
    numberOfDeliveries() {
      return this.$store.getters['purchaseObject/getNumberOfDeliveries']
    },
    costOfOneDelivery() {
      return this.$store.getters['purchaseObject/getCostOfOneDelivery']
    },
    allDeliveryConst() {
      return this.numberOfDeliveries * this.deliveryPointersCounter * this.costOfOneDelivery
    },
    uniqueProviders() {
      if (this.$store.getters['purchaseObject/getUniqueProviders'].length) {
        const array = this.$store.getters['purchaseObject/getUniqueProviders']
          .filter((seller) => seller)
          .reduce(function (preVal, seller) {
            return preVal.concat(seller)
          }, [])
        const result = []
        for (const str of array) {
          if (!result.includes(str)) {
            result.push(str)
          }
        }
        return result.length
      } else return 0
    },
    deliveryCopy() {
      return this.$store.getters['purchaseObject/getDelivery']
    },
    preferencesCopy() {
      return this.$store.getters['purchaseObject/getPreferences']
    },
    docsDeliveryCopy() {
      return this.$store.getters['purchaseObject/getDocsDelivery']
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
    currentPurchaseObjectsPrice() {
      return this.$store.getters['purchaseObject/getPurchaseObjectsPrice']
    },
    priceObjectsLength() {
      let result = 0
      this.$store.getters['purchaseObject/getPurchaseObjectsPrice'].map(function (purchaseObject) {
        if (purchaseObject.price_objects) result += purchaseObject.price_objects.length
      })
      return result
    },
    isZnvlpPurchase() {
      return JSON.parse(JSON.stringify(this.$store.getters['purchaseObject/getZnvlpPurchaseStatus']))
    },
    tradingPlaceComis() {
      let maxComis = 6000
      const onePercent = this.currentPurchase.max_price * 0.01
      if (this.currentPurchase.is_mb44330) {
        maxComis = 2400
      } else if (this.currentPurchase.etp_code === 'ETP_SBAST') {
        maxComis = 2000
      }
      if (onePercent > maxComis) return maxComis
      else return onePercent.toFixed(2)
    },
    purchaseValue() {
      return this.$store.getters['purchaseObject/getPurchaseValue']
        .reduce(function (preVal, value) {
          return preVal + value
        }, 0)
        .toFixed(2)
    },
    purchaseValueZnvlp() {
      return this.isZnvlpPurchase
        ? this.$store.getters['purchaseObject/getPurchaseValueZnvlp']
            .reduce(function (preVal, value) {
              return preVal + value
            }, 0)
            .toFixed(2)
        : 0
    },
    offerPositionValue() {
      return this.$store.getters['purchaseObject/getOfferPositionValue']
        .reduce(function (preVal, value) {
          return preVal + value
        }, 0)
        .toFixed(2)
    },
    deliveryValue() {
      return this.delivery ? this.delivery : this.deliveryAuto
    },
    allowance() {
      return (
        Number(this.purchaseValue) +
        Number(this.tradingPlaceComis) +
        Number(this.deliveryValue) +
        Number(this.allDeliveryConst)
      )
    },
    valueAllowance() {
      return this.allowance < 20000 ? 7000 : 10000
    },
    netProfit() {
      if (this.currentPurchase.max_price > this.purchaseValueZnvlp && this.purchaseValueZnvlp > 0.01)
        return this.purchaseValueZnvlp - this.allowance
      else return this.currentPurchase.max_price - this.allowance
    },
    // profitability() {
    //   if (this.isZnvlpPurchase) {
    //     if (this.purchaseValueZnvlp > 0.01 && this.currentPurchase.max_price > this.purchaseValueZnvlp) {
    //       return ((this.purchaseValueZnvlp / this.allowance - 1) * 100).toFixed(2)
    //     } else if (this.allowance > 0.01) {
    //       return ((Number(this.currentPurchase.max_price) / (Number(this.allowance) - 1)) * 100).toFixed(2) - 100
    //     } else return 0
    //   } else return ((Number(this.currentPurchase.max_price) / (Number(this.allowance) - 1)) * 100).toFixed(2) - 100
    // },
    profitability() {
      if (this.isZnvlpPurchase) {
        if (this.purchaseValueZnvlp > 0.01 && this.currentPurchase.max_price > this.purchaseValueZnvlp) {
          return ((this.netProfit / this.purchaseValueZnvlp) * 100).toFixed(2)
        } else return ((this.netProfit / this.currentPurchase.max_price) * 100).toFixed(2)
      } else return ((this.netProfit / this.currentPurchase.max_price) * 100).toFixed(2)
    },
    porogPriceWithoutPreferences() {
      return (
        (1.06 +
          (1 / this.allowance) * this.valueAllowance * 1.2 +
          (this.numberOfDeliveries *
            (this.deliveryPointersCounter ? this.deliveryPointersCounter : 1) *
            (this.allowance > 100000 ? 1 + (1 / (this.allowance - 70000)) * 10000 * 3 : 2) +
            this.uniqueProviders +
            this.priceObjectsLength * 0.3) /
            100) *
        this.allowance
      ).toFixed(2)
    },
    porogPriceWithPreferences() {
      return (this.porogPriceWithoutPreferences / 0.85).toFixed(2)
    },
    porogPrice() {
      return this.preferences ? this.porogPriceWithPreferences : this.porogPriceWithoutPreferences
    },
    isProfitability() {
      if (Number(this.purchaseValueZnvlp) === 0) {
        return Number(this.porogPrice) < Number(this.currentPurchase.max_price)
      } else if (Number(this.purchaseValueZnvlp) > 0) {
        if (Number(this.currentPurchase.max_price) < Number(this.purchaseValueZnvlp))
          return Number(this.porogPrice) < Number(this.currentPurchase.max_price)
        else return Number(this.porogPrice) < Number(this.purchaseValueZnvlp)
      } else return false
    },
  },
  watch: {
    docsDelivery(newValue) {
      this.$store.commit('purchaseObject/UPDATE_DOCS_DELIVERY', newValue)
    },
    delivery(newValue) {
      this.$store.commit('purchaseObject/UPDATE_DELIVERY', newValue)
    },
    docsDeliveryCopy(newValue) {
      if (newValue) this.docsDelivery = newValue
      else this.docsDelivery = null
    },
    deliveryCopy(newValue) {
      this.delivery = newValue
    },
    preferencesCopy(newValue) {
      this.preferences = newValue
    },
    porogPrice(newValue) {
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', { field: 'porog_price', value: newValue })
    },
    profitability(newValue) {
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', { field: 'profitability', value: newValue })
    },
    netProfitException(newValue) {
      this.$store.commit('purchaseObject/SAVE_NET_PROFIT_VALUE', newValue)
    },
    isProfitability(newValue) {
      this.$store.commit('purchaseObject/SAVE_CURRENT_PURCHASE_PROFITABILITY', newValue)
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', { field: 'is_profitability', value: newValue })
    },
    purchaseValueZnvlp(newValue) {
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', {
        field: 'price_require_znvlp',
        value: newValue,
      })
    },
    purchaseValue(newValue) {
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', {
        field: 'price_require',
        value: newValue,
      })
    },
    preferences(newValue) {
      this.$store.commit('purchaseObject/SAVE_PURCHASE_COMPUTED_DATA', {
        field: 'is_preferences',
        value: newValue,
      })
    },
    currentPurchase(newValue) {
      this.maxPrice = newValue.max_price
      this.contractGuaranteeAmount = newValue.contract_guarantee_amount
      this.applicationGuaranteeAmount = newValue.application_guarantee_amount
    },
    maxPriceCopy(newValue) {
      this.maxPrice = newValue
    },
    contractGuaranteeAmountCopy(newValue) {
      this.contractGuaranteeAmount = newValue
    },
    applicationGuaranteeAmountCopy(newValue) {
      this.applicationGuaranteeAmount = newValue
    },
  },
  created() {
    this.API_URL = process.env.API_URL

    this.docsDelivery = this.$store.getters['purchaseObject/getDocsDelivery']
    this.delivery = this.$store.getters['purchaseObject/getDelivery']
    this.preferences = this.$store.getters['purchaseObject/getPreferences']
    this.maxPrice = this.$store.getters['purchaseObject/getMaxPrice']
  },
  methods: {
    changeDeliveryDocControl() {
      this.deliveryDocControl = !this.deliveryDocControl
    },
    changeDeliveryControl() {
      this.deliveryControl = !this.deliveryControl
    },
    changeContractGuaranteeAmountControl() {
      this.contractGuaranteeAmountControl = !this.contractGuaranteeAmountControl
      if (!this.contractGuaranteeAmountControl)
        this.$store.commit('purchaseObject/UPDATE_CONTRACT_GUARANTEE_AMOUNT', this.contractGuaranteeAmount)
    },
    changeApplicationGuaranteeAmountControl() {
      this.applicationGuaranteeAmountControl = !this.applicationGuaranteeAmountControl
      if (!this.applicationGuaranteeAmountControl)
        this.$store.commit('purchaseObject/UPDATE_APPLICATION_GUARANTEE_AMOUNT', this.applicationGuaranteeAmount)
    },
    changeMaxPriceControl() {
      this.maxPriceControl = !this.maxPriceControl
      if (!this.maxPriceControl) this.$store.commit('purchaseObject/UPDATE_PURCHASE_MAX_PRICE', this.maxPrice)
    },
    tooglePreferences() {
      this.$store.commit('purchaseObject/UPDATE_PREFERENCES')
    },
    setAutoDelivery() {
      this.$store.dispatch('purchaseObject/updatePurchase', { uuid: this.currentPurchase.uuid, flag: true })
      this.delivery = null
    },
    fetchPurchaseComments() {
      this.$store.dispatch('purchaseObject/fetchPurchaseMessages', this.currentPurchase.uuid)
    },
    getBestOffers() {
      this.$store.dispatch('purchaseObject/updatePurchase', { uuid: this.currentPurchase.uuid, best_offer: true })
    },
    addSuccessNotification(title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant,
        appendToast: false,
      })
    },
  },
}
</script>
