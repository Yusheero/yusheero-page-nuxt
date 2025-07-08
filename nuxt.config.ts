// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts'
  ],

  css: [
    '~/assets/style/style.scss'
  ],

  vite: {
    assetsInclude: ['**/*.glb']
  },

  googleFonts: {
    families: {
      'Gabarito': [400, 600, 700]
    }
  },

  app: {
    head: {
      title: 'Yusheero',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      // Здесь можно добавить публичные переменные окружения
    }
  }
})
