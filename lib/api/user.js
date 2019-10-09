const ApiResource = require('./api_resource')
const qs = require('qs')

/**
 * @class User
 */
class User extends ApiResource {
  /**
   * Creates a new label.
   *
   * @param {string} labelName - The name of the label.
   * @returns {Promise}
   */
  createLabel (labelName) {
    return this.context.authRequest(
      'post', `/users/self/labels.json`, qs.stringify({label_name: labelName}))
  }

  /**
   * Lists all labels.
   *
   * @returns {Promise}
   */
  listLabels () {
    return this.context.authRequest('get', '/users/self/labels.json')
  }

  /**
   * Modify an existing label's fields.
   *
   * @param {number} labelId - The ID of an existing label.
   * @param {string} labelName - The value to replace the label's current name.
   * @returns {Promise}
   */
  modifyLabel (labelId, labelName) {
    return this.context.authRequest(
      'put', `/users/self/label/${labelId}.json`, qs.stringify({label_name: labelName}))
  }

  /**
   * Delete an existing label.
   *
   * @param {number} labelId - The ID of an existing label.
   * @returns {Promise}
   */
  deleteLabel (labelId) {
    return this.context.authRequest('delete', `/users/self/label/${labelId}.json`)
  }
}

module.exports = User
