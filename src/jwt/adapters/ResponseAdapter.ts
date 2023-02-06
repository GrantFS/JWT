import { ApiGatewayResponse, Output } from "../interface"

class ResponseAdapter implements Output {
  output(data: {}, statusCode: number): ApiGatewayResponse {
    return {
      statusCode: statusCode,
      body: JSON.stringify(data),
    }
  }
}

export default ResponseAdapter
