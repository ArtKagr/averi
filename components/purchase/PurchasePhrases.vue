<template>
  <div class="p-4">
    <div v-for="(phrase, key) in phrases" :key="key" class="d-flex align-items-center mb-3">
      <div class="d-flex align-items-center">
        <b-icon-check-square
          v-if="phraseIds.includes(phrase.id)"
          class="h5 m-0 mr-3"
          @click="removePhrase(phrase.id)"
        ></b-icon-check-square>
        <b-icon-square v-else class="h5 m-0 mr-3" @click="setPhrase(phrase.id)"></b-icon-square>
      </div>
      <p :id="`comment_cell_${phrase.id}`" class="d-flex align-items-center m-0" style="font-size: 14px">
        {{ phrase.name }}
      </p>
      <b-tooltip :target="`comment_cell_${phrase.id}`" placement="left">
        {{ phrase.description }}
      </b-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchasePhrases',
  props: {
    priceObject: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      phraseIds: [],
    }
  },
  computed: {
    phrases() {
      return this.$store.getters['dictionaries/getPhrases']
    },
    currentPurchase() {
      return this.$store.getters['purchaseObject/getCurrentPurchase']
    },
  },
  watch: {
    priceObject(newValue) {
      this.phraseIds = newValue.phrase_ids
    },
  },
  created() {
    this.phraseIds = this.priceObject.phrase_ids
  },
  methods: {
    setPhrase(phraseId) {
      this.phraseIds.push(phraseId)
      this.$store.commit('purchaseObject/SAVE_PHRASES_IN_PURCHASE_PRICE_OBJECT', {
        price_object: this.priceObject,
        phrase_ids: this.phraseIds,
      })
    },
    removePhrase(phraseId) {
      this.phraseIds = this.phraseIds.filter((currentPhraseId) => currentPhraseId !== phraseId)
      this.$store.commit('purchaseObject/SAVE_PHRASES_IN_PURCHASE_PRICE_OBJECT', {
        price_object: this.priceObject,
        phrase_ids: this.phraseIds,
      })
    },
  },
}
</script>
