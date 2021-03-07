<template>
  <div>
    <b-table
      :fields="fields"
      :items="offers"
      striped
      sticky-header="100%"
      class="w-100 m-0"
      @row-dblclicked="doubleClick"
    >
      <template v-slot:cell(npp)="row"> {{ row.index + 1 }}</template>
      <template v-slot:cell(created_at)="row">
        <span>{{ $moment(row.item.created_at).format('DD.MM.YYYY HH:mm') }}</span>
      </template>
      <template v-slot:cell(remove)="row">
        <b-icon-trash class="m-0 h4 pointer" @click="openArchiveModal(row.item)"></b-icon-trash>
      </template>
      <template v-slot:cell(user)="row">
        <span>{{ row.item && row.item.user ? row.item.user.name : 'Не назначен' }}</span>
      </template>
      <template v-slot:cell(mailing)="row">
        <b-icon-toggle-on v-if="row.item.is_started" class="m-0 h5"></b-icon-toggle-on>
        <b-icon-toggle-off v-else class="m-0 h5" @click="setOfferMailing(row.item.id)"></b-icon-toggle-off>
      </template>
    </b-table>
    <b-modal ref="remove-current-offer" title="Архивирование коммерческого предложения" @ok="archiveModalAccept">
      <p class="my-4">Отправить в архив коммерческое предложение?</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'OffersTable',
  data() {
    return {
      selectedOffer: {},
      fields: [
        {
          key: 'npp',
          label: '№ п/п',
          class: 'align-middle',
        },
        {
          key: 'created_at',
          label: 'Дата создания',
          class: 'align-middle w-10',
          sortable: true,
        },
        {
          key: 'id',
          label: '№ КП (внутренний)',
          class: 'align-middle w-30',
        },
        {
          key: 'user',
          label: 'Пользователь',
          class: 'align-middle',
        },
        {
          key: 'customer_name',
          label: 'Заказчик',
          class: 'align-middle',
        },
        {
          key: 'customer_comment',
          label: 'Комментарий',
          class: 'align-middle',
        },
        {
          key: 'mailing',
          label: 'В рассылку',
          class: 'align-middle',
        },
        {
          key: 'remove',
          label: '',
          class: 'align-middle w-3',
        },
      ],
    }
  },
  computed: {
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
    offers() {
      return this.$store.getters['offers/getOffers']
    },
  },
  created() {
    this.$store.dispatch('offers/fetchOffers')
  },
  methods: {
    doubleClick(row) {
      this.$store.dispatch('offers/fetchCurrentOffer', row.id)
      this.$bvModal.show('offersModal')
    },
    openArchiveModal(offer) {
      this.selectedOffer = offer
      this.$refs['remove-current-offer'].show()
    },
    archiveModalAccept() {
      this.$store.dispatch('offers/archiveCurrentOffer', this.selectedOffer)
    },
    setOfferMailing(offerId) {
      this.$store.dispatch('offers/setOfferMailing', offerId)
    },
  },
}
</script>
