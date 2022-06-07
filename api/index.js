class Api {
  constructor({ axios }) {
    this.$axios = axios
  }

  getCards() {
    return this.$axios
      .$get('/azs/api/v2/prod/', {
        params: {
          query: `{
            cards{
              id
              name
              image
              isMain
            }
          }`
        }
      })
      .then(response => response.data)
      .catch(error => {
        console.log(error)
      })
  }

  getLocations(query) {
    return this.$axios
      .$get('/azs/api/v2/prod/', {
        params: {
          query: `{
            places${query} {
              edges {
                node {
                  latitude
                  longitude
                  vendor {
                    name
                  }
                }
              }
            }
          }`
        }
      })
      .then(response => response.data)
      .catch(error => {
        console.log(error)
      })
  }

  getServices() {
    return this.$axios
      .$get('/azs/api/v2/prod/', {
        params: {
          query: `{
          services {
            id
            name
          }
        }`
        }
      })
      .then(response => response.data)
      .catch(error => {
        console.log(error)
      })
  }

  getInfo([latitude, longitude]) {
    return this.$axios
      .$get('/azs/api/v2/prod/', {
        params: {
          query: `{
                places(latitude: ${latitude}, longitude: ${longitude}) {
                  edges {
                    node {
                      address
                      latitude
                      longitude
                      phone
                      vendor {
                        name
                      }
                      house
                      cards {
                        edges {
                          node {
                            name
                            provider
                            image
                          }
                        }
                      }
                      placeserviceSet {
                        edges {
                          node {
                            price
                            date
                            service {
                                name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }`
        }
      })
      .then(response => response.data.places.edges[0].node)
      .catch(error => {
        console.log(error)
      })
  }

  findGeolocationPos(address) {
    return this.$axios
      .$get('/azs/api/v1/places/coordinates/', {
        params: {
          address
        }
      })
      .then(response => response)
      .catch(error => '')
  }

  findGeolocationName(latitude, longitude) {
    return this.$axios
      .$get('/azs/api/v1/places/address/', {
        params: {
          latitude,
          longitude
        }
      })
      .then(response => response.data.address)
      .catch(error => '')
  }
}

export default Api
