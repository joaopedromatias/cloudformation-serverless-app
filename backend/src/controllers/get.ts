import { APIGatewayProxyEvent } from "aws-lambda";

export async function getHandler (event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  return {data: 'get handler here'}
}