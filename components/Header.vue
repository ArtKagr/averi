<template>
  <b-navbar toggleable="lg" type="light" class="bg-white">
    <b-navbar-brand href="#">AVE</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" class="d-flex align-items-center" is-nav>
      <b-navbar-nav>
        <b-nav-item
          v-for="(link, key) in accessMenuItems(short_menu_items)"
          :key="key"
          class="header-container-items-item"
          :class="active_item === key ? '-active_item' : ''"
          :to="{ name: `${link.slag}-manage` }"
          @click="setActiveItem(key)"
        >
          {{ link.title }}
        </b-nav-item>
      </b-navbar-nav>
      <p
        v-if="accessRight.role === 'administrators'"
        v-b-toggle.sidebar-main-menu
        class="m-0 mr-4 custom_button p-2"
        style="color: rgba(0, 0, 0, 0.5)"
      >
        Настройки
      </p>
      <b-sidebar
        id="sidebar-main-menu"
        bg-variant="gray-200"
        backdrop-variant="secondary"
        width="10%"
        backdrop
        left
        shadow=""
        lazy
      >
        <b-navbar-nav class="d-flex flex-column p-3">
          <b-nav-item
            v-for="(link, key) in accessMenuItems(menu_items)"
            :key="key"
            class="header-container-items-item"
            :class="active_item === key ? '-active_item' : ''"
            :to="{ name: `${link.slag}-manage` }"
            @click="setActiveItem(key)"
          >
            {{ link.title }}
          </b-nav-item>
        </b-navbar-nav>
      </b-sidebar>
      <b-navbar-nav class="ml-auto">
        <!--        <b-nav-item-dropdown right>-->
        <!--          <template v-slot:button-content>-->
        <!--            <b-icon-bell class="header-user_settings-notification-icon"></b-icon-bell>-->
        <!--            <span class="header-user_settings-replacements-person">99</span>-->
        <!--          </template>-->
        <!--          <b-dropdown-item href="#">Уведомления</b-dropdown-item>-->
        <!--        </b-nav-item-dropdown>-->

        <b-nav-item-dropdown right>
          <template v-slot:button-content>
            <b-icon-person class="header-user_settings-settings-icon"></b-icon-person>
            <span class="header-user_settings-settings-person">{{ userName }}</span>
          </template>
          <!--          <b-dropdown-item href="#">Профиль</b-dropdown-item>-->
          <b-dropdown-item @click="logOut">Выйти</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      menu_items: [
        { slag: 'sellers', title: 'Поставщики' },
        { slag: 'surcharge', title: 'Надбавки' },
        { slag: 'replacements', title: 'Эквивалентные замены' },
        { slag: 'contracts', title: 'Контракты' },
        { slag: 'procurements', title: 'Объекты закупок' },
        { slag: 'dosageForms', title: 'Эквивалентные  лек. формы' },
      ],
      short_menu_items: [
        { slag: 'purchase', title: 'Закупки' },
        { slag: 'price', title: 'Прайс' },
        { slag: 'user', title: 'Пользователи' },
        { slag: 'stat', title: 'Статистика' },
        { slag: 'sellers', title: 'Поставщики' },
        { slag: 'offers', title: 'Коммерческие предложения' },
      ],
      active_item: 'purchase',
    }
  },
  computed: {
    userName() {
      return this.$store.getters['dictionaries/getAuthUserName']
    },
    accessRight() {
      return this.$access(this.$store.getters['dictionaries/getAuthUser'])
    },
  },
  methods: {
    setActiveItem(item) {
      if (item === 0)
        this.$store.commit('purchase/UPDATE_FILTER_SET', {
          title: 'Фильтры отключены',
          id: null,
          options: {
            status: null,
            is_znvlp: null,
            etp_code: null,
            match: null,
            fcs_type: null,
            count_objects: { min: null, max: null },
            max_price: { min: null, max: null },
            processing_date: { to: null, from: null },
            start_application: { to: null, from: null },
            end_application: { to: null, from: null },
            bidding_date: { to: null, from: null },
            purchase_number: null,
          },
        })
      this.active_item = item
    },
    logOut() {
      this.$auth.logout()
    },
    accessMenuItems(menuItems) {
      const accessRight = this.accessRight
      return menuItems.filter(function (item) {
        if (accessRight.role === 'general_operators' && (item.slag === 'surcharge' || item.slag === 'user'))
          return false
        else if (
          (accessRight.role === 'purchasing_operators' || accessRight.role === 'observers') &&
          (item.slag === 'surcharge' || item.slag === 'user' || item.slag === 'sellers' || item.slag === 'stat')
        )
          return false
        else return item
      })
    },
  },
}
</script>
