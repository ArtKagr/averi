<template>
  <div class="p-4">
    <div>
      <p class="h3 font-weight-bold mb-3">Наше возможное предложение</p>
      <p class="h5 mb-4 pb-4">{{ eqReplacement.our_offer }}</p>
    </div>
    <div>
      <p class="h3 font-weight-bold mb-3">Как пересчитать</p>
      <p class="h5 mb-4 pb-4">{{ eqReplacement.how_recalculate }}</p>
    </div>
    <div>
      <p class="h3 font-weight-bold mb-3">Краткий комментарий для заявки</p>
      <p class="h5 mb-4 pb-4">{{ eqReplacement.short_comment }}</p>
    </div>
    <div>
      <div class="d-flex align-items-center mb-3">
        <p class="h3 font-weight-bold mb-0 mr-3">Полный комментарий для заявки</p>
      </div>
      <p id="myInput" class="h5 mb-4 pb-4">{{ eqReplacement.full_comment }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseEqReplacement',
  props: {
    eqReplacement: {
      type: Object,
      default: () => ({
        mnn: [],
        lf_name: [],
        our_offer: 'Данные отсутствуют',
        how_recalculate: 'Данные отсутствуют',
        short_comment: 'Данные отсутствуют',
        full_comment: 'Данные отсутствуют',
      }),
    },
  },
  methods: {
    myFunction(newValue) {
      const copyText = document.getElementById('myInput')
      copyText.select()
      document.execCommand('copy')
    },
  },
}
</script>
