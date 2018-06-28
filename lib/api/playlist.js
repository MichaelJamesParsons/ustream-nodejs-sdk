const ApiResource = require('./api_resource')
const PageableApiResource = require('./pageable_api_resource')
const qs = require('qs')

/**
 * @class Channel
 */
class Playlist extends ApiResource {
  /**
   * Retrieves channel details.
   *
   * @param {Number}    channelId
   * @param {{}}        opts
   * @param {string}    opts.detail_level - Verbosity level. Possible value: "minimal". If set to "minimal",
   *                                        the result set is limited to id, title, picture, owner and locks data.
   *                                        If the channel is protected, only minimal data can be retrieved without
   *                                        valid access token.
   *
   * @returns {*}
   */
  isEnabled (channelId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('get', `/channels/${channelId}/settings/playlists.json`).then((res) => {
        resolve(res.is_enabled)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

module.exports = Playlist