const dynamoDBDocumentClientSendMock = jest.fn()
const dynamoDBDocumentClientQueryMock = jest.fn()

jest.mock("@aws-sdk/lib-dynamodb", () => {
  const awsSdkLibDynamodb = jest.requireActual("@aws-sdk/lib-dynamodb")
  return {
    ...awsSdkLibDynamodb,
    DynamoDBDocumentClient: {
      from: () => ({
        middlewareStack: {
          add: jest.fn(),
        },
        send: dynamoDBDocumentClientSendMock,
      }),
      query: () => ({
        promise: dynamoDBDocumentClientQueryMock,
      }),
    },
  }
})

const dynamoDBClientMock = jest.fn()
jest.mock("@aws-sdk/client-dynamodb", () => {
  const awsSdkLibDynamodb = jest.requireActual("@aws-sdk/client-dynamodb")
  return {
    ...awsSdkLibDynamodb,
    DynamoDBClient: dynamoDBClientMock,
  }
})

export { dynamoDBClientMock, dynamoDBDocumentClientSendMock, dynamoDBDocumentClientQueryMock }
