import { APIGatewayProxyEvent } from 'aws-lambda'

export async function optionsHandler(_: APIGatewayProxyEvent): Promise<undefined> {
  return undefined
}
