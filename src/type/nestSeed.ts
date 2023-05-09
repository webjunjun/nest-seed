enum CodeNumber {
  successCode = 1,
  errorCode = -1
}

type CodeNumberKeys = keyof typeof CodeNumber;
type CodeNumberValues = typeof CodeNumber[CodeNumberKeys];

export interface ResponseData<T> {
  code: CodeNumberValues; // 1: 成功 -1: 失败
  statusCode: number; // 请求返回的状态码
  msg: string; // 状态描述
  data: T; // 返回json
  timestamp: string; // 数据返回时间
}

export type NestSeedType = {
  secret: string,
  appid: string,
  appsecret: string,
  wechatHost: string
}

export type WechatRequest = {
  appid: string,
  secret: string,
  grant_type: string,
  js_code: string
}

export type WechatResponse = {
  openid: string,
  session_key: string,
  unionid: string,
  errcode: number,
  errmsg: string
}
