import { expect } from 'chai'
import nock from 'nock'
import { Robot } from '../src/robot'

describe('Dingtalk Robot', function () {
  afterEach(function () {
    nock.cleanAll()
  })

  it('ok', async function () {
    nock('https://oapi.dingtalk.com')
      .persist()
      .post(/^\/robot/)
      .reply(200, { errcode: 0 })

    let robot = new Robot({
      accessToken: 'mock',
      timeout: 1000,
    })

    await robot.text('demo')
  })

  it('fail if response with error', async function () {
    nock('https://oapi.dingtalk.com')
      .persist()
      .post(/^\/robot/)
      .reply(200, { errcode: 400001 })

    let robot = new Robot({
      accessToken: 'mock',
      timeout: 1000,
    })

    try {
      await robot.text('demo')
    } catch (e) {
      expect(e.message).includes('400001')
      return
    }

    expect.fail('should not go here')
  })

  it('retry if server timeout', async function () {
    this.timeout(15000)

    nock('https://oapi.dingtalk.com')
      .persist()
      .post(/^\/robot/)
      .replyWithError({ code: 'ETIMEDOUT' })

    let robot = new Robot({
      accessToken: 'mock',
      timeout: 1000,
      retries: 3,
    })

    let start = Date.now()

    try {
      await robot.text('test')
    } catch (e) {
      expect(e.code).eq('ETIMEDOUT')
    }
    expect(Date.now() - start).gte(3000)
  })

  it('retry if client timeout', async function () {
    this.timeout(15000)

    nock('https://oapi.dingtalk.com')
      .persist()
      .post(/^\/robot/)
      .delay(1050)
      .reply(200, { errcode: 0 })

    let robot = new Robot({
      accessToken: 'mock',
      timeout: 1000,
      retries: 3,
    })

    let start = Date.now()

    try {
      await robot.text('test')
    } catch (e) {
      expect(e.message).includes('timeout')
    }
    expect(Date.now() - start).gte(3000)
  })

  it('retry if server 5xx', async function () {
    this.timeout(15000)

    nock('https://oapi.dingtalk.com')
      .persist()
      .post(/^\/robot/)
      .reply(500, 'bad gateway')

    let robot = new Robot({
      accessToken: 'mock',
      timeout: 1000,
      retries: 3,
    })

    let start = Date.now()

    try {
      await robot.text('test')
    } catch (e) {
      expect(e.message).eq('Request failed with status code 500')
    }
    expect(Date.now() - start).gte(3000)
  })
})
