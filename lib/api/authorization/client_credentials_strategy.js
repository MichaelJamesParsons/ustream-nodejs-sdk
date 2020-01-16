const qs = require('qs')

/**
 * Implementation of client credentials authentication.
 *
 * @class
 * @See "Client credentials flow" section of documentation.
 */
class ClientCredentialsStrategy {
  /**
   * @constructor
   *
   * @param {Ustream} context
   * @param {string} clientId   - 40 character sha1 hash, provided by IBM Video
   *  Streaming.
   * @param {string} clientSecret - A hash provided along with the Client key.
   * @param {string} deviceName - Device name.
   * @param {string} scope      - Currently, only use of the "broadcaster"
   *  scope is supported. If the parameter is empty, no scope will be set.
   */
  constructor (context, clientId, clientSecret, deviceName, scope) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.deviceName = deviceName
    this.scope = scope
    this.context = context
  }

  /**
   * Authorizes request using Ustream client credentials.
   *
   * @returns {Promise}
   */
  authorize () {
    return this.context.httpClient.requestRaw('post', `${this.context.getAuthUrl()}/oauth2/token`, qs.stringify({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      device_name: this.deviceName,
      scope: this.scope,
      token_type: 'bearer'
    }), {
      'Authorization': `Basic ${this.clientSecret}`
    })
  }
}

module.exports = ClientCredentialsStrategy
