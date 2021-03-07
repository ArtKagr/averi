<template>
  <div class="p-4">
    <div v-for="(notification, key) in purchaseNotifications" :key="key" class="d-flex flex-column">
      <div class="mb-2">
        <span class="mr-1">{{ key + 1 }}.</span>
        <span>{{ notification }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PurchaseNotifications',
  computed: {
    purchaseNotifications() {
      return this.$store.getters['purchaseObject/getCurrentPurchaseNotifications']
    },
  },
}
</script>
