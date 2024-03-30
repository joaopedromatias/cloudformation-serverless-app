import { APIGatewayProxyEvent } from "aws-lambda";

export async function postHandler (event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  return {data: 'post handler here'}
}