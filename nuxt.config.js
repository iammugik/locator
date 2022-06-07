const autoprefixer = require('autoprefixer')
module.exports = {
  telemetry: false,
  head: {
    title: 'Express Card — Locator',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Локатор по АЗС от топливной процессинговой компании «ЭКСПРЕСС-КАРТ»'
      },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'theme-color', content: '#ffffff' },
      { property: 'og:image:width', content: '1190' },
      { property: 'og:image:height', content: '623' },
      { property: 'og:title', content: 'Express Card Locator' },
      { property: 'og:url', content: 'https://locator.expcard.ru/' },
      {
        property: 'og:image',
        content: 'https://locator.expcard.ru/images/og-image.jpg'
      },
      {
        property: 'og:description',
        content:
          'Локатор по АЗС от топливной процессинговой компании «ЭКСПРЕСС-КАРТ»'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: '/styles/all.min.css'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ea7b00' }
    ],
    script: [
      {
        src:
          'https://api-maps.yandex.ru/2.1?apikey=468c4f51-6730-4767-85d3-ceb693151437&lang=ru_RU',
        type: 'text/javascript',
        body: true
      }
    ]
  },
  loading: { color: '#fff' },
  css: [
    {
      src: 'bulma',
      lang: 'sass'
    },
    {
      src: '~/assets/styles/common.scss',
      lang: 'scss'
    }
  ],
  modules: ['@nuxtjs/axios'],
  plugins: [
    { src: '~/plugins/api', mode: 'all' },
    { src: '~/plugins/mq', mode: 'all' }
  ],
  axios: {
    baseUrl: 'https://locator.expcard.ru'
  },
  build: {
    postcss: {
      plugins: [
        autoprefixer({
          grid: true
        })
      ]
    },
    preset: {
      features: {
        customProperties: false
      }
    }
  },
  extend(config, ctx) {
    if (ctx.isDev && ctx.isClient) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/
      })
    }
  }
}
