import { dynamoDBClientMock, dynamoDBDocumentClientSendMock } from "../mocks/dynamoDbMock"
import DynamoDbAdapter from "../../adapters/DynamoDbAdapter"

const OFFLINE = "offline"
const tableName = "Table1"

process.env.DYNAMODB_TABLE = tableName
process.env.OFFLINE_DYNAMODB_ENDPOINT = "http://localhost:8000"
process.env.ENVIRONMENT = OFFLINE

describe("DynamoDbAdapter", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe("When running offline", () => {
    it("Should use local DynamoDB instance", async () => {
      const expectedDynamodbDocumentConfiguration = {
        region: OFFLINE,
        endpoint: process.env.OFFLINE_DYNAMODB_ENDPOINT,
        credentials: {
          accessKeyId: OFFLINE,
          secretAccessKey: OFFLINE,
        },
      }
      process.env.ENVIRONMENT = "offline"

      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.get()

      expect(dynamoDBClientMock).toHaveBeenCalledWith(expectedDynamodbDocumentConfiguration)
    })
  })
  describe("When getting the tokens from the database", () => {
    it("Should use the correct table", async () => {
      const expectedCall = expect.objectContaining({
        input: expect.objectContaining({
          TableName: tableName,
        }),
      })

      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.get()
      expect(dynamoDBDocumentClientSendMock).toHaveBeenLastCalledWith(expectedCall)
    })
    it("Should call dynamo", async () => {
      const expectedQuery = {
        TableName: tableName,
        KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
        ExpressionAttributeNames: {
          "#pk": "PK",
          "#sk": "SK",
        },
        ExpressionAttributeValues: {
          ":pk": "REFRESH_TOKEN",
          ":sk": "REFRESH",
        },
      }
      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.get()

      expect(dynamoDBDocumentClientSendMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          input: expect.objectContaining(expectedQuery),
        }),
      )
    })
  })

  describe("When finding a token from the database", () => {
    const token = "ABC123"
    it("Should use the correct table", async () => {
      const expectedCall = expect.objectContaining({
        input: expect.objectContaining({
          TableName: tableName,
        }),
      })

      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.get()
      expect(dynamoDBDocumentClientSendMock).toHaveBeenLastCalledWith(expectedCall)
    })
    it("Should call dynamo", async () => {
      const expectedQuery = {
        TableName: tableName,
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
      }
      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.find(token)

      expect(dynamoDBDocumentClientSendMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          input: expect.objectContaining(expectedQuery),
        }),
      )
    })
  })

  describe("When removing a token from the database", () => {
    const token = "ABC123"
    const SK = "SK-123"

    it("Should use the correct table", async () => {
      const expectedCall = expect.objectContaining({
        input: expect.objectContaining({
          TableName: tableName,
        }),
      })

      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.get()
      expect(dynamoDBDocumentClientSendMock).toHaveBeenLastCalledWith(expectedCall)
    })
    it("Should call dynamo", async () => {
      dynamoDBDocumentClientSendMock.mockResolvedValue({
        Items: [{ SK: SK }],
      })
      const expectedQuery = {
        TableName: tableName,
        Key: {
          PK: `REFRESH_TOKEN`,
          SK: SK,
        },
      }
      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.remove(token)

      expect(dynamoDBDocumentClientSendMock).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          input: expect.objectContaining(expectedQuery),
        }),
      )
    })
  })

  describe("When adding a token from the database", () => {
    const token = "ABC123"

    it("Should use the correct table", async () => {
      const expectedCall = expect.objectContaining({
        input: expect.objectContaining({
          TableName: tableName,
        }),
      })

      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.get()
      expect(dynamoDBDocumentClientSendMock).toHaveBeenLastCalledWith(expectedCall)
    })
    it("Should call dynamo", async () => {
      const timeStamp = new Date()
      jest.useFakeTimers().setSystemTime(timeStamp)

      const expectedQuery = {
        TableName: tableName,
        Key: {
          PK: `REFRESH_TOKEN`,
          SK: `REFRESH#${timeStamp.toISOString()}`,
        },
      }
      const dynamoDbAdapter = new DynamoDbAdapter()
      await dynamoDbAdapter.add(token)

      expect(dynamoDBDocumentClientSendMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          input: expect.objectContaining(expectedQuery),
        }),
      )
    })
  })
})
