<template>
  <div class="px-4">
    <div class="d-flex align-items-center w-100 justify-content-between mb-4 mt-4">
      <span class="mr-4 h5 mb-0">Пользователь: </span>
      <b-dd
        id="dropdown-purchase_status"
        :lazy="true"
        toggle-class="p-0 text-center mb-0 mr-4 custom_button"
        variant="link"
        boundary="viewport"
      >
        <template v-slot:button-content>
          <span class="h5">{{ userName }}</span>
        </template>
        <template v-for="(user, key) in users">
          <b-dd-item-btn
            :key="key"
            button-class="d-flex flex-row custom_dropdown_item"
            :active="user.title === userName"
            @click="updateStatisticFilter(user)"
          >
            <div class="flex-fill text-left mr-2">
              {{ user.title }}
            </div>
          </b-dd-item-btn>
        </template>
      </b-dd>
    </div>
    <div class="d-flex align-items-center justify-content-between w-100">
      <span class="mr-4 h5 mb-0">Интервал подтверждения: </span>
      <b-input-group class="filter w-50">
        <datepicker
          v-model="createdAt.from"
          placeholder="Начало интервала"
          type="datetime"
          value-type="timestamp"
          format="DD.MM.YYYY HH:mm"
          class="w-50"
        ></datepicker>
        <datepicker
          v-model="createdAt.to"
          placeholder="Конец интервала"
          type="datetime"
          value-type="timestamp"
          format="DD.MM.YYYY HH:mm"
          class="w-50"
        ></datepicker>
      </b-input-group>
    </div>
    <div class="d-flex justify-content-between mt-4 pr-3">
      <span class="h5">Количество подтверждений:</span>
      <span class="h5">{{ confirmResult ? confirmResult : 'нет данных' }}</span>
    </div>
    <div class="d-flex justify-content-start pr-2 mt-4">
      <b-icon-play
        v-if="matchConfirm.author_id && matchConfirm.from && matchConfirm.to"
        class="m-0 h2 pointer"
        variant="success"
        @click="fetchPriceMatchConfirmStat"
      ></b-icon-play>
      <b-icon-play v-else class="m-0 h2" variant="secondary"></b-icon-play>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatPriceResult',
  data() {
    return {
      userName: 'Выберите пользователя',
      createdAt: {
        from: null,
        to: null,
      },
    }
  },
  computed: {
    users() {
      return this.$store.getters['purchase/getUserSet'].users
    },
    matchConfirm() {
      return this.$store.getters['statistic/getMatchConfirm']
    },
    confirmResult() {
      return this.$store.getters['statistic/getConfirmResult']
    },
  },
  watch: {
    createdAt: {
      handler(newValue) {
        this.$store.commit('statistic/UPDATE_MATCH_CONFIRM_FILTER', newValue)
      },
      deep: true,
    },
  },
  methods: {
    updateStatisticFilter(user) {
      this.userName = user.title
      this.$store.commit('statistic/SAVE_MATCH_CONFIRM_USER_ID', user.user_id)
    },
    fetchPriceMatchConfirmStat() {
      this.$store.dispatch('statistic/getPriceMatchConfirm')
    },
  },
}
</script>
