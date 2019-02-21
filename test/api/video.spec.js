const {it, describe, afterEach} = require('mocha')
const {assert} = require('chai')
const sinon = require('sinon')
const Ustream = require('../../lib/ustream')

describe('api.video', () => {
  describe('#upload', () => {
    let ustream = new Ustream({})
    let sandbox = sinon.createSandbox()

    beforeEach(() => {
      sandbox.stub(ustream, 'authRequest')
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should initiate upload with correct parameters', () => {
      sandbox.stub(ustream, '_initiateUpload')

      videoApi.upload()
    })
  })
})
