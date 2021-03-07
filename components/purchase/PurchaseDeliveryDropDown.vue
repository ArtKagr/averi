<template>
  <div class="d-flex align-items-center mr-4">
    <b-dropdown size="md" variant="link" toggle-class="text-decoration-none p-0 custom_button" no-caret>
      <template v-slot:button-content>
        <b-icon-building v-if="source === 'purchase-control'" class="h5 m-0 mr-1"></b-icon-building>
        <b-icon-pencil v-else-if="source === 'sellers-table'" class="m-0 h5 ml-2"></b-icon-pencil>
        <b-icon-plus-circle v-else class="m-0 h4 pointer"></b-icon-plus-circle>
      </template>
      <div class="d-flex flex-column h-100 w-100 overflow-hidden">
        <div class="d-flex justify-content-between w-100 px-2 mb-3 align-items-center">
          <b-input-group class="filter pr-3 align-items-center">
            <template v-if="source === 'purchase-control'">
              <b-icon-intersect
                id="multiply_delivery"
                v-b-toggle="[`sidebar_multiply_delivery`]"
                class="m-0 mr-3 h4 pointer custom_button"
                variant="secondary"
              ></b-icon-intersect>
              <b-tooltip target="multiply_delivery" placement="right"> Доставка в несколько мест </b-tooltip>
            </template>
            <b-form-input v-model="kladrFilter.kladr_name" placeholder="Населённый пункт"></b-form-input>
          </b-input-group>
          <b-input-group class="filter pr-3">
            <b-form-input v-model="kladrFilter.kladr_obl" placeholder="Область, край"></b-form-input>
          </b-input-group>
          <b-icon-zoom-in
            v-if="kladrFilter.kladr_name || kladrFilter.kladr_obl"
            class="m-0 mr-3 h5 pointer"
            variant="info"
            @click="setKladrInfo"
          ></b-icon-zoom-in>
          <b-icon-zoom-in v-else class="m-0 mr-3 h5" variant="secondary"></b-icon-zoom-in>
          <b-icon-x
            v-if="kladrFilter.kladr_name || kladrFilter.kladr_obl"
            class="m-0 h4 pointer"
            @click="clearKladrFilter"
          ></b-icon-x>
          <b-icon-x v-else class="m-0 h4" variant="secondary"></b-icon-x>
        </div>
        <div v-if="!locality.length" class="d-flex justify-content-center" style="width: 400px">
          <span>Результатов не найдено</span>
        </div>
        <div v-else class="d-flex align-self-end overflow-hidden flex-column">
          <div class="overflow-auto" style="max-height: 200px">
            <b-dd-item-btn
              v-for="(curLocality, key) in locality"
              :key="key"
              :active="curLocality.id === currentLocality.id"
              :disabled="!curLocality.region"
              @click="selectLocality(curLocality)"
            >
              <div class="d-flex mb-2" style="font-size: 11px; width: 400px">
                <span class="font-weight-bold mr-2">{{ curLocality.cdek ? 'СДЭК' : '' }}</span>
                <span>
                  {{
                    `${curLocality.socr ? curLocality.socr : ''} ${curLocality.name ? curLocality.name : ''}, ${
                      curLocality.region && curLocality.region.name ? curLocality.region.name : ''
                    } ${curLocality.region && curLocality.region.socr ? curLocality.region.socr : ''}`
                  }}
                </span>
              </div>
            </b-dd-item-btn>
          </div>
        </div>
      </div>
    </b-dropdown>
    <template v-if="source === 'purchase-control'">
      <p id="locality" class="m-0 ml-2 pointer hide-text" style="font-size: 13px; width: 150px">
        {{ currentLocality && currentLocality.name ? currentLocality.name : 'Укажите населённый пункт' }}
      </p>
      <b-tooltip target="locality" placement="left">
        {{ currentLocality && currentLocality.name ? currentLocality.name : 'Укажите населённый пункт' }}
      </b-tooltip>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PurchaseDeliveryDropDown',
  props: {
    source: String,
    default: null,
  },
  data() {
    return {
      currentLocality: { id: null, name: 'Укажите населённый пункт' },
      kladrFilter: {},
    }
  },
  computed: {
    getKladrFilter() {
      return this.$store.getters['purchaseObject/getKladrFilter']
    },
    locality() {
      return this.$store.getters['purchaseObject/getLocality']
    },
    currentLocalityCopy() {
      return this.$store.getters['purchaseObject/getCurrentLocality']
    },
  },
  watch: {
    currentLocalityCopy(newValue) {
      this.currentLocality = newValue
    },
  },
  created() {
    this.kladrFilter = this.$store.getters['purchaseObject/getKladrFilter']
  },
  methods: {
    selectLocality(locality) {
      if (this.source === 'purchase-control') this.$store.commit('purchaseObject/SAVE_CURRENT_LOCALITY', locality)
      if (this.source === 'sellers-table') this.$emit('selected-kladr', locality)
      else this.$store.commit('purchaseObject/ADD_LOCALITY', locality)
    },
    clearKladrFilter() {
      this.kladrFilter = { kladr_name: null, kladr_obl: null }
      this.$store.commit('purchaseObject/CLEAR_KLADR_FILTER')
    },
    setKladrInfo() {
      this.$store.commit('purchaseObject/UPDATE_KLADR_FILTER', this.kladrFilter)
      if (this.source === 'sellers-table') this.$store.dispatch('purchaseObject/getLocality')
    },
  },
}
</script>
