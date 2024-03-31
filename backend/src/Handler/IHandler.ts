import { APIGatewayProxyEvent } from 'aws-lambda'

export interface IHandler {
  handle: (event: APIGatewayProxyEvent) => Promise<Record<string, unknown> | undefined>
}
