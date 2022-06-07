import YandexMap from './YandexMap.js'
import SectionTools from '~/components/SectionTools'

export default {
  components: {
    SectionTools
  },
  data: () => ({
    map: null
  }),
  computed: {
    locations() {
      return this.$store.state.locations
    },
    isShowTools() {
      return this.$store.state.isShowTools
    },
    isMapLoading() {
      return this.$store.state.isMapLoading
    },
    isMobile() {
      return this.$mq === 'tablet'
    }
  },
  watch: {
    isShowTools() {
      setTimeout(() => {
        this.map.map.container.fitToViewport()
      }, 500)
    },
    isMobile(value) {
      if (this.map) {
        this.map.map.options.set('balloonPanelMaxMapArea', value ? Infinity : 0)
      }
    }
  },
  mounted() {
    ymaps.ready(() => {
      this.map = new YandexMap({
        api: this.$api,
        store: this.$store,
        isMobile: this.isMobile
      })
      this.init()
    })
  },
  methods: {
    toggleTools() {
      this.$store.commit('setIsShowTools', !this.isShowTools)
    },
    async init() {
      this.$store.commit('setIsMapLoading', true)
      await this.$store.dispatch('getLocations')
      this.map.setCluster(this.locations)
      this.$store.commit('setIsMapLoading', false)
    }
  }
}
