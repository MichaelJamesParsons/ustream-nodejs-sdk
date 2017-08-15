const AuthorizationToken = require('./api/authorization/authorization_token')
const RequestClient = require('./http/request_client')
const AuthorizationProvider = require('./api/authorization/authorization_provider')
const VideoApi = require('./api/video')
const ChannelApi = require('./api/channel')

const API_AUTH_ENDPOINT = 'https://www.ustream.tv'
const API_RESOURCE_ENDPOINT = 'https://api.Ustream.tv'

/**
 * @class
 */
class Ustream {
  /**
   * @constructor
   *
   * @param {*} opts - Authorization credentials.
   *
   * @see authenticate for additional information about opts.
   */
  constructor (opts) {
    this.authToken = null
    this.httpClient = new RequestClient(this.getResourceUrl())
    this._authProvider = new AuthorizationProvider(this, opts)

    // Initialize APIs.
    this.video = new VideoApi(this)
    this.channel = new ChannelApi(this)
  }

  /**
   * Sets authorization credentials.
   *
   * @param {Object} opts - A map of credentials.
   *
   * #### Examples
   *
   * Ustream.setAuthCredentials({
   *     type: "password",
   *     username: "<username>",
   *     password: "<password>",
   *     clientId: "<client ID>",
   *     clientSecret: "<client secret>"
   * })
   */
  setAuthCredentials (opts) {
    this._authProvider = new AuthorizationProvider(this, opts)
  }

  /**
   * @param {boolean}  force - If true, the access credentials will be re-authorized even if a valid authorization
   *                           token exists for those credentials.
   */
  authorize (force = false) {
    return new Promise((resolve, reject) => {
      if (!this._isAuthorized() || force) {
        this._authProvider.authorize().then((res, err) => {
          if (err) {
            reject(new Error('Ustream authentication failed.'))
          }

          this.authToken = new AuthorizationToken({
            accessToken: res.access_token,
            tokenType: res.token_type,
            expiresIn: res.expires_in
          })
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * Send an API request.
   *
   * @param {string}   verb
   * @param {string}   route
   * @param {{}}       data
   * @param {{}}       headers
   */
  request (verb, route, data, headers) {
    return this.httpClient.request(verb, route, data, headers)
  }

  /**
   * Send an API request which requires authorization credentials.
   *
   * @param verb
   * @param route
   * @param data
   * @param headers
   */
  authRequest (verb, route, data, headers) {
    return new Promise((resolve) => {
      this.authorize(false).then(() => {
        this.request(verb, route, data, this._buildAuthHeaders(headers)).then((res) => {
          return resolve(res)
        })
      })
    })
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns authorization endpoint.
   *
   * @returns {string}
   *
   */
  getAuthUrl () {
    return API_AUTH_ENDPOINT
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns resource endpoint.
   *
   * @returns {string}
   */
  getResourceUrl () {
    return API_RESOURCE_ENDPOINT
  }

  /**
   * Adds authorization header to headers object.
   *
   * @param {{}} headers
   * @returns {{}}
   * @private
   */
  _buildAuthHeaders (headers = {}) {
    headers['Authorization'] = `Bearer ${this.authToken.access_token}`
    return headers
  }

  /**
   * Returns true if client is authorized to send requests to protected routes.
   *
   * The result is determined by the presence and validity of an authentication
   * token.
   *
   * @returns {boolean}
   * @private
   */
  _isAuthorized () {
    return (this.authToken !== null && !this.authToken.isExpired())
  }
}

module.exports = Ustream
