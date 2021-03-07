<template>
  <div class="d-flex flex-column">
    <b-table class="w-100" :items="organizations" :fields="fields" striped>
      <template v-slot:cell(percent)="row">
        <b-input
          v-model="row.item.percent"
          class="custom_input"
          placeholder="Процент"
          @change="updateCurrentOrganization(row.item)"
        />
      </template>
      <template v-slot:cell(name)="row">
        <b-input
          v-model="row.item.name"
          class="custom_input"
          placeholder="Организация"
          @change="updateCurrentOrganization(row.item)"
        />
      </template>
      <template v-slot:cell(login)="row">
        <b-input
          v-model="row.item.login"
          class="custom_input"
          placeholder="Логин"
          @change="updateCurrentOrganization(row.item)"
        />
      </template>
      <template v-slot:cell(password)="row">
        <b-input
          v-model="row.item.password"
          class="custom_input"
          placeholder="Изменить пароль"
          @change="updateCurrentOrganization(row.item)"
        />
      </template>
    </b-table>
    <div
      class="d-flex align-items-center mt-4 px-4"
      :class="addOrganizationFlag ? 'justify-content-between' : 'justify-content-end'"
    >
      <b-input-group v-if="addOrganizationFlag" class="filter mr-4">
        <b-form-input v-model="customerName" placeholder="Наименование"></b-form-input>
        <b-form-input v-model="customerLogin" placeholder="Логин"></b-form-input>
        <b-form-input v-model="customerPassword" placeholder="Пароль"></b-form-input>
        <b-form-input v-model="customerPercent" placeholder="Процент"></b-form-input>
      </b-input-group>
      <template v-if="organizations && organizations.length < 3">
        <b-icon-patch-plus
          v-if="!addOrganizationFlag"
          class="m-0 h3 pointer"
          variant="info"
          @click="addOrganization(true)"
        ></b-icon-patch-plus>
        <b-icon-patch-minus
          v-else-if="addOrganizationFlag && (!customerName || !customerLogin || !customerPassword)"
          class="m-0 h3 pointer"
          @click="addOrganization(false)"
        ></b-icon-patch-minus>
        <b-icon-patch-check
          v-else-if="addOrganizationFlag && customerName && customerLogin && customerPassword"
          class="m-0 h3 pointer"
          variant="success"
          @click="createOrganization"
        ></b-icon-patch-check>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OffersSettings',
  props: {
    source: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      customerName: null,
      customerLogin: null,
      customerPassword: null,
      customerPercent: null,
      addOrganizationFlag: false,
      fields: [
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
          key: 'login',
          label: 'Логин',
          class: 'align-middle',
        },
        {
          key: 'password',
          label: 'Пароль',
          class: 'align-middle',
        },
      ],
    }
  },
  computed: {
    organizations() {
      return this.$store.getters['offers/getOrganizations']
    },
  },
  created() {
    this.$store.dispatch('offers/fetchOrganizations')
  },
  methods: {
    addOrganization(flag) {
      this.addOrganizationFlag = flag
      if (!flag) {
        this.customerName = null
        this.customerLogin = null
        this.customerPassword = null
        this.customerPercent = null
      }
    },
    createOrganization() {
      this.$store.dispatch('offers/createCurrentOrganization', {
        name: this.customerName,
        login: this.customerLogin,
        password: this.customerPassword,
        percent: this.customerPercent,
      })
      this.addOrganizationFlag = false
      this.customerName = null
      this.customerLogin = null
      this.customerPassword = null
      this.customerPercent = null
    },
    updateCurrentOrganization(organization) {
      this.$store.dispatch('offers/updateCurrentOrganization', organization)
    },
  },
}
</script>
