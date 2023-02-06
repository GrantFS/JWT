import { Request } from "express"

export interface Storage {
  getTokens: () => any
  removeToken: (token: string) => void
  hasNoTokens: () => boolean
  hasToken: (refreshToken: string) => boolean
  addRefreshToken: (refreshToken: string) => void
}

export interface User {
  name: string
}

export interface Post {
  username: string
  title: string
}

export interface UserRequest extends Request {
  user: User
}
