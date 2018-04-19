const PageableApiResource = require('./pageable_api_resource')
const qs = require('qs')

class DevicePasswords extends ApiResource {
  /**
   * Lists all devices on an account.
   *
   * @param {Number} pageSize - The number of results to show per page.
   * @param {Number} page     - The page to retrieve.
   * @returns {Promise}
   */
  list (pageSize = 100, page = 1) {
    return new Promise((resolve, reject) => {
      this.context.authRequest('get', '/users/self/device-passwords.json')
        .then((res) => {
          resolve(new PageableApiResource(this.context, 'devices', res.devices, res.paging))
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
