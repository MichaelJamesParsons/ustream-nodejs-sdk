/**
 * Implementation of oauth bearer authentication.
 *
 * @class
 */
class OAuthBearerStrategy {
  /**
   * @constructor
   *
   * @param {Ustream} context
   * @param {string} accessToken
   * @param {string} tokenType
   * @param {string} expiresIn
   */
  constructor (context, accessToken, tokenType, expiresIn) {
    this.accessToken = accessToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
    this.context = context
  }

  /**
   * Returns authorization credentials.
   *
   * @returns {Promise}
   */
  authorize () {
    return Promise.resolve({
      access_token: this.accessToken,
      token_type: this.tokenType,
      expires_in: this.expiresIn
    })
  }
}

module.exports = OAuthBearerStrategy
