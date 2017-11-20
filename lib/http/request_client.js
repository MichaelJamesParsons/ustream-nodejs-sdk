const axios = require('axios')

/**
 * @class
 */
class RequestClient {
  /**
   * @constructor
   */
  constructor (apiEndpoint, http = null) {
    this.http = http || axios
    this.apiEndpoint = apiEndpoint
    this.verbs = {
      'get': {func: this.http.get, hasData: false},
      'post': {func: this.http.post, hasData: true},
      'put': {func: this.http.put, hasData: true},
      'delete': {func: this.http.delete, hasData: false}
    }
  }

  /**
   * Send a HTTP request with API url prefix.
   *
   * @param {string}   verb    - Type of request: get, post, put, delete.
   * @param {string}   route   - URL or API endpoint.
   * @param {{}}       data    - Data to be sent with the request.
   * @param {{}}       headers - Request headers.
   */
  request (verb, route, data = {}, headers = {}) {
    return this.requestRaw(verb, this._buildRoute(route), data, headers)
  }

  /**
   * Send a HTTP request.
   *
   * @param {string}   verb    - Type of request: get, post, put, delete.
   * @param {string}   route   - URL or API endpoint.
   * @param {{}}       data    - Data to be sent with the request.
   * @param {{}}       headers - Request headers.
   */
  requestRaw (verb, route, data = {}, headers = {}) {
    return new Promise((resolve, reject) => {
      if (!this.verbs.hasOwnProperty(verb)) {
        reject(new Error(`Unsupported HTTP verb ${verb}. Supported verbs are get, post, put and delete.`))
      }

      let request = null
      if (this.verbs[verb].hasData) {
        request = this.verbs[verb].func(route, data, {headers: headers})
      } else {
        request = this.verbs[verb].func(route, {headers: headers})
      }

      request.then((res) => {
        resolve(res.data)
      }).catch(function (err) {
        reject(err)
      })
    })
  }

  /**
   * Build full API endpoint url.
   *
   * @param {string}   route
   * @returns {string}
   *
   * @private
   */
  _buildRoute (route) {
    if (route.substr(0, 4) === 'http') {
      return route
    }

    if (route.substr(0, 1) !== '/') {
      route = `/${route}`
    }

    return this.apiEndpoint + route
  }
}

module.exports = RequestClient
