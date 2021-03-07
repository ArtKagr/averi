<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex justify-content-between h-5 w-100 align-items-center pl-4 pr-3 mb-3">
      <span class="h5 m-0">Объект закупки № {{ row.index }}</span>
      <div class="d-flex align-items-center">
        <b-icon-folder-check class="m-0 h4 mr-4 pointer" variant="success" @click="saveHideSidebar(row.item)" />
        <b-icon-x class="m-0 h4 pointer" @click="hideSideBar" />
      </div>
    </div>
    <div class="d-flex flex-column h-35 w-100 overflow-hidden" style="border-bottom: 1px solid gray">
      <div class="d-flex w-100 pb-2">
        <span class="h5 w-35 mb-2 pl-4">МНН</span>
        <div class="d-flex align-self-start w-65">
          <b-input-group class="filter pr-3">
            <b-form-input
              v-model="purchaseMnn"
              :placeholder="row.item.mnn ? row.item.mnn : 'Выберите значение'"
            ></b-form-input>
            <b-input-group-append>
              <b-button v-if="purchaseMnn" size="sm" variant="info" @click="clearMnn">X</b-button>
              <b-button v-else size="sm" variant="secondary">X</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <div class="d-flex align-self-end overflow-hidden flex-column bg-green-100 w-100">
        <div class="overflow-auto w-100">
          <div
            v-for="(mnn, key) in mnnList"
            :key="key"
            class="py-1 mx-2 pointer"
            style="border-bottom: 1px solid #ced4da"
            @click="updatePurchaseObject(row.item, 'mnn', mnn)"
          >
            <div class="d-flex justify-content-between mb-1" style="font-size: 12px; width: 400px">
              {{ mnn.mnn }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column h-30 w-100 overflow-hidden" style="border-bottom: 1px solid gray">
      <div class="d-flex w-100 pt-3 pb-2">
        <span class="h5 w-35 mr-2 pl-4">Лек. форма</span>
        <div class="d-flex align-self-start w-65">
          <b-input-group class="filter pr-3">
            <b-form-input
              v-model="purchaseLfName"
              :placeholder="row.item.form_name ? row.item.form_name : 'Укажите значение'"
            ></b-form-input>
            <b-input-group-append>
              <b-button v-if="purchaseLfName" size="sm" variant="info" @click="clearLfName">X</b-button>
              <b-button v-else size="sm" variant="secondary">X</b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <div class="d-flex align-self-end overflow-hidden flex-column bg-green-100 w-100">
        <div class="overflow-auto w-100">
          <div
            v-for="(lfName, key) in lfList"
            :key="key"
            class="py-1 mx-2 pointer"
            style="border-bottom: 1px solid #ced4da"
            @click="updatePurchaseObject(row.item, 'form_name', lfName)"
          >
            <div class="d-flex justify-content-between mb-1" style="font-size: 12px">
              <span style="width: 400px">{{ lfName.form }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column h-13 w-100 overflow-hidden" style="border-bottom: 1px solid gray">
      <div class="d-flex px-4 w-100 py-2">
        <span class="h5 w-35 mb-2">Ед. измерения</span>
        <div class="text-right w-65 pr-3" style="font-size: 16px">
          {{
            row.item.okei_code && currentOkei(row.item.okei_code) && currentOkei(row.item.okei_code).local_name
              ? currentOkei(row.item.okei_code).local_name
              : 'Выберите значение'
          }}
        </div>
      </div>
      <div class="d-flex w-100 overflow-hidden flex-column bg-green-100 w-100">
        <div class="d-flex justify-content-between overflow-auto w-100 px-4">
          <div
            v-for="(okeiItem, key) in okeiList"
            :key="key"
            class="py-4 mx-2 pointer"
            style="border-bottom: 1px solid #ced4da"
            @click="updatePurchaseObject(row.item, 'okei_code', okeiItem)"
          >
            <div class="d-flex justify-content-between mb-1" style="font-size: 12px">
              {{ okeiItem.local_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex h-5 w-100 align-items-center" style="border-bottom: 1px solid gray">
      <div class="d-flex px-4 w-100">
        <span class="d-flex h5 w-35 mr-2">Дозировка</span>
        <b-form-input
          v-model="row.item.dosage_grls_value"
          class="filter w-65"
          placeholder="Введите значение"
          @change="updatePurchaseObject(row.item, 'dosage_grls_value')"
        ></b-form-input>
      </div>
    </div>
    <div class="d-flex h-5 w-100 align-items-center" style="border-bottom: 1px solid gray">
      <div class="d-flex px-4 w-100 py-4">
        <span class="h5 w-35 mr-2">Количество</span>
        <b-form-input
          v-model="row.item.drug_quantity"
          class="filter w-65"
          placeholder="Введите значение"
          @change="updatePurchaseObject(row.item, 'drug_quantity')"
        ></b-form-input>
      </div>
    </div>
    <div class="d-flex h-5 w-100 align-items-center" style="border-bottom: 1px solid gray">
      <div class="d-flex px-4 w-100">
        <span class="d-flex h5 w-35 mr-2">НМЦ объекта</span>
        <b-form-input
          v-model="row.item.position_price"
          class="filter w-65"
          placeholder="Введите значение"
          @change="updatePurchaseObject(row.item, 'position_price')"
        ></b-form-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseObjectControl',
  props: {
    row: {
      type: Object,
      default: null,
    },
    hide: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      purchaseMnn: null,
      purchaseLfName: null,
    }
  },
  computed: {
    currentPurchase() {
      return this.$store.state.purchaseObject.currentPurchase
    },
    mnnList() {
      return this.$store.getters['dictionaries/getMnnList']
    },
    lfList() {
      return this.$store.getters['dictionaries/getLfList']
    },
    okeiList() {
      return this.$store.getters['dictionaries/getOkeiList']
    },
  },
  watch: {
    purchaseMnn(newValue) {
      this.$store.commit('dictionaries/UPDATE_MNN_LIST', newValue)
    },
    purchaseLfName(newValue) {
      this.$store.commit('dictionaries/UPDATE_LF_LIST', newValue)
    },
  },
  destroyed() {
    this.$store.commit('dictionaries/UPDATE_MNN_LIST', null)
    this.$store.commit('dictionaries/UPDATE_LF_LIST', null)
  },
  methods: {
    updatePurchaseObject(updatedPurchaseObject, field, value) {
      if (field === 'mnn') {
        updatedPurchaseObject.mnn = value.mnn
        this.purchaseMnn = null
      } else if (field === 'form_name') {
        updatedPurchaseObject.form_name = value.form
        this.purchaseLfName = null
      } else if (field === 'okei_code') {
        updatedPurchaseObject.okei_code = value.okei_code
      }
    },
    currentOkei(okeiCode) {
      return this.$store.getters['dictionaries/getCurrentOkei'](okeiCode)
    },
    clearMnn() {
      this.purchaseMnn = null
    },
    clearLfName() {
      this.purchaseLfName = null
    },
    saveHideSidebar(updatedPurchaseObject) {
      this.$store.commit('purchaseObject/UPDATE_PURCHASE_OBJECT', updatedPurchaseObject)
      this.$store.dispatch('purchaseObject/updatePurchase', this.currentPurchase.uuid)
      this.hide()
    },
    hideSideBar() {
      this.hide()
    },
  },
}
</script>
