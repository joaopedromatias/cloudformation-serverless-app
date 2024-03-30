import { APIGatewayProxyEvent } from 'aws-lambda'

export async function invalidMethodHandler(
  _: APIGatewayProxyEvent
): Promise<Record<string, unknown>> {
  throw new Error('invalid method')
}
