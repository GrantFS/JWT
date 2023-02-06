export interface Parser {
  get: () => ParsedResponse
}

export interface Output {
  output: (data: any, statusCode: number) => ApiGatewayResponse
}

export interface Storage {
  remove: (token: string) => void
  get: () => Promise<string[]>
  find: (token: string) => Promise<Record<string, any>>
  add: (refreshToken: string) => void
}
export interface Cache {
  hasNoTokens: () => boolean
  removeToken: (token: string) => Promise<boolean>
  hasToken: (refreshToken: string) => boolean
  update: () => Promise<boolean>
  addRefreshToken: (refreshToken: string) => void
}

export interface ApiGatewayResponse {
  headers?: {
    "Access-Control-Allow-Origin"?: string
  }
  statusCode: number
  body: string
}

export interface ParsedResponse {
  username: string
  token: string
}

export type RefreshToken = string
