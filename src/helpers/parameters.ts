import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda"

interface QueryStringParameters {
  [name: string]: string
}

export class Parameters {
  public event: APIGatewayProxyEvent

  constructor(event: APIGatewayProxyEvent) {
    this.event = event
  }

  private hasParametersSet(): boolean {
    return this.event.queryStringParameters !== null && this.event.queryStringParameters !== undefined
  }

  private hasParameter(parameterKey: string): boolean {
    const parameters = this.event.queryStringParameters as APIGatewayProxyEventQueryStringParameters

    return (
      parameters[parameterKey] !== null && parameters[parameterKey] !== undefined && parameters[parameterKey] !== ""
    )
  }

  private isNumeric(value: any): boolean {
    return !isNaN(value) && !isNaN(parseFloat(value))
  }

  private hasPathParametersSet(): boolean {
    return this.event.pathParameters !== null && this.event.pathParameters !== undefined
  }

  private hasPathParameter(parameterKey: string): boolean {
    const parameters = this.event.pathParameters as APIGatewayProxyEventPathParameters

    return (
      parameters[parameterKey] !== null && parameters[parameterKey] !== undefined && parameters[parameterKey] !== ""
    )
  }

  public getParameter(parameterKey: string): string {
    const parameters = this.event.queryStringParameters as QueryStringParameters
    if (this.hasParametersSet() && this.hasParameter(parameterKey)) {
      return parameters[parameterKey]
    }
    return ""
  }

  public getNumericParameter(parameter: string): number {
    const limitParam = this.getParameter(parameter)

    if (!this.isNumeric(limitParam)) {
      return 0
    }
    return parseInt(limitParam)
  }

  public getPathParameter(parameterKey: string): string {
    const parameters = this.event.pathParameters as QueryStringParameters
    if (this.hasPathParametersSet() && this.hasPathParameter(parameterKey)) {
      return parameters[parameterKey]
    }
    return ""
  }
}
