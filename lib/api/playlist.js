const ApiResource = require('./api_resource')
const PageableApiResource = require('./pageable_api_resource')
const qs = require('qs')

/**
 * @class Channel
 */
class Playlist extends ApiResource {
  /**
   * Retrieves flag if playlist is available for a specific channel.
   *
   * @param {Number}    channelId
   *
   * @returns {*}
   */
  isEnabled(channelId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('get', `/channels/${channelId}/settings/playlists.json`).then((res) => {
        resolve(res.is_enabled)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Lists all Playlists on an channel.
   *
   * @param {Number} pageSize - The number of results to show per page.
   * @param {Number} page     - The page to retrieve.
   * @returns {Promise}
   */
  list(channelId, pageSize = 50, page = 1, filter = 'include_empty') {
    return new Promise((resolve, reject) => {
      /**
       * @var {{channels, paging}} res
       */
      this.context.authRequest('get', `/channels/${channelId}/playlists.json?pagesize=${pageSize}&page=${page}&filter=${filter}`)
        .then((res) => {
          resolve(new PageableApiResource(this.context, 'channels', res.channels, res.paging))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = Playlist