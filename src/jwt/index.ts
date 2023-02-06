import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda"

import ApiGatewayParser from "./adapters/ApiGatewayParser"

import DynamoDbAdapter from "./adapters/DynamoDbAdapter"
import ResponseAdapter from "./adapters/ResponseAdapter"
import { Application } from "./application"
import TokenCache from "./adapters/tokenCache"

export const login = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const storage = new DynamoDbAdapter()
  const application = new Application(new ApiGatewayParser(event), new TokenCache(storage), new ResponseAdapter())
  return await application.resolve()
}

export const refreshToken = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const storage = new DynamoDbAdapter()
  const application = new Application(new ApiGatewayParser(event), new TokenCache(storage), new ResponseAdapter())
  return await application.refreshToken()
}

export const logout = async (event: APIGatewayEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  const storage = new DynamoDbAdapter()
  const application = new Application(new ApiGatewayParser(event), new TokenCache(storage), new ResponseAdapter())
  return await application.logout()
}
