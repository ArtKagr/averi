<template>
  <div class="d-flex flex-column w-100">
    <div
      v-for="(price, key) in prices"
      :key="key"
      class="d-flex justify-content-between text-truncate w-100"
      style="font-size: 12px"
    >
      <div class="d-flex w-80 hide-text justify-content-start">
        <span class="hide-text w-90">{{ price.seller }}:</span>
      </div>
      <div class="w-20">
        <span>{{ price.qnt }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NumberMedicines',
  props: {
    prices: {
      type: Array,
      default: null,
    },
  },
}
</script>
