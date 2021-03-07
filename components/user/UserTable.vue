<template>
  <b-table :fields="fields" :items="users" striped sticky-header="100%" class="w-100 m-0">
    <template v-slot:cell(npp)="row">
      {{ row.index + 1 }}
    </template>
    <template v-slot:cell(personal_data)="row">
      {{ row.item.name }}
    </template>
    <template v-slot:cell(e_mail)="row">
      {{ row.item.email }}
    </template>
    <template v-slot:cell(role)="row">
      <b-dd
        id="dropdown-trading_places"
        :lazy="true"
        toggle-class="p-0 text-center mb-0 mr-4 custom_button"
        variant="link"
        boundary="viewport"
      >
        <template v-slot:button-content>
          {{ row.item.roles[0] && row.item.roles[0].name_role ? row.item.roles[0].name_role : 'нет' }}
        </template>
        <template v-for="(role, key) in roles">
          <b-dd-item-btn
            :key="key"
            button-class="d-flex flex-row custom_dropdown_item"
            @click="changeRole(row.item, role)"
          >
            <div class="flex-fill text-left mr-2">
              {{ role.name_role || 'нет' }}
            </div>
          </b-dd-item-btn>
        </template>
      </b-dd>
    </template>
    <template v-slot:cell(positions_confirm_possible)="row">
      <b-icon-check-square
        v-if="row.item.is_confirming"
        class="h4 m-0 pointer"
        @click="matchConfirmationUser(row.item)"
      ></b-icon-check-square>
      <b-icon-square v-else class="h4 m-0 pointer" @click="matchConfirmationUser(row.item)"></b-icon-square>
    </template>
    <template v-slot:cell(save)="row">
      <!--      <b-icon-journal-check-->
      <!--        v-if="row.item.edit"-->
      <!--        class="h4 m-0 mr-4"-->
      <!--        variant="success"-->
      <!--        @click="changeUser(row.item)"-->
      <!--      ></b-icon-journal-check>-->
      <!--      <b-icon-journal-check v-else class="h4 m-0 mr-4" variant="secondary"></b-icon-journal-check>-->
      <b-icon-archive class="h4 m-0 pointer" @click="hideUser(row.item)"></b-icon-archive>
    </template>
  </b-table>
</template>

<script>
export default {
  name: 'UserTable',
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
          key: 'personal_data',
          label: 'Имя',
          class: 'align-middle',
        },
        {
          key: 'e_mail',
          label: 'E-mail',
          class: 'align-middle',
        },
        {
          key: 'role',
          label: 'Роль',
          class: 'align-middle',
        },
        {
          key: 'positions_confirm_possible',
          label: 'Подтверждение сопоставления',
          class: 'align-middle',
        },
        {
          key: 'save',
          label: 'В архив',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    usersListStatus() {
      return this.$store.getters['dictionaries/getUsersListStatus']
    },
    users() {
      return this.$store.getters['dictionaries/getUsers']
    },
    roles() {
      return this.$store.getters['dictionaries/getRoles']
    },
  },
  methods: {
    changeRole(user, role) {
      this.$store.commit('dictionaries/CHANGE_USERS', { user, role })
      this.$store.dispatch('dictionaries/changeUserRole', { user, role })
    },
    changeUser(user) {
      this.$store.dispatch('dictionaries/editUser', user)
    },
    matchConfirmationUser(user) {
      this.$store.dispatch('dictionaries/editUser', { id: user.id, is_confirming: !user.is_confirming })
    },
    hideUser(user) {
      this.$store.dispatch('dictionaries/editUser', { id: user.id, is_active: false })
    },
  },
}
</script>
