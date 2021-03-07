<template>
  <div class="d-flex flex-column justify-content-center px-4" style="width: 300px">
    <template v-if="source === 'ru_file'">
      <div v-if="!selectedKlp.ru_file" class="pt-2">
        <b-file v-model="file" :state="Boolean(file)" plain> </b-file>
      </div>
      <div class="d-flex justify-content-between pt-3 pb-2" :class="selectedKlp.ru_file ? 'pt-2' : 'pt-3'">
        <b-icon-cloud-upload
          :variant="file && !selectedKlp.ru_file ? 'info' : 'dark'"
          class="h4 m-0"
          :class="file && !selectedKlp.ru_file ? 'pointer' : ''"
          @click="uploadRuFile"
        ></b-icon-cloud-upload>
        <b-icon-cloud-download
          :variant="selectedKlp.ru_file ? 'info' : 'dark'"
          :class="selectedKlp.ru_file ? 'pointer' : ''"
          class="h4 m-0"
          @click="downloadFile"
        ></b-icon-cloud-download>
        <b-icon-trash
          :variant="selectedKlp.ru_file ? 'info' : 'dark'"
          :class="selectedKlp.ru_file ? 'pointer' : ''"
          class="h4 m-0"
          @click="removeFile"
        ></b-icon-trash>
      </div>
    </template>
    <template v-else-if="source === 'price'">
      <div class="d-flex align-items-center">
        <b-icon-cloud-upload
          :variant="price_file ? 'info' : 'dark'"
          class="h4 m-0 mr-4"
          :class="price_file ? 'pointer' : ''"
          @click="uploadPriceFile"
        ></b-icon-cloud-upload>
        <b-file v-model="price_file" :state="Boolean(price_file)" plain> </b-file>
      </div>
    </template>
    <template v-else-if="source === 'seller_current_price'">
      <div class="d-flex align-items-center">
        <b-icon-cloud-upload
          :variant="price_file ? 'info' : 'dark'"
          class="h4 m-0 mr-4"
          :class="price_file ? 'pointer' : ''"
          @click="uploadCurrentSellerPrice"
        ></b-icon-cloud-upload>
        <b-file v-model="price_file" :state="Boolean(price_file)" plain> </b-file>
      </div>
    </template>
    <template v-else-if="source === 'seller_current_price_import'">
      <div class="d-flex align-items-center">
        <b-icon-cloud-upload
          :variant="price_file ? 'info' : 'dark'"
          class="h4 m-0 mr-4"
          :class="price_file ? 'pointer' : ''"
          @click="uploadCurrentSellerPriceImport"
        ></b-icon-cloud-upload>
        <b-file v-model="price_file" :state="Boolean(price_file)" plain> </b-file>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UploadFiles',
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      file: null,
      price_file: null,
      API_URL: null,
    }
  },
  computed: {
    currentSellerPriceTemplate() {
      return this.$store.getters['dictionaries/getCurrentSellerPriceTemplate']
    },
    selectedKlp() {
      return this.$store.state.price.selectedKlp
    },
    currentKlp() {
      return this.$store.state.price.currentKlp
    },
    status() {
      return this.$store.state.file.status
    },
    ruFile() {
      return this.$store.state.price.ruFile
    },
  },
  watch: {
    selectedKlp() {
      this.file = null
    },
    // ruFile() {
    //   this.$store.dispatch('price/fetchCurrentKlp', this.currentKlp.uuid)
    //   this.$store.dispatch('price/fetchMatchedKlpTable')
    // },
    status(newStatus) {
      if (newStatus === 'file-uploaded') {
        this.file = null
        this.price_file = null
      }
    },
  },
  created() {
    this.API_URL = process.env.API_URL
  },
  methods: {
    uploadRuFile() {
      if (this.file) {
        this.$store.dispatch('file/uploadRuFile', { file: this.file, uuid: this.selectedKlp.uuid })
      }
    },
    uploadPriceFile() {
      this.$store.dispatch('file/uploadPriceFile', this.price_file)
    },
    downloadFile() {
      const link = document.createElement('a')
      link.setAttribute('href', `${this.API_URL}api/esklp/klp/ru_file/${this.selectedKlp.uuid}`)
      link.setAttribute('download', 'download')
      onload = link.click()
    },
    removeFile() {
      this.$store.dispatch('file/removeRuFile', this.selectedKlp)
    },
    uploadCurrentSellerPrice() {
      this.$store.dispatch('file/uploadCurrentSellerPrice', this.price_file)
    },
    uploadCurrentSellerPriceImport() {
      this.$store.dispatch('file/importCurrentSellerPrice', {
        price_file: this.price_file,
        seller_price_pattern_id: this.currentSellerPriceTemplate[0].id,
      })
    },
  },
}
</script>
