import { IResponse } from './IResponse'

export class Response implements IResponse {
  status: number
  sucess: boolean
  allowedOrigin: string
  data?: Record<string, unknown>

  constructor(
    status: number,
    sucess: boolean,
    allowedOrigin: string,
    data?: Record<string, unknown>
  ) {
    this.status = status
    this.sucess = sucess
    this.allowedOrigin = allowedOrigin
    this.data = data
  }

  public formatResponse() {
    return {
      statusCode: this.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': this.allowedOrigin,
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
      },
      isBase64Encoded: false,
      body: JSON.stringify({ sucess: this.sucess, ...this.data })
    }
  }
}
