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
          resolve(new PageableApiResource(this.context, 'playlists', res.playlists, res.paging))
        })
        .catch((err) => {
          try {
            if (err.response.status === 404) {
              resolve(new PageableApiResource(this.context, 'playlists', {}, {
                item_count: 0,
                page_count: 0
              }))
            }
            reject(err)
          } catch (error) {
            reject(error)
          }
        })
    })
  }

  /**
   * Lists all videos in a Playlist
   *
   * @param {Number}    playlistId
   * @param {Number} pageSize - The number of results to show per page.
   * @param {Number} page     - The page to retrieve.
   * 
   * @returns {Promise}
   */
  listVideos(playlistId, pageSize = 50, page = 1) {
    return new Promise((resolve, reject) => {
      let url = `/playlists/${playlistId}/videos.json?pagesize=${pageSize}&page=${page}`
      this.context.authRequest('get', url)
        .then((res) => {
          resolve(new PageableApiResource(this.context, 'video', res.videos, res.paging))
        })
        .catch((err) => {
          try {
            if (err.response.status === 404) {
              resolve(new PageableApiResource(this.context, 'video', {}, {
                item_count: 0,
                page_count: 0
              }))
            }
            reject(err)
          } catch (error) {
            reject(error)
          }
        })
    })
  }

  /**
   * Creates a new playlist.
   *
   * @param {string}    title - The title of the playlist.
   * @param {Number}    channelId
   * @param {{}}        opts
   * @param {Number}    opts.is_enabled - Whether the playlist is enabled or not. Values: 1 (enabled), 0 (disabled). (1 by default)
   *
   * @returns {*}
   */
  create(channelId, title, opts = {}) {
    opts.title = title
    return new Promise((resolve, reject) => {
      this.context.authRequest('post', `/channels/${channelId}/playlists.json`, qs.stringify(opts)).then((res) => {
        let url = res._headers.location
        // console.log(url)
        let urlArray = res._headers.location.split('/')
        let playlistId = urlArray[urlArray.length - 1].split('.')[0]
        resolve(playlistId)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Retrieves flag if playlist is available for a specific channel.
   *
   * @param {Number}    playlistId
   *
   * @returns {*}
   */
  get(playlistId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('get', `/playlist/${playlistId}.json`).then((res) => {
        resolve(res.is_enabled)
      }).catch((err) => {
        try {
          if (err.response.status === 404) {
            resolve({
              "playlist": {
                id: playlistId
              },
              message: 'ensure playlists are enabled for channel'
            })
          }
          reject(err)
        } catch (error) {
          reject(error)
        }
      })
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
  addVideo(playlistId, videoId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('put', `/playlists/${playlistId}/videos/${videoId}.json`).then((res) => {
        let url = res._headers.location
        resolve({
          limit: res._headers['x-collection-limit'],
          remaining: res._headers['x-collection-remaining']
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Delete Playlist from Ustream.
   *
   * @param {Number} playlistId - ID of existing playlist
   */
  remove(playlistId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('delete', `/playlists/${playlistId}.json`).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

module.exports = Playlist