<template>
  <b-modal
    id="esklpPriceMatchingModal"
    size="full"
    no-close-on-backdrop
    hide-header
    hide-footer
    body-class="p-0 h-100 overflow-hidden"
    content-class="h-100"
    footer-bg-variant="info"
  >
    <template v-slot:default>
      <div class="d-flex flex-column h-100 w-100">
        <matching-control />
        <b-overlay
          :show="status === 'fetching'"
          opacity="0.5"
          class="align-self-start w-100 overflow-auto"
          :class="`h-${blockHeight}`"
        >
          <price-table source="matching-modal" />
        </b-overlay>

        <div class="d-flex align-self-end flex-column w-100 overflow-hidden" :class="`h-${100 - blockHeight}`">
          <div class="align-self-start w-100">
            <matching-filter />
          </div>

          <b-overlay :show="status === 'fetching'" opacity="0.5" class="h-100 overflow-auto">
            <price-table :source="matchingStep" />
          </b-overlay>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import PriceTable from './PriceTable'
import MatchingFilter from './MatchingFilter'
import MatchingControl from './MatchingControl'
export default {
  name: 'MatchingModal',
  components: { MatchingControl, MatchingFilter, PriceTable },
  computed: {
    status() {
      return this.$store.state.price.status
    },
    fileStatus() {
      return this.$store.state.file.status
    },
    matchingStep() {
      let source
      switch (this.$store.state.price.matchedStep) {
        case 1:
          source = 'matching-modal-smnn'
          break
        case 2:
          source = 'matching-modal-klp_grouping'
          break
        case 3:
          source = 'matching-modal-klp_full'
          break
      }
      return source
    },
    blockHeight() {
      return this.$store.state.price.blockHeight
    },
  },
  watch: {
    fileStatus(newStatus) {
      switch (newStatus) {
        case 'file-uploaded':
          this.addSuccessNotification('Загрузка файла', 'Файл успешно загружен', 'success')
          break
        case 'error-uploading':
          this.addSuccessNotification('Загрузка файла', 'Ошибка загрузки файла', 'warning')
          break
        case 'file-removed':
          this.addSuccessNotification('Удаление файла', 'Файл успешно удалён', 'success')
          break
        case 'error-removing':
          this.addSuccessNotification('Удаление файла', 'Ошибка удаления файла', 'warning')
          break
      }
    },
  },
  methods: {
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
