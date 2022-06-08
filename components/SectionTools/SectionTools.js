import { mapMultiRowFields, mapFields } from 'vuex-map-fields'
import BaseLogo from '~/components/BaseLogo'
import FilterCard from '~/components/FilterCard'
import FilterService from '~/components/FilterService'

export default {
  components: {
    BaseLogo,
    FilterCard,
    FilterService
  },
  props: {
    map: Object
  },
  data: () => ({
    isFindingGeolocation: false,
    findGeolocationError: false,
    route: [
      {
        latitude: null,
        longitude: null,
        value: '',
        error: false
      }
    ]
  }),
  computed: {
    locations() {
      return this.$store.state.locations
    },
    filteredRoute() {
      return this.route.slice(1)
    },
    ...mapMultiRowFields({ cards: 'cards' }),
    ...mapMultiRowFields({ services: 'services' }),
    ...mapFields({ routeThreshold: 'routeThreshold' })
  },
  mounted() {
    this.$root.$on('addRoute', value => {
      this.map.map.balloon.close()
      this.addRoute({
        latitude: value.latitude,
        longitude: value.longitude,
        value: value.value,
        error: false
      })
      this.buildRoute()
    })
  },
  watch: {
    map() {
      // Добавление новой точки
      this.map.map.events.add('dblclick', async event => {
        const coords = event.get('coords')
        let latitude = parseFloat(coords[0].toFixed(6))
        let longitude = parseFloat(coords[1].toFixed(6))
        let address = await this.$api.findGeolocationName(latitude, longitude)
        this.$root.$emit('addRoute', {
          latitude,
          longitude,
          value: address,
          error: false
        })
      })
    }
  },
  methods: {
    onInputChange(index, start = false) {
      if (start) {
        this.route[0].latitude = null
        this.route[0].longitude = null
      } else {
        this.route[index + 1].latitude = null
        this.route[index + 1].longitude = null
      }
    },
    async findGeolocation() {
      if (this.route[0].value.length === 0) return

      const result = await this.map.findGeolocation(this.route[0].value)
      this.map.map.setBounds(result.bounds, {
        checkZoomRange: true
      })
    },
    findMyselfGeolocation() {
      this.isFindingGeolocation = true

      if (!navigator.geolocation) {
        this.isFindingGeolocation = false
        this.findGeolocationError = true
        this.$store.dispatch('addNotification', [
          'Ваш браузер не поддерживает определение геолокации',
          'error'
        ])
        return
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          let latitude = parseFloat(coords.latitude.toFixed(6))
          let longitude = parseFloat(coords.longitude.toFixed(6))
          this.map.setCenter([latitude, longitude])
          this.map.setZoom(15)
          this.route[0].value = await this.$api.findGeolocationName(
            latitude,
            longitude
          )
          this.route[0].latitude = latitude
          this.route[0].longitude = longitude
          this.isFindingGeolocation = false
          this.buildRoute()
          this.$store.dispatch('addNotification', [
            'Ваша геолокация успешно найдена',
            'info'
          ])
        },
        () => {
          this.isFindingGeolocation = false
          this.findGeolocationError = true
          this.$store.dispatch('addNotification', [
            'Разрешение на получений вашей геолокации не было получено',
            'error'
          ])
        }
      )
    },
    addRoute(
      value = {
        latitude: null,
        longitude: null,
        value: '',
        error: false
      }
    ) {
      if (this.route[0].value === '' && this.route[0].latitude === null) {
        this.route = [value]
      } else {
        this.route.push(value)
      }
    },
    removeRoute(index) {
      this.route.splice(index, 1)
      this.buildRoute()
    },
    resetRoute() {
      this.route = [
        {
          latitude: null,
          longitude: null,
          value: '',
          error: false
        }
      ]
      this.map.resetRoute()
      this.map.clearAdditionalMarkers()
      this.$store.dispatch('addNotification', ['Маршрут очищен', 'info'])
    },
    async buildRoute() {
      const waypoints = []

      this.route.forEach((item, i) => {
        if (item.latitude != null && item.longitude != null) {
          waypoints.push([item.latitude, item.longitude])
          this.route[i].error = false
        } else if (item.value !== '') {
          waypoints.push(item.value)
          this.route[i].error = false
        } else {
          this.route[i].error = 'Поле не заполнено'
          return false
        }
      })

      let start = waypoints.shift()
      let finish
      if (waypoints.length > 0) {
        finish = waypoints.pop()

        this.$store.commit('setIsMapLoading', true)
        await this.$nextTick()

        let statusSetRoute = this.map.setRoute(start, finish, waypoints)

        if (statusSetRoute) {
          this.map.clearAdditionalMarkers()
          return true
        } else {
          this.$store.dispatch('addNotification', [
            'Ошибка подключения к Yandex Maps API',
            'error'
          ])
          return false
        }
      } else {
        this.map.clearAdditionalMarkers()

        if (typeof start === 'string') {
          const result = await this.map.findGeolocation(start)
          this.map.setAdditionalMarker(result.coords)
          this.map.map.setBounds(result.bounds)
        } else {
          this.map.setAdditionalMarker([start[0], start[1]])
        }
        return false
      }
    },
    async filterMarkers() {
      this.$store.commit('setIsMapLoading', true)
      await this.$nextTick()
      let filteredCards = []
      let filteredServices = []

      this.cards.forEach(card => {
        if (card.value) {
          if (card.id != 'card__3') {
            let idInt = atob(card.id).split(':')[1]
            filteredCards.push(idInt)
          } else {
            filteredCards.push(1)
          }
        }
      })

      this.services.forEach(service => {
        if (service.value) {
          let idInt = atob(service.id).split(':')[1]
          filteredServices.push(idInt)
        }
      })

      await this.$store.dispatch('getLocations', {
        cards: filteredCards,
        services: filteredServices
      })

      const activeRoute = this.map.multiRoute.getActiveRoute()
      if (activeRoute) {
        // Если маршрут построен, то перерисовываем точки на маршруте
        await this.map.filterNearbyPlacemarks()
      } else {
        // Иначе отображаем все точки и кластеризуем
        this.map.setCluster(this.locations)
      }

      this.$store.commit('setIsMapLoading', false)
    }
  }
}
