import { APIGatewayProxyEvent } from 'aws-lambda'
import { handler } from '../src'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

describe('get handler', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return null and 0 if there are no items in images table', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockReturnValueOnce(
      Promise.resolve({
        Item: undefined
      }) as any
    )
    const response = await handler({
      httpMethod: 'GET',
      headers: { origin: 'http://localhost:3000' },
      queryStringParameters: { page: '1' }
    } as any)

    const body = JSON.parse((response as any).body)

    expect(body.sucess).toBe(true)
    expect(body.data.totalPages).toBe(0)
    expect(body.data.images).toBeNull()
  })

  it('should return null and the correct number of pages if asked page is greater than the total pages', async () => {
    jest.spyOn(DynamoDBClient.prototype, 'send').mockReturnValueOnce(
      Promise.resolve({
        Item: { items: { N: '22' } }
      }) as any
    )
    const response = await handler({
      httpMethod: 'GET',
      headers: { origin: 'http://localhost:3000' },
      queryStringParameters: { page: '3' }
    } as any)

    const body = JSON.parse((response as any).body)

    expect(body.sucess).toBe(true)
    expect(body.data.totalPages).toBe(2)
    expect(body.data.images).toBeNull()
  })

  it('should return the 20 first items when the first page is asked', async () => {
    jest
      .spyOn(DynamoDBClient.prototype, 'send')
      .mockReturnValueOnce(
        Promise.resolve({
          Item: { items: { N: '22' } }
        }) as any
      )
      .mockReturnValueOnce(
        Promise.resolve({
          Items: [
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { N: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            }
          ]
        }) as any
      )
      .mockReturnValueOnce(
        Promise.resolve({
          Items: [
            {
              image_group: { N: '2' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { N: '2' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            }
          ]
        }) as any
      )

    jest.mock('@aws-sdk/s3-request-presigner', () => {
      return {
        getSignedUrl: jest.fn().mockReturnValue('http://localhost:3000')
      }
    })

    const response = await handler({
      httpMethod: 'GET',
      headers: { origin: 'http://localhost:3000' },
      queryStringParameters: { page: '1' }
    } as any)

    const body = JSON.parse((response as any).body)

    expect(body.sucess).toBe(true)
    expect(body.data.totalPages).toBe(2)
    expect(body.data.images).toHaveLength(20)
    expect(body.data.images.at(-1).image_group).toBe('1')
  })

  it('should return the 2 last items when the second page is asked', async () => {
    jest
      .spyOn(DynamoDBClient.prototype, 'send')
      .mockReturnValueOnce(
        Promise.resolve({
          Item: { items: { N: '22' } }
        }) as any
      )
      .mockReturnValueOnce(
        Promise.resolve({
          Items: [
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            },
            {
              image_group: { S: '1' },
              title: { S: 'title' },
              description: { S: 'description' },
              created_at: { S: 'created_at' },
              file_name: { S: 'fileName' }
            }
          ]
        }) as any
      )
      .mockReturnValueOnce(
        Promise.resolve({
          Items: [
            {
              image_group: { N: '2' },
              title: { S: 'title2' },
              description: { S: 'description2' },
              created_at: { S: 'created_at2' },
              file_name: { S: 'fileName2' }
            },
            {
              image_group: { N: '2' },
              title: { S: 'title2' },
              description: { S: 'description2' },
              created_at: { S: 'created_at2' },
              file_name: { S: 'fileName2' }
            }
          ]
        }) as any
      )

    jest.mock('@aws-sdk/s3-request-presigner', () => {
      return {
        getSignedUrl: jest.fn().mockReturnValue('mockedUrl')
      }
    })

    const response = await handler({
      httpMethod: 'GET',
      headers: { origin: 'http://localhost:3000' },
      queryStringParameters: { page: '2' }
    } as any)

    const body = JSON.parse((response as any).body)

    expect(body.sucess).toBe(true)
    expect(body.data.totalPages).toBe(2)
    expect(body.data.images).toHaveLength(2)
    expect(body.data.images[0].image_group).toBe('2')
  })
})
