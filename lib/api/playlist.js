const ApiResource = require('./api_resource')
const PageableApiResource = require('./pageable_api_resource')
const qs = require('qs')

/**
 * @class Playlist
 */
class Playlist extends ApiResource {
  /**
   * Retrieves flag if playlist is available for a specific channel.
   *
   * @param {Number}    channelId
   *
   * @returns {*}
   */
  isEnabled (channelId) {
    return this.context.authRequest('get', `/channels/${channelId}/settings/playlists.json`)
      .then((res) => {
        return Promise.resolve(res.isEnabled)
      })
  }

  /**
   * Lists all Playlists on an channel.
   *
   * @param {Number} pageSize - The number of results to show per page.
   * @param {Number} page     - The page to retrieve.
   * @param {boolean} includeEmptyLists   - Should empty playlists be returned.
   * @returns {Promise}
   */
  list (channelId, pageSize = 50, page = 1, includeEmptyLists = false) {
    pageSize = Math.min(pageSize, 50)
    return this.context.authRequest('get', `/channels/${channelId}/playlists.json`, qs.stringify({
      pageSize,
      page,
      filter: {
        include_empty: includeEmptyLists
      }
    }))
      .then((res) => {
        return Promise.resolve(new PageableApiResource(this.context, 'playlists', res.playlists, res.paging))
      })
  }

  /**
   * Lists all videos in a Playlist
   *
   * @param {Number} playlistId
   * @param {Number} pageSize - The number of results to show per page.
   * @param {Number} page     - The page to retrieve.
   *
   * @returns {Promise}
   */
  listVideos (playlistId, pageSize = 200, page = 1) {
    pageSize = Math.min(pageSize, 200)
    return this.context.authRequest('get', `/playlists/${playlistId}/videos.json`, qs.stringify({
      pageSize,
      page
    })).then((res) => {
      return Promise.resolve(new PageableApiResource(this.context, 'video', res.videos, res.paging))
    })
  }

  /**
   * Creates a new playlist.
   *
   * @param {string}    title - The title of the playlist.
   * @param {Number}    channelId
   * @param {Number}    isEnabled - Whether the playlist is enabled or not. Possible values are 1 (enabled), 0 (disabled). The default is 1 (enabled).
   *
   * @returns {*}
   */
  create (channelId, title, isEnabled = 1) {
    return this.context.authRequest('post', `/channels/${channelId}/playlists.json`, qs.stringify(title, isEnabled)).then((res) => {
      let urlArray = res._headers.location.split('/')
      let playlistId = urlArray[urlArray.length - 1].split('.')[0]
      return Promise.resolve(playlistId)
    })
  }

  /**
   * Retrieves the details on a specific playlist
   *
   * @param {Number}    playlistId
   *
   * @returns {*}
   */
  get (playlistId) {
    return this.context.authRequest('get', `/playlist/${playlistId}.json`).then((res) => {
      return Promise.resolve(res)
    })
  }

  /**
   * Put a video in a playlist.
   *
   * @param {Number}    playlistId
   * @param {Number}    videoId
   *
   * @returns {*}
   */
  addVideo (playlistId, videoId) {
    return this.context.authRequest('put', `/playlists/${playlistId}/videos/${videoId}.json`).then((res) => {
      return Promise.resolve({
        limit: res._headers['x-collection-limit'],
        remaining: res._headers['x-collection-remaining']
      })
    })
  }

  /**
   * Delete Playlist from Ustream.
   *
   * @param {Number} playlistId
   */
  remove (playlistId) {
    return this.context.authRequest('delete', `/playlists/${playlistId}.json`).then((res) => {
      return Promise.resolve(res)
    })
  }
}

module.exports = Playlist
