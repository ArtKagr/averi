export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [{ src: '~/plugins/datepicker.js', ssr: false }, '~/plugins/formatmoney.js', '~/plugins/access.js'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    // '@nuxtjs/stylelint-module',
    ['@nuxtjs/moment', ['ru']],
    '@nuxtjs/dotenv',
  ],
  /*
   ** Nuxt.js modules
   */

  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // prefix: '/api/',
    credentials: true,
    baseURL: process.env.API_URL || 'https://api-dev.eu39.ru/',
  },

  /*
   ** Uuth module configuration
   ** See https://auth.nuxtjs.org/guide/setup.html
   */
  auth: {
    // Options
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/purchase/manage',
      callback: '/auth/callback',
      user: '/profile',
    },
    watchLoggedIn: true,
    token: {
      prefix: '_token.',
    },
    localStorage: {
      prefix: 'auth.',
    },
    cookie: false,
    vuex: {
      namespace: 'auth',
    },
    scopeKey: 'data',
    strategies: {
      local: {
        endpoints: {
          login: {
            baseURL: process.env.API_URL,
            url: '/api/auth/token',
            method: 'post',
            propertyName: 'access_token',
          },
          logout: {
            baseURL: process.env.API_URL,
            url: '/api/auth/logout',
            method: 'post',
          },
          user: {
            baseURL: process.env.API_URL,
            url: '/api/auth/user',
            method: 'get',
            propertyName: false,
          },
        },
      },
    },
  },

  bootstrapVue: {
    icons: true,
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },
  router: {
    middleware: ['auth'],
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    cache: true,
  },
  server: {
    port: 3232,
    host: 'local-dev.eu39.ru',
  },
  env: {
    pusherKey: process.env.PUSHER_APP_KEY || 'NOT_ENV_CONFIG',
    pusherCluster: process.env.PUSHER_APP_CLUSTER || 'NOT_ENV_CONFIG',
    pusherPort: 443, // process.env.LARAVEL_WEBSOCKETS_PORT || 'NOT_ENV_CONFIG',
    pusherHost: process.env.PUSHER_APP_HOST || 'NOT_ENV_CONFIG',
  },
}
