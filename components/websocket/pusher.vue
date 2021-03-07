<template>
  <div></div>
</template>

<script>
import LaravelEcho from 'laravel-echo'
export default {
  name: 'WsPusher',
  data() {
    return {
      user: {},
      isActive: null,
      typingTimer: null,
    }
  },
  computed: {
    channelPurchase() {
      return window.Echo.join('App.Purchase')
    },
  },
  mounted() {
    this.user = this.$auth.user.data
    if (!window.Echo) {
      const token =
        localStorage.getItem('auth._token.laravel.passport') !== null
          ? localStorage.getItem('auth._token.laravel.passport')
          : localStorage.getItem('auth._token.local')
      window.Pusher = require('pusher-js')

      window.Echo = new LaravelEcho({
        authEndpoint: process.env.API_URL + 'broadcasting/auth',
        broadcaster: 'pusher',
        key: process.env.pusherKey,
        cluster: process.env.pusherCluster,
        wsHost: process.env.pusherHost,
        statsHost: process.env.pusherHost,
        sockjsHost: process.env.pusherHost,
        wsPort: process.env.pusherPort,
        wssPort: process.env.pusherPort,
        enabledTransports: ['ws'],
        auth: {
          headers: {
            Authorization: token,
          },
        },
        encrypted: true,
        disableStats: true,
      })
    }
    if (window.Echo) {
      this.listenUserNotification()
      this.listenPurchase()
    }
  },
  methods: {
    listenUserNotification() {
      window.Echo.private('App.User.' + this.user.id).notification((n) => {
        console.warn('notification', n)
      })
    },
    listenPurchase() {
      this.channelPurchase
        .here((users) => {
          // this.activeUsers = users
          // this.$store.commit('user/setItemsActiveUsers', users)
        })
        .joining((user) => {
          // this.activeUsers.push(user)
          // this.$store.commit('user/setItemsActiveUser', user)
        })
        .leaving((user) => {
          // this.activeUsers.splice(this.activeUsers.indexOf(user), 1)
          // this.$store.commit('user/unsetItemsActiveUser', user)
        })
        .listenForWhisper('typing', (e) => {
          this.isActive = e
          if (this.typingTimer) clearTimeout(this.typingTimer)
          this.typingTimer = setTimeout(() => {
            this.isActive = false
          }, 2000)
        })

      window.Echo.private('App.Purchase')
        .listen('PurchaseUpdate', (e) => {
          console.warn('PurchaseUpdate', e)
          // this.$store.commit('purchase/updatePurchaseItem', e.data)
          // this.$store.commit('purchase/updateItemsBusyAll', e.data)
        })
        .listen('Purchase\\updateStatus', (e) => {
          console.warn('updateStatus', e)
          // this.$store.commit('purchase/updateItemPurchaseStatus', e.data)
        })
    },
  },
}
</script>
