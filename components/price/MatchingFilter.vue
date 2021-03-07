<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 4vh;'">
    <div v-if="source !== 'expanded-ru'">
      <b-icon-chevron-up class="pointer h4 m-0" @click="heightControl('up')"> </b-icon-chevron-up>
      <b-icon-chevron-down class="pointer h4 m-0" @click="heightControl('down')"> </b-icon-chevron-down>
    </div>
    <b-input-group class="filter -large">
      <b-form-input v-model="filter.mnn" placeholder="МНН"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.mnn ? 'info' : 'secondary'" @click="clearFilter('mnn')">X</b-button>
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-if="source !== 'expanded-ru'" class="filter -small">
      <b-form-input v-model="filter.lf_name" placeholder="Лекарственная форма"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.lf_name ? 'info' : 'secondary'" @click="clearFilter('lf_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-else class="filter -small">
      <b-form-input v-model="filter.lf_norm_name" placeholder="Лекарственная форма"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.lf_norm_name ? 'info' : 'secondary'" @click="clearFilter('lf_norm_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-if="source !== 'expanded-ru'" class="filter -small">
      <b-form-input v-model="filter.dosage_name" placeholder="Дозировка"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.dosage_name ? 'info' : 'secondary'" @click="clearFilter('dosage_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-else class="filter -small">
      <b-form-input v-model="filter.dosage_norm_name" placeholder="Дозировка"></b-form-input>
      <b-input-group-append>
        <b-button
          size="sm"
          :variant="filter.dosage_norm_name ? 'info' : 'secondary'"
          @click="clearFilter('dosage_norm_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-if="source !== 'expanded-ru'" class="filter -small">
      <b-form-input v-model="filter.num_reg" placeholder="Регистрационное удостоверение"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.num_reg ? 'info' : 'secondary'" @click="clearFilter('num_reg')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-if="source !== 'expanded-ru'" class="filter -small">
      <b-form-input v-model="filter.manufacturer_name" placeholder="Производитель"></b-form-input>
      <b-input-group-append>
        <b-button
          size="sm"
          :variant="filter.manufacturer_name ? 'info' : 'secondary'"
          @click="clearFilter('manufacturer_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group class="filter -small">
      <b-form-input v-model="filter.pack_sum" placeholder="Общее количество"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.pack_sum ? 'info' : 'secondary'" @click="clearFilter('pack_sum')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-if="source === 'expanded-ru'" class="filter -medium">
      <b-form-input v-model="filter.trade_name" placeholder="Торговое наименование"></b-form-input>
      <b-input-group-append>
        <b-button size="sm" :variant="filter.trade_name ? 'info' : 'secondary'" @click="clearFilter('trade_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <b-input-group v-if="source === 'expanded-ru'" class="filter -medium">
      <b-form-input v-model="filter.manufacturer_country_name" placeholder="Страна происх."></b-form-input>
      <b-input-group-append>
        <b-button
          size="sm"
          :variant="filter.manufacturer_country_name ? 'info' : 'secondary'"
          @click="clearFilter('manufacturer_country_name')"
          >X</b-button
        >
      </b-input-group-append>
    </b-input-group>
    <div class="d-flex align-items-center">
      <template v-if="source !== 'expanded-ru'">
        <b-icon-eye v-if="matchedPriceFilter.is_active" class="h4 m-0 mr-3 pointer" @click="setActiveSmnnRoute">
        </b-icon-eye>
        <b-icon-eye-slash v-else class="h4 m-0 mr-3 pointer" @click="setActiveSmnnRoute"> </b-icon-eye-slash>
      </template>
      <div v-if="source !== 'expanded-ru'">
        <b-dropdown
          v-if="Object.keys(selectedKlp).length"
          size="lg"
          variant="link"
          toggle-class="text-decoration-none p-0"
          no-caret
        >
          <template v-slot:button-content>
            <b-icon-file-earmark-minus
              v-if="selectedKlp.ru_file"
              variant="warning"
              class="h4 pointer m-0"
            ></b-icon-file-earmark-minus>
            <b-icon-file-earmark-plus v-else variant="success" class="h4 pointer m-0"></b-icon-file-earmark-plus>
          </template>
          <upload-files source="ru_file" />
        </b-dropdown>
        <b-icon-file-earmark v-else class="h4 m-0"></b-icon-file-earmark>
      </div>
    </div>
  </div>
</template>

<script>
import UploadFiles from '../UploadFiles'
export default {
  name: 'MatchingFilter',
  components: { UploadFiles },
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      filter: {
        mnn: null,
        lf_name: null,
        lf_norm_name: null,
        dosage_name: null,
        dosage_norm_name: null,
        trade_name: null,
        num_reg: null,
        manufacturer_name: null,
        manufacturer_country_name: null,
        is_active: true,
        pack_sum: null,
      },
    }
  },
  computed: {
    expandedRu() {
      return this.$store.getters['price/getExpandedRu']
    },
    matchedPriceFilter() {
      return this.$store.state.price.matchedPriceFilter
    },
    currentExpandedPriceFilter() {
      return this.$store.getters['price/getExpandedPriceFilter']
    },
    blockHeight() {
      return this.$store.state.price.blockHeight
    },
    selectedKlp() {
      return this.$store.getters['price/getSelectedKlp']
    },
    matchedStep() {
      return this.$store.state.price.matchedStep
    },
    ruFile() {
      return this.$store.state.price.ruFile
    },
    addonKlp() {
      return this.$store.getters['price/getAddonKlp']
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
  },
  watch: {
    matchedPriceFilter: {
      handler(newFilter) {
        this.filter = Object.assign(this.filter, newFilter)
        this.matchingSteps(newFilter)
      },
      deep: true,
    },
    'filter.mnn'(newValue) {
      if (this.source !== 'expanded-ru') {
        this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
          field_name: 'mnn',
          new_value: newValue,
        })
      } else {
        this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
          field_name: 'mnn',
          new_value: newValue,
        })
      }
    },
    'filter.lf_name'(newValue) {
      this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
        field_name: 'lf_name',
        new_value: newValue,
      })
    },
    'filter.lf_norm_name'(newValue) {
      this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
        field_name: 'lf_norm_name',
        new_value: newValue,
      })
    },
    'filter.dosage_name'(newValue) {
      this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
        field_name: 'dosage_name',
        new_value: newValue,
      })
    },
    'filter.dosage_norm_name'(newValue) {
      this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
        field_name: 'dosage_norm_name',
        new_value: newValue,
      })
    },
    'filter.num_reg'(newValue) {
      this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
        field_name: 'num_reg',
        new_value: newValue,
      })
    },
    'filter.manufacturer_name'(newValue) {
      this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
        field_name: 'manufacturer_name',
        new_value: newValue,
      })
    },
    'filter.pack_sum'(newValue) {
      if (this.source !== 'expanded-ru') {
        this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
          field_name: 'pack_sum',
          new_value: newValue,
        })
      } else {
        this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
          field_name: 'pack_sum',
          new_value: newValue,
        })
      }
    },
    'filter.manufacturer_country_name'(newValue) {
      this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
        field_name: 'manufacturer_country_name',
        new_value: newValue,
      })
    },
    'filter.trade_name'(newValue) {
      if (this.source !== 'expanded-ru') {
        this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
          field_name: 'trade_name',
          new_value: newValue,
        })
      } else {
        this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
          field_name: 'trade_name',
          new_value: newValue,
        })
      }
    },
    'filter.is_active'(newValue) {
      this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
        field_name: 'is_active',
        new_value: newValue,
      })
    },
    currentExpandedPriceFilter: {
      handler(newFilter) {
        this.filter = Object.assign(this.filter, newFilter)
        this.getExpandedFilter()
      },
      deep: true,
    },
  },
  created() {
    if (this.source === 'expanded-ru') {
      this.filter.mnn = this.expandedRu.mnn
      this.filter.lf_norm_name = this.expandedRu.lf_norm_name
      this.filter.dosage_norm_name = this.expandedRu.dosage_norm_name
      this.filter.trade_name = this.expandedRu.trade_name
      this.filter.manufacturer_country_name = this.expandedRu.manufacturer_country_name
      this.filter.pack_sum = this.expandedRu.pack_sum
    }
  },
  methods: {
    getExpandedFilter() {
      if (this.source === 'expanded-ru') this.$store.dispatch('price/fetchExpandedPriceKlp')
    },
    matchingSteps(filter) {
      if (this.source === 'expanded-ru') {
        this.$store.commit('price/SET_MATCHED_STEP', 3)
        this.$store.dispatch('price/fetchMatchedKlpTable')
      } else if (filter.num_reg) {
        this.$store.commit('price/SET_MATCHED_STEP', 3)
        this.$store.dispatch('price/fetchMatchedKlpTable')
      } else if (filter.mnn && filter.lf_name && filter.dosage_name) {
        this.$store.commit('price/SET_MATCHED_STEP', 2)
        this.$store.dispatch('price/fetchMatchedKlpTable')
      } else {
        this.$store.commit('price/SET_MATCHED_STEP', 1)
        this.$store.dispatch('price/fetchMatchedSmnnTable')
      }
    },
    clearFilter(field) {
      if (this.source !== 'expanded-ru') {
        this.$store.commit('price/UPDATE_MATCHED_PRICE_FILTER', {
          field_name: field,
          new_value: null,
        })
      } else {
        this.$store.commit('price/UPDATE_EXPANDED_PRICE_FILTER', {
          field_name: field,
          new_value: null,
        })
      }
      this.$store.commit('price/SAVE_SELECTED_KLP', {})
    },
    heightControl(flag) {
      this.$store.commit('price/UPDATE_MODAL_BLOCK_HEIGHT', flag)
    },
    setActiveSmnnRoute() {
      this.filter.is_active = !this.filter.is_active
    },
  },
}
</script>
