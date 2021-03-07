<template>
  <b-table striped hover sticky-header="100%" :items="surcharge" :fields="fields" class="w-100 m-0">
    <template v-slot:cell(region_name)="row">
      {{ row.item.region_name }}
    </template>
    <template v-slot:cell(addition1)="row">
      <b-input
        v-model.number="row.item.addition1"
        class="custom_input"
        type="number"
        placeholder="0"
        @change="editCurrentSurcharge(row.item, '1')"
      />
    </template>
    <template v-slot:cell(addition2)="row">
      <b-input
        v-model.number="row.item.addition2"
        class="custom_input"
        type="number"
        placeholder="0"
        @change="editCurrentSurcharge(row.item, '2')"
      />
    </template>
    <template v-slot:cell(addition3)="row">
      <b-input
        v-model.number="row.item.addition3"
        class="custom_input"
        type="number"
        placeholder="0"
        @change="editCurrentSurcharge(row.item, '3')"
      />
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'SurchargeTable',
  data() {
    return {
      fields: [
        {
          key: 'region_name',
          label: 'Название региона',
        },
        {
          key: 'addition1',
          label: 'до 50₽',
        },
        {
          key: 'addition2',
          label: 'от 50₽ до 500₽',
        },
        {
          key: 'addition3',
          label: 'от 500₽',
        },
      ],
    }
  },
  computed: {
    surchargeStatus() {
      return this.$store.state.surcharge.status
    },
    surcharge() {
      return JSON.parse(JSON.stringify(this.$store.getters['surcharge/filteredRegions']))
    },
    currentSurcharge() {
      return this.$store.state.surcharge.currentSurcharge
    },
  },
  watch: {
    surchargeStatus(newStatus) {
      if (newStatus === 'current-surcharge-is-edited')
        this.addSuccessNotification('Надбавка', 'Данные успешно изменены')
      else if (newStatus === 'surcharge-is-fetched') this.addSuccessNotification('Надбавки', 'Данные успешно обновлены')
    },
  },
  methods: {
    editCurrentSurcharge(currentSurcharge, number) {
      this.$store.dispatch('surcharge/editCurrentSurcharge', {
        id: currentSurcharge.id,
        key: `addition${number}`,
        value: currentSurcharge[`addition${number}`],
      })
    },
    addSuccessNotification(title, message) {
      this.$bvToast.toast(message, {
        title,
        autoHideDelay: 5000,
        toaster: 'b-toaster-bottom-right',
        variant: 'success',
        appendToast: false,
      })
    },
  },
}
</script>
