import { APIGatewayProxyEvent } from 'aws-lambda'

export async function deleteHandler(event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  return { data: 'delete handler here' }
}
