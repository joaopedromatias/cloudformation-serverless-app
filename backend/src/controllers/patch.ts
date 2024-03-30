import { APIGatewayProxyEvent } from "aws-lambda";

export async function patchHandler (event: APIGatewayProxyEvent): Promise<Record<string, unknown>> {
  return {data: 'patch handler here'}
}