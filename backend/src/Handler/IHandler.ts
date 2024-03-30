import { APIGatewayProxyEvent } from 'aws-lambda'

export interface IHandler {
  handler: (event: APIGatewayProxyEvent) => Promise<Record<string, unknown> | undefined>
}
