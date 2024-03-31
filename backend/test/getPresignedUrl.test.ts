import { handler } from '../src'

describe('get presigned url handler', () => {
  it('should return the presigned url', async () => {
    const response = await handler({
      httpMethod: 'GET',
      path: '/presigned-url',
      headers: { origin: 'http://localhost:3000' },
      queryStringParameters: { fileName: 'ok', contentType: 'ok' }
    } as any)

    const body = JSON.parse((response as any).body)
    expect(body.preSignedUrl).toBeDefined()
  })
})
