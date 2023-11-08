import axios from 'axios'

interface RobotConstructorOptions {
  url?: string
  timeout?: number
}

interface IMentions {
  atMobiles?: string[]
  atUserIds?: string[]
  isAtAll?: boolean
}

interface ILinkReq {
  text: string
  title: string
  messageUrl: string
  picUrl: string
}

interface ITextReq {
  content: string
  at?: IMentions
}

interface IMarkdownReq {
  title: string
  text: string
  at?: IMentions
}

interface IActionCardButton {
  title: string
  action_url: string
}
type IActionCardReq =
  | {
      title: string
      text: string
      single_title: string
      single_url: string
    }
  | {
      title: string
      text: string
      btn_orientation: '0' | '1'
      btn_json_list: IActionCardButton[]
    }

interface IFeedCardLink {
  title: string
  messageURL: string
  picURL: string
}

interface IFeedCardReq {
  links: IFeedCardLink[]
}

class Robot {
  #url?: string
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

    return axios
      .request({
        method: 'POST',
        url: this.#url,
        timeout: this.#timeout,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
      })
      .then((resp) => {
        let status = resp.status
        if (status >= 300) {
          throw new Error(`request dingtaik fail, status ${status}`)
        }

        let { errcode, errmsg } = resp.data
        if (errcode !== 0) {
          throw new Error(
            `request dingtaik fail, errorcode '${errcode}', errormsg '${errmsg}'`,
          )
        }
      })
  }

  text(req: ITextReq): Promise<void>
  text(content: string): Promise<void>
  text(arg: string | ITextReq) {
    let content: string
    let at: IMentions
    if (typeof arg === 'string') {
      content = arg
    } else {
      content = arg.content
      at = arg.at
    }
    return this.request({
      msgtype: 'text',
      text: {
        content: content,
        at,
      },
    })
  }

  markdown(req: IMarkdownReq): Promise<void>
  markdown(title: string, text: string): Promise<void>
  markdown(arg1: string | IMarkdownReq, arg2?: string) {
    let title: string
    let text: string
    let at: IMentions

    if (typeof arg1 === 'string') {
      title = arg1
      text = arg2
    } else {
      title = arg1.title
      text = arg1.text
      at = arg1.at
    }

    return this.request({
      msgtype: 'markdown',
      markdown: {
        title,
        text,
        at,
      },
    })
  }

  actionCard(data: IActionCardReq) {
    return this.request({
      msgtype: 'actionCard',
      actionCard: data,
    })
  }

  feedCard(data: IFeedCardReq) {
    return this.request({
      msgtype: 'feedCard',
      feedCard: data,
    })
  }
}

export { Robot, RobotConstructorOptions }
