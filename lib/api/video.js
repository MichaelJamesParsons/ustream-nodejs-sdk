const ApiResource = require('./api_resource')
const PageableApiResource = require('./pageable_api_resource')
const Ftp = require('ftp')
const qs = require('qs')

/**
 * Class Video
 *
 * Implementation of Ustream's video API.
 *
 * @class
 * @link http://developers.Ustream.tv/broadcasting-api/channel.html
 */
class Video extends ApiResource {
  /**
   * @constructor
   *
   * @param context
   */
  constructor (context) {
    super(context)
    this.ftp = new Ftp()
  }

  /**
   * Lists all videos on an account.
   *
   * @param {string} channelId - ID of a channel.
   * @param {Number} pageSize  - The number of results to show per page.
   * @param {Number} page      - The page to retrieve.
   *
   * @returns {Promise}
   */
  list (channelId, pageSize = 100, page = 1) {
    return new Promise((resolve, reject) => {
      /**
       * @var {{videos, paging}} res
       */
      this.context.authRequest('get', `/channels/${channelId}/videos.json?pagesize=${pageSize}&page=${page}`)
        .then((res) => {
          resolve(new PageableApiResource(this.context, 'videos', res.videos, res.paging))
        }).catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Get video fields, including title, description, url, etc.
   *
   * @param {Number} videoId - ID of existing video
   */
  get (videoId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('get', `/videos/${videoId}.json`).then((res) => {
        resolve(res.video)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Delete video from Ustream.
   *
   * @param {Number} videoId - ID of existing video
   */
  remove (videoId) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('delete', `/videos/${videoId}.json`).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  /**
   * Check the status of an uploaded video.
   *
   * Possible returned statuses are:
   *    - initiated
   *    - transferred
   *    - queued
   *    - pending
   *    - transcoding
   *    - complete
   *    - error
   *
   * @param {Number} channelId
   * @param {Number} videoId
   */
  getStatus (channelId, videoId) {
    return this.context.authRequest('get', `/channels/${channelId}/uploads/${videoId}.json`)
  }

  /**
   * Uploads a video to Ustream.
   *
   * @param {Number} channelId
   * @param {{}}     opts
   * @param {string} opts.title       - (optional) Video title.
   * @param {string} opts.description - (optional) Video description.
   * @param {string} opts.protect     - (optional) Protection level. Acceptable values are "public" or "private".
   *                                               Default value is "private".
   * @param {{originalname, stream}} file
   * @param {stream} file.stream
   *
   * @return {Promise}
   */
  upload (channelId, file, opts) {
    const self = this
    let ext = file.originalname.substr(file.originalname.lastIndexOf('.') + 1)

    return new Promise((resolve, reject) => {
      this._initiateUpload(channelId, opts)
        .then((res) => {
          return self._ftpUpload(res.host, res.user, res.password, res.port, `${res.path}.${ext}`, file.stream)
            .then(() => {
              return self._completeUpload(channelId, res['videoId'], 'ready')
            })
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * Initiates a video upload.
   *
   * @param {Number} channelId       - ID of a Ustream channel.
   * @param {{}}     opts
   * @param {string} opts.title       - (optional) Video title.
   * @param {string} opts.description - (optional) Video description.
   * @param {string} opts.protect     - (optional) Protection level. Acceptable values are "public" or "private".
   *                                               Default value is "public".
   *
   * @return {Promise}
   *
   * @private
   */
  _initiateUpload (channelId, opts) {
    return this.context.authRequest('post', `/channels/${channelId}/uploads.json?type=videoupload-ftp`, qs.stringify(opts))
  }

  /**
   * Uploads video binary stream.
   *
   * The method _initiate upload must be executed immediately before this method.
   *
   * @param {string} ftpHost  - Remote host server.
   * @param {string} ftpUser  - FTP username.
   * @param {string} ftpPass  - FTP password.
   * @param {Number} ftpPort  - FTP port.
   * @param {string} ftpDest  - Destination on remote server.
   * @param {Stream} stream
   *
   * @return {Promise}
   *
   * @private
   */
  _ftpUpload (ftpHost, ftpUser, ftpPass, ftpPort, ftpDest, stream) {
    let ftp = new Ftp()

    return new Promise((resolve, reject) => {
      ftp.binary((err) => {
        if (err) {
          return reject(new Error('Failed to set FTP transfer type to binary.'))
        }
      })

      ftp.on('ready', () => {
        ftp.put(stream, ftpDest, (err) => {
          ftp.end()

          if (err) {
            return reject(err)
          }

          return resolve()
        })
      })

      ftp.on('error', (err) => {
        return reject(err)
      })

      ftp.connect({
        host: `${ftpHost}`,
        port: ftpPort,
        user: ftpUser,
        password: ftpPass
      })
    })
  }

  /**
   * Signals that FTP file transfer is complete.
   *
   * Must be executed after _ftpUpload().
   *
   * @param {Number}   channelId - ID of Ustream channel.
   * @param {Number}   videoId   - ID of Ustream video.
   * @param {string}   status     - Status of video. Default is "ready".
   *
   * @return {Promise}
   *
   * @private
   */
  _completeUpload (channelId, videoId, status) {
    status = (status !== null) ? status : 'ready'
    let payload = qs.stringify({status: status})

    return new Promise((resolve, reject) => {
      this.context.authRequest('put', `/channels/${channelId}/uploads/${videoId}.json`, payload)
        .then(() => {
          resolve({
            channelId: channelId,
            videoId: videoId
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = Video
