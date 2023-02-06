import dotenv from "dotenv"
import jwt, { Secret } from "jsonwebtoken"

import { Cache, Output, Parser } from "../interface"
import { User } from "../../old/interfaces"

dotenv.config()

export class Application {
  private parser: Parser
  private cache: Cache
  private response: Output
  private REFRESH_TOKEN_SECRET: Secret
  private ACCESS_TOKEN_SECRET: Secret
  private tokenExpiryTime: string

  constructor(parser: Parser, cache: Cache, response: Output) {
    this.cache = cache
    this.parser = parser
    this.response = response
    this.tokenExpiryTime = "25s"
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? ""
    this.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ""
  }

  generateAccessToken(user: User) {
    return jwt.sign(user, this.ACCESS_TOKEN_SECRET, { expiresIn: this.tokenExpiryTime })
  }

  generateRefreshToken(user: User) {
    return jwt.sign(user, this.REFRESH_TOKEN_SECRET)
  }

  async resolve() {
    const { username } = this.parser.get()
    const user: User = {
      name: username,
    }
    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)
    this.cache.addRefreshToken(refreshToken)

    return this.response.output({ accessToken, refreshToken }, 200)
  }

  async refreshToken() {
    const { token } = this.parser.get()
    await this.cache.update()

    if (this.cache.hasNoTokens()) return this.response.output({}, 401)
    if (!this.cache.hasToken(token)) return this.response.output({}, 403)

    const accessToken = jwt.verify(token, this.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
      if (err) return this.response.output({}, 403)
      return this.generateAccessToken({ name: user.name })
    })

    return this.response.output({ accessToken }, 200)
  }

  async logout() {
    const { token } = this.parser.get()
    const result = await this.cache.removeToken(token)
    return this.response.output({ message: `Logout ${result ? "Complete" : "Failed"}` }, 200)
  }
}
