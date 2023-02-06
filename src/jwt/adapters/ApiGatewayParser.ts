import { Parameters } from "../../helpers/parameters"
import { ParsedResponse, Parser } from "../interface"

class ApiGatewayParser extends Parameters implements Parser {
  get(): ParsedResponse {
    let username = this.getPathParameter("username")
    let token = this.getPathParameter("token")
    if (this.event.body !== null) {
      const body = JSON.parse(this.event.body)
      token = body.token
      username = body.username
    }
    return {
      username,
      token,
    }
  }
}

export default ApiGatewayParser
