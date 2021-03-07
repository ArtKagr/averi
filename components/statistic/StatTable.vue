<template>
  <div>
    <b-table :items="statistic" :fields="fields" striped sticky-header="100%" class="w-100 m-0">
      <template v-slot:cell(npp)="row">
        {{ row.index + 1 }}
      </template>
      <template v-slot:cell(purchase.purchase_number)="row">
        {{ getPurchaseNumber(row.item.purchase) || 'нет данных' }}
      </template>
      <template v-slot:cell(updated_at)="row">
        {{ $moment(row.item.updated_at).format('DD.MM.YYYY HH:mm') }}
      </template>
      <template v-slot:cell(user_id)="row">
        {{ currentUser(row.item.user_id) }}
      </template>
      <template v-slot:cell(status_slug)="row">
        {{ currentStatus(row.item.status_slug) }}
      </template>
      <template v-slot:cell(confirmed)="row">
        <b-icon-check-square
          v-if="row.item.confirmed"
          class="m-0 h5"
          @click="confirmedSwitcher({ id: row.item.purchase_uuid, flag: false })"
        ></b-icon-check-square>
        <b-icon-square
          v-else
          class="m-0 h5"
          @click="confirmedSwitcher({ id: row.item.purchase_uuid, flag: true })"
        ></b-icon-square>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'StatTable',
  data() {
    return {
      items: [],
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'purchase.purchase_number',
          label: '№ извещения',
          class: 'align-middle',
        },
        {
          key: 'user_id',
          label: 'Имя пользователя',
          class: 'align-middle',
        },
        {
          key: 'count_purchase_objects_prices',
          label: 'Кол-во объектов прайса',
          class: 'align-middle',
        },
        {
          key: 'updated_at',
          label: 'Дата перемещения',
          class: 'align-middle',
        },
        {
          key: 'status_slug',
          label: 'Статус перемещения',
          class: 'align-middle',
        },
        {
          key: 'confirmed',
          label: 'Подтверждено',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    statistic() {
      return this.$store.getters['statistic/getStatistic']
    },
    statuses() {
      return this.$store.state.purchase.filters.purchase_status
    },
    users() {
      return this.$store.getters['dictionaries/getAllUsersList']
    },
  },
  methods: {
    currentStatus(currentSlug) {
      const result = this.statuses.find((status) => status.status === currentSlug)
      return result && result.title ? result.title : 'нет данных'
    },
    currentUser(currentUserId) {
      return this.users.length ? this.users.find((user) => user.id === currentUserId).name : 'не найден'
    },
    confirmedSwitcher(query) {
      this.$store.dispatch('statistic/confirmedSwitcher', query)
    },
    getPurchaseNumber(purchase) {
      if (purchase.purchase_number === '0000000000000000000' && !purchase.registration_number) {
        return purchase.purchase_number_manual
      } else if (purchase.purchase_number === '0000000000000000000' && !purchase.purchase_number_manual) {
        return purchase.registration_number
      } else return purchase.purchase_number
    },
  },
}
</script>
