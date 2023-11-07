import axios from 'axios'

export interface RobotConstructorOptions {
  url?: string
  timeout?: number
}

export class Robot {
  #url: string
  #timeout: number

  constructor(opts: RobotConstructorOptions) {
    this.#url = opts.url
    this.#timeout = opts.timeout || 3000
    if (!this.#url) {
      console.warn('url is empty, all operations will ignore')
    }
  }

  request(data: object) {
    if (!this.#url) {
      return
    }

    return axios.request({
      method: 'POST',
      url: this.#url,
      timeout: this.#timeout,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    })
  }

  text(text: string) {
    return this.request({
      msgtype: 'text',
      text: {
        content: text,
      },
    })
  }

  markdown(title: string, text: string) {
    return this.request({
      msgtype: 'markdown',
      markdown: {
        title,
        text,
      },
    })
  }
}
