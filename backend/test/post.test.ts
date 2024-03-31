import { APIGatewayProxyEvent } from 'aws-lambda'
import { handler } from '../src'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

describe('post url handler', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should put in db metadata table if there are no items yet and should put in image metadata table', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockReturnValue(
      Promise.resolve({
        Item: undefined
      }) as any
    )

    const response = await handler({
      httpMethod: 'POST',
      path: '/presigned-url',
      headers: { origin: 'http://localhost:3000' },
      body: JSON.stringify({ title: 'title', description: 'description', fileName: 'fileName' })
    } as any)

    expect(DynamoDBClient.prototype.send).toHaveBeenCalledTimes(4)
  })

  it('should put only in image metadata table if there are already items count in db metadata table', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockReturnValue(
      Promise.resolve({
        Item: { items: { N: '1' } }
      }) as any
    )

    const response = await handler({
      httpMethod: 'POST',
      path: '/presigned-url',
      headers: { origin: 'http://localhost:3000' },
      body: JSON.stringify({ title: 'title', description: 'description', fileName: 'fileName' })
    } as any)

    expect(DynamoDBClient.prototype.send).toHaveBeenCalledTimes(3)
  })
})
