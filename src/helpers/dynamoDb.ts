import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { Environment } from "./interface"

export class Dynamodb {
  public dynamodbDocumentClient = null as unknown as DynamoDBDocumentClient

  constructor() {
    this.setDatabaseInstance()
  }
  setDatabaseInstance = () => {
    let config = {}
    if (process.env.ENVIRONMENT === Environment.OFFLINE) {
      config = {
        region: "offline",
        endpoint: "http://localhost:8000",
        credentials: {
          accessKeyId: "offline",
          secretAccessKey: "offline",
        },
      }
    }
    const dynamoClient = new DynamoDBClient(config)
    this.dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamoClient)
  }
}
