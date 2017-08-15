const PasswordStrategy = require('./password_strategy')

/**
 * @class
 */
class AuthorizationProvider {
  /**
   * @constructor
   *
   * @param {Ustream}  context
   * @param {*} opts - Authorization flow configuration.
   */
  constructor (context, opts = {}) {
    this.context = context
    this.config = opts
    this.provider = null
  }

  /**
   * Obtain API token.
   *
   * @returns {Promise}
   */
  authorize () {
    if (this.provider === null) {
      this.provider = this.getProvider(this.config)
    }

    return this.provider.authorize()
  }

  /**
   * Gets authorization provider.
   *
   * @param {Object} opts - Credentials for a type of authorization.
   *                 opts.type - The type of authorization flow.
   */
  getProvider (opts) {
    if (opts.type === 'password') {
      return new PasswordStrategy(this.context, opts.username, opts.password, opts.client_id, opts.client_secret)
    }

    throw new Error('Invalid authorization type. Supported types include: "password".')
  }
}

module.exports = AuthorizationProvider
