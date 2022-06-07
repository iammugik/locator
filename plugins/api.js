import Api from '../api/index'

export default (context, inject) => {
  const api = new Api({
    axios: context.$axios
  })
  inject('api', api)
}
