import { mapMultiRowFields } from 'vuex-map-fields'

export default {
  computed: {
    ...mapMultiRowFields({ services: 'services' })
  },
  mounted() {
    this.$store.dispatch('getServices')
  }
}
