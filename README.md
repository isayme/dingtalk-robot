# 支持的特性

- 支持 secret 签名
- 支持 text/markdown/link/actionCard/feedCard 5 种消息类型

# 快速使用

## 安装

```
npm install '@isayme/dingtalk-robot'
或
pnpm add '@isayme/dingtalk-robot'
```

## 使用包

```
// CommonJS
const { Robot } = require('@isayme/dingtalk-robot')

// ESM & Typescript
import { Robot } from '@isayme/dingtalk-robot'
```

## 样例

```
let accessToken = '你的webhook accessToken'

let dingtalkRobot = new Robot({
  accessToken,
})

async function main() {
  dingtalkRobot.text('这个是测试消息')
}

main()
```

# 相关钉钉文档

[接口签名](https://open.dingtalk.com/document/robots/customize-robot-security-settings)

[消息类型及数据格式](https://open.dingtalk.com/document/isvapp/custom-bot-access-send-message)
