import {
  UpdateCommandInput,
  UpdateCommand,
  QueryCommandInput,
  QueryCommand,
  DeleteCommand,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb"
import { Dynamodb } from "../../helpers/dynamoDb"

import { RefreshToken, Storage } from "../interface"

class DynamoDbAdapter extends Dynamodb implements Storage {
  private tableName = process.env.DYNAMODB_TABLE as string

  remove = async (token: string) => {
    const item = await this.find(token)
    const deleteCommandInput: DeleteCommandInput = {
      TableName: this.tableName,
      Key: {
        PK: `REFRESH_TOKEN`,
        SK: item.SK,
      },
    }
    const updateCommand = new DeleteCommand(deleteCommandInput)
    await this.dynamodbDocumentClient.send(updateCommand)
  }

  find = async (token: string) => {
    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "tokenGSI",
      KeyConditionExpression: "#pk = :pk and #token = :token",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#token": "TOKEN",
      },
      ExpressionAttributeValues: {
        ":pk": "REFRESH_TOKEN",
        ":token": token,
      },
      ScanIndexForward: false,
      Limit: 1,
    }

    const queryCommand = new QueryCommand(queryCommandInput)
    const result = await this.dynamodbDocumentClient.send(queryCommand)
    if (result && typeof result.Items !== "undefined" && Array.isArray(result.Items)) {
      return result.Items[0]
    }
    return []
  }

  get = async () => {
    const queryCommandInput: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        "#pk": "PK",
        "#sk": "SK",
      },
      ExpressionAttributeValues: {
        ":pk": "REFRESH_TOKEN",
        ":sk": `REFRESH`,
      },
    }

    const queryCommand = new QueryCommand(queryCommandInput)
    const result = await this.dynamodbDocumentClient.send(queryCommand)
    if (result && typeof result.Items !== "undefined" && Array.isArray(result.Items)) {
      return result.Items.map((item) => {
        return item.TOKEN as RefreshToken
      })
    }
    return []
  }

  add = async (refreshToken: string) => {
    const timeStamp = new Date().toISOString()
    const updateExpression = [
      "#tokenColumn = :tokenValue",
      "#dbUpdatedColumn = :timestampValue",
      "#dbCreatedColumn = if_not_exists(#dbCreatedColumn, :timestampValue)",
    ]

    const updateCommandInput: UpdateCommandInput = {
      TableName: this.tableName,
      Key: {
        PK: `REFRESH_TOKEN`,
        SK: `REFRESH#${timeStamp}`,
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: {
        ":tokenValue": refreshToken,
        ":timestampValue": timeStamp,
      },
      ExpressionAttributeNames: {
        "#tokenColumn": "TOKEN",
        "#dbCreatedColumn": "_DB_CREATED",
        "#dbUpdatedColumn": "_DB_UPDATED",
      },
    }

    const updateCommand = new UpdateCommand(updateCommandInput)
    await this.dynamodbDocumentClient.send(updateCommand)
  }
}

export default DynamoDbAdapter
