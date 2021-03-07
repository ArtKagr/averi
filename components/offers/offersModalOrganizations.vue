<template>
  <b-table :fields="fields" :items="organizations" striped sticky-header="100%" class="w-100 m-0">
    <template v-slot:cell(npp)="row"> {{ row.index + 1 }}</template>
    <template v-slot:cell(percent)="row">
      <b-input
        v-model.number="row.item.percent"
        class="custom_input"
        placeholder="Процент"
        @click="updateOrganization(row.item.percent, 'percent', row.index)"
      />
    </template>
    <template v-slot:cell(started_at)="row">
      <datepicker
        v-model="row.item.started_at"
        :placeholder="row.item.started_at || 'Не указана'"
        type="datetime"
        format="DD.MM.YYYY HH"
        :clearable="false"
        value-type="timestamp"
        class="w-100 custom_datepicker"
        @change="updateDateTimeOrganization($event, 'started_at', row.index)"
      ></datepicker>
    </template>
    <template v-slot:cell(date_kp)="row">
      <datepicker
        v-model="row.item.date_kp"
        :placeholder="row.item.date_kp || 'Не указана'"
        type="date"
        format="DD.MM.YYYY"
        :clearable="false"
        value-type="timestamp"
        class="w-100 custom_datepicker"
        @change="updateDateOrganization($event, 'date_kp', row.index)"
      ></datepicker>
    </template>
    <template v-slot:cell(number_kp)="row">
      <b-input
        v-model.number="row.item.number_kp"
        class="custom_input"
        placeholder="Процент"
        @click="updateOrganization(row.item.number_kp, 'number_kp', row.index)"
      />
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'OffersModalOrganizations',
  data() {
    return {
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'name',
          label: 'Наименование',
          class: 'align-middle',
        },
        {
          key: 'percent',
          label: 'Процент',
          class: 'align-middle',
        },
        {
          key: 'started_at',
          label: 'Дата и время отправки',
          class: 'align-middle',
        },
        {
          key: 'date_kp',
          label: 'Дата КП',
          class: 'align-middle',
        },
        {
          key: 'number_kp',
          label: '№ КП',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    currentOffer() {
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getCurrentOffer']))
    },
    organizations() {
      const offerDateCreated = this.currentOffer.created_at
      const moment = this.$moment
      const currentOffer = this.currentOffer
      return JSON.parse(JSON.stringify(this.$store.getters['offers/getOfferOrganizations'])).map(function (
        organization,
        index
      ) {
        if (index === 0) {
          if (!organization.started_at)
            organization.started_at = moment(offerDateCreated).add(2, 'hours').format('DD.MM.YYYY HH:mm')
          if (!organization.number_kp) organization.number_kp = currentOffer.id + 23
          if (!organization.date_kp) organization.date_kp = moment(offerDateCreated).format('DD.MM.YYYY')
        }
        if (index === 1) {
          if (!organization.started_at)
            organization.started_at = moment(offerDateCreated).add(4, 'hours').format('DD.MM.YYYY HH:mm')
          if (!organization.number_kp) organization.number_kp = currentOffer.id + 100
          if (!organization.date_kp) organization.date_kp = moment(offerDateCreated).format('DD.MM.YYYY')
        }
        if (index === 2) {
          if (!organization.started_at)
            organization.started_at = moment(offerDateCreated).add(1, 'days').format('DD.MM.YYYY HH:mm')
          if (!organization.number_kp) organization.number_kp = currentOffer.id + 177
          if (!organization.date_kp) organization.date_kp = moment(offerDateCreated).add(1, 'days').format('DD.MM.YYYY')
        }
        return organization
      })
    },
  },
  watch: {
    organizations: {
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.$store.commit('offers/UPDATE_ORGANIZATIONS', newValue)
        }
      },
      deep: true,
    },
  },
  methods: {
    updateOrganization(value, field, index) {
      this.$store.commit('offers/UPDATE_CURRENT_ORGANIZATION', { value, field, index })
    },
    updateDateTimeOrganization(date, field, index) {
      if (this.$moment(new Date(date)).format('HH:mm') !== '00:00') {
        const value = this.$moment(new Date(date)).format('DD.MM.YYYY HH:mm')
        this.$store.commit('offers/UPDATE_CURRENT_ORGANIZATION', { value, field, index })
      }
    },
    updateDateOrganization(date, field, index) {
      const value = this.$moment(new Date(date)).format('DD.MM.YYYY')
      this.$store.commit('offers/UPDATE_CURRENT_ORGANIZATION', { value, field, index })
    },
  },
}
</script>
