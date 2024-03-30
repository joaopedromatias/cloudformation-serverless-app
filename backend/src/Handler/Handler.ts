import { APIGatewayProxyEvent } from 'aws-lambda'
import { IHandler } from './IHandler'

export class Handler implements IHandler {
  handler: (event: APIGatewayProxyEvent) => Promise<Record<string, unknown> | undefined>

  constructor(
    handler: (event: APIGatewayProxyEvent) => Promise<Record<string, unknown> | undefined>
  ) {
    this.handler = handler
  }
}
