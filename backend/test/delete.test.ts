import { handler } from '../src'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import * as decreaseItemsCount from '../src/controllers/delete'

describe('delete handler', () => {
  beforeAll(() => {
    jest.spyOn(decreaseItemsCount, 'decreaseItemsCount')
    jest
      .spyOn(DynamoDBClient.prototype, 'send')
      .mockReturnValue(Promise.resolve({ Item: { items: { N: '8' } }, Attributes: 0 }) as any)
  })

  it('should delete item and call the decrease count function with the correct new value of itens', async () => {
    const response = await handler({
      httpMethod: 'DELETE',
      headers: { origin: 'http://localhost:3000' },
      body: JSON.stringify({ created_at: 1, image_group: 1 })
    } as any)

    expect(DynamoDBClient.prototype.send).toHaveBeenCalledTimes(3)
    expect(decreaseItemsCount.decreaseItemsCount).toHaveBeenCalledTimes(1)

    const body = JSON.parse((response as any).body)
    expect(body.sucess).toBe(true)
  })
})
