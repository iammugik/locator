import { getField, updateField } from 'vuex-map-fields'

const state = () => ({
  cards: [
    {
      id: '',
      image: '',
      name: '',
      value: false
    }
  ],
  services: [
    {
      id: '',
      name: '',
      value: false
    }
  ],
  locations: [],
  routeThreshold: 500,
  cardsValue: null,
  servicesValue: null,
  isShowCardsPopup: true,
  isShowTools: true,
  isMapLoading: true,
  notifications: []
})

const getters = {
  getField
}

const mutations = {
  updateField,
  setCards(state, value) {
    state.cards = value
  },
  setServices(state, value) {
    state.services = value
  },
  setServicesValue(state, value) {
    state.servicesValue = value
  },
  setLocations(state, value) {
    state.locations = value
  },
  setIsShowCardsPopup(state, value) {
    state.isShowCardsPopup = value
  },
  setCardsValue(state, value) {
    state.cardsValue = value
  },
  setCardsIndexTrue(state, index) {
    state.cards[index].value = true
  },
  setIsShowTools(state, value) {
    state.isShowTools = value
  },
  setIsMapLoading(state, value) {
    state.isMapLoading = value
  },
  addNotification(state, value) {
    state.notifications.push(value)
  },
  removeNotification(state) {
    state.notifications.shift()
  }
}

const actions = {
  addNotification({ commit }, [text, type]) {
    commit('addNotification', { text, type })
    setTimeout(() => {
      commit('removeNotification')
    }, 5000)
  },

  getCards({ commit }) {
    return this.$api
      .getCards()
      .then(response => {
        const cards = response.cards.map(card => ({
          ...card,
          value: false
        }))
        commit('setCards', cards)
      })
      .catch(error => {
        dispatch('addNotification', [error, 'error'])
        return false
      })
  },

  getServices({ commit }) {
    return this.$api
      .getServices()
      .then(response => {
        const services = response.services.map(service => ({
          ...service,
          value: false
        }))
        commit('setServices', services)
      })
      .catch(error => {
        dispatch('addNotification', [error, 'error'])
        return false
      })
  },

  getLocations({ commit, dispatch, state }, { cards, services } = {}) {
    let queryCard = ''
    if ((cards && cards.length !== 0) || (services && services.length !== 0)) {
      queryCard = '('
    }
    if (cards && cards.length !== 0) {
      queryCard = queryCard + `cards: [${cards}]`
    }
    if (cards && services && cards.length !== 0 && services.length !== 0) {
      queryCard = queryCard + ' ,'
    }
    if (services && services.length !== 0) {
      queryCard = queryCard + `placeservice_Service_In: "${services}"`
    }
    if ((cards && cards.length !== 0) || (services && services.length !== 0)) {
      queryCard = queryCard + ')'
    }

    if (!cards && !services) {
      let idInt = atob(state.cardsValue).split(':')[1]
      queryCard = `(cards: [${idInt}])`
    }

    return this.$api
      .getLocations(queryCard)
      .then(response => {
        const locations = response.places.edges.map(place => ({
          vendor: place.node.vendor,
          coordinates: [place.node.latitude, place.node.longitude]
        }))
        commit('setLocations', locations)
        dispatch('addNotification', ['Точки АЗС успешно загружены', 'info'])
      })
      .catch(error => {
        commit('setLocations', [])
        dispatch('addNotification', [error, 'error'])
        return false
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
