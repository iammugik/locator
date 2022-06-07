import {
  getIconUrl,
  getPlacemarkContent
} from '~/components/SectionMap/Placemark'
import { getPoint, getRouteToCoords } from '~/components/SectionMap/utils'

export default class YandexMap {
  constructor({ api, store, isMobile }) {
    this.$api = api
    this.$store = store
    this.map = null
    this.cluster = null
    this.multiRoute = null
    this.nearbyPlacemarks = null
    this.additionalMarkers = []

    const zoomControl = new ymaps.control.ZoomControl({
      options: {
        size: 'small'
      }
    })

    this.map = new ymaps.Map(
      document.getElementById('map'),
      {
        center: [55.7534091, 37.6208559],
        zoom: 13,
        controls: [zoomControl]
      },
      {
        // На мобилке переключаем балуны меток в режим панели
        balloonPanelMaxMapArea: isMobile ? Infinity : 0
      }
    )

    // Отключаем зум при даблклике
    this.map.behaviors.disable('dblClickZoom')

    this.initCluster()
    this.initMultiRoute()
  }

  /**
   * Формирует метки из локаций
   * @param locations
   * @returns {*}
   */
  getPlacemarks(locations) {
    return locations.map(({ coordinates, vendor }) => {
      const iconUrl = getIconUrl(vendor.name)
      const placemark = new ymaps.Placemark(
        coordinates,
        {},
        {
          iconLayout: 'default#image',
          iconImageHref: iconUrl,
          iconImageSize: [30, 43],
          balloonOffset: [3, -39],
          balloonMaxHeight: 600,
          openEmptyBalloon: true,
          hideIconOnBalloonOpen: false
        }
      )

      placemark.events.add('balloonopen', async () => {
        // placemark.properties.set('balloonContent', 'Загружаем информацию...')
        const info = await this.$api.getInfo(coordinates)
        const address = await this.$api.findGeolocationName(
          info.latitude,
          info.longitude
        )
        const placemarkContent = getPlacemarkContent(info, address)
        placemark.properties.set('balloonContent', placemarkContent)
      })

      return placemark
    })
  }
  async filterNearbyPlacemarks() {
    const locations = this.$store.state.locations
    const threshold = this.$store.state.routeThreshold

    this.map.geoObjects.remove(this.nearbyPlacemarks)
    this.nearbyPlacemarks = null
    this.cluster.removeAll()

    const routePolyLines = this.multiRoute
      .getRoutes()
      .toArray()
      .map(route => new ymaps.Polyline(getRouteToCoords(route)))

    // Добавляем на карту кривую маршрута
    const routeCurve = new ymaps.GeoObjectCollection(
      { children: routePolyLines },
      { visible: false }
    )
    this.map.geoObjects.add(routeCurve)

    // Шаг 1. Быстрая фильтрация заведомо лишних меток
    // Добавляем на карту прямоугольник, вмещающий маршрут целиком с учетом
    // threshold, и фильтруем только локации в этом прямоугольнике
    const bounds = routeCurve.getBounds()
    const boundsWithThreshold = [
      getPoint(bounds[0], 225, threshold),
      getPoint(bounds[1], 45, threshold)
    ]
    const boundRectangle = new ymaps.Rectangle(
      boundsWithThreshold,
      {},
      { visible: false }
    )
    this.map.geoObjects.add(boundRectangle)

    const placemarks = ymaps
      .geoQuery(this.getPlacemarks(locations))
      .searchInside(boundRectangle)

    // Шаг 2. Фильтрация оставшихся меток на расстоянии threshold
    const nearbyPlacemarks = []
    placemarks.each(element => {
      const coords = element.geometry.getCoordinates()

      const isNearSomeRoute = routePolyLines.some(line => {
        const closest = line.geometry.getClosest(coords)
        return closest.distance < threshold
      })
      if (isNearSomeRoute) {
        nearbyPlacemarks.push(element)
      }
    })

    this.nearbyPlacemarks = new ymaps.GeoObjectCollection({
      children: nearbyPlacemarks
    })

    this.map.geoObjects.add(this.nearbyPlacemarks)
    this.map.geoObjects.remove(routeCurve)
    this.map.geoObjects.remove(boundRectangle)
    this.$store.commit('setIsMapLoading', false)
  }
  resetNearbyPlacemarks() {
    this.map.geoObjects.remove(this.nearbyPlacemarks)
    this.nearbyPlacemarks = null
    this.setCluster(this.$store.state.locations)
  }
  initCluster() {
    this.cluster = new ymaps.Clusterer({
      clusterIcons: [
        {
          href: '/images/markers/cluster.png',
          size: [53, 52],
          offset: [-26, -26]
        }
      ],
      gridSize: 128,
      preset: 'islands#invertedBlackClusterIcons',
      hasBalloon: false
    })
    this.map.geoObjects.add(this.cluster)
  }
  setCluster(locations) {
    this.cluster.removeAll()
    let placemarks = this.getPlacemarks(locations)
    this.cluster.add(placemarks)
  }
  initMultiRoute() {
    this.multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [],
        params: {
          // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
          results: 2,
          avoidTrafficJams: true
        }
      },
      {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
      }
    )
    this.map.geoObjects.add(this.multiRoute)

    this.multiRoute.model.events.add('requestsuccess', () => {
      const activeRoute = this.multiRoute.getActiveRoute()
      if (activeRoute) {
        // Масштабируем карту при обновлении маршрута
        this.map.setBounds(activeRoute.getBounds(), {
          checkZoomRange: true
        })
        // Фильтруем точки вдоль маршрута
        this.filterNearbyPlacemarks()
      } else {
        this.resetNearbyPlacemarks()
      }
    })
  }
  setCenter(position) {
    this.map.setCenter(position)
  }
  setZoom(value) {
    this.map.setZoom(value)
  }
  setAdditionalMarker([latitude, longitude]) {
    const marker = new ymaps.GeoObject({
      geometry: {
        type: 'Point',
        coordinates: [latitude, longitude]
      }
    })
    this.map.geoObjects.add(marker)
    this.additionalMarkers.push(marker)
  }
  clearAdditionalMarkers() {
    this.additionalMarkers.forEach(marker => {
      this.map.geoObjects.remove(marker)
    })
    this.additionalMarkers = []
  }
  setRoute(start, finish, waypoints = []) {
    if (!start || !finish) return false

    const referencePoints = [start, ...waypoints, finish]
    const viaIndexes = [...referencePoints.keys()].slice(1, -1)
    this.multiRoute.model.setReferencePoints(referencePoints, viaIndexes)

    return true
  }
  resetRoute() {
    this.multiRoute.model.setReferencePoints([], [])
  }
}
