import { APIGatewayProxyEvent } from 'aws-lambda'
import { IHandler } from './IHandler'

export class Handler implements IHandler {
  handle: (event: APIGatewayProxyEvent) => Promise<Record<string, unknown> | undefined>

  constructor(
    handle: (event: APIGatewayProxyEvent) => Promise<Record<string, unknown> | undefined>
  ) {
    this.handle = handle
  }
}
