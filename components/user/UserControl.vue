<template>
  <div class="d-flex justify-content-between bg-gray-200 align-items-center px-3" :style="'height: 5vh;'">
    <div>
      <b-icon-arrow-clockwise class="h5 m-0 pointer mr-4"></b-icon-arrow-clockwise>
      <span class="mr-4 pointer" :class="usersListStatus ? 'font-weight-bold' : ''" @click="setUsersListStatus(true)"
        >Активные</span
      >
      <span class="pointer" :class="!usersListStatus ? 'font-weight-bold' : ''" @click="setUsersListStatus(false)"
        >Архивные</span
      >
    </div>
    <b-icon-plus-circle class="m-0 h4 pointer" @click="createUserModal"></b-icon-plus-circle>
    <b-modal ref="user-create-modal" title="Создание пользователя" @ok="createUserAccess">
      <div class="w-100">
        <div class="mb-3">
          <b-dd
            id="dropdown-trading_places"
            :lazy="true"
            toggle-class="p-0 text-center mb-0 mr-4 custom_button"
            variant="link"
            boundary="viewport"
          >
            <template v-slot:button-content>
              {{ currentRole }}
            </template>
            <template v-for="(role, key) in roles">
              <b-dd-item-btn :key="key" button-class="d-flex flex-row custom_dropdown_item" @click="setRole(role)">
                <div class="flex-fill text-left mr-2">
                  {{ role.name_role ? role.name_role : 'Выберите роль' }}
                </div>
              </b-dd-item-btn>
            </template>
          </b-dd>
        </div>
        <b-input-group class="filter mb-3">
          <b-form-input v-model="userCreate.name" placeholder="Имя пользователя"></b-form-input>
        </b-input-group>
        <b-input-group class="filter mb-3">
          <b-form-input v-model="userCreate.email" placeholder="E-mail"></b-form-input>
        </b-input-group>
        <b-input-group class="filter mb-3">
          <b-form-input v-model="userCreate.password" placeholder="Пароль"></b-form-input>
        </b-input-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'UserControl',
  data() {
    return {
      currentRole: 'Выберите роль',
      userCreate: {
        name: null,
        email: null,
        password: null,
        is_confirming: false,
        is_active: true,
        role_ids: [],
      },
    }
  },
  computed: {
    roles() {
      return this.$store.getters['dictionaries/getRoles']
    },
    usersListStatus() {
      return this.$store.getters['dictionaries/getUsersListStatus']
    },
  },
  methods: {
    createUserModal() {
      this.$refs['user-create-modal'].show()
    },
    setRole(role) {
      this.currentRole = role.name_role || null
      const array = []
      array.push(role.id)
      this.userCreate.role_ids = array
    },
    createUserAccess() {
      this.$store.dispatch('dictionaries/createUser', this.userCreate)
      this.currentRole = 'Выберите роль'
      this.userCreate = {
        name: null,
        email: null,
        password: null,
        is_confirming: false,
        is_active: true,
        role_ids: [],
      }
    },
    setUsersListStatus(status) {
      this.$store.commit('dictionaries/CHANGE_USERS_LIST_FLAG', status)
    },
  },
}
</script>
