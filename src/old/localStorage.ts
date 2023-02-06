import { Storage } from "./interfaces"

class LocalStorage implements Storage {
  private refreshTokens: string[]

  constructor() {
    this.refreshTokens = []
  }

  hasNoTokens = () => this.refreshTokens == null
  removeToken = (token: string) =>
    (this.refreshTokens = this.refreshTokens.filter((refreshToken) => refreshToken !== token))

  hasToken = (refreshToken: string) => {
    return this.refreshTokens.includes(refreshToken)
  }

  getTokens = () => {
    return this.refreshTokens
  }

  addRefreshToken = (refreshToken: string) => {
    this.refreshTokens.push(refreshToken)
  }
}

export default LocalStorage
