<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 4vh;'">
    <div class="d-flex justify-content-between">
      <!--      <div class="d-flex align-items-center -large mr-4">-->
      <!--        <b-input-group class="filter">-->
      <!--          <b-form-input-->
      <!--            v-model="selectedKlp.custom_mnn"-->
      <!--            placeholder="МНН"-->
      <!--            :disabled="!Object.keys(selectedKlp).length"-->
      <!--          ></b-form-input>-->
      <!--        </b-input-group>-->
      <!--        <b-icon-info-circle-->
      <!--          class="h6 m-0 ml-2 pointer"-->
      <!--          @click="addSuccessNotification('Подсказка', 'Международное непатентованное наименование', 'info')"-->
      <!--        ></b-icon-info-circle>-->
      <!--      </div>-->
      <div class="d-flex align-items-center -extra_large mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.name_teh"
            placeholder="Технические характеристики"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="addSuccessNotification('Подсказка', 'Дополнительный показатель', 'info')"
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -small mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.expiration_date"
            type="number"
            placeholder="Срок годности"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="
            addSuccessNotification(
              'Подсказка',
              'Срок годности. Указывается в количестве месяцев хранения (не учитывая даты изготовления)',
              'info'
            )
          "
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -small mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.temperature_min"
            type="number"
            max="0"
            placeholder="С (мин)"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
          <b-form-input
            v-model="selectedKlp.temperature_max"
            type="number"
            max="0"
            placeholder="С (макс)"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="
            addSuccessNotification(
              'Подсказка',
              'Температурный режим. С (мин): если не замораживать - 0, С (макс): заполняется в соответствии с РУ',
              'info'
            )
          "
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -medium mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.dimensions_height"
            type="number"
            placeholder="Высота"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
          <b-form-input
            v-model="selectedKlp.dimensions_length"
            type="number"
            placeholder="Длина"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
          <b-form-input
            v-model="selectedKlp.dimensions_width"
            type="number"
            placeholder="Ширина"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="addSuccessNotification('Подсказка', 'Габаритные размеры. Указываются в метрах', 'info')"
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -extra_small mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.weight"
            type="number"
            placeholder="Вес"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="addSuccessNotification('Подсказка', 'Вес. Указывается в килограммах', 'info')"
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -small mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.pre_packing"
            type="number"
            placeholder="Кол-во в коробке"
            :disabled="!Object.keys(selectedKlp).length"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="
            addSuccessNotification(
              'Подсказка',
              'Транспортная упаковка. Укажите количество упаковок в одной коробке',
              'info'
            )
          "
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -large mr-4">
        <b-input-group class="filter">
          <b-form-input
            v-model="selectedKlp.comment_ru"
            placeholder="Комментарий к РУ"
            :disabled="!selectedKlp.ru_file"
          ></b-form-input>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="addSuccessNotification('Подсказка', 'Комментарий к регистрационному удостоверению', 'info')"
        ></b-icon-info-circle>
      </div>
      <div class="d-flex align-items-center -medium mr-4">
        <b-input-group class="filter w-100">
          <datepicker
            v-model="selectedKlp.date_ru_file"
            :disabled="!selectedKlp.ru_file"
            :placeholder="
              selectedKlp.date_ru_file ? $moment(selectedKlp.date_ru_file).format('DD.MM.YYYY') : 'Дата окончания РУ'
            "
            type="date"
            value-type="format"
            format="DD.MM.YYYY"
            class="w-100"
          ></datepicker>
        </b-input-group>
        <b-icon-info-circle
          class="h6 m-0 ml-2 pointer"
          @click="addSuccessNotification('Подсказка', 'Дата окончания РУ', 'info')"
        ></b-icon-info-circle>
      </div>
    </div>
    <div class="d-flex align-items-center -medium">
      <b-input-group class="filter">
        <b-form-input
          v-model="selectedKlp.matching_comment"
          placeholder="Комментарий"
          :disabled="!Object.keys(selectedKlp).length"
        ></b-form-input>
      </b-input-group>
      <b-icon-info-circle
        class="h6 m-0 ml-2 pointer"
        @click="addSuccessNotification('Подсказка', 'Комментарий', 'info')"
      ></b-icon-info-circle>
    </div>
    <div class="d-flex -small align-items-center justify-content-end">
      <b-icon-folder-check
        v-if="savePossible"
        variant="success"
        class="h4 m-0 mr-3 pointer"
        @click="editingKlp"
      ></b-icon-folder-check>
      <b-icon-folder-check v-else variant="secondary" class="h4 m-0 mr-3"></b-icon-folder-check>
      <b-icon-x class="h5 m-0 pointer" @click="closeMatchingModal"> </b-icon-x>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchingControl',
  data() {
    return {
      selectedKlp: {
        custom_mnn: null,
        name_teh: null,
        expiration_date: null,
        temperature_min: null,
        temperature_max: null,
        dimensions_length: null,
        dimensions_width: null,
        dimensions_height: null,
        pre_packing: null,
        weight: null,
        comment_ru: null,
        date_ru_file: null,
        matching_comment: null,
      },
    }
  },
  computed: {
    priceStatus() {
      return this.$store.state.price.status
    },
    selectedKlpCopy() {
      return JSON.parse(JSON.stringify(this.$store.getters['price/getSelectedKlp']))
    },
    savePossible() {
      return (
        this.selectedKlp.name_teh &&
        this.selectedKlp.expiration_date &&
        this.selectedKlp.dimensions_length &&
        this.selectedKlp.dimensions_width &&
        this.selectedKlp.dimensions_height &&
        this.selectedKlp.pre_packing &&
        this.selectedKlp.weight
      )
    },
  },
  watch: {
    'selectedKlp.custom_mnn'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'custom_mnn', value: newValue })
    },
    'selectedKlp.name_teh'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'name_teh', value: newValue })
    },
    'selectedKlp.expiration_date'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'expiration_date', value: newValue })
    },
    'selectedKlp.temperature_min'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'temperature_min', value: newValue })
    },
    'selectedKlp.temperature_max'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'temperature_max', value: newValue })
    },
    'selectedKlp.dimensions_height'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'dimensions_height', value: newValue })
    },
    'selectedKlp.dimensions_length'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'dimensions_length', value: newValue })
    },
    'selectedKlp.dimensions_width'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'dimensions_width', value: newValue })
    },
    'selectedKlp.pre_packing'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'pre_packing', value: newValue })
    },
    'selectedKlp.weight'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'weight', value: newValue })
    },
    'selectedKlp.comment_ru'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'comment_ru', value: newValue })
    },
    'selectedKlp.date_ru_file'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'date_ru_file', value: newValue })
    },
    'selectedKlp.matching_comment'(newValue) {
      this.$store.commit('price/UPDATE_EDITING_KLP_FIELDS', { field: 'matching_comment', value: newValue })
    },
    selectedKlpCopy(newFields) {
      this.selectedKlp = JSON.parse(JSON.stringify(newFields))
    },
    priceStatus(newValue) {
      if (newValue === 'matching-success') {
        this.closeMatchingModal()
      }
    },
  },
  created() {
    this.selectedKlp = JSON.parse(JSON.stringify(this.$store.getters['price/getSelectedKlp']))
  },
  methods: {
    closeMatchingModal() {
      this.$store.commit('price/RESET_MATCHING')
      this.$store.commit('price/CLEAR_SELECTED_ROWS')
      this.$store.commit('priceObject/UPDATE_MATCHING_MODAL_SOURCE', 'price_table')
      this.$bvModal.hide('esklpPriceMatchingModal')
    },
    editingKlp() {
      if (Object.keys(this.selectedKlp).length) this.$store.dispatch('price/editKlp')
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
