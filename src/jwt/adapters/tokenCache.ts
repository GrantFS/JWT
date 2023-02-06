import { Cache, RefreshToken, Storage } from "../interface"

class TokenCache implements Cache {
  private tokens: RefreshToken[] = []
  private storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  update = async () => {
    try {
      this.tokens = await this.storage.get()
      return true
    } catch (error) {
      return false
    }
  }

  setTokens = (refreshTokens: RefreshToken[]) => (this.tokens = refreshTokens)
  hasNoTokens = () => this.tokens.length == 0
  hasToken = (refreshToken: RefreshToken) => {
    return this.tokens.includes(refreshToken)
  }
  addRefreshToken = async (refreshToken: string) => {
    this.storage.add(refreshToken)
  }
  removeToken = async (refreshToken: string) => {
    try {
      await this.storage.remove(refreshToken)
      await this.update()
      return true
    } catch (error) {
      return false
    }
  }
}

export default TokenCache
